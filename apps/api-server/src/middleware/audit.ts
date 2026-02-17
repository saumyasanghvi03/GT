import type { Request, Response, NextFunction } from 'express';

export const auditTrail = (req: Request, _res: Response, next: NextFunction) => {
  const event = {
    ts: new Date().toISOString(),
    method: req.method,
    path: req.path,
    ip: req.ip
  };
  console.log('[AUDIT]', JSON.stringify(event));
  next();
};
