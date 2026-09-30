import React from 'react';
import { Navigate } from 'react-router-dom';
import { ui } from '../../constants/index.ts';
import { APP_ROUTES } from '../../constants/routes.ts';
import imagesData from '../../seed/images.json';
import seedUsers from '../../seed/users.json';
import type { User, UserRole, SystemSettings } from '../../types/common.types.ts';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { renderSemantic } from '../../utils/text.tsx';

interface LoginPageProps {
  user: User | null;
  settings: SystemSettings;
  onLogin: (role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ user, settings, onLogin }) => {
  // If authenticated, redirect to role-specific root
  if (user) {
    switch (user.role) {
      case 'accountant':
        return <Navigate to={APP_ROUTES.ACCOUNTANT.ROOT} replace />;
      case 'auditor':
        return <Navigate to={APP_ROUTES.AUDITOR.ROOT} replace />;
      case 'billing':
        return <Navigate to={APP_ROUTES.BILLING.ROOT} replace />;
      case 'admin':
        return <Navigate to={APP_ROUTES.ADMIN.ROOT} replace />;
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-between items-center p-3 sm:p-6 lg:p-8 text-slate-100 font-sans select-none overflow-x-hidden">
      {/* Top Header */}
      <header className="w-full max-w-4xl flex flex-wrap items-center justify-between py-3 sm:py-4 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={imagesData.systemLogo}
            alt={ui.system.name}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg shrink-0"
          />
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug break-words">
              {renderSemantic(ui.system.name)}
            </h1>
            <p className="text-xs text-slate-400 break-words leading-relaxed">{settings.systemOwner}</p>
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2 shrink-0">
          <span className="whitespace-nowrap shrink-0">{ui.common.fiscalYearPrefix}</span>
          <span className="font-mono tabular-nums text-slate-200 whitespace-nowrap shrink-0">{settings.fiscalYear}</span>
        </div>
      </header>

      {/* Main Authentication & Role Selection Container */}
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 lg:p-8 shadow-2xl my-6">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug break-words">
            {renderSemantic(ui.auth.loginHeader)}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed break-words">
            {renderSemantic(ui.auth.publicAnnouncement)}
          </p>
        </div>

        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-400 whitespace-nowrap shrink-0">
            {renderSemantic(ui.auth.selectRole)}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {seedUsers.map((u) => {
              const roleKey = u.role as UserRole;
              const avatar = imagesData.avatars[roleKey] || imagesData.avatars.accountant;
              return (
                <button
                  key={u.id}
                  onClick={() => onLogin(roleKey)}
                  className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-sky-500 rounded-xl transition-all text-left gap-3 group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-sky-500/40 active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={avatar}
                      alt={u.fullName}
                      className="w-10 h-10 rounded-full shrink-0 bg-slate-700 ring-2 ring-slate-700 group-hover:ring-sky-500 transition-all"
                    />
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-sky-300 transition-colors break-words leading-snug">
                        {u.fullName}
                      </div>
                      <div className="text-xs text-sky-400 whitespace-nowrap shrink-0 mt-0.5">
                        {ui.roles[roleKey]}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-700/60 group-hover:bg-sky-600 text-slate-300 group-hover:text-white transition-all shrink-0 self-end sm:self-center whitespace-nowrap">
                    <span className="text-xs font-semibold leading-normal whitespace-nowrap shrink-0">{ui.auth.submitLogin}</span>
                    <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="whitespace-nowrap shrink-0">{ui.common.systemStatus}</span>
          </div>
          <span className="break-words">{settings.accountingStandard}</span>
        </div>
      </div>

      {/* Footer Notice */}
      <footer className="w-full max-w-4xl text-center py-3 sm:py-4 text-xs text-slate-500 border-t border-slate-800/80 break-words leading-relaxed px-2">
        <span>{renderSemantic(ui.common.desktopOnlyNotice)}</span>
      </footer>
    </div>
  );
};
