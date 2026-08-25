import { z } from 'zod';

export const attendanceStatusSchema = z.enum(['present', 'absent', 'late', 'leave']);

export const bulkAttendanceItemSchema = z.object({
  studentId: z.string().min(1, 'ต้องระบุรหัสนักเรียน'),
  status: attendanceStatusSchema,
  remark: z.string().max(200, 'หมายเหตุต้องไม่เกิน 200 ตัวอักษร').optional(),
});

export const bulkAttendanceSchema = z.object({
  classroomId: z.string().min(1, 'ต้องระบุรหัสห้องเรียน'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'รูปแบบวันที่ต้องเป็น YYYY-MM-DD'),
  items: z.array(bulkAttendanceItemSchema).min(1, 'ต้องมีรายการเช็คชื่ออย่างน้อย 1 รายการ'),
});

export const singleAttendanceRecordSchema = z.object({
  studentId: z.string().min(1, 'ต้องระบุรหัสนักเรียน'),
  classroomId: z.string().min(1, 'ต้องระบุรหัสห้องเรียน'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'รูปแบบวันที่ต้องเป็น YYYY-MM-DD'),
  status: attendanceStatusSchema,
  remark: z.string().max(200).optional(),
  method: z.enum(['manual', 'qr', 'barcode', 'batch']).default('manual'),
});
