import { Router } from 'express';
import { reportsController } from '../controllers/reports.controller';
import { asyncHandler } from '../utils/asyncHandler';

export const reportsRoutes = Router();

reportsRoutes.get('/summary', asyncHandler(reportsController.getSummary.bind(reportsController)));
reportsRoutes.get('/high-absence', asyncHandler(reportsController.getHighAbsence.bind(reportsController)));
