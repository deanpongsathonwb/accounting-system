import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'ต้องระบุชื่อผู้ใช้งาน'),
  password: z.string().min(1, 'ต้องระบุรหัสผ่าน'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email('อีเมลไม่ถูกต้อง').optional(),
  avatarUrl: z.string().url().optional(),
});
