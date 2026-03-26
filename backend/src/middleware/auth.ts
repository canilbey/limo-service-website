import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
  sub: number;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret || secret.length < 16) {
    throw new Error('JWT_SECRET must be set and at least 16 characters');
  }
  return secret;
}

export function signAdminToken(userId: number, username: string): string {
  const secret = getJwtSecret();
  return jwt.sign({ sub: userId, username }, secret, { expiresIn: '8h' });
}

export function verifyAdminToken(token: string): AuthPayload {
  const secret = getJwtSecret();
  const decoded = jwt.verify(token, secret) as jwt.JwtPayload & {
    sub?: number;
    username?: string;
  };
  if (typeof decoded.sub !== 'number' || typeof decoded.username !== 'string') {
    throw new Error('Invalid token payload');
  }
  return { sub: decoded.sub, username: decoded.username };
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const token = header.slice('Bearer '.length).trim();
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    req.auth = verifyAdminToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
