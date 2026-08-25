import { Classroom } from '../types/classroom';
import { Student } from '../types/student';
import { AttendanceRecord, AttendanceSession } from '../types/attendance';
import { User } from '../types/user';

export interface DatabaseSchema {
  users: User[];
  classrooms: Classroom[];
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  attendanceSessions: AttendanceSession[];
  lastUpdated: string;
}
