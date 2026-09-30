import React from 'react';
import { Navigate } from 'react-router-dom';
import type { User, UserRole } from '../types/common.types.ts';
import { APP_ROUTES } from '../constants/routes.ts';

interface RequireRoleProps {
  user: User | null;
  allowedRole: UserRole;
  children: React.ReactElement;
}

export const RequireRole: React.FC<RequireRoleProps> = ({ user, allowedRole, children }) => {
  if (!user) {
    return React.createElement(Navigate, { to: APP_ROUTES.LOGIN, replace: true });
  }

  if (user.role !== allowedRole) {
    switch (user.role) {
      case 'accountant':
        return React.createElement(Navigate, { to: APP_ROUTES.ACCOUNTANT.ROOT, replace: true });
      case 'auditor':
        return React.createElement(Navigate, { to: APP_ROUTES.AUDITOR.ROOT, replace: true });
      case 'billing':
        return React.createElement(Navigate, { to: APP_ROUTES.BILLING.ROOT, replace: true });
      case 'admin':
        return React.createElement(Navigate, { to: APP_ROUTES.ADMIN.ROOT, replace: true });
    }
  }

  return children;
};
