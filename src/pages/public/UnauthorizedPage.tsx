import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { UI, ROUTES } from '../../constants/index.ts';
import { useAuthStore } from '../../stores/auth.store.ts';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);

  const handleReturn = () => {
    if (!currentUser) {
      navigate(ROUTES.PUBLIC.LOGIN);
      return;
    }
    switch (currentUser.role) {
      case 'accountant':
        navigate(ROUTES.ACCOUNTANT.DASHBOARD);
        break;
      case 'finance':
        navigate(ROUTES.FINANCE.DASHBOARD);
        break;
      case 'auditor':
        navigate(ROUTES.AUDITOR.DASHBOARD);
        break;
      case 'admin':
        navigate(ROUTES.ADMIN.DASHBOARD);
        break;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-rose-600 mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 mb-2">
          {UI.auth.unauthorizedTitle}
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          {UI.auth.unauthorizedMessage}
        </p>
        <button
          onClick={handleReturn}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{UI.auth.returnToMain}</span>
        </button>
      </div>
    </div>
  );
};
