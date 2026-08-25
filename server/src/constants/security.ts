export const SECURITY_CONFIG = {
  CORS_ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  CORS_ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'X-Requested-With'],
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 mins
  RATE_LIMIT_MAX_REQUESTS: 3000,
} as const;
