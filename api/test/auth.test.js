import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { app } from '../src/server.js';
import { connectToDatabase } from '../src/config/db.js';

let server;
let baseUrl;
let userToken;
let adminToken;

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
  await connectToDatabase();
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const { port } = server.address();
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
  userToken = await registerAndLogin('USER');
  adminToken = await registerAndLogin('ADMIN');
});

after(() => new Promise((resolve) => server.close(resolve)));
after(() => mongoose.connection.close());

test('register/login user and access /me', async () => {
  const email = uniqueEmail('user');
  const { res: registerRes } = await request('/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'secret123', role: 'USER' }),
  });
  assert.equal(registerRes.status, 201);

  const { res: loginRes, body: loginBody } = await request('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'secret123' }),
  });
  assert.equal(loginRes.status, 200);
  assert.ok(loginBody.token);

  const { res: meRes, body: meBody } = await request('/api/v1/me', {
    headers: { Authorization: `Bearer ${loginBody.token}` },
  });
  assert.equal(meRes.status, 200);
  assert.equal(meBody.item.email, email);
  assert.equal(meBody.item.role, 'USER');
});

test('admin route requires ADMIN role', async () => {
  const { res: forbiddenRes } = await request('/api/v1/admin/ping', {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert.equal(forbiddenRes.status, 403);

  const { res: adminRes, body: adminBody } = await request('/api/v1/admin/ping', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.equal(adminRes.status, 200);
  assert.equal(adminBody.item.scope, 'admin');
});

test('visitor without token is rejected on admin endpoint', async () => {
  const { res } = await request('/api/v1/admin/ping');
  assert.equal(res.status, 401);
});

test('public ping is accessible without token', async () => {
  const { res, body } = await request('/api/v1/public/ping');
  assert.equal(res.status, 200);
  assert.equal(body.item.scope, 'public');
});

test('public artists list works without token', async () => {
  const { res, body } = await request('/api/v1/artists');
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(body.items));
});

test('public external artists returns items', async () => {
  const { res, body } = await request('/api/v1/external-artists');
  if (res.status === 200) {
    assert.ok(Array.isArray(body.items));
    assert.ok(body.source);
  } else {
    assert.equal(res.status, 502);
    assert.ok(body.error);
  }
});
