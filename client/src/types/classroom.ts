export interface Classroom {
  id: string; // e.g. "cls-1"
  name: string; // e.g. "ม.1/1"
  gradeLevel: string; // e.g. "มัธยมศึกษาปีที่ 1"
  roomNumber: string; // e.g. "421"
  academicYear: string; // e.g. "2569"
  semester: string; // e.g. "1"
  advisorName: string; // ชื่อครูที่ปรึกษา / ครูประจำชั้น e.g. "ครูสมศรี ใจดี"
  totalStudents?: number;
  color?: string; // Hex or Tailwind color class
  createdAt?: string;
  updatedAt?: string;
}

export type CreateClassroomDto = Omit<Classroom, 'id' | 'totalStudents' | 'createdAt' | 'updatedAt'>;
export type UpdateClassroomDto = Partial<CreateClassroomDto>;
