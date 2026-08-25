import { Request, Response, NextFunction } from 'express';
import { SECURITY_CONFIG } from '../constants/security';

const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'OPTIONS') {
    return next();
  }

  const ip = (req.headers['x-forwarded-for'] as string) || req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  const record = ipRequestCounts.get(ip);
  if (!record || now > record.resetTime) {
    ipRequestCounts.set(ip, {
      count: 1,
      resetTime: now + SECURITY_CONFIG.RATE_LIMIT_WINDOW_MS,
    });
    return next();
  }

  record.count += 1;
  if (record.count > SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      message: 'คำขอมากเกินไป กรุณารอสักครู่แล้วลองใหม่',
    });
  }

  next();
}
