import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { getDb } from './db/database.js';
import bookingsRouter from './routes/bookings.js';
import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js';
import googleAdsRouter from './routes/googleAds.js';

export function createApp(): express.Express {
  const app = express();

  app.use(compression());
  app.use(helmet());
  app.use(express.json({ limit: '256kb' }));

  const corsOrigin = process.env.CORS_ORIGIN?.trim();
  const allowed = corsOrigin
    ? corsOrigin.split(',').map((s) => s.trim()).filter(Boolean)
    : ['http://localhost:5173'];

  app.use(
    cors({
      origin: allowed.length === 1 && allowed[0] === '*' ? true : allowed,
      credentials: false,
    }),
  );

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/api/bookings', bookingsRouter);
  app.use('/api/auth', authRouter);
  // Register more specific /api/admin/* paths before the generic admin router.
  app.use('/api/admin/google-ads', googleAdsRouter);
  app.use('/api/admin', adminRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  return app;
}

export function ensureDbInitialized(): void {
  getDb();
}
