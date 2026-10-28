import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store.ts';
import { ROUTES } from '../../constants/index.ts';

export const PortalRedirect: React.FC = () => {
  const currentUser = useAuthStore((state) => state.currentUser);

  if (!currentUser) {
    return <Navigate to={ROUTES.PUBLIC.LOGIN} replace />;
  }

  switch (currentUser.role) {
    case 'accountant':
      return <Navigate to={ROUTES.ACCOUNTANT.DASHBOARD} replace />;
    case 'finance':
      return <Navigate to={ROUTES.FINANCE.DASHBOARD} replace />;
    case 'auditor':
      return <Navigate to={ROUTES.AUDITOR.DASHBOARD} replace />;
    case 'admin':
      return <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />;
    default:
      return <Navigate to={ROUTES.PUBLIC.LOGIN} replace />;
  }
};
