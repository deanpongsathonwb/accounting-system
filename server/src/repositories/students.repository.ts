import { dbStore } from '../database/inMemoryStore';
import { Student } from '../types/student';

export class StudentsRepository {
  async findAll(classroomId?: string): Promise<Student[]> {
    return dbStore.getStudents(classroomId);
  }

  async findById(id: string): Promise<Student | undefined> {
    return dbStore.getStudentById(id);
  }

  async findByCode(code: string): Promise<Student | undefined> {
    return dbStore.getStudentByCodeOrBarcode(code);
  }

  async create(student: Student): Promise<Student> {
    return dbStore.createStudent(student);
  }

  async update(id: string, updates: Partial<Student>): Promise<Student | undefined> {
    return dbStore.updateStudent(id, updates);
  }

  async delete(id: string): Promise<boolean> {
    return dbStore.deleteStudent(id);
  }
}

export const studentsRepository = new StudentsRepository();
