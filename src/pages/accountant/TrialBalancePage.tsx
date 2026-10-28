import React from 'react';
import { Scale, CheckCircle2 } from 'lucide-react';
import { Header } from '../../components/layout/Header.tsx';
import { UI } from '../../constants/index.ts';
import { useAppStore } from '../../stores/app.store.ts';
import { formatCurrency } from '../../utils/format.ts';
import { renderSemanticText } from '../../components/common/index.ts';

export const TrialBalancePage: React.FC = () => {
  const accounts = useAppStore((state) => state.accounts);

  const trialRows = accounts.map((acc) => {
    const isDebitNormal = acc.normalBalance === 'debit';
    return {
      id: acc.id,
      code: acc.code,
      name: acc.name,
      debit: isDebitNormal ? acc.balance : 0,
      credit: !isDebitNormal ? acc.balance : 0
    };
  });

  const totalDebit = trialRows.reduce((sum, r) => sum + r.debit, 0);
  const totalCredit = trialRows.reduce((sum, r) => sum + r.credit, 0);
  const isBalanced = totalDebit === totalCredit;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title={UI.accountant.trialBalanceTitle}
        subtitle={UI.accountant.trialBalanceSubtitle}
      />

      <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-full">
        {/* Verification Summary Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {renderSemanticText(UI.accountant.trialBalanceTitle)}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {renderSemanticText(UI.accountant.trialBalanceSubtitle)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{UI.accountant.balancedStatus}</span>
            </div>
          </div>
        </div>

        {/* Trial Balance Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-28">{UI.accountant.accountCode}</th>
                  <th className="py-3 px-4">{UI.accountant.accountName}</th>
                  <th className="py-3 px-4 text-right w-48">{UI.common.debit}</th>
                  <th className="py-3 px-4 text-right w-48">{UI.common.credit}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trialRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      {row.code}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {row.name}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-900">
                      {row.debit > 0 ? formatCurrency(row.debit) : UI.common.emptyValue}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-900">
                      {row.credit > 0 ? formatCurrency(row.credit) : UI.common.emptyValue}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300">
                <tr>
                  <td colSpan={2} className="py-4 px-4 text-slate-800 font-semibold">
                    {UI.common.total}
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-base text-slate-900">
                    {formatCurrency(totalDebit)}
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-base text-slate-900">
                    {formatCurrency(totalCredit)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Mobile Stacked Card View */}
          <div className="md:hidden divide-y divide-slate-100">
            {trialRows.map((row) => (
              <div key={row.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-blue-700 block">{row.code}</span>
                    <h4 className="font-semibold text-slate-800 text-sm">{row.name}</h4>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-50">
                  <span className="text-slate-500">
                    {row.debit > 0 ? (
                      <span className="text-emerald-700 font-mono font-semibold">
                        {UI.common.debit}: {formatCurrency(row.debit)}
                      </span>
                    ) : (
                      <span className="text-slate-400">{UI.common.debit}: -</span>
                    )}
                  </span>
                  <span className="text-slate-500">
                    {row.credit > 0 ? (
                      <span className="text-blue-700 font-mono font-semibold">
                        {UI.common.credit}: {formatCurrency(row.credit)}
                      </span>
                    ) : (
                      <span className="text-slate-400">{UI.common.credit}: -</span>
                    )}
                  </span>
                </div>
              </div>
            ))}

            <div className="p-4 bg-slate-100 space-y-2 font-bold text-sm">
              <span className="text-slate-700 block">{UI.common.total}</span>
              <div className="flex items-center justify-between font-mono text-xs">
                <span>{UI.common.debit}: <strong className="text-slate-900 text-sm">{formatCurrency(totalDebit)}</strong></span>
                <span>{UI.common.credit}: <strong className="text-slate-900 text-sm">{formatCurrency(totalCredit)}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
