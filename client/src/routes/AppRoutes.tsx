import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES, getDefaultRouteForRole } from '../constants/routes';
import { AppLayout } from '../components/layout/AppLayout';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AttendancePage } from '../pages/AttendancePage';
import { StudentsPage } from '../pages/StudentsPage';
import { ClassroomsPage } from '../pages/ClassroomsPage';
import { ReportsPage } from '../pages/ReportsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { StaffAbsencesPage } from '../pages/StaffAbsencesPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProtectedRoute } from './ProtectedRoute';
import { RouteGuard } from './RouteGuard';
import { useAuthStore } from '../stores/authStore';

// Root redirect handler
const RootRedirect: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return <Navigate to={getDefaultRouteForRole(user.role)} replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Login Route (No Layout/Navigation) */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      {/* Root redirect to respective portal */}
      <Route path={ROUTES.HOME} element={<RootRedirect />} />

      {/* Authenticated Portal Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Admin Portal */}
        <Route element={<RouteGuard allowedRoles={['admin']} />}>
          <Route path="/admin" element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.ADMIN_ATTENDANCE} element={<AttendancePage />} />
          <Route path={ROUTES.ADMIN_STUDENTS} element={<StudentsPage />} />
          <Route path={ROUTES.ADMIN_CLASSROOMS} element={<ClassroomsPage />} />
          <Route path={ROUTES.ADMIN_REPORTS} element={<ReportsPage />} />
          <Route path={ROUTES.ADMIN_SETTINGS} element={<SettingsPage />} />
        </Route>

        {/* Teacher Portal */}
        <Route element={<RouteGuard allowedRoles={['teacher', 'admin']} />}>
          <Route path="/teacher" element={<Navigate to={ROUTES.TEACHER_ATTENDANCE} replace />} />
          <Route path={ROUTES.TEACHER_ATTENDANCE} element={<AttendancePage />} />
          <Route path={ROUTES.TEACHER_STUDENTS} element={<StudentsPage />} />
          <Route path={ROUTES.TEACHER_REPORTS} element={<ReportsPage />} />
        </Route>

        {/* Staff / Student Affairs Portal */}
        <Route element={<RouteGuard allowedRoles={['staff', 'admin']} />}>
          <Route path="/staff" element={<Navigate to={ROUTES.STAFF_ATTENDANCE} replace />} />
          <Route path={ROUTES.STAFF_ATTENDANCE} element={<AttendancePage />} />
          <Route path={ROUTES.STAFF_ABSENCES} element={<StaffAbsencesPage />} />
          <Route path={ROUTES.STAFF_STUDENTS} element={<StudentsPage />} />
          <Route path={ROUTES.STAFF_REPORTS} element={<ReportsPage />} />
        </Route>

        {/* Fallback alias routes */}
        <Route path="/dashboard" element={<RootRedirect />} />
        <Route path="/attendance" element={<RootRedirect />} />
        <Route path="/students" element={<RootRedirect />} />
        <Route path="/classrooms" element={<RootRedirect />} />
        <Route path="/reports" element={<RootRedirect />} />
        <Route path="/settings" element={<RootRedirect />} />

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
