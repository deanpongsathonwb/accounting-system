export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_ME: '/auth/me',
  AUTH_LOGOUT: '/auth/logout',

  // Students & Classrooms
  STUDENTS: '/students',
  STUDENT_BY_ID: (id: string) => `/students/${id}`,
  CLASSROOMS: '/classrooms',
  CLASSROOM_BY_ID: (id: string) => `/classrooms/${id}`,

  // Attendance
  ATTENDANCE: '/attendance',
  ATTENDANCE_BY_SESSION: '/attendance/session',
  ATTENDANCE_STATS: '/attendance/stats',
  ATTENDANCE_REPORT: '/attendance/report',

  // Reports
  REPORTS_SUMMARY: '/reports/summary',
  REPORTS_HIGH_ABSENCE: '/reports/high-absence',

  STATS: '/stats',
} as const;

export const DEFAULT_TIMEOUT = 10000;
