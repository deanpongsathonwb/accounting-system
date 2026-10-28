import React, { useState } from 'react';
import { CheckCircle2, CheckCircle, Filter } from 'lucide-react';
import { Header } from '../../components/layout/Header.tsx';
import { UI } from '../../constants/index.ts';
import { useAppStore } from '../../stores/app.store.ts';
import { formatCurrency } from '../../utils/format.ts';

export const ReconciliationPage: React.FC = () => {
  const bankAccounts = useAppStore((state) => state.bankAccounts);
  const [selectedBankId, setSelectedBankId] = useState(bankAccounts[0]?.id || '');
  const [statementBalanceStr, setStatementBalanceStr] = useState(UI.defaults.initialStatementBalance);
  const [isReconciled, setIsReconciled] = useState(false);

  const selectedBank = bankAccounts.find((b) => b.id === selectedBankId) || bankAccounts[0];
  const bookBalance = selectedBank?.balance || 0;
  const statementBalance = parseFloat(statementBalanceStr) || 0;
  const difference = Math.abs(bookBalance - statementBalance);
  const isMatch = difference === 0;

  const handleConfirmReconcile = () => {
    setIsReconciled(true);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title={UI.finance.reconciliationTitle}
        subtitle={UI.finance.reconciliationSubtitle}
      />

      <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-full">
        {/* Bank Selection */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <label
              htmlFor="reconcile-bank-select"
              className="text-sm font-bold text-slate-700 whitespace-nowrap flex items-center gap-1.5"
            >
              <Filter className="w-4 h-4 text-slate-500 shrink-0" />
              <span>{UI.finance.bankName}:</span>
            </label>
            <div className="w-full sm:w-72">
              <select
                id="reconcile-bank-select"
                value={selectedBankId}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedBankId(val);
                  const b = bankAccounts.find((acc) => acc.id === val);
                  if (b) setStatementBalanceStr(String(b.balance));
                  setIsReconciled(false);
                }}
                aria-label={UI.finance.bankName}
                className="w-full text-sm font-semibold border border-slate-200 rounded-lg px-3.5 py-2 bg-white text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {bankAccounts.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.bankName} ({b.accountNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            {UI.common.date}: {UI.defaults.currentDate}
          </div>
        </div>

        {/* Reconciliation Comparison Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-800 text-base">
              {UI.finance.bookBalance}
            </h4>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xl sm:text-2xl font-bold text-blue-700 break-words">
              {formatCurrency(bookBalance)}
            </div>
            <p className="text-xs text-slate-500">
              {selectedBank?.bankName} - {selectedBank?.accountNumber}
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-800 text-base">
              {UI.finance.bankStatementBalance}
            </h4>
            <input
              type="number"
              step="any"
              value={statementBalanceStr}
              onChange={(e) => {
                setStatementBalanceStr(e.target.value);
                setIsReconciled(false);
              }}
              className="w-full p-3.5 bg-white border border-slate-300 rounded-xl font-mono text-xl sm:text-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-500">
              {UI.finance.reconciliationSubtitle}
            </p>
          </div>
        </div>

        {/* Difference & Status */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">
              {UI.finance.reconciledDifference}
            </span>
            <span className={`text-xl font-mono font-bold ${isMatch ? 'text-emerald-600' : 'text-rose-600'}`}>
              {formatCurrency(difference)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {isMatch && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{UI.finance.reconcileComplete}</span>
              </div>
            )}

            <button
              onClick={handleConfirmReconcile}
              disabled={!isMatch || isReconciled}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isReconciled ? UI.common.approved : UI.finance.reconcileAction}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
