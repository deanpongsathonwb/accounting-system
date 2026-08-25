import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { BadRequestError } from '../utils/errors';

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError || error?.issues) {
        const issues = error.issues || (error as any).errors || [];
        const errorMessages = issues.map((e: any) => `${e.path?.join('.') || 'field'}: ${e.message}`).join(', ');
        next(new BadRequestError(`ข้อมูลไม่ถูกต้อง: ${errorMessages}`, issues));
      } else {
        next(error);
      }
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.query);
      req.query = parsed as any;
      next();
    } catch (error: any) {
      if (error instanceof ZodError || error?.issues) {
        const issues = error.issues || (error as any).errors || [];
        const errorMessages = issues.map((e: any) => `${e.path?.join('.') || 'field'}: ${e.message}`).join(', ');
        next(new BadRequestError(`พารามิเตอร์ไม่ถูกต้อง: ${errorMessages}`, issues));
      } else {
        next(error);
      }
    }
  };
}

