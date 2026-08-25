import { Router } from 'express';
import { attendanceController } from '../controllers/attendance.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { validateBody } from '../middlewares/validationMiddleware';
import { bulkAttendanceSchema, singleAttendanceRecordSchema } from '../validations/attendance.schema';

export const attendanceRoutes = Router();

attendanceRoutes.get('/', asyncHandler(attendanceController.getRecords.bind(attendanceController)));
attendanceRoutes.get('/session', asyncHandler(attendanceController.getSession.bind(attendanceController)));
attendanceRoutes.post(
  '/bulk',
  validateBody(bulkAttendanceSchema),
  asyncHandler(attendanceController.saveBulk.bind(attendanceController))
);
attendanceRoutes.post(
  '/single',
  validateBody(singleAttendanceRecordSchema),
  asyncHandler(attendanceController.recordSingle.bind(attendanceController))
);
