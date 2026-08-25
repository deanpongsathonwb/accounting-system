export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName?: string;
  studentNumber?: number;
  classroomId: string;
  classroomName?: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remark?: string;
  recordedBy?: string;
  timestamp: string; // ISO 8601
  method?: 'manual' | 'qr' | 'barcode' | 'batch';
}

export interface AttendanceSession {
  id: string;
  classroomId: string;
  date: string;
  title?: string;
  status: 'draft' | 'completed' | 'locked';
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  leaveCount: number;
  presentRate: number;
  records: AttendanceRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface BulkAttendanceItem {
  studentId: string;
  status: AttendanceStatus;
  remark?: string;
}

export interface BulkAttendancePayload {
  classroomId: string;
  date: string;
  items: BulkAttendanceItem[];
}
