import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { ui } from '../../constants/index.ts';
import { APP_ROUTES } from '../../constants/routes.ts';
import imagesData from '../../seed/images.json';
import type { User, UserRole, SystemSettings } from '../../types/common.types.ts';
import seedUsers from '../../seed/users.json';
import {
  BookOpen,
  FileText,
  Layers,
  Scale,
  PieChart,
  GitCompare,
  Percent,
  CheckCircle2,
  FileSpreadsheet,
  Receipt as ReceiptIcon,
  Clock,
  Building2,
  Settings,
  ShieldAlert,
  Database,
  Users as UsersIcon,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { renderSemantic } from '../../utils/text.tsx';

interface AppLayoutProps {
  user: User;
  settings: SystemSettings;
  onLogout: () => void;
  onSwitchRole: (role: UserRole) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  user,
  settings,
  onLogout,
  onSwitchRole,
}) => {
  const location = useLocation();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const lock = () => {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      const mainEl = document.getElementById('main-scroll-container');
      if (mainEl) mainEl.style.overflow = 'hidden';
    };
    lock();
    window.addEventListener('resize', lock);
    window.addEventListener('orientationchange', lock);
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      const mainEl = document.getElementById('main-scroll-container');
      if (mainEl) mainEl.style.overflow = '';
      window.removeEventListener('resize', lock);
      window.removeEventListener('orientationchange', lock);
    };
  }, [mobileNavOpen]);

  // Role-specific navigation links: strictly non-duplicated across roles
  const getNavLinks = () => {
    switch (user.role) {
      case 'accountant':
        return [
          {
            to: APP_ROUTES.ACCOUNTANT.JOURNALS,
            label: ui.navigation.accountant.journals,
            icon: BookOpen,
          },
          {
            to: APP_ROUTES.ACCOUNTANT.ACCOUNTS,
            label: ui.navigation.accountant.accounts,
            icon: Layers,
          },
          {
            to: APP_ROUTES.ACCOUNTANT.LEDGER,
            label: ui.navigation.accountant.ledger,
            icon: FileText,
          },
          {
            to: APP_ROUTES.ACCOUNTANT.TRIAL_BALANCE,
            label: ui.navigation.accountant.trialBalance,
            icon: Scale,
          },
        ];
      case 'auditor':
        return [
          {
            to: APP_ROUTES.AUDITOR.FINANCIAL_STATEMENTS,
            label: ui.navigation.auditor.financialStatements,
            icon: PieChart,
          },
          {
            to: APP_ROUTES.AUDITOR.RECONCILIATION,
            label: ui.navigation.auditor.reconciliation,
            icon: GitCompare,
          },
          {
            to: APP_ROUTES.AUDITOR.TAX,
            label: ui.navigation.auditor.tax,
            icon: Percent,
          },
          {
            to: APP_ROUTES.AUDITOR.CLOSING,
            label: ui.navigation.auditor.closing,
            icon: CheckCircle2,
          },
        ];
      case 'billing':
        return [
          {
            to: APP_ROUTES.BILLING.INVOICES,
            label: ui.navigation.billing.invoices,
            icon: FileSpreadsheet,
          },
          {
            to: APP_ROUTES.BILLING.RECEIPTS,
            label: ui.navigation.billing.receipts,
            icon: ReceiptIcon,
          },
          {
            to: APP_ROUTES.BILLING.AGING,
            label: ui.navigation.billing.aging,
            icon: Clock,
          },
          {
            to: APP_ROUTES.BILLING.CUSTOMERS,
            label: ui.navigation.billing.customers,
            icon: Building2,
          },
        ];
      case 'admin':
        return [
          {
            to: APP_ROUTES.ADMIN.CONFIGURATION,
            label: ui.navigation.admin.configuration,
            icon: Settings,
          },
          {
            to: APP_ROUTES.ADMIN.USERS,
            label: ui.navigation.admin.users,
            icon: UsersIcon,
          },
          {
            to: APP_ROUTES.ADMIN.AUDIT,
            label: ui.navigation.admin.audit,
            icon: ShieldAlert,
          },
          {
            to: APP_ROUTES.ADMIN.MAINTENANCE,
            label: ui.navigation.admin.maintenance,
            icon: Database,
          },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();
  const currentNav = navLinks.find((link) => location.pathname.startsWith(link.to));
  const userAvatar =
    imagesData.avatars[user.role as keyof typeof imagesData.avatars] || imagesData.avatars.accountant;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-100 select-none">
      {/* Brand & System Header */}
      <div className="p-4 border-b border-slate-800 flex items-start gap-3">
        <img
          src={imagesData.systemLogo}
          alt={ui.system.name}
          className="w-9 h-9 rounded-lg shrink-0 mt-0.5"
        />
        <div className="min-w-0 flex-1">
          <div className="text-base font-bold text-white tracking-tight leading-snug break-words">
            {renderSemantic(ui.system.name)}
          </div>
          {/* Text displayed below system name sourced from setting.json ("systemOwner") */}
          <div className="text-xs text-slate-400 mt-1 leading-relaxed break-words" title={settings.systemOwner}>
            {settings.systemOwner}
          </div>
        </div>
        {/* Mobile close button */}
        <button
          onClick={() => setMobileNavOpen(false)}
          className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors shrink-0 flex items-center justify-center cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Role-specific Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 tracking-wider whitespace-nowrap shrink-0">
          {ui.roles[user.role]}
        </div>
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileNavOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-colors leading-relaxed ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap shrink-0">{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Bottom-left Sidebar Footer: Sole interaction for User Profile and Logout */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/70 relative">
        {roleMenuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-2 z-50">
            <div className="px-2.5 py-1.5 text-[11px] text-slate-400 font-semibold border-b border-slate-800 mb-1 whitespace-nowrap shrink-0">
              {ui.auth.selectRole}
            </div>
            {seedUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  onSwitchRole(u.role as UserRole);
                  setRoleMenuOpen(false);
                  setMobileNavOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-md transition-colors text-left cursor-pointer ${
                  u.role === user.role
                    ? 'bg-sky-900/60 text-sky-300 font-medium'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="break-words mr-2">{u.fullName}</span>
                <span className="text-[10px] text-slate-400 shrink-0 whitespace-nowrap">
                  {ui.roles[u.role as UserRole]}
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
          <img
            src={userAvatar}
            alt={user.fullName}
            className="w-8 h-8 rounded-full shrink-0 bg-slate-800 mt-0.5"
          />
          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="w-full text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="text-xs font-semibold text-white group-hover:text-sky-300 transition-colors leading-snug break-words">
                {user.fullName}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 group-hover:text-white" />
            </button>
            <div className="text-[11px] text-sky-400 leading-snug mt-0.5 whitespace-nowrap shrink-0">
              {ui.roles[user.role]}
            </div>
          </div>
          <button
            onClick={onLogout}
            title={ui.auth.logout}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors shrink-0 flex items-center justify-center cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full max-w-full overflow-hidden bg-slate-100 text-slate-800 antialiased font-sans">
      {/* Desktop Sidebar: visible on lg (>=1024px) screens */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 h-full">
        {sidebarContent}
      </aside>

      {/* Mobile / Tablet Drawer Overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-[85vw] h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header: Responsive breadcrumbs & System Status (NO duplicate profile/logout, NO test role switch button) */}
        <header className="min-h-14 bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5 flex items-center justify-between shrink-0 shadow-xs gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors shrink-0 flex items-center justify-center cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 leading-normal min-w-0">
              <span className="font-semibold text-slate-900 whitespace-nowrap shrink-0">
                {ui.roles[user.role]}
              </span>
              {currentNav && (
                <>
                  <span className="text-slate-300 whitespace-nowrap shrink-0">{ui.common.symbolSlash}</span>
                  <span className="font-medium text-slate-700 whitespace-nowrap shrink-0">
                    {currentNav.label}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 sm:gap-3 text-xs shrink-0">
            <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-slate-700 font-medium whitespace-nowrap shrink-0">
              <span className="whitespace-nowrap shrink-0">{ui.common.fiscalYearPrefix}</span>
              <span className="font-mono tabular-nums whitespace-nowrap shrink-0">{settings.fiscalYear}</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 font-medium whitespace-nowrap shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="hidden sm:inline whitespace-nowrap shrink-0">{ui.common.systemStatus}</span>
            </div>
          </div>
        </header>

        {/* Content Viewport: Fluid responsive padding and natural scrolling */}
        <main id="main-scroll-container" className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 bg-slate-50 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
