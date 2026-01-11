import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import mongoose from 'mongoose';
import { app } from '../src/server.js';

let server;
let baseUrl;
let discoveryServer;
let iaServer;

function startMockServer(handler) {
  return new Promise((resolve) => {
    const srv = http.createServer(handler);
    srv.listen(0, () => {
      const { port } = srv.address();
      resolve({ srv, port });
    });
  });
}

before(async () => {
  const discovery = await startMockServer((req, res) => {
    if (req.url.startsWith('/external-artists')) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ items: [{ id: 'ext-1' }], source: 'mock' }));
      return;
    }
    res.writeHead(404);
    res.end();
  });
  discoveryServer = discovery.srv;

  const ia = await startMockServer((req, res) => {
    if (req.url.startsWith('/recommendations')) {
      const url = new URL(req.url, 'http://localhost');
      const userId = url.searchParams.get('userId') || 'demo';
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ userId, items: [] }));
      return;
    }
    res.writeHead(404);
    res.end();
  });
  iaServer = ia.srv;

  app.locals.discoveryUrl = `http://127.0.0.1:${discovery.port}`;
  app.locals.iaUrl = `http://127.0.0.1:${ia.port}`;

  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const { port } = server.address();
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(() => new Promise((resolve) => server.close(resolve)));
after(() => new Promise((resolve) => discoveryServer.close(resolve)));
after(() => new Promise((resolve) => iaServer.close(resolve)));
after(() => mongoose.connection.close());

test('gateway proxies discovery service', async () => {
  const res = await fetch(`${baseUrl}/api/v1/gateway/discovery/external-artists`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(Array.isArray(body.items));
  assert.equal(body.source, 'mock');
});

test('gateway proxies ia service', async () => {
  const res = await fetch(`${baseUrl}/api/v1/gateway/ia/recommendations?userId=demo`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.userId, 'demo');
});
