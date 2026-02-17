import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { Role, UserToken } from '../types/index.js';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET ?? 'dev-secret') as UserToken;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorize = (roles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  next();
};
