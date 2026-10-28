import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Users,
  Settings,
  HardDrive,
  ShieldCheck,
  ArrowRight,
  Database,
  Activity
} from 'lucide-react';
import { Header } from '../../components/layout/Header.tsx';
import { UI, ROUTES } from '../../constants/index.ts';
import { useAppStore } from '../../stores/app.store.ts';
import { formatNumber } from '../../utils/format.ts';
import { renderSemanticText } from '../../components/common/index.ts';

export const AdminDashboardPage: React.FC = () => {
  const users = useAppStore((state) => state.users);
  const auditLogs = useAppStore((state) => state.auditLogs);
  const accounts = useAppStore((state) => state.accounts);
  const settings = useAppStore((state) => state.settings);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title={UI.admin.dashboardTitle}
        subtitle={UI.roles.admin.responsibility}
      />

      <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-full">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              {UI.admin.usersTitle}
            </span>
            <p className="text-xl font-bold text-slate-900 font-mono">
              {formatNumber(users.length)}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-blue-600 font-medium">
              <Users className="w-3.5 h-3.5" />
              <span>{formatNumber(users.filter((u) => u.status === 'active').length)} {UI.common.active}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              {UI.admin.databaseStatus}
            </span>
            <p className="text-xl font-bold text-emerald-600">
              {UI.admin.healthy}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
              <Database className="w-3.5 h-3.5" />
              <span>{formatNumber(accounts.length)} {UI.units.accounts}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              {UI.auditor.auditTrailTitle}
            </span>
            <p className="text-xl font-bold text-slate-900 font-mono">
              {formatNumber(auditLogs.length)}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
              <Activity className="w-3.5 h-3.5" />
              <span>{UI.units.items}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              {UI.settingsFields.fiscalYear}
            </span>
            <p className="text-xl font-bold text-blue-700 font-mono">
              {settings.fiscalYear}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-slate-500 break-words" title={settings.systemOwner}>
              <span>{renderSemanticText(settings.systemOwner)}</span>
            </div>
          </div>
        </div>

        {/* Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <NavLink
            to={ROUTES.ADMIN.USER_MANAGEMENT}
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800">
                {UI.navigation.admin.userManagement}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </NavLink>

          <NavLink
            to={ROUTES.ADMIN.SETTINGS}
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800">
                {UI.navigation.admin.settings}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </NavLink>

          <NavLink
            to={ROUTES.ADMIN.SYSTEM_HEALTH}
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <HardDrive className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800">
                {UI.navigation.admin.systemHealth}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </NavLink>
        </div>

        {/* System Settings Snapshot */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-base font-bold text-slate-800">
              {UI.admin.settingsTitle}
            </h3>
            <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{UI.admin.healthy}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500 block mb-0.5">
                {UI.settingsFields.systemOwner}
              </span>
              <span className="font-semibold text-slate-800">{settings.systemOwner}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500 block mb-0.5">
                {UI.settingsFields.taxId}
              </span>
              <span className="font-mono font-semibold text-slate-800">{settings.taxId}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500 block mb-0.5">
                {UI.settingsFields.accountingMethod}
              </span>
              <span className="font-semibold text-slate-800">{settings.accountingMethod}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500 block mb-0.5">
                {UI.settingsFields.defaultVatRate}
              </span>
              <span className="font-mono font-semibold text-slate-800">
                {settings.defaultVatRate}{UI.units.percent}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
