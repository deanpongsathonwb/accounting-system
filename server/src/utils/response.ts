import { Response } from 'express';
import { ApiResponse } from '../types/api';
import { HTTP_STATUS, HttpStatusCode } from '../constants/http';

export function sendSuccess<T>(
  res: Response,
  data?: T,
  message: string = 'สำเร็จ',
  statusCode: HttpStatusCode = HTTP_STATUS.OK,
  meta?: ApiResponse['meta']
) {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  };
  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  message: string = 'เกิดข้อผิดพลาด',
  statusCode: HttpStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  errors?: any
) {
  const payload: ApiResponse = {
    success: false,
    message,
    errors,
  };
  return res.status(statusCode).json(payload);
}
