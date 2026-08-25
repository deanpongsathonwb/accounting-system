export type AttendanceStatus = 'present' | 'late' | 'absent' | 'leave' | 'activity';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentNumber: string;
  studentName: string;
  rollNumber: number;
  classroomId: string;
  date: string; // YYYY-MM-DD
  period: string; // "morning" | "p1" | "p2" | ...
  status: AttendanceStatus;
  remark?: string;
  checkInTime?: string; // ISO Timestamp or HH:mm
  updatedAt?: string;
}

export interface AttendanceSession {
  id: string;
  classroomId: string;
  date: string; // YYYY-MM-DD
  period: string; // "morning" | "afternoon" | "period_1" ...
  recordedBy: string;
  records: AttendanceRecord[];
  summary: {
    total: number;
    present: number;
    late: number;
    absent: number;
    leave: number;
    activity: number;
    attendanceRate: number; // percentage e.g. 95.5
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface SaveAttendancePayload {
  classroomId: string;
  date: string;
  period: string;
  recordedBy?: string;
  records: Array<{
    studentId: string;
    status: AttendanceStatus;
    remark?: string;
    checkInTime?: string;
  }>;
}

export interface AttendanceStatsSummary {
  todayTotalStudents: number;
  todayCheckedCount: number;
  todayPresentCount: number;
  todayLateCount: number;
  todayAbsentCount: number;
  todayLeaveCount: number;
  overallRate: number;
  classroomsChecked: number;
  totalClassrooms: number;
}
