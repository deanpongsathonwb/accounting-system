export const DB_COLLECTIONS = {
  USERS: 'users',
  CLASSROOMS: 'classrooms',
  STUDENTS: 'students',
  ATTENDANCE_RECORDS: 'attendance_records',
  ATTENDANCE_SESSIONS: 'attendance_sessions',
  SETTINGS: 'settings',
  AUDIT_LOGS: 'audit_logs',
} as const;

export const DB_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  INITIALIZING: 'initializing',
} as const;
