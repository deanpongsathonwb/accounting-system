import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { validateBody } from '../middlewares/validationMiddleware';
import { loginSchema } from '../validations/auth.schema';
import { authMiddleware } from '../middlewares/authMiddleware';

export const authRoutes = Router();

authRoutes.post('/login', validateBody(loginSchema), asyncHandler(authController.login.bind(authController)));
authRoutes.get('/me', authMiddleware, asyncHandler(authController.me.bind(authController)));
authRoutes.post('/logout', asyncHandler(authController.logout.bind(authController)));
