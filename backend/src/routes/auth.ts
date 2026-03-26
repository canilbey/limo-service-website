import { Router } from 'express';
import type { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import { getDb } from '../db/database.js';
import { requireAdminAuth, signAdminToken } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.VITEST === 'true' ? 10_000 : 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later' },
});

router.post('/login', authLimiter, (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid credentials payload' });
    return;
  }

  const { username, password } = parsed.data;
  const db = getDb();
  const row = db
    .prepare('SELECT id, username, password_hash FROM admin_users WHERE username = ?')
    .get(username) as { id: number; username: string; password_hash: string } | undefined;

  if (!row || !bcrypt.compareSync(password, row.password_hash)) {
    res.status(401).json({ error: 'Invalid username or password' });
    return;
  }

  const token = signAdminToken(row.id, row.username);
  res.json({ token, username: row.username });
});

router.get('/me', requireAdminAuth, (req: Request, res: Response) => {
  res.json({ username: req.auth!.username, userId: req.auth!.sub });
});

export default router;
