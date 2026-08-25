export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'attendance-system-prod-auth-secret-key-2026',
  tokenExpiresIn: '7d',
} as const;
