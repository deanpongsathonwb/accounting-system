import React, { useState } from 'react';
import { ui } from '../../constants/index.ts';
import { formatCurrency } from '../../utils/format.ts';
import { CheckCircle2, GitCompare } from 'lucide-react';
import { renderSemantic } from '../../utils/text.tsx';

interface ReconciliationPageProps {
  reconciliations: {
    bankAccount: string;
    statementBalance: number;
    bookBalance: number;
    outstandingCheques: number;
    depositsInTransit: number;
    reconciled: boolean;
  };
}

export const ReconciliationPage: React.FC<ReconciliationPageProps> = ({ reconciliations }) => {
  const [reconciled, setReconciled] = useState(reconciliations.reconciled);

  const adjustedBank =
    reconciliations.statementBalance - reconciliations.outstandingCheques + reconciliations.depositsInTransit;
  const difference = Math.abs(adjustedBank - reconciliations.bookBalance);
  const isMatch = difference < 0.01;

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug break-words">
            {renderSemantic(ui.auditor.reconciliation.title)}
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed break-words">
            {renderSemantic(ui.auditor.reconciliation.description)}
          </p>
        </div>

        <button
          onClick={() => setReconciled(true)}
          disabled={!isMatch || reconciled}
          className="self-start sm:self-center inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs hover:shadow-sm transition-all duration-150 shrink-0 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 whitespace-nowrap"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap shrink-0">{ui.auditor.reconciliation.markReconciled}</span>
        </button>
      </div>

      {/* Account Info */}
      <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-3">
        <div className="flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span className="font-semibold text-slate-700 whitespace-nowrap shrink-0">
            {ui.auditor.reconciliation.bankAccount}
          </span>
          <span className="text-slate-400 shrink-0">{ui.common.symbolColon}</span>
          <span className="text-slate-900 font-medium break-words">{reconciliations.bankAccount}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-slate-500 whitespace-nowrap shrink-0">{ui.common.status}</span>
          <span className="text-slate-400 shrink-0">{ui.common.symbolColon}</span>
          <span
            className={`font-semibold px-2 py-0.5 rounded whitespace-nowrap shrink-0 ${
              reconciled ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}
          >
            {reconciled
              ? ui.auditor.reconciliation.reconciledStatus
              : ui.auditor.reconciliation.unreconciledItems}
          </span>
        </div>
      </div>

      {/* Reconciliation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Bank Statement Side */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 whitespace-nowrap shrink-0">
            {ui.auditor.reconciliation.statementBalance}
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1 gap-2">
              <span className="text-slate-600 break-words leading-relaxed">
                {ui.auditor.reconciliation.statementBalance}
              </span>
              <span className="font-mono tabular-nums text-slate-900 font-semibold whitespace-nowrap shrink-0">
                {formatCurrency(reconciliations.statementBalance)}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 text-rose-600 gap-2">
              <span className="break-words leading-relaxed">{ui.auditor.reconciliation.unreconciledItems}</span>
              <span className="font-mono tabular-nums whitespace-nowrap shrink-0">
                {ui.common.symbolDash} {formatCurrency(reconciliations.outstandingCheques)}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t-2 border-slate-200 flex justify-between items-center font-bold text-xs text-sky-800 gap-2">
            <span className="whitespace-nowrap shrink-0">{ui.auditor.reconciliation.adjustedBankBalance}</span>
            <span className="font-mono tabular-nums text-sm whitespace-nowrap shrink-0">
              {formatCurrency(adjustedBank)} {ui.common.currencyUnit}
            </span>
          </div>
        </div>

        {/* Book Side */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 whitespace-nowrap shrink-0">
            {ui.auditor.reconciliation.bookBalance}
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1 gap-2">
              <span className="text-slate-600 break-words leading-relaxed">{ui.auditor.reconciliation.bookBalance}</span>
              <span className="font-mono tabular-nums text-slate-900 font-semibold whitespace-nowrap shrink-0">
                {formatCurrency(reconciliations.bookBalance)}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 text-slate-400 gap-2">
              <span className="break-words">{ui.auditor.reconciliation.difference}</span>
              <span className="font-mono tabular-nums whitespace-nowrap shrink-0">{formatCurrency(0)}</span>
            </div>
          </div>

          <div className="pt-3 border-t-2 border-slate-200 flex justify-between items-center font-bold text-xs text-sky-800 gap-2">
            <span className="whitespace-nowrap shrink-0">{ui.auditor.reconciliation.adjustedBookBalance}</span>
            <span className="font-mono tabular-nums text-sm whitespace-nowrap shrink-0">
              {formatCurrency(reconciliations.bookBalance)} {ui.common.currencyUnit}
            </span>
          </div>
        </div>
      </div>

      {/* Difference Check */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="font-semibold text-slate-700 whitespace-nowrap shrink-0">
            {ui.auditor.reconciliation.difference}
          </span>
          <span className="text-slate-400 shrink-0">{ui.common.symbolColon}</span>
          <span className="font-mono font-bold text-slate-900 whitespace-nowrap shrink-0">
            {formatCurrency(difference)} {ui.common.currencyUnit}
          </span>
        </div>

        <div className="font-semibold text-emerald-700 flex items-center gap-1.5 whitespace-nowrap shrink-0">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{ui.auditor.reconciliation.reconciledStatus}</span>
        </div>
      </div>
    </div>
  );
};
