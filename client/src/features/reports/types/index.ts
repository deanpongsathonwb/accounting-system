export interface DailyAttendanceStat {
  date: string; // YYYY-MM-DD
  dayLabel: string; // เช่น จันทร์ 24 ส.ค.
  presentRate: number; // 0 - 100
  presentCount: number;
  lateCount: number;
  absentCount: number;
  leaveCount: number;
  total: number;
}

export interface StudentAbsenceRisk {
  studentId: string;
  studentNumber: string;
  studentName: string;
  classroomName: string;
  absentCount: number;
  lateCount: number;
  leaveCount: number;
  parentPhone: string;
  riskLevel: 'high' | 'medium' | 'low';
}
