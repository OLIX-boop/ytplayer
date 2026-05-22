const TOKEN = process.env.API_TOKEN;

const PUBLIC_PATHS = new Set(['/', '/health']);

export function authMiddleware(req, res, next) {
  if (!TOKEN) return next();
  if (PUBLIC_PATHS.has(req.path)) return next();

  const headerToken = req.header('x-api-token') || req.query.token;
  if (headerToken === TOKEN) return next();

  res.status(401).json({ error: 'Unauthorized' });
}
