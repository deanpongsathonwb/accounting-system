import { z } from 'zod';

export const titleThSchema = z.enum(['นาย', 'นางสาว', 'เด็กชาย', 'เด็กหญิง']);
export const genderSchema = z.enum(['male', 'female', 'other']);

export const createStudentSchema = z.object({
  studentCode: z.string().min(1, 'ต้องระบุรหัสนักเรียน'),
  studentNumber: z.coerce.number().int().positive('เลขที่ต้องเป็นจำนวนเต็มบวก'),
  title: titleThSchema,
  firstName: z.string().min(1, 'ต้องระบุชื่อจริง'),
  lastName: z.string().min(1, 'ต้องระบุนามสกุล'),
  gender: genderSchema,
  classroomId: z.string().min(1, 'ต้องระบุห้องเรียน'),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  parentPhone: z.string().regex(/^[0-9-+\s]{9,15}$/, 'เบอร์โทรศัพท์ผู้ปกครองไม่ถูกต้อง').optional().or(z.literal('')),
  parentName: z.string().max(100).optional(),
  barcode: z.string().optional(),
  rfid: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const updateStudentSchema = createStudentSchema.partial();
