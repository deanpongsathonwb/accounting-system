import { Router } from 'express';
import { studentsController } from '../controllers/students.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { validateBody } from '../middlewares/validationMiddleware';
import { createStudentSchema, updateStudentSchema } from '../validations/student.schema';

export const studentsRoutes = Router();

studentsRoutes.get('/', asyncHandler(studentsController.getAll.bind(studentsController)));
studentsRoutes.get('/barcode/:barcode', asyncHandler(studentsController.getByBarcode.bind(studentsController)));
studentsRoutes.get('/:id', asyncHandler(studentsController.getById.bind(studentsController)));
studentsRoutes.post(
  '/',
  validateBody(createStudentSchema),
  asyncHandler(studentsController.create.bind(studentsController))
);
studentsRoutes.put(
  '/:id',
  validateBody(updateStudentSchema),
  asyncHandler(studentsController.update.bind(studentsController))
);
studentsRoutes.delete('/:id', asyncHandler(studentsController.delete.bind(studentsController)));
