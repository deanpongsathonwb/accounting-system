import { Router } from 'express';
import { classroomsController } from '../controllers/classrooms.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { validateBody } from '../middlewares/validationMiddleware';
import { createClassroomSchema, updateClassroomSchema } from '../validations/classroom.schema';

export const classroomsRoutes = Router();

classroomsRoutes.get('/', asyncHandler(classroomsController.getAll.bind(classroomsController)));
classroomsRoutes.get('/:id', asyncHandler(classroomsController.getById.bind(classroomsController)));
classroomsRoutes.post(
  '/',
  validateBody(createClassroomSchema),
  asyncHandler(classroomsController.create.bind(classroomsController))
);
classroomsRoutes.put(
  '/:id',
  validateBody(updateClassroomSchema),
  asyncHandler(classroomsController.update.bind(classroomsController))
);
classroomsRoutes.delete('/:id', asyncHandler(classroomsController.delete.bind(classroomsController)));
