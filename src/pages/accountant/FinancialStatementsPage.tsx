import React, { useState } from 'react';
import { PieChart, FileText, CheckCircle2, TrendingUp, Filter } from 'lucide-react';
import { Header } from '../../components/layout/Header.tsx';
import { UI } from '../../constants/index.ts';
import { useAppStore } from '../../stores/app.store.ts';
import { formatCurrency } from '../../utils/format.ts';

export const FinancialStatementsPage: React.FC = () => {
  const accounts = useAppStore((state) => state.accounts);
  const [activeTab, setActiveTab] = useState<'income' | 'balance'>('income');

  const revenues = accounts.filter((a) => a.type === 'revenue');
  const expenses = accounts.filter((a) => a.type === 'expense');
  const assets = accounts.filter((a) => a.type === 'asset');
  const liabilities = accounts.filter((a) => a.type === 'liability');
  const equity = accounts.filter((a) => a.type === 'equity');

  const totalRevenue = revenues.reduce((s, a) => s + a.balance, 0);
  const totalExpense = expenses.reduce((s, a) => s + a.balance, 0);
  const netIncome = totalRevenue - totalExpense;

  const totalAssets = assets.reduce((s, a) => s + a.balance, 0);
  const totalLiabilities = liabilities.reduce((s, a) => s + a.balance, 0);
  const totalEquityBase = equity.reduce((s, a) => s + a.balance, 0);
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquityBase;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title={UI.accountant.financialStatementsTitle}
        subtitle={UI.accountant.coaSubtitle}
      />

      <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-full">
        {/* Native Filter Dropdown */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <label
              htmlFor="statement-type-filter"
              className="text-sm font-bold text-slate-700 whitespace-nowrap flex items-center gap-1.5"
            >
              <Filter className="w-4 h-4 text-slate-500 shrink-0" />
              <span>{UI.accountant.financialStatementsTitle}:</span>
            </label>
            <div className="w-full sm:w-64">
              <select
                id="statement-type-filter"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as 'income' | 'balance')}
                aria-label={UI.accountant.financialStatementsTitle}
                className="w-full text-sm font-semibold border border-slate-200 rounded-lg px-3.5 py-2 bg-white text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="income">{UI.accountant.incomeStatementTab}</option>
                <option value="balance">{UI.accountant.balanceSheetTab}</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{UI.auditor.auditStatusNormal}</span>
          </div>
        </div>

        {activeTab === 'income' ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-slate-800">
                {UI.accountant.incomeStatementTab}
              </h3>
            </div>

            {/* Revenues Section */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                {UI.accountant.types.revenue}
              </h4>
              <div className="divide-y divide-slate-100">
                {revenues.map((acc) => (
                  <div key={acc.id} className="py-2.5 flex justify-between text-sm">
                    <span className="text-slate-700">
                      <span className="font-mono text-slate-400 mr-2">{acc.code}</span>
                      {acc.name}
                    </span>
                    <span className="font-mono font-medium text-slate-900">
                      {formatCurrency(acc.balance)}
                    </span>
                  </div>
                ))}
                <div className="py-3 flex justify-between text-sm font-bold bg-slate-50 px-2 rounded">
                  <span>{UI.common.total} {UI.accountant.types.revenue}</span>
                  <span className="font-mono text-blue-700">{formatCurrency(totalRevenue)}</span>
                </div>
              </div>
            </div>

            {/* Expenses Section */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                {UI.accountant.types.expense}
              </h4>
              <div className="divide-y divide-slate-100">
                {expenses.map((acc) => (
                  <div key={acc.id} className="py-2.5 flex justify-between text-sm">
                    <span className="text-slate-700">
                      <span className="font-mono text-slate-400 mr-2">{acc.code}</span>
                      {acc.name}
                    </span>
                    <span className="font-mono font-medium text-slate-900">
                      {formatCurrency(acc.balance)}
                    </span>
                  </div>
                ))}
                <div className="py-3 flex justify-between text-sm font-bold bg-slate-50 px-2 rounded">
                  <span>{UI.common.total} {UI.accountant.types.expense}</span>
                  <span className="font-mono text-rose-700">{formatCurrency(totalExpense)}</span>
                </div>
              </div>
            </div>

            {/* Net Income Summary */}
            <div className="p-4 rounded-xl bg-slate-900 text-white flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-400">{UI.accountant.netIncome}</p>
                <p className="text-xl font-bold mt-0.5">{formatCurrency(netIncome)}</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4" />
                <span>{UI.common.approved}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Assets */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
                <h3 className="text-base font-bold text-slate-800">
                  {UI.accountant.types.asset}
                </h3>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                  {UI.accountant.codeRanges.asset}
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {assets.map((acc) => (
                  <div key={acc.id} className="py-2.5 flex justify-between text-sm">
                    <span className="text-slate-700">
                      <span className="font-mono text-slate-400 mr-2">{acc.code}</span>
                      {acc.name}
                    </span>
                    <span className="font-mono font-medium text-slate-900">
                      {formatCurrency(acc.balance)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t-2 border-slate-300 flex justify-between font-bold text-sm bg-slate-50 p-3 rounded-lg">
                <span>{UI.accountant.totalAssets}</span>
                <span className="font-mono text-blue-700">{formatCurrency(totalAssets)}</span>
              </div>
            </div>

            {/* Liabilities & Equity */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
                <h3 className="text-base font-bold text-slate-800">
                  {UI.accountant.totalLiabilitiesAndEquity}
                </h3>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                  {UI.accountant.codeRanges.liabilityEquity}
                </span>
              </div>

              {/* Liabilities */}
              <div>
                <p className="text-xs font-bold uppercase text-slate-500 mb-2">
                  {UI.accountant.types.liability}
                </p>
                <div className="divide-y divide-slate-100">
                  {liabilities.map((acc) => (
                    <div key={acc.id} className="py-2 flex justify-between text-xs">
                      <span className="text-slate-700">
                        <span className="font-mono text-slate-400 mr-1.5">{acc.code}</span>
                        {acc.name}
                      </span>
                      <span className="font-mono text-slate-900">
                        {formatCurrency(acc.balance)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equity */}
              <div className="pt-2">
                <p className="text-xs font-bold uppercase text-slate-500 mb-2">
                  {UI.accountant.types.equity}
                </p>
                <div className="divide-y divide-slate-100">
                  {equity.map((acc) => (
                    <div key={acc.id} className="py-2 flex justify-between text-xs">
                      <span className="text-slate-700">
                        <span className="font-mono text-slate-400 mr-1.5">{acc.code}</span>
                        {acc.name}
                      </span>
                      <span className="font-mono text-slate-900">
                        {formatCurrency(acc.balance)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t-2 border-slate-300 flex justify-between font-bold text-sm bg-slate-50 p-3 rounded-lg">
                <span>{UI.accountant.totalLiabilitiesAndEquity}</span>
                <span className="font-mono text-purple-700">
                  {formatCurrency(totalLiabilitiesAndEquity)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
