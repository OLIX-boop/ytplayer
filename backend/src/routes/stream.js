import { Router } from 'express';
import { getAudioStreamUrl } from '../lib/ytdlp.js';

export const streamRouter = Router();

streamRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid video id' });

    const { url, mimeType } = await getAudioStreamUrl(id);

    const range = req.headers.range;
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    };
    if (range) headers.Range = range;

    const upstream = await fetch(url, { headers });

    if (!upstream.ok && upstream.status !== 206) {
      return res.status(upstream.status).json({
        error: `Upstream returned ${upstream.status}`,
      });
    }

    res.status(upstream.status);

    const forwardHeaders = [
      'content-type',
      'content-length',
      'content-range',
      'accept-ranges',
      'cache-control',
      'etag',
      'last-modified',
    ];
    for (const h of forwardHeaders) {
      const v = upstream.headers.get(h);
      if (v) res.setHeader(h, v);
    }
    if (!upstream.headers.get('content-type')) {
      res.setHeader('content-type', mimeType);
    }
    if (!upstream.headers.get('accept-ranges')) {
      res.setHeader('accept-ranges', 'bytes');
    }

    if (!upstream.body) {
      return res.end();
    }

    const reader = upstream.body.getReader();
    req.on('close', () => reader.cancel().catch(() => {}));

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!res.write(value)) {
        await new Promise((r) => res.once('drain', r));
      }
    }
    res.end();
  } catch (err) {
    if (!res.headersSent) next(err);
    else res.end();
  }
});

function isValidId(id) {
  return typeof id === 'string' && /^[A-Za-z0-9_-]{6,15}$/.test(id);
}
