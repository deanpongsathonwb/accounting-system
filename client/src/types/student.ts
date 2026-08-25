import { Gender } from './common';

export interface Student {
  id: string; // e.g. "std-001"
  studentNumber: string; // เลขประจำตัวนักเรียน e.g. "54001"
  prefix: string; // นาย / นางสาว / เด็กชาย / เด็กหญิง
  firstName: string; // ชื่อ
  lastName: string; // นามสกุล
  nickname?: string; // ชื่อเล่น
  gender: Gender;
  classroomId: string; // รหัสห้องเรียน
  classroomName?: string; // e.g. "ม.1/1"
  rollNumber: number; // เลขที่
  avatarUrl?: string;
  parentPhone?: string; // เบอร์โทรผู้ปกครอง
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export type CreateStudentDto = Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'classroomName'>;
export type UpdateStudentDto = Partial<CreateStudentDto>;
