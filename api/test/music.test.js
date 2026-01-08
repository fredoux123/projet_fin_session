import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../src/server.js';

let server;
let baseUrl;

function uniqueEmail(prefix) {
  return `${prefix}-${Date.now()}@test.com`;
}

async function request(path, options = {}) {
  const res = await fetch(`${baseUrl}${path}`, options);
  const bodyText = await res.text();
  const body = bodyText ? JSON.parse(bodyText) : null;
  return { res, body };
}

async function registerAndLogin(role) {
  const email = uniqueEmail(role.toLowerCase());
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

before(() => new Promise((resolve) => {
  server = app.listen(0, () => {
    const { port } = server.address();
    baseUrl = `http://127.0.0.1:${port}`;
    resolve();
  });
}));

after(() => new Promise((resolve) => server.close(resolve)));

test('artist can create artist and track, user can play', async () => {
  const artistToken = await registerAndLogin('ARTIST');

  const { res: artistRes, body: artistBody } = await request('/api/v1/artists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${artistToken}`,
    },
    body: JSON.stringify({ stageName: 'MTL Artist', city: 'Montreal' }),
  });
  assert.equal(artistRes.status, 201);
  const artistId = artistBody.item.id;

  const { res: trackRes, body: trackBody } = await request('/api/v1/tracks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${artistToken}`,
    },
    body: JSON.stringify({
      title: 'First Track',
      durationSec: 180,
      genre: 'rap',
      artistId,
    }),
  });
  assert.equal(trackRes.status, 201);
  const trackId = trackBody.item.id;

  const userToken = await registerAndLogin('USER');
  const { res: playRes, body: playBody } = await request(`/api/v1/tracks/${trackId}/play`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert.equal(playRes.status, 200);
  assert.equal(playBody.item.playCount, 1);
});

test('artist cannot edit another artist profile', async () => {
  const artistToken = await registerAndLogin('ARTIST');
  const otherArtistToken = await registerAndLogin('ARTIST');

  const { body: artistBody } = await request('/api/v1/artists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${artistToken}`,
    },
    body: JSON.stringify({ stageName: 'Owner Artist', city: 'Montreal' }),
  });

  const { res: updateRes } = await request(`/api/v1/artists/${artistBody.item.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${otherArtistToken}`,
    },
    body: JSON.stringify({ stageName: 'Hacked' }),
  });
  assert.equal(updateRes.status, 403);
});
