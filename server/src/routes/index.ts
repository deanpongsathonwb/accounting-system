import { Router } from 'express';
import { attendanceRoutes } from './attendance.routes';
import { classroomsRoutes } from './classrooms.routes';
import { studentsRoutes } from './students.routes';
import { authRoutes } from './auth.routes';
import { reportsRoutes } from './reports.routes';

export const mainRouter = Router();

mainRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Student Attendance API',
    timestamp: new Date().toISOString(),
  });
});

mainRouter.use('/attendance', attendanceRoutes);
mainRouter.use('/classrooms', classroomsRoutes);
mainRouter.use('/students', studentsRoutes);
mainRouter.use('/auth', authRoutes);
mainRouter.use('/reports', reportsRoutes);
