import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import mongoose from 'mongoose';
import { app } from '../src/server.js';
import { connectToDatabase } from '../src/config/db.js';

let server;
let baseUrl;
let iaServer;
let iaUrl;
let lastPayload;

async function request(path, options = {}) {
  const res = await fetch(`${baseUrl}${path}`, options);
  const bodyText = await res.text();
  const body = bodyText ? JSON.parse(bodyText) : null;
  return { res, body };
}

async function registerAndLogin(role) {
  const email = `${role.toLowerCase()}-${Date.now()}@test.com`;
  await request('/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'secret123', role }),
  });
  const { body } = await request('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'secret123' }),
  });
  return body.token;
}

function startMockIa() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      if (req.method === 'POST' && req.url === '/recommendations') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          lastPayload = JSON.parse(body || '{}');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              items: [
                { type: 'artist', id: 'artist-1', score: 6.5, reason: 'Mock' },
                { type: 'track', id: 'track-1', score: 4.2, reason: 'Mock' },
              ],
            }),
          );
        });
        return;
      }
      res.writeHead(404);
      res.end();
    });
    srv.listen(0, () => {
      const { port } = srv.address();
      resolve({ srv, url: `http://127.0.0.1:${port}` });
    });
  });
}

before(async () => {
  await connectToDatabase();
  const mock = await startMockIa();
  iaServer = mock.srv;
  iaUrl = mock.url;
  process.env.IA_URL = iaUrl;

  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const { port } = server.address();
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(() => new Promise((resolve) => server.close(resolve)));
after(() => new Promise((resolve) => iaServer.close(resolve)));
after(() => mongoose.connection.close());

test('recommendations returns sorted items from IA', async () => {
  const artistToken = await registerAndLogin('ARTIST');
  const { body: artistBody } = await request('/api/v1/artists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${artistToken}`,
    },
    body: JSON.stringify({ stageName: 'Rec Artist', city: 'Montreal' }),
  });

  const { body: trackBody } = await request('/api/v1/tracks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${artistToken}`,
    },
    body: JSON.stringify({
      title: 'Rec Track',
      durationSec: 180,
      genre: 'rap',
      artistId: artistBody.item.id,
    }),
  });

  const userToken = await registerAndLogin('USER');
  await request(`/api/v1/tracks/${trackBody.item.id}/play`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
  });
  await request(`/api/v1/favorites/artists/${artistBody.item.id}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
  });

  const { res, body } = await request('/api/v1/recommendations', {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(body.items));
  assert.ok(body.items.length > 0);
  assert.ok(lastPayload.userId);
  assert.equal(body.items[0].score >= body.items[1].score, true);
});
