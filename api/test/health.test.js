import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../src/server.js';

let server;
let baseUrl;

before(() => new Promise((resolve) => {
  server = app.listen(0, () => {
    const { port } = server.address();
    baseUrl = `http://127.0.0.1:${port}`;
    resolve();
  });
}));

after(() => new Promise((resolve) => server.close(resolve)));

test('health endpoint responds', async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.item.service, 'api');
});
