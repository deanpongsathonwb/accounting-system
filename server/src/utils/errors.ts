import { HttpStatusCode, HTTP_STATUS } from '../constants/http';

export class AppError extends Error {
  public statusCode: HttpStatusCode;
  public isOperational: boolean;
  public details?: any;

  constructor(message: string, statusCode: HttpStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'ไม่พบข้อมูลที่ต้องการ') {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'คำขอไม่ถูกต้อง', details?: any) {
    super(message, HTTP_STATUS.BAD_REQUEST, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'ไม่มีสิทธิ์เข้าถึง') {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'คุณไม่มีสิทธิ์ในการดำเนินการนี้') {
    super(message, HTTP_STATUS.FORBIDDEN);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'มีข้อมูลนี้อยู่ในระบบแล้ว') {
    super(message, HTTP_STATUS.CONFLICT);
  }
}
