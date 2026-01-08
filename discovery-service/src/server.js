import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { externalArtists } from './data.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 3001;

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'discovery' }));
app.get('/external-artists', (req, res) => res.json({ items: externalArtists, source: 'mock' }));

export { app };

const isDirectRun = process.argv[1] === fileURLToPath(import.meta.url);
if (isDirectRun) {
  app.listen(PORT, () => console.log(`Discovery running on http://localhost:${PORT}`));
}
