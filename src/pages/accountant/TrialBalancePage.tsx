import React from 'react';
import { ui } from '../../constants/index.ts';
import type { AccountItem, SystemSettings } from '../../types/common.types.ts';
import { formatCurrency } from '../../utils/format.ts';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import reconciliationData from '../../seed/reconciliations.json';
import { renderSemantic } from '../../utils/text.tsx';

interface TrialBalancePageProps {
  accounts: AccountItem[];
  settings: SystemSettings;
}

export const TrialBalancePage: React.FC<TrialBalancePageProps> = ({ accounts, settings }) => {
  let totalDebit = 0;
  let totalCredit = 0;

  const rows = accounts.map((acc) => {
    let debit = 0;
    let credit = 0;

    if (acc.normalBalance === 'debit') {
      if (acc.balance >= 0) {
        debit = acc.balance;
      } else {
        credit = Math.abs(acc.balance);
      }
    } else {
      if (acc.balance >= 0) {
        credit = acc.balance;
      } else {
        debit = Math.abs(acc.balance);
      }
    }

    totalDebit += debit;
    totalCredit += credit;

    return {
      code: acc.code,
      name: acc.name,
      debit,
      credit,
    };
  });

  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug break-words">
            {renderSemantic(ui.accountant.trialBalance.title)}
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed break-words">
            {renderSemantic(ui.accountant.trialBalance.description)}
          </p>
        </div>

        <div className="self-start sm:self-center shrink-0">
          <div className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-md border border-slate-200 flex items-center gap-1.5 shadow-xs whitespace-nowrap shrink-0">
            <span className="whitespace-nowrap shrink-0">{ui.accountant.trialBalance.asOfDate}</span>
            <span className="font-mono font-medium whitespace-nowrap shrink-0">{reconciliationData.periodStatus.asOfDate}</span>
          </div>
        </div>
      </div>

      {/* Balanced Status Banner */}
      <div
        className={`p-3.5 sm:p-4 rounded-lg border flex flex-col md:flex-row items-start md:items-center justify-between text-xs gap-3 ${
          isBalanced
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}
      >
        <div className="flex items-center gap-2 font-medium break-words leading-relaxed">
          {isBalanced ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span className="whitespace-nowrap shrink-0">
            {isBalanced
              ? ui.accountant.trialBalance.statusBalanced
              : ui.accountant.trialBalance.statusUnbalanced}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 font-mono font-semibold">
          <div className="flex items-center gap-1 whitespace-nowrap shrink-0">
            <span className="whitespace-nowrap shrink-0">{ui.accountant.trialBalance.totalDebitColumns}</span>
            <span>{ui.common.symbolColon}</span>
            <span className="tabular-nums">{formatCurrency(totalDebit)}</span>
            <span>{ui.common.currencyUnit}</span>
          </div>
          <div className="flex items-center gap-1 whitespace-nowrap shrink-0">
            <span className="whitespace-nowrap shrink-0">{ui.accountant.trialBalance.totalCreditColumns}</span>
            <span>{ui.common.symbolColon}</span>
            <span className="tabular-nums">{formatCurrency(totalCredit)}</span>
            <span>{ui.common.currencyUnit}</span>
          </div>
        </div>
      </div>

      {/* Trial Balance: Responsive Card View on Mobile, Table on Tablet/Desktop */}
      <div className="md:hidden space-y-3">
        {rows.map((r) => (
          <div
            key={r.code}
            className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-mono font-bold text-xs text-slate-900 whitespace-nowrap shrink-0">
                {r.code}
              </span>
              <span className="font-medium text-xs text-slate-800 break-words leading-relaxed text-right">
                {r.name}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
              <div>
                <span className="text-slate-400 block text-[11px] whitespace-nowrap shrink-0">
                  {ui.accountant.journals.debitAmount}
                </span>
                <span className="font-mono tabular-nums text-slate-900 font-semibold whitespace-nowrap shrink-0">
                  {r.debit > 0 ? formatCurrency(r.debit) : ui.common.symbolDash}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] whitespace-nowrap shrink-0">
                  {ui.accountant.journals.creditAmount}
                </span>
                <span className="font-mono tabular-nums text-slate-900 font-semibold whitespace-nowrap shrink-0">
                  {r.credit > 0 ? formatCurrency(r.credit) : ui.common.symbolDash}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop / Tablet Table */}
      <div className="hidden md:block bg-white rounded-lg border border-slate-200 overflow-x-auto shadow-xs">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="text-left px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.accountant.accounts.code}
              </th>
              <th className="text-left px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.accountant.accounts.name}
              </th>
              <th className="text-right px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.accountant.journals.debitAmount}
              </th>
              <th className="text-right px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.accountant.journals.creditAmount}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.code} className="hover:bg-slate-50 transition-colors">
                <td className="px-3 sm:px-4 py-2 font-mono text-slate-500 whitespace-nowrap shrink-0">{r.code}</td>
                <td className="px-3 sm:px-4 py-2 font-medium text-slate-800 break-words leading-relaxed">{r.name}</td>
                <td className="px-3 sm:px-4 py-2 text-right font-mono tabular-nums text-slate-900 whitespace-nowrap shrink-0">
                  {r.debit > 0 ? formatCurrency(r.debit) : ui.common.symbolDash}
                </td>
                <td className="px-3 sm:px-4 py-2 text-right font-mono tabular-nums text-slate-900 whitespace-nowrap shrink-0">
                  {r.credit > 0 ? formatCurrency(r.credit) : ui.common.symbolDash}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold text-slate-900 text-xs">
              <td colSpan={2} className="px-3 sm:px-4 py-3 text-right whitespace-nowrap shrink-0">
                {ui.common.total}
              </td>
              <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-sm text-sky-700 whitespace-nowrap shrink-0">
                {formatCurrency(totalDebit)}
              </td>
              <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-sm text-sky-700 whitespace-nowrap shrink-0">
                {formatCurrency(totalCredit)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
