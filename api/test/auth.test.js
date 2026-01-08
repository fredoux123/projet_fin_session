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

before(() => new Promise((resolve) => {
  server = app.listen(0, () => {
    const { port } = server.address();
    baseUrl = `http://127.0.0.1:${port}`;
    resolve();
  });
}));

after(() => new Promise((resolve) => server.close(resolve)));

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
  assert.equal(meBody.user.email, email);
  assert.equal(meBody.user.role, 'USER');
});

test('admin route requires ADMIN role', async () => {
  const userEmail = uniqueEmail('user');
  await request('/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userEmail, password: 'secret123', role: 'USER' }),
  });

  const { body: userLogin } = await request('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userEmail, password: 'secret123' }),
  });

  const { res: forbiddenRes } = await request('/api/v1/admin/ping', {
    headers: { Authorization: `Bearer ${userLogin.token}` },
  });
  assert.equal(forbiddenRes.status, 403);

  const adminEmail = uniqueEmail('admin');
  await request('/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminEmail, password: 'secret123', role: 'ADMIN' }),
  });

  const { body: adminLogin } = await request('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminEmail, password: 'secret123' }),
  });

  const { res: adminRes, body: adminBody } = await request('/api/v1/admin/ping', {
    headers: { Authorization: `Bearer ${adminLogin.token}` },
  });
  assert.equal(adminRes.status, 200);
  assert.equal(adminBody.scope, 'admin');
});

test('visitor without token is rejected on admin endpoint', async () => {
  const { res } = await request('/api/v1/admin/ping');
  assert.equal(res.status, 401);
});

test('public ping is accessible without token', async () => {
  const { res, body } = await request('/api/v1/public/ping');
  assert.equal(res.status, 200);
  assert.equal(body.scope, 'public');
});
