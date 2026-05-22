import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { searchRouter } from './routes/search.js';
import { infoRouter } from './routes/info.js';
import { streamRouter } from './routes/stream.js';
import { streamUrlRouter } from './routes/streamUrl.js';
import { authMiddleware } from './middleware/auth.js';

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const app = express();

app.use(cors());
app.use(express.json());
app.use(authMiddleware);

app.get('/', (_req, res) => {
  res.json({
    name: 'YTPlayer Backend',
    version: '1.0.0',
    endpoints: [
      'GET /api/search?q=<query>',
      'GET /api/info/:id',
      'GET /api/stream/:id',
      'GET /api/stream-url/:id',
      'GET /health',
    ],
  });
});

app.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

app.use('/api/search', searchRouter);
app.use('/api/info', infoRouter);
app.use('/api/stream', streamRouter);
app.use('/api/stream-url', streamUrlRouter);

app.use((err, _req, res, _next) => {
  console.error('[error]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, HOST, () => {
  console.log(`\n  YTPlayer Backend in ascolto su http://${HOST}:${PORT}`);
  console.log(`  LAN — usa l'IP del server (es. http://192.168.x.x:${PORT}) dall'app\n`);
});
