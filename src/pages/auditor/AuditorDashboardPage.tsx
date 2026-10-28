import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Activity,
  FileText,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Scale,
  Award
} from 'lucide-react';
import { Header } from '../../components/layout/Header.tsx';
import { UI, ROUTES } from '../../constants/index.ts';
import { useAppStore } from '../../stores/app.store.ts';
import { formatCurrency, formatPercent } from '../../utils/format.ts';

export const AuditorDashboardPage: React.FC = () => {
  const accounts = useAppStore((state) => state.accounts);
  const auditLogs = useAppStore((state) => state.auditLogs);

  const totalAssets = accounts
    .filter((a) => a.type === 'asset')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalLiabilities = accounts
    .filter((a) => a.type === 'liability')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalEquity = accounts
    .filter((a) => a.type === 'equity')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalRevenues = accounts
    .filter((a) => a.type === 'revenue')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalExpenses = accounts
    .filter((a) => a.type === 'expense')
    .reduce((sum, a) => sum + a.balance, 0);

  const netIncome = totalRevenues - totalExpenses;
  const netProfitMargin = totalRevenues > 0 ? (netIncome / totalRevenues) * 100 : 0;
  const currentRatio = totalLiabilities > 0 ? totalAssets / totalLiabilities : 0;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title={UI.auditor.dashboardTitle}
        subtitle={UI.roles.auditor.responsibility}
      />

      <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-full">
        {/* Executive KPI Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              {UI.accountant.netIncome}
            </span>
            <p className="text-xl font-bold text-emerald-600">
              {formatCurrency(netIncome)}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-slate-500 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>{UI.accountant.incomeStatementTab}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              {UI.auditor.netProfitMargin}
            </span>
            <p className="text-xl font-bold text-blue-700">
              {formatPercent(Number(netProfitMargin.toFixed(1)))}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-blue-600 font-medium">
              <Award className="w-3.5 h-3.5" />
              <span>{UI.common.approved}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              {UI.auditor.currentRatio}
            </span>
            <p className="text-xl font-bold text-slate-900 font-mono">
              {currentRatio.toFixed(2)}{UI.units.multiplier}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 font-medium">
              <Scale className="w-3.5 h-3.5" />
              <span>{UI.auditor.auditStatusNormal}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              {UI.accountant.types.equity}
            </span>
            <p className="text-xl font-bold text-slate-900">
              {formatCurrency(totalEquity)}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
              <span>{UI.accountant.accountingEquationCheck}</span>
            </div>
          </div>
        </div>

        {/* Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <NavLink
            to={ROUTES.AUDITOR.FINANCIAL_RATIOS}
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800">
                {UI.navigation.auditor.financialRatios}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </NavLink>

          <NavLink
            to={ROUTES.AUDITOR.AUDIT_TRAIL}
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800">
                {UI.navigation.auditor.auditTrail}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </NavLink>

          <NavLink
            to={ROUTES.AUDITOR.COMPLIANCE}
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800">
                {UI.navigation.auditor.compliance}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </NavLink>
        </div>

        {/* Recent Audit Trail Preview */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800">
              {UI.auditor.auditTrailTitle}
            </h3>
            <NavLink
              to={ROUTES.AUDITOR.AUDIT_TRAIL}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>{UI.common.view}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">{UI.auditor.timestamp}</th>
                  <th className="py-3 px-4">{UI.auditor.actor}</th>
                  <th className="py-3 px-4">{UI.auditor.actionType}</th>
                  <th className="py-3 px-4">{UI.auditor.entity}</th>
                  <th className="py-3 px-4 font-mono text-xs">{UI.auditor.ipAddress}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.slice(0, 5).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono text-xs text-slate-600">{log.timestamp}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{log.actor}</td>
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-blue-700">
                      {log.actionType}
                    </td>
                    <td className="py-3 px-4 text-slate-700 text-xs">{log.entity}</td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-500">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Card View */}
          <div className="md:hidden divide-y divide-slate-100">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="p-4 space-y-1.5 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-800 text-sm">
                    {log.actor}
                  </span>
                  <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {log.actionType}
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  {log.entity}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                  <span>{log.timestamp}</span>
                  <span>{log.ipAddress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
