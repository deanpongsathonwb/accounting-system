export const API_CONFIG = {
  PREFIX: '/api',
  VERSION: 'v1',
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const ENDPOINTS = {
  HEALTH: '/health',
  AUTH: {
    ROOT: '/auth',
    LOGIN: '/login',
    LOGOUT: '/logout',
    ME: '/me',
  },
  CLASSROOMS: {
    ROOT: '/classrooms',
    BY_ID: '/classrooms/:id',
  },
  STUDENTS: {
    ROOT: '/students',
    BY_ID: '/students/:id',
  },
  ATTENDANCE: {
    ROOT: '/attendance',
    BY_ID: '/attendance/:id',
    SESSION: '/attendance/session',
    SUMMARY: '/attendance/summary',
    STATS: '/attendance/stats',
  },
  REPORTS: {
    ROOT: '/reports',
    SUMMARY: '/reports/summary',
    HIGH_ABSENCE: '/reports/high-absence',
    EXPORT: '/reports/export',
  },
} as const;
