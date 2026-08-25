import { z } from 'zod';

export const createClassroomSchema = z.object({
  name: z.string().min(1, 'ต้องระบุชื่อห้องเรียน').max(50, 'ชื่อห้องเรียนต้องไม่เกิน 50 ตัวอักษร'),
  gradeLevel: z.string().min(1, 'ต้องระบุระดับชั้น'),
  academicYear: z.string().regex(/^\d{4}$/, 'ปีการศึกษาต้องเป็นตัวเลข 4 หลัก เช่น 2568'),
  term: z.union([z.literal(1), z.literal(2), z.literal('1').transform(() => 1 as const), z.literal('2').transform(() => 2 as const)]),
  homeroomTeacher: z.string().max(100).optional(),
  description: z.string().max(255).optional(),
  color: z.string().optional(),
});

export const updateClassroomSchema = createClassroomSchema.partial();
