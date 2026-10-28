import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store.ts';
import { UserRole } from '../../types/common.types.ts';
import { ROUTES } from '../../constants/index.ts';

interface RoleGuardProps {
  allowedRole: UserRole;
  children?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRole, children }) => {
  const currentUser = useAuthStore((state) => state.currentUser);

  if (!currentUser) {
    return <Navigate to={ROUTES.PUBLIC.LOGIN} replace />;
  }

  if (currentUser.role !== allowedRole) {
    return <Navigate to={ROUTES.PUBLIC.UNAUTHORIZED} replace />;
  }

  return children;
};
