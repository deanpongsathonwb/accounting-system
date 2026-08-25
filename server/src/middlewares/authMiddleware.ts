import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors';
import { AUTH_CONSTANTS } from '../constants/auth';
import { userRepository } from '../repositories/user.repository';
import { User } from '../types/user';

export interface AuthenticatedRequest extends Request {
  user?: Omit<User, 'password'>;
}

export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers[AUTH_CONSTANTS.HEADER_NAME] || req.headers.authorization;
    if (!authHeader || typeof authHeader !== 'string') {
      return next(new UnauthorizedError('กรุณาเข้าสู่ระบบก่อนดำเนินการ'));
    }

    const token = authHeader.startsWith(AUTH_CONSTANTS.BEARER_PREFIX)
      ? authHeader.slice(AUTH_CONSTANTS.BEARER_PREFIX.length).trim()
      : authHeader.trim();

    if (!token) {
      return next(new UnauthorizedError('กรุณาเข้าสู่ระบบก่อนดำเนินการ'));
    }

    // Decode session payload
    try {
      const decodedStr = Buffer.from(token, 'base64url').toString('utf-8');
      const payload = JSON.parse(decodedStr);

      if (!payload.sub || (payload.exp && payload.exp < Date.now())) {
        return next(new UnauthorizedError('เซสชันการเข้าสู่ระบบหมดอายุ กรุณาเข้าสู่ระบบใหม่'));
      }

      const user = await userRepository.findById(payload.sub);
      if (!user) {
        return next(new UnauthorizedError('ไม่พบข้อมูลผู้ใช้งานนี้ในระบบ'));
      }

      const { password: _, ...sanitizedUser } = user;
      req.user = sanitizedUser;
      next();
    } catch {
      return next(new UnauthorizedError('โทเค็นการเข้าสู่ระบบไม่ถูกต้อง'));
    }
  } catch (error) {
    next(new UnauthorizedError('การยืนยันตัวตนล้มเหลว'));
  }
}
