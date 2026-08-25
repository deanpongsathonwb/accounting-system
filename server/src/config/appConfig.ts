import { env } from './env';

export const appConfig = {
  name: 'Student Attendance API Server',
  version: '1.0.0',
  port: env.PORT,
  environment: env.NODE_ENV,
  apiPrefix: env.API_PREFIX,
  isProduction: env.NODE_ENV === 'production',
  isDevelopment: env.NODE_ENV === 'development',
} as const;
