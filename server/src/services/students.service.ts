import { studentsRepository } from '../repositories/students.repository';
import { classroomsRepository } from '../repositories/classrooms.repository';
import { Student } from '../types/student';
import { NotFoundError } from '../utils/errors';
import { generateId } from '../utils/helpers';

export class StudentsService {
  async getAllStudents(classroomId?: string): Promise<Student[]> {
    return studentsRepository.findAll(classroomId);
  }

  async getStudentById(id: string): Promise<Student> {
    const student = await studentsRepository.findById(id);
    if (!student) {
      throw new NotFoundError('ไม่พบข้อมูลนักเรียน');
    }
    return student;
  }

  async getStudentByBarcode(code: string): Promise<Student> {
    const student = await studentsRepository.findByCode(code);
    if (!student) {
      throw new NotFoundError('ไม่พบข้อมูลนักเรียนจากรหัสบาร์โค้ดนี้');
    }
    return student;
  }

  async createStudent(data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<Student> {
    const classroom = await classroomsRepository.findById(data.classroomId);
    const newStudent: Student = {
      ...data,
      id: generateId('std'),
      classroomName: classroom?.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return studentsRepository.create(newStudent);
  }

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    const updated = await studentsRepository.update(id, updates);
    if (!updated) {
      throw new NotFoundError('ไม่พบข้อมูลนักเรียนที่ต้องการแก้ไข');
    }
    return updated;
  }

  async deleteStudent(id: string): Promise<boolean> {
    const exists = await studentsRepository.findById(id);
    if (!exists) {
      throw new NotFoundError('ไม่พบข้อมูลนักเรียน');
    }
    return studentsRepository.delete(id);
  }
}

export const studentsService = new StudentsService();
