export const AUTH_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STAFF: 'staff',
  VIEWER: 'viewer',
} as const;

export type AuthRole = typeof AUTH_ROLES[keyof typeof AUTH_ROLES];

export const AUTH_CONSTANTS = {
  TOKEN_EXPIRY_SECONDS: 60 * 60 * 24 * 7, // 7 days
  SALT_ROUNDS: 10,
  BEARER_PREFIX: 'Bearer ',
  HEADER_NAME: 'authorization',
} as const;
