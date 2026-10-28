import React, { useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen,
  FileSpreadsheet,
  Scale,
  PieChart,
  Receipt,
  FileCheck2,
  Building2,
  CheckCircle,
  Activity,
  ShieldCheck,
  FileText,
  Users,
  Settings,
  HardDrive,
  LogOut,
  LayoutDashboard,
  X
} from 'lucide-react';
import { UI, ROUTES } from '../../constants/index.ts';
import { useAuthStore } from '../../stores/auth.store.ts';
import { useAppStore } from '../../stores/app.store.ts';
import { renderSemanticText } from '../common/index.ts';
import imagesSeed from '../../seed/images.json';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const systemOwner = useAppStore((state) => state.settings.systemOwner);

  const isMobileSidebarOpen = useAppStore((state) => state.isMobileSidebarOpen);
  const setMobileSidebarOpen = useAppStore((state) => state.setMobileSidebarOpen);
  const isDesktopSidebarCollapsed = useAppStore((state) => state.isDesktopSidebarCollapsed);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname, setMobileSidebarOpen]);

  if (!currentUser) return null;

  const role = currentUser.role;

  const getNavItems = () => {
    switch (role) {
      case 'accountant':
        return [
          {
            path: ROUTES.ACCOUNTANT.DASHBOARD,
            label: UI.navigation.accountant.dashboard,
            icon: <LayoutDashboard className="w-5 h-5 shrink-0" />
          },
          {
            path: ROUTES.ACCOUNTANT.CHART_OF_ACCOUNTS,
            label: UI.navigation.accountant.chartOfAccounts,
            icon: <BookOpen className="w-5 h-5 shrink-0" />
          },
          {
            path: ROUTES.ACCOUNTANT.GENERAL_JOURNAL,
            label: UI.navigation.accountant.generalJournal,
            icon: <FileSpreadsheet className="w-5 h-5 shrink-0" />
          },
          {
            path: ROUTES.ACCOUNTANT.TRIAL_BALANCE,
            label: UI.navigation.accountant.trialBalance,
            icon: <Scale className="w-5 h-5 shrink-0" />
          },
          {
            path: ROUTES.ACCOUNTANT.FINANCIAL_STATEMENTS,
            label: UI.navigation.accountant.financialStatements,
            icon: <PieChart className="w-5 h-5 shrink-0" />
          }
        ];
      case 'finance':
        return [
          {
            path: ROUTES.FINANCE.DASHBOARD,
            label: UI.navigation.finance.dashboard,
            icon: <LayoutDashboard className="w-5 h-5 shrink-0" />
          },
          {
            path: ROUTES.FINANCE.INVOICES,
            label: UI.navigation.finance.invoices,
            icon: <Receipt className="w-5 h-5 shrink-0" />
          },
          {
            path: ROUTES.FINANCE.BILLS,
            label: UI.navigation.finance.bills,
            icon: <FileCheck2 className="w-5 h-5 shrink-0" />
          },
          {
            path: ROUTES.FINANCE.BANK_ACCOUNTS,
            label: UI.navigation.finance.bankAccounts,
            icon: <Building2 className="w-5 h-5 shrink-0" />
          },
          {
            path: ROUTES.FINANCE.RECONCILIATION,
            label: UI.navigation.finance.reconciliation,
            icon: <CheckCircle className="w-5 h-5 shrink-0" />
          }
        ];
      case 'auditor':
        return [
          {
            path: ROUTES.AUDITOR.DASHBOARD,
            label: UI.navigation.auditor.dashboard,
            icon: <LayoutDashboard className="w-5 h-5 shrink-0" />
          },
          {
            path: ROUTES.AUDITOR.FINANCIAL_RATIOS,
            label: UI.navigation.auditor.financialRatios,
            icon: <Activity className="w-5 h-5 shrink-0" />
          },
          {
            path: ROUTES.AUDITOR.AUDIT_TRAIL,
            label: UI.navigation.auditor.auditTrail,
            icon: <FileText className="w-5 h-5 shrink-0" />
          },
          {
            path: ROUTES.AUDITOR.COMPLIANCE,
            label: UI.navigation.auditor.compliance,
            icon: <ShieldCheck className="w-5 h-5 shrink-0" />
          }
        ];
      case 'admin':
        return [
          {
            path: ROUTES.ADMIN.DASHBOARD,
            label: UI.navigation.admin.dashboard,
            icon: <LayoutDashboard className="w-5 h-5 shrink-0" />
          },
          {
            path: ROUTES.ADMIN.USER_MANAGEMENT,
            label: UI.navigation.admin.userManagement,
            icon: <Users className="w-5 h-5 shrink-0" />
          },
          {
            path: ROUTES.ADMIN.SETTINGS,
            label: UI.navigation.admin.settings,
            icon: <Settings className="w-5 h-5 shrink-0" />
          },
          {
            path: ROUTES.ADMIN.SYSTEM_HEALTH,
            label: UI.navigation.admin.systemHealth,
            icon: <HardDrive className="w-5 h-5 shrink-0" />
          }
        ];
    }
  };

  const navItems = getNavItems();
  const avatarUrl =
    imagesSeed.avatars[currentUser.avatarKey as keyof typeof imagesSeed.avatars] ||
    imagesSeed.avatars.default;

  const handleLogout = () => {
    logout();
    navigate(ROUTES.PUBLIC.LOGIN);
  };

  const renderContent = (isCollapsed: boolean, isMobileView: boolean) => (
    <div className="flex flex-col h-full select-none no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Brand & Organization Title */}
      <div className="p-3 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg overflow-hidden shadow-sm shrink-0 flex items-center justify-center bg-blue-600">
            <img src="/favicon.svg" alt={UI.system.name} className="w-full h-full object-contain" />
          </div>
          {(!isCollapsed || isMobileView) && (
            <div className="min-w-0 flex-1">
              <h1 className="text-base font-bold tracking-tight text-white leading-tight">
                {renderSemanticText(UI.system.name)}
              </h1>
              <p className="text-xs text-slate-400 font-medium mt-0.5 break-words leading-snug">
                {renderSemanticText(systemOwner)}
              </p>
            </div>
          )}
        </div>

        {isMobileView && (
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus:outline-none"
            aria-label={UI.navigation.closeSidebar}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav
        aria-label="Sidebar"
        className="flex-1 p-2.5 sm:p-3 space-y-1 overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {(!isCollapsed || isMobileView) && (
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
            {renderSemanticText(UI.roles[role].title)}
          </div>
        )}
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={isCollapsed && !isMobileView ? item.label : undefined}
            onClick={() => {
              if (isMobileView) setMobileSidebarOpen(false);
            }}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              } ${isCollapsed && !isMobileView ? 'justify-center px-2' : ''}`
            }
          >
            {item.icon}
            {(!isCollapsed || isMobileView) && (
              <span className="leading-snug break-words">{renderSemanticText(item.label)}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Profile and Logout */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/50 shrink-0">
        {(!isCollapsed || isMobileView) ? (
          <>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/60 mb-2">
              <img
                src={avatarUrl}
                alt={currentUser.fullName}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/30 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white leading-tight break-words">{currentUser.fullName}</p>
                <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{renderSemanticText(UI.roles[role].title)}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-rose-300 hover:text-white hover:bg-rose-600/20 rounded-lg transition-colors border border-rose-900/30"
            >
              <LogOut className="w-4 h-4" />
              <span>{UI.auth.logoutButton}</span>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 py-1">
            <img
              src={avatarUrl}
              alt={currentUser.fullName}
              title={`${currentUser.fullName} (${UI.roles[role].title})`}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/30"
            />
            <button
              onClick={handleLogout}
              title={UI.auth.logoutButton}
              className="p-2 text-rose-300 hover:text-white hover:bg-rose-600/20 rounded-lg transition-colors border border-rose-900/30"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden lg:flex flex-col sticky top-0 h-screen bg-slate-900 text-slate-100 border-r border-slate-800 shrink-0 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden transition-all duration-300 ${
          isDesktopSidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {renderContent(isDesktopSidebarCollapsed, false)}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setMobileSidebarOpen(false)}
          />
          {/* Slide-out Drawer */}
          <aside className="fixed top-0 bottom-0 left-0 w-72 max-w-[85vw] bg-slate-900 text-slate-100 flex flex-col shadow-2xl z-10 border-r border-slate-800 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden animate-slide-right">
            {renderContent(false, true)}
          </aside>
        </div>
      )}
    </>
  );
};
