import React from 'react';
import { ui } from '../../constants/index.ts';
import { formatCurrency } from '../../utils/format.ts';
import type { Customer } from '../../types/common.types.ts';
import { renderSemantic } from '../../utils/text.tsx';

interface AgingPageProps {
  agingSummary: {
    current: number;
    range1to30: number;
    range31to60: number;
    range61to90: number;
    over90: number;
    total: number;
  };
  customers: Customer[];
}

export const AgingPage: React.FC<AgingPageProps> = ({ agingSummary, customers }) => {
  return (
    <div className="space-y-4 sm:space-y-6 max-w-full">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug break-words">
          {renderSemantic(ui.billing.aging.title)}
        </h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed break-words">
          {renderSemantic(ui.billing.aging.description)}
        </p>
      </div>

      {/* Aging Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium whitespace-nowrap shrink-0">
            {ui.billing.aging.currentRange}
          </div>
          <div className="text-base font-bold font-mono text-emerald-700 mt-1 tabular-nums whitespace-nowrap shrink-0">
            {formatCurrency(agingSummary.current)}
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium whitespace-nowrap shrink-0">
            {ui.billing.aging.range1to30}
          </div>
          <div className="text-base font-bold font-mono text-amber-600 mt-1 tabular-nums whitespace-nowrap shrink-0">
            {formatCurrency(agingSummary.range1to30)}
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium whitespace-nowrap shrink-0">
            {ui.billing.aging.range31to60}
          </div>
          <div className="text-base font-bold font-mono text-slate-900 mt-1 tabular-nums whitespace-nowrap shrink-0">
            {formatCurrency(agingSummary.range31to60)}
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium whitespace-nowrap shrink-0">
            {ui.billing.aging.range61to90}
          </div>
          <div className="text-base font-bold font-mono text-rose-600 mt-1 tabular-nums whitespace-nowrap shrink-0">
            {formatCurrency(agingSummary.range61to90)}
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium whitespace-nowrap shrink-0">
            {ui.billing.aging.rangeOver90}
          </div>
          <div className="text-base font-bold font-mono text-slate-900 mt-1 tabular-nums whitespace-nowrap shrink-0">
            {formatCurrency(agingSummary.over90)}
          </div>
        </div>
      </div>

      {/* Total Card */}
      <div className="bg-slate-900 text-white p-3.5 sm:p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-xs gap-2">
        <span className="text-xs font-semibold whitespace-nowrap shrink-0">{ui.billing.aging.totalReceivable}</span>
        <span className="text-base sm:text-lg font-bold font-mono tabular-nums text-sky-400 whitespace-nowrap shrink-0">
          {formatCurrency(agingSummary.total)} {ui.common.currencyUnit}
        </span>
      </div>

      {/* Customer Aging: Responsive Card View on Mobile, Table on Tablet/Desktop */}
      <div className="md:hidden space-y-3">
        {customers.map((c) => (
          <div
            key={c.code}
            className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-mono font-bold text-xs text-slate-900 whitespace-nowrap shrink-0">
                {c.code}
              </span>
              <span className="font-medium text-xs text-slate-800 break-words leading-relaxed text-right">
                {c.name}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
              <div>
                <span className="text-slate-400 block text-[11px] whitespace-nowrap shrink-0">
                  {ui.billing.customers.creditLimit}
                </span>
                <span className="font-mono text-slate-600 tabular-nums whitespace-nowrap shrink-0">
                  {formatCurrency(c.creditLimit)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[11px] whitespace-nowrap shrink-0">
                  {ui.billing.customers.currentDebt}
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap shrink-0">
                  {formatCurrency(c.currentDebt)} {ui.common.currencyUnit}
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
              <th className="text-left px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.billing.customers.customerCode}
              </th>
              <th className="text-left px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.billing.customers.companyName}
              </th>
              <th className="text-right px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.billing.customers.creditLimit}
              </th>
              <th className="text-right px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.billing.customers.currentDebt}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((c) => (
              <tr key={c.code} className="hover:bg-slate-50 transition-colors">
                <td className="px-3 sm:px-4 py-3 font-mono font-semibold text-slate-900 whitespace-nowrap shrink-0">{c.code}</td>
                <td className="px-3 sm:px-4 py-3 font-medium text-slate-800 break-words leading-relaxed">{c.name}</td>
                <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-600 whitespace-nowrap shrink-0">
                  {formatCurrency(c.creditLimit)}
                </td>
                <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums font-bold text-slate-900 whitespace-nowrap shrink-0">
                  {formatCurrency(c.currentDebt)} {ui.common.currencyUnit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
