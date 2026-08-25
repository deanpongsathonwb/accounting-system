import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';
import { HTTP_STATUS } from '../constants/http';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  logger.error(`Error processing ${req.method} ${req.originalUrl}:`, err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.details || null,
    });
  }

  // Handle Zod or schema validation errors
  if (err.name === 'ZodError' || err.issues) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'ข้อมูลที่ส่งมาไม่ถูกต้องตามโครงสร้างที่กำหนด',
      errors: err.issues || err.errors,
    });
  }

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'เกิดข้อผิดพลาดภายในระบบ กรุณาลองใหม่อีกครั้ง',
    errors: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
}
