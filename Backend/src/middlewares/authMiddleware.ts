import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { messages } from '../config/messages';

const JWT_SECRET = process.env.JWT_SECRET || 'transitopssecretkey123_change_me';

export interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: messages.auth.unauthorized });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: messages.auth.invalidToken });
  }
}

export function requireRoles(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: messages.auth.unauthorized });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: messages.auth.forbidden });
    }
    next();
  };
}
