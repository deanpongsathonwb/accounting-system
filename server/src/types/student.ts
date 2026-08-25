export type Gender = 'male' | 'female' | 'other';
export type TitleTh = 'นาย' | 'นางสาว' | 'เด็กชาย' | 'เด็กหญิง';

export interface Student {
  id: string;
  studentCode: string; // e.g. "STD-1001"
  studentNumber: number; // เลขที่
  title: TitleTh;
  firstName: string;
  lastName: string;
  gender: Gender;
  classroomId: string;
  classroomName?: string;
  avatarUrl?: string;
  parentPhone?: string;
  parentName?: string;
  barcode?: string;
  rfid?: string;
  isActive: boolean;
  attendanceStats?: {
    totalDays: number;
    present: number;
    absent: number;
    late: number;
    leave: number;
    attendanceRate: number;
  };
  createdAt: string;
  updatedAt: string;
}
