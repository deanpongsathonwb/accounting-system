import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User as UserIcon, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { UI, ROUTES } from '../../constants/index.ts';
import { useAuthStore } from '../../stores/auth.store.ts';
import { useAppStore } from '../../stores/app.store.ts';
import { UserRole } from '../../types/common.types.ts';
import { renderSemanticText } from '../../components/common/index.ts';

import { sanitizeInput, getLoginRateLimitState, recordFailedLoginAttempt, resetLoginRateLimit } from '../../utils/security.ts';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const authenticate = useAuthStore((state) => state.authenticate);
  const users = useAppStore((state) => state.users);
  const systemOwner = useAppStore((state) => state.settings.systemOwner);
  const addAuditLog = useAppStore((state) => state.addAuditLog);

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getRoleLandingRoute = (role: UserRole): string => {
    switch (role) {
      case 'accountant':
        return ROUTES.ACCOUNTANT.DASHBOARD;
      case 'finance':
        return ROUTES.FINANCE.DASHBOARD;
      case 'auditor':
        return ROUTES.AUDITOR.DASHBOARD;
      case 'admin':
        return ROUTES.ADMIN.DASHBOARD;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Check rate limit status
    const rateLimit = getLoginRateLimitState();
    if (rateLimit.lockoutExpiry && Date.now() < rateLimit.lockoutExpiry) {
      setErrorMessage(UI.auth.tooManyAttempts);
      return;
    }

    const cleanIdentifier = sanitizeInput(usernameOrEmail);
    if (!cleanIdentifier || !password) {
      setErrorMessage(UI.validation.required);
      return;
    }

    setIsLoading(true);

    // Simulate minor production authentication roundtrip latency
    setTimeout(() => {
      const result = authenticate(cleanIdentifier, password, users);

      if (result.success && result.user) {
        resetLoginRateLimit();
        addAuditLog({
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          actor: result.user.fullName,
          role: result.user.role,
          actionType: UI.auth.loginButton,
          entity: `${UI.auth.currentUser}: ${result.user.username}`,
          ipAddress: 'Web Client (Secure Session)'
        });

        setIsLoading(false);
        navigate(getRoleLandingRoute(result.user.role), { replace: true });
      } else {
        const rateStatus = recordFailedLoginAttempt();
        setIsLoading(false);
        setPassword('');
        if (rateStatus.isLocked) {
          setErrorMessage(UI.auth.tooManyAttempts);
        } else {
          setErrorMessage(result.error || UI.auth.invalidCredentials);
        }
      }
    }, 300);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 p-3 sm:p-6 select-none">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-slate-950 p-6 sm:p-8 text-center border-b border-slate-800">
          <div className="w-14 sm:w-16 h-14 sm:h-16 mx-auto rounded-2xl shadow-lg mb-4 overflow-hidden flex items-center justify-center bg-blue-600">
            <img src="/favicon.svg" alt={UI.system.name} className="w-full h-full object-contain" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {UI.system.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            {renderSemanticText(systemOwner)}
          </p>
        </div>

        {/* Login Form Body */}
        <div className="p-6 sm:p-8">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-bold text-slate-800">
              {UI.auth.loginTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {renderSemanticText(UI.auth.loginSubtitle)}
            </p>
          </div>

          {/* Error Message Banner */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-fade-in"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-snug font-medium break-words">
                {renderSemanticText(errorMessage)}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                {UI.auth.usernameLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  value={usernameOrEmail}
                  onChange={(e) => {
                    setUsernameOrEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder={UI.auth.usernamePlaceholder}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-slate-800 font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                {UI.auth.passwordLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder={UI.auth.passwordPlaceholder}
                  className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-slate-800 font-medium font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? UI.auth.hidePassword : UI.auth.showPassword}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-medium text-slate-600">
                  {UI.auth.rememberMe}
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>{UI.auth.authenticating}</span>
                </>
              ) : (
                <>
                  <span>{UI.auth.loginButton}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </>
              )}
            </button>
          </form>

          {/* Security & Health Notice Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400 text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{UI.auth.secureLoginNotice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
