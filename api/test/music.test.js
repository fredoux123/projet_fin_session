import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { app } from '../src/server.js';

let server;
let baseUrl;
let artistToken;
let otherArtistToken;
let userToken;

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

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const { port } = server.address();
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
  artistToken = await registerAndLogin('ARTIST');
  otherArtistToken = await registerAndLogin('ARTIST');
  userToken = await registerAndLogin('USER');
});

after(() => new Promise((resolve) => server.close(resolve)));
after(() => mongoose.connection.close());

test('artist can create artist and track, user can play', async () => {
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
  const { res: playRes, body: playBody } = await request(`/api/v1/tracks/${trackId}/play`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert.equal(playRes.status, 200);
  assert.equal(playBody.item.playCount, 1);

  const { res: historyRes, body: historyBody } = await request('/api/v1/history', {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert.equal(historyRes.status, 200);
  assert.ok(Array.isArray(historyBody.items));
  assert.equal(historyBody.items[0].trackId, trackId);

  const { res: clearRes } = await request('/api/v1/history', {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert.equal(clearRes.status, 204);

  const { res: historyAfterRes, body: historyAfterBody } = await request('/api/v1/history', {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert.equal(historyAfterRes.status, 200);
  assert.equal(historyAfterBody.items.length, 0);
});

test('artist cannot edit another artist profile', async () => {
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

test('user can add and remove favorite artists', async () => {
  const { body: artistBody } = await request('/api/v1/artists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${artistToken}`,
    },
    body: JSON.stringify({ stageName: 'Fav Artist', city: 'Montreal' }),
  });

  const artistId = artistBody.item.id;

  const { res: addRes, body: addBody } = await request(`/api/v1/favorites/artists/${artistId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert.equal(addRes.status, 200);
  assert.equal(addBody.item.artistId, artistId);

  const { res: addAgainRes, body: addAgainBody } = await request(
    `/api/v1/favorites/artists/${artistId}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
    },
  );
  assert.equal(addAgainRes.status, 200);
  assert.equal(addAgainBody.item.id, addBody.item.id);

  const { res: listRes, body: listBody } = await request('/api/v1/favorites/artists', {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert.equal(listRes.status, 200);
  assert.equal(listBody.items.length, 1);
  assert.equal(listBody.items[0].artistId, artistId);

  const { res: deleteRes } = await request(`/api/v1/favorites/artists/${artistId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert.equal(deleteRes.status, 204);

  const { body: emptyBody } = await request('/api/v1/favorites/artists', {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert.equal(emptyBody.items.length, 0);
});
