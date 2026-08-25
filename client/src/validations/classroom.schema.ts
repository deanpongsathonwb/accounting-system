import { z } from 'zod';

export const classroomSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อห้องเรียน เช่น ม.1/1'),
  gradeLevel: z.string().min(1, 'กรุณากรอกระดับชั้น เช่น มัธยมศึกษาปีที่ 1'),
  roomNumber: z.string().min(1, 'กรุณากรอกเลขห้องเรียน เช่น 421'),
  academicYear: z.string().min(4, 'กรุณาระบุปีการศึกษา เช่น 2569'),
  semester: z.string().min(1, 'กรุณาระบุภาคเรียน เช่น 1'),
  advisorName: z.string().min(2, 'กรุณาระบุชื่อครูประจำชั้น'),
  color: z.string().optional(),
});

export type ClassroomFormValues = z.infer<typeof classroomSchema>;
