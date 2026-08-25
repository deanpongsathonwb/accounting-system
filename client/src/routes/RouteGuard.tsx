import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { ROUTES, getDefaultRouteForRole } from '../constants/routes';

interface RouteGuardProps {
  children?: React.ReactNode;
  allowedRoles?: Array<'admin' | 'teacher' | 'staff'>;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && user) {
    if (!allowedRoles.includes(user.role)) {
      // Direct user to their appropriate production portal
      const fallbackRoute = getDefaultRouteForRole(user.role);
      return <Navigate to={fallbackRoute} replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default RouteGuard;
