export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'attendance-system-dev-secret-key-2025',
  tokenExpiresIn: '7d',
  mockUsersEnabled: true,
} as const;
