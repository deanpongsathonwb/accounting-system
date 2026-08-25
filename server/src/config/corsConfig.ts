import { CorsOptions } from 'cors';
import { env } from './env';

export const corsConfig: CorsOptions = {
  origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400,
};
