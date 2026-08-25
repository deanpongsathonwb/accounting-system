import { Request, Response } from 'express';
import { attendanceService } from '../services/attendance.service';
import { sendSuccess } from '../utils/response';
import { HTTP_STATUS } from '../constants/http';

export class AttendanceController {
  async getRecords(req: Request, res: Response) {
    const { classroomId, date, studentId } = req.query as {
      classroomId?: string;
      date?: string;
      studentId?: string;
    };
    const records = await attendanceService.getRecords(classroomId, date, studentId);
    return sendSuccess(res, records, 'ดึงข้อมูลการเช็คชื่อสำเร็จ');
  }

  async getSession(req: Request, res: Response) {
    const { classroomId, date } = req.query as { classroomId: string; date?: string };
    const session = await attendanceService.getSession(classroomId, date);
    return sendSuccess(res, session, 'ดึงข้อมูลรอบการเช็คชื่อสำเร็จ');
  }

  async saveBulk(req: Request, res: Response) {
    const session = await attendanceService.saveBulkAttendance(req.body);
    return sendSuccess(res, session, 'บันทึกการเช็คชื่อเรียบร้อยแล้ว', HTTP_STATUS.OK);
  }

  async recordSingle(req: Request, res: Response) {
    const record = await attendanceService.recordSingle(req.body);
    return sendSuccess(res, record, 'บันทึกรายการสำเร็จ', HTTP_STATUS.CREATED);
  }
}

export const attendanceController = new AttendanceController();
