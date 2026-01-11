import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { connectToDatabase } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import artistRoutes from './routes/artistRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import trackRoutes from './routes/trackRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import publicRoutes from './routes/publicRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 3000;
app.locals.discoveryUrl = process.env.DISCOVERY_URL || 'http://localhost:3001';
app.locals.iaUrl = process.env.IA_URL || 'http://localhost:8001';

connectToDatabase().catch((err) => {
  console.error('Mongo connection failed:', err.message);
  process.exit(1);
});

async function proxyRequest(baseUrl, req, res) {
  const targetUrl = new URL(req.url, baseUrl).toString();
  const headers = { ...req.headers };
  delete headers.host;
  delete headers['content-length'];

  let body;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    if (req.body && Object.keys(req.body).length > 0) {
      body = JSON.stringify(req.body);
      if (!headers['content-type']) {
        headers['content-type'] = 'application/json';
      }
    }
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });
    res.status(response.status);
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.set('content-type', contentType);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    res.send(buffer);
  } catch {
    res.status(502).json({ error: 'Upstream service unreachable' });
  }
}

app.get('/health', (req, res) => res.json({ item: { status: 'ok', service: 'api' } }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/public', publicRoutes);
app.use('/api/v1', artistRoutes);
app.use('/api/v1', trackRoutes);
app.use('/api/v1', favoriteRoutes);
app.use('/api/v1', historyRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use('/api/v1/gateway/discovery', (req, res) => proxyRequest(req.app.locals.discoveryUrl, req, res));
app.use('/api/v1/gateway/ia', (req, res) => proxyRequest(req.app.locals.iaUrl, req, res));

app.get('/api/v1/external-artists', async (req, res) => {
  try {
    const r = await fetch(`${req.app.locals.discoveryUrl}/external-artists`);
    const data = await r.json();
    const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
    res.json({ items, source: data?.source || 'external' });
  } catch {
    res.status(502).json({ error: 'Discovery service unreachable' });
  }
});

app.get('/api/v1/recommendations', async (req, res) => {
  const userId = req.query.userId || 'demo';
  try {
    const r = await fetch(
      `${req.app.locals.iaUrl}/recommendations?userId=${encodeURIComponent(userId)}`,
    );
    const data = await r.json();
    res.json({ item: data });
  } catch {
    res.status(502).json({ error: 'IA service unreachable' });
  }
});

app.use((err, req, res, next) => {
  if (!err) {
    next();
    return;
  }
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal error' });
});

export { app };

const isDirectRun = process.argv[1] === fileURLToPath(import.meta.url);
if (isDirectRun) {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}
