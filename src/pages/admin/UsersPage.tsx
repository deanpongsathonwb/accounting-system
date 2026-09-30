import React from 'react';
import { ui } from '../../constants/index.ts';
import seedUsers from '../../seed/users.json';
import imagesData from '../../seed/images.json';
import type { UserRole } from '../../types/common.types.ts';
import { ShieldCheck, Info } from 'lucide-react';
import { renderSemantic } from '../../utils/text.tsx';

export const UsersPage: React.FC = () => {
  return (
    <div className="space-y-4 sm:space-y-6 max-w-full">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug break-words">
          {renderSemantic(ui.admin.users.title)}
        </h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed break-words">
          {renderSemantic(ui.admin.users.description)}
        </p>
      </div>

      {/* Scope Notice */}
      <div className="flex items-start gap-3 p-3.5 sm:p-4 bg-sky-50 border border-sky-200 rounded-lg text-xs text-sky-900">
        <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <span className="leading-relaxed break-words">{renderSemantic(ui.admin.users.roleScopeNotice)}</span>
      </div>

      {/* Users List: Responsive Card View on Mobile, Table on Tablet/Desktop */}
      <div className="md:hidden space-y-3">
        {seedUsers.map((u) => {
          const roleKey = u.role as UserRole;
          const avatar = imagesData.avatars[roleKey] || imagesData.avatars.admin;
          return (
            <div
              key={u.id}
              className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={avatar} alt={u.fullName} className="w-8 h-8 rounded-full shrink-0 bg-slate-100" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 break-words leading-snug">
                      {u.fullName}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 whitespace-nowrap shrink-0 mt-0.5">
                      {u.username}
                    </div>
                  </div>
                </div>
                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 shrink-0 whitespace-nowrap">
                  {ui.accountant.accounts.active}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[11px] whitespace-nowrap shrink-0">
                    {ui.admin.users.assignedRole}
                  </span>
                  <span className="font-semibold text-slate-700 whitespace-nowrap shrink-0">
                    {ui.roles[roleKey]}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] whitespace-nowrap shrink-0">
                    {ui.admin.users.lastLogin}
                  </span>
                  <span className="font-mono text-slate-500 whitespace-nowrap shrink-0">
                    {u.lastLogin}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop / Tablet Table */}
      <div className="hidden md:block bg-white rounded-lg border border-slate-200 overflow-x-auto shadow-xs">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr>
              <th className="text-left px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.admin.users.username}
              </th>
              <th className="text-left px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.admin.users.fullName}
              </th>
              <th className="text-left px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.admin.users.assignedRole}
              </th>
              <th className="text-left px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.admin.users.lastLogin}
              </th>
              <th className="text-center px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.admin.users.status}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {seedUsers.map((u) => {
              const roleKey = u.role as UserRole;
              const avatar = imagesData.avatars[roleKey] || imagesData.avatars.admin;
              return (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-slate-900 whitespace-nowrap shrink-0">
                    <div className="flex items-center gap-2.5">
                      <img src={avatar} alt={u.fullName} className="w-6 h-6 rounded-full shrink-0" />
                      <span className="whitespace-nowrap shrink-0">{u.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-800 font-medium break-words leading-relaxed">
                    {u.fullName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap shrink-0">
                    <span className="font-semibold text-slate-700 whitespace-nowrap shrink-0">
                      {ui.roles[roleKey]}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-500 whitespace-nowrap shrink-0">
                    {u.lastLogin}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap shrink-0">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 whitespace-nowrap shrink-0">
                      {ui.accountant.accounts.active}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
