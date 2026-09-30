import React from 'react';
import { ui } from '../../constants/index.ts';
import type { AuditLog, UserRole } from '../../types/common.types.ts';
import { renderSemantic } from '../../utils/text.tsx';

interface AuditPageProps {
  auditLogs: AuditLog[];
}

export const AuditPage: React.FC<AuditPageProps> = ({ auditLogs }) => {
  return (
    <div className="space-y-4 sm:space-y-6 max-w-full">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug break-words">
          {renderSemantic(ui.admin.audit.title)}
        </h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed break-words">
          {renderSemantic(ui.admin.audit.description)}
        </p>
      </div>

      {/* Audit Logs: Responsive Card View on Mobile, Table on Tablet/Desktop */}
      <div className="md:hidden space-y-3">
        {auditLogs.map((log) => (
          <div
            key={log.id}
            className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs font-bold text-slate-900 break-words leading-snug">
                  {log.action}
                </div>
                <div className="text-[11px] text-slate-500 font-mono tabular-nums whitespace-nowrap shrink-0 mt-0.5">
                  {log.timestamp}
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0 whitespace-nowrap">
                {ui.roles[log.role as UserRole]}
              </span>
            </div>

            <div className="text-xs text-slate-800 break-words leading-relaxed">
              {log.details}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
              <div>
                <span className="text-slate-400 block text-[11px] whitespace-nowrap shrink-0">
                  {ui.admin.audit.actor}
                </span>
                <span className="text-slate-700 font-medium break-words leading-relaxed">
                  {log.actor}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] whitespace-nowrap shrink-0">
                  {ui.admin.audit.module}
                </span>
                <span className="text-slate-700 font-medium whitespace-nowrap shrink-0">
                  {log.module}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop / Tablet Table */}
      <div className="hidden md:block bg-white rounded-lg border border-slate-200 overflow-x-auto shadow-xs">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr>
              <th className="text-left px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.admin.audit.timestamp}
              </th>
              <th className="text-left px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.admin.audit.actor}
              </th>
              <th className="text-left px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.admin.audit.role}
              </th>
              <th className="text-left px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.admin.audit.action}
              </th>
              <th className="text-left px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.admin.audit.module}
              </th>
              <th className="text-left px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.admin.audit.details}
              </th>
              <th className="text-left px-4 py-3 font-semibold font-mono whitespace-nowrap shrink-0">
                {ui.admin.audit.ipAddress}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-mono text-slate-500 whitespace-nowrap shrink-0">
                  {log.timestamp}
                </td>
                <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap shrink-0">
                  {log.actor}
                </td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap shrink-0">
                  {ui.roles[log.role as UserRole]}
                </td>
                <td className="px-4 py-3 font-medium text-slate-900 break-words leading-relaxed">
                  {log.action}
                </td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap shrink-0">
                  {log.module}
                </td>
                <td className="px-4 py-3 text-slate-700 break-words leading-relaxed">
                  {log.details}
                </td>
                <td className="px-4 py-3 font-mono text-slate-400 whitespace-nowrap shrink-0">
                  {log.ipAddress}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
