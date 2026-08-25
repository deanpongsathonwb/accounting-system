import { Request, Response } from 'express';
import { classroomsService } from '../services/classrooms.service';
import { sendSuccess } from '../utils/response';
import { HTTP_STATUS } from '../constants/http';

export class ClassroomsController {
  async getAll(_req: Request, res: Response) {
    const classrooms = await classroomsService.getAllClassrooms();
    return sendSuccess(res, classrooms, 'ดึงรายการห้องเรียนสำเร็จ');
  }

  async getById(req: Request, res: Response) {
    const classroom = await classroomsService.getClassroomById(req.params.id);
    return sendSuccess(res, classroom, 'ดึงข้อมูลห้องเรียนสำเร็จ');
  }

  async create(req: Request, res: Response) {
    const classroom = await classroomsService.createClassroom(req.body);
    return sendSuccess(res, classroom, 'สร้างห้องเรียนสำเร็จ', HTTP_STATUS.CREATED);
  }

  async update(req: Request, res: Response) {
    const classroom = await classroomsService.updateClassroom(req.params.id, req.body);
    return sendSuccess(res, classroom, 'อัปเดตห้องเรียนสำเร็จ');
  }

  async delete(req: Request, res: Response) {
    await classroomsService.deleteClassroom(req.params.id);
    return sendSuccess(res, { id: req.params.id }, 'ลบห้องเรียนสำเร็จ');
  }
}

export const classroomsController = new ClassroomsController();
