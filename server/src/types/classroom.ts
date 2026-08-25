export interface Classroom {
  id: string;
  name: string; // e.g. "ม.4/1"
  gradeLevel: string; // e.g. "ม.4"
  academicYear: string; // e.g. "2568"
  term: 1 | 2;
  homeroomTeacher?: string;
  studentCount?: number;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}
