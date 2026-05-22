import { Router } from 'express';
import { searchYouTube } from '../lib/ytdlp.js';

export const searchRouter = Router();

const MAX = Number(process.env.MAX_SEARCH_RESULTS) || 20;

searchRouter.get('/', async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) return res.status(400).json({ error: 'Missing query parameter "q"' });

    const limit = Math.min(Number(req.query.limit) || MAX, 50);
    const tracks = await searchYouTube(q, limit);
    res.json({ query: q, count: tracks.length, tracks });
  } catch (err) {
    next(err);
  }
});
