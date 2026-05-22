import { Router } from 'express';
import { getVideoInfo } from '../lib/ytdlp.js';

export const infoRouter = Router();

infoRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid video id' });

    const track = await getVideoInfo(id);
    res.json(track);
  } catch (err) {
    next(err);
  }
});

function isValidId(id) {
  return typeof id === 'string' && /^[A-Za-z0-9_-]{6,15}$/.test(id);
}
