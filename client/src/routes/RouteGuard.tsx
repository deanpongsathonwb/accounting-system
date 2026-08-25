import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { ROUTES } from '../constants/routes';

interface RouteGuardProps {
  children?: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: string[];
  redirectTo?: string;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  requireAuth = false,
  requiredRole,
  redirectTo = ROUTES.DASHBOARD,
}) => {
  const { isAuthenticated, user } = useAuthStore();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole && requiredRole.length > 0 && user) {
    if (!requiredRole.includes(user.role)) {
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default RouteGuard;
