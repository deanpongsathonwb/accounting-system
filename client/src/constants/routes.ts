export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',

  // Admin Portal Routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_ATTENDANCE: '/admin/attendance',
  ADMIN_STUDENTS: '/admin/students',
  ADMIN_CLASSROOMS: '/admin/classrooms',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_SETTINGS: '/admin/settings',

  // Teacher Portal Routes
  TEACHER_ATTENDANCE: '/teacher/attendance',
  TEACHER_STUDENTS: '/teacher/students',
  TEACHER_REPORTS: '/teacher/reports',

  // Staff / Student Affairs Portal Routes
  STAFF_ATTENDANCE: '/staff/attendance',
  STAFF_STUDENTS: '/staff/students',
  STAFF_ABSENCES: '/staff/absences',
  STAFF_REPORTS: '/staff/reports',

  // Fallback aliases
  DASHBOARD: '/admin/dashboard',
  ATTENDANCE: '/teacher/attendance',
  STUDENTS: '/admin/students',
  CLASSROOMS: '/admin/classrooms',
  REPORTS: '/admin/reports',
  SETTINGS: '/admin/settings',
} as const;

export function getDefaultRouteForRole(role?: string): string {
  switch (role) {
    case 'admin':
      return ROUTES.ADMIN_DASHBOARD;
    case 'teacher':
      return ROUTES.TEACHER_ATTENDANCE;
    case 'staff':
      return ROUTES.STAFF_ATTENDANCE;
    default:
      return ROUTES.LOGIN;
  }
}
