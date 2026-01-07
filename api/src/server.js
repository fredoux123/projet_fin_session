import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 3000;
const DISCOVERY_URL = process.env.DISCOVERY_URL || 'http://localhost:3001';
const IA_URL = process.env.IA_URL || 'http://localhost:8001';

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'api' }));

app.get('/api/v1/external-artists', async (req, res) => {
  try {
    const r = await fetch(`${DISCOVERY_URL}/external-artists`);
    res.json(await r.json());
  } catch {
    res.status(502).json({ error: 'Discovery service unreachable' });
  }
});

app.get('/api/v1/recommendations', async (req, res) => {
  const userId = req.query.userId || 'demo';
  try {
    const r = await fetch(`${IA_URL}/recommendations?userId=${encodeURIComponent(userId)}`);
    res.json(await r.json());
  } catch {
    res.status(502).json({ error: 'IA service unreachable' });
  }
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
