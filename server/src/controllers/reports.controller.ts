import { Request, Response } from 'express';
import { reportsService } from '../services/reports.service';
import { sendSuccess } from '../utils/response';

export class ReportsController {
  async getSummary(req: Request, res: Response) {
    const { classroomId, startDate, endDate } = req.query as {
      classroomId?: string;
      startDate?: string;
      endDate?: string;
    };
    const summary = await reportsService.getSummary(classroomId, startDate, endDate);
    return sendSuccess(res, summary, 'ดึงข้อมูลสรุปรายงานสำเร็จ');
  }

  async getHighAbsence(req: Request, res: Response) {
    const { threshold } = req.query as { threshold?: string };
    const list = await reportsService.getHighAbsenceList(threshold ? parseInt(threshold, 10) : 3);
    return sendSuccess(res, list, 'ดึงรายชื่อนักเรียนขาดเรียนบ่อยสำเร็จ');
  }
}

export const reportsController = new ReportsController();
