import express, { Express } from 'express';
import { corsMiddleware } from './middlewares/corsMiddleware';
import { loggingMiddleware } from './middlewares/loggingMiddleware';
import { rateLimitMiddleware } from './middlewares/rateLimitMiddleware';
import { errorHandler } from './middlewares/errorHandler';
import { mainRouter } from './routes';
import { env } from './config/env';
import { SERVER_LIMITS } from './constants/limits';

export function createApp(): Express {
  const app = express();

  // Middlewares
  app.use(corsMiddleware);
  app.use(express.json({ limit: SERVER_LIMITS.BODY_JSON_LIMIT }));
  app.use(express.urlencoded({ extended: true, limit: SERVER_LIMITS.BODY_JSON_LIMIT }));
  app.use(loggingMiddleware);

  // Mount API routes with rate limiting
  app.use(env.API_PREFIX, rateLimitMiddleware, mainRouter);

  // Error Handler
  app.use(errorHandler);

  return app;
}
