import { classroomsRepository } from '../repositories/classrooms.repository';
import { Classroom } from '../types/classroom';
import { NotFoundError } from '../utils/errors';
import { generateId } from '../utils/helpers';

export class ClassroomsService {
  async getAllClassrooms(): Promise<Classroom[]> {
    return classroomsRepository.findAll();
  }

  async getClassroomById(id: string): Promise<Classroom> {
    const classroom = await classroomsRepository.findById(id);
    if (!classroom) {
      throw new NotFoundError('ไม่พบข้อมูลห้องเรียน');
    }
    return classroom;
  }

  async createClassroom(data: Omit<Classroom, 'id' | 'createdAt' | 'updatedAt'>): Promise<Classroom> {
    const newClassroom: Classroom = {
      ...data,
      id: generateId('cls'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return classroomsRepository.create(newClassroom);
  }

  async updateClassroom(id: string, updates: Partial<Classroom>): Promise<Classroom> {
    const updated = await classroomsRepository.update(id, updates);
    if (!updated) {
      throw new NotFoundError('ไม่พบข้อมูลห้องเรียนที่ต้องการแก้ไข');
    }
    return updated;
  }

  async deleteClassroom(id: string): Promise<boolean> {
    const exists = await classroomsRepository.findById(id);
    if (!exists) {
      throw new NotFoundError('ไม่พบข้อมูลห้องเรียน');
    }
    return classroomsRepository.delete(id);
  }
}

export const classroomsService = new ClassroomsService();
