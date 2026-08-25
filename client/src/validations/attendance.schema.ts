import { z } from 'zod';

export const attendanceRecordSchema = z.object({
  studentId: z.string().min(1),
  status: z.enum(['present', 'late', 'absent', 'leave', 'activity']),
  remark: z.string().optional(),
  checkInTime: z.string().optional(),
});

export const attendanceSessionSchema = z.object({
  classroomId: z.string().min(1, 'กรุณาเลือกห้องเรียน'),
  date: z.string().min(1, 'กรุณาเลือกวันที่'),
  period: z.string().min(1, 'กรุณาเลือกรอบ/คาบเรียน'),
  recordedBy: z.string().optional(),
  records: z.array(attendanceRecordSchema),
});

export type AttendanceSessionFormValues = z.infer<typeof attendanceSessionSchema>;
