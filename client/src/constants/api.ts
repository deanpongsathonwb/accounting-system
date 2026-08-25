export const API_ENDPOINTS = {
  STUDENTS: '/students',
  STUDENT_BY_ID: (id: string) => `/students/${id}`,
  CLASSROOMS: '/classrooms',
  CLASSROOM_BY_ID: (id: string) => `/classrooms/${id}`,
  ATTENDANCE: '/attendance',
  ATTENDANCE_BY_SESSION: '/attendance/session',
  ATTENDANCE_STATS: '/attendance/stats',
  ATTENDANCE_REPORT: '/attendance/report',
  STATS: '/stats',
} as const;

export const DEFAULT_TIMEOUT = 10000;
