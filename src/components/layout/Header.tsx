import React from 'react';
import { Calendar, Shield, Menu, PanelLeftClose, PanelLeft } from 'lucide-react';
import { UI } from '../../constants/index.ts';
import { useAuthStore } from '../../stores/auth.store.ts';
import { useAppStore } from '../../stores/app.store.ts';
import { renderSemanticText } from '../common/index.ts';
import { NotificationDropdown } from './NotificationDropdown.tsx';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const fiscalYear = useAppStore((state) => state.settings.fiscalYear);
  const toggleMobileSidebar = useAppStore((state) => state.toggleMobileSidebar);
  const isDesktopSidebarCollapsed = useAppStore((state) => state.isDesktopSidebarCollapsed);
  const toggleDesktopSidebar = useAppStore((state) => state.toggleDesktopSidebar);

  if (!currentUser) return null;

  return (
    <header className="sticky top-0 z-30 min-h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 md:px-8 py-3 flex items-center justify-between gap-3 shrink-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {/* Left-side buttons within Header */}
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={UI.navigation.toggleNavigationMenu}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="lg:hidden w-7 h-7 rounded-lg overflow-hidden shadow-xs shrink-0 flex items-center justify-center bg-blue-600">
          <img src="/favicon.svg" alt={UI.system.name} className="w-full h-full object-contain" />
        </div>

        <button
          type="button"
          onClick={toggleDesktopSidebar}
          className="hidden lg:flex p-2 -ml-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
          title={isDesktopSidebarCollapsed ? UI.navigation.expandSidebar : UI.navigation.collapseSidebar}
          aria-label={isDesktopSidebarCollapsed ? UI.navigation.expandSidebar : UI.navigation.collapseSidebar}
        >
          {isDesktopSidebarCollapsed ? (
            <PanelLeft className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <h2 className="text-base sm:text-lg font-bold text-slate-800 leading-tight">
            {renderSemanticText(title || UI.system.name)}
          </h2>
          {subtitle && (
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              {renderSemanticText(subtitle)}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* In-app Notification Dropdown */}
        <NotificationDropdown />

        {/* Fiscal Year Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold border border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="break-words">{renderSemanticText(`${UI.settingsFields.fiscalYear}: ${fiscalYear}`)}</span>
        </div>

        {/* Certified Role Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold border border-blue-200">
          <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="break-words">{renderSemanticText(UI.roles[currentUser.role].title)}</span>
        </div>
      </div>
    </header>
  );
};
