import { Request, Response } from 'express';
import { studentsService } from '../services/students.service';
import { sendSuccess } from '../utils/response';
import { HTTP_STATUS } from '../constants/http';

export class StudentsController {
  async getAll(req: Request, res: Response) {
    const { classroomId } = req.query as { classroomId?: string };
    const students = await studentsService.getAllStudents(classroomId);
    return sendSuccess(res, students, 'ดึงรายการนักเรียนสำเร็จ');
  }

  async getById(req: Request, res: Response) {
    const student = await studentsService.getStudentById(req.params.id);
    return sendSuccess(res, student, 'ดึงข้อมูลนักเรียนสำเร็จ');
  }

  async getByBarcode(req: Request, res: Response) {
    const student = await studentsService.getStudentByBarcode(req.params.barcode);
    return sendSuccess(res, student, 'ค้นหานักเรียนจากบาร์โค้ดสำเร็จ');
  }

  async create(req: Request, res: Response) {
    const student = await studentsService.createStudent(req.body);
    return sendSuccess(res, student, 'เพิ่มนักเรียนสำเร็จ', HTTP_STATUS.CREATED);
  }

  async update(req: Request, res: Response) {
    const student = await studentsService.updateStudent(req.params.id, req.body);
    return sendSuccess(res, student, 'อัปเดตข้อมูลนักเรียนสำเร็จ');
  }

  async delete(req: Request, res: Response) {
    await studentsService.deleteStudent(req.params.id);
    return sendSuccess(res, { id: req.params.id }, 'ลบข้อมูลนักเรียนสำเร็จ');
  }
}

export const studentsController = new StudentsController();
