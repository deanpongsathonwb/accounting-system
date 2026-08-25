import { z } from 'zod';

export const studentSchema = z.object({
  studentNumber: z.string().min(1, 'กรุณากรอกเลขประจำตัวนักเรียน').max(20, 'ความยาวไม่เกิน 20 ตัวอักษร'),
  prefix: z.string().min(1, 'กรุณาเลือกคำนำหน้า'),
  firstName: z.string().min(2, 'กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร'),
  lastName: z.string().min(2, 'กรุณากรอกนามสกุลอย่างน้อย 2 ตัวอักษร'),
  nickname: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']),
  classroomId: z.string().min(1, 'กรุณาเลือกห้องเรียน'),
  rollNumber: z.number().min(1, 'เลขที่ต้องมากกว่า 0'),
  avatarUrl: z.string().optional(),
  parentPhone: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});

export type StudentFormValues = z.infer<typeof studentSchema>;

