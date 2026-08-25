export const ERROR_CODES = {
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  DATABASE_ERROR: 'DATABASE_ERROR',
} as const;

export const ERROR_MESSAGES = {
  RESOURCE_NOT_FOUND: 'ไม่พบข้อมูลที่ต้องการ',
  UNAUTHORIZED_ACCESS: 'ไม่มีสิทธิ์เข้าถึงข้อมูลหรือเข้าสู่ระบบไม่ถูกต้อง',
  INVALID_PAYLOAD: 'ข้อมูลที่ส่งมาไม่ถูกต้องตามโครงสร้างที่กำหนด',
  INTERNAL_ERROR: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง',
  DUPLICATE_ENTRY: 'มีข้อมูลนี้อยู่ในระบบแล้ว',
  STUDENT_NOT_FOUND: 'ไม่พบข้อมูลนักเรียน',
  CLASSROOM_NOT_FOUND: 'ไม่พบข้อมูลห้องเรียน',
} as const;
