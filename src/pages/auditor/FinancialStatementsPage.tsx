import React, { useState } from 'react';
import { ui } from '../../constants/index.ts';
import type { AccountItem, SystemSettings } from '../../types/common.types.ts';
import { formatCurrency } from '../../utils/format.ts';
import cashflowData from '../../seed/cashflow.json';
import { renderSemantic } from '../../utils/text.tsx';

interface FinancialStatementsPageProps {
  accounts: AccountItem[];
  settings: SystemSettings;
}

export const FinancialStatementsPage: React.FC<FinancialStatementsPageProps> = ({
  accounts,
  settings,
}) => {
  const [activeTab, setActiveTab] = useState<'balanceSheet' | 'income' | 'cashFlow'>('balanceSheet');

  const assets = accounts.filter((a) => a.category === 'asset');
  const liabilities = accounts.filter((a) => a.category === 'liability');
  const equities = accounts.filter((a) => a.category === 'equity');
  const revenues = accounts.filter((a) => a.category === 'revenue');
  const expenses = accounts.filter((a) => a.category === 'expense');

  const totalAssets = assets.reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = liabilities.reduce((sum, a) => sum + a.balance, 0);
  const totalEquity = equities.reduce((sum, a) => sum + a.balance, 0);

  const totalRevenues = revenues.reduce((sum, a) => sum + a.balance, 0);
  const totalExpenses = expenses.reduce((sum, a) => sum + a.balance, 0);
  const netProfit = totalRevenues - totalExpenses;

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug break-words">
            {renderSemantic(ui.auditor.financialStatements.title)}
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed break-words">
            {renderSemantic(ui.auditor.financialStatements.description)}
          </p>
        </div>

        <div className="self-start sm:self-center">
          <div className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-xs break-words">
            <span>{settings.accountingStandard}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center flex-wrap gap-1 border-b border-slate-200 bg-white px-3 sm:px-4 pt-2 rounded-t-lg shadow-xs">
        <button
          onClick={() => setActiveTab('balanceSheet')}
          className={`inline-flex items-center justify-center px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus:outline-hidden leading-normal ${
            activeTab === 'balanceSheet'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          {ui.auditor.financialStatements.balanceSheetTab}
        </button>
        <button
          onClick={() => setActiveTab('income')}
          className={`inline-flex items-center justify-center px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus:outline-hidden leading-normal ${
            activeTab === 'income'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          {ui.auditor.financialStatements.incomeStatementTab}
        </button>
        <button
          onClick={() => setActiveTab('cashFlow')}
          className={`inline-flex items-center justify-center px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus:outline-hidden leading-normal ${
            activeTab === 'cashFlow'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          {ui.auditor.financialStatements.cashFlowTab}
        </button>
      </div>

      {/* Tab 1: Balance Sheet */}
      {activeTab === 'balanceSheet' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Left: Assets */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 whitespace-nowrap shrink-0">
              {ui.accountant.accounts.categoryAsset}
            </h3>
            <div className="space-y-2 text-xs">
              {assets.map((a) => (
                <div key={a.code} className="flex justify-between items-center py-1 border-b border-slate-50 gap-2">
                  <span className="text-slate-700 break-words leading-relaxed">{a.name}</span>
                  <span className="font-mono tabular-nums text-slate-900 whitespace-nowrap shrink-0">
                    {formatCurrency(a.balance)}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t-2 border-slate-300 flex justify-between items-center font-bold text-xs text-sky-800 gap-2">
              <span className="whitespace-nowrap shrink-0">{ui.auditor.financialStatements.totalAssets}</span>
              <span className="font-mono tabular-nums text-sm whitespace-nowrap shrink-0">
                {formatCurrency(totalAssets)} {ui.common.currencyUnit}
              </span>
            </div>
          </div>

          {/* Right: Liabilities & Equity */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 whitespace-nowrap shrink-0">
                {ui.accountant.accounts.categoryLiability}
              </h3>
              <div className="space-y-2 text-xs">
                {liabilities.map((a) => (
                  <div key={a.code} className="flex justify-between items-center py-1 border-b border-slate-50 gap-2">
                    <span className="text-slate-700 break-words leading-relaxed">{a.name}</span>
                    <span className="font-mono tabular-nums text-slate-900 whitespace-nowrap shrink-0">
                      {formatCurrency(a.balance)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-center font-semibold text-xs text-slate-900 gap-2">
                <span className="whitespace-nowrap shrink-0">{ui.auditor.financialStatements.totalLiabilities}</span>
                <span className="font-mono tabular-nums whitespace-nowrap shrink-0">
                  {formatCurrency(totalLiabilities)} {ui.common.currencyUnit}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 whitespace-nowrap shrink-0">
                {ui.accountant.accounts.categoryEquity}
              </h3>
              <div className="space-y-2 text-xs">
                {equities.map((a) => (
                  <div key={a.code} className="flex justify-between items-center py-1 border-b border-slate-50 gap-2">
                    <span className="text-slate-700 break-words leading-relaxed">{a.name}</span>
                    <span className="font-mono tabular-nums text-slate-900 whitespace-nowrap shrink-0">
                      {formatCurrency(a.balance)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-center font-semibold text-xs text-slate-900 gap-2">
                <span className="whitespace-nowrap shrink-0">{ui.auditor.financialStatements.totalEquity}</span>
                <span className="font-mono tabular-nums whitespace-nowrap shrink-0">
                  {formatCurrency(totalEquity)} {ui.common.currencyUnit}
                </span>
              </div>
            </div>

            <div className="bg-slate-100 rounded-lg border border-slate-300 p-4 flex justify-between items-center font-bold text-xs text-slate-900 gap-2">
              <span className="whitespace-nowrap shrink-0">{ui.auditor.financialStatements.totalLiabilitiesAndEquity}</span>
              <span className="font-mono tabular-nums text-sm text-sky-800 whitespace-nowrap shrink-0">
                {formatCurrency(totalLiabilities + totalEquity)} {ui.common.currencyUnit}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Income Statement */}
      {activeTab === 'income' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-xs max-w-4xl space-y-6">
          {/* Revenues */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-200 mb-3 whitespace-nowrap shrink-0">
              {ui.auditor.financialStatements.totalRevenue}
            </h3>
            <div className="space-y-2 text-xs">
              {revenues.map((a) => (
                <div key={a.code} className="flex justify-between items-center py-1 gap-2">
                  <span className="text-slate-700 break-words leading-relaxed">{a.name}</span>
                  <span className="font-mono tabular-nums text-slate-900 whitespace-nowrap shrink-0">
                    {formatCurrency(a.balance)}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center font-semibold text-xs text-emerald-800 mt-2 gap-2">
              <span className="whitespace-nowrap shrink-0">{ui.auditor.financialStatements.totalRevenue}</span>
              <span className="font-mono tabular-nums whitespace-nowrap shrink-0">
                {formatCurrency(totalRevenues)} {ui.common.currencyUnit}
              </span>
            </div>
          </div>

          {/* Expenses */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-200 mb-3 whitespace-nowrap shrink-0">
              {ui.auditor.financialStatements.totalExpenses}
            </h3>
            <div className="space-y-2 text-xs">
              {expenses.map((a) => (
                <div key={a.code} className="flex justify-between items-center py-1 gap-2">
                  <span className="text-slate-700 break-words leading-relaxed">{a.name}</span>
                  <span className="font-mono tabular-nums text-slate-900 whitespace-nowrap shrink-0">
                    {formatCurrency(a.balance)}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center font-semibold text-xs text-rose-800 mt-2 gap-2">
              <span className="whitespace-nowrap shrink-0">{ui.auditor.financialStatements.totalExpenses}</span>
              <span className="font-mono tabular-nums whitespace-nowrap shrink-0">
                {formatCurrency(totalExpenses)} {ui.common.currencyUnit}
              </span>
            </div>
          </div>

          {/* Net Profit */}
          <div className="pt-4 border-t-2 border-slate-300 flex flex-wrap justify-between items-center font-bold text-sm text-slate-900 bg-slate-50 p-4 rounded-md gap-2">
            <span className="whitespace-nowrap shrink-0">{ui.auditor.financialStatements.netProfit}</span>
            <span className="font-mono tabular-nums text-base text-emerald-600 whitespace-nowrap shrink-0">
              {formatCurrency(netProfit)} {ui.common.currencyUnit}
            </span>
          </div>
        </div>
      )}

      {/* Tab 3: Cash Flow Statement */}
      {activeTab === 'cashFlow' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-xs max-w-4xl space-y-6">
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-slate-100 gap-2">
              <span className="font-semibold text-slate-800 whitespace-nowrap shrink-0">
                {ui.auditor.financialStatements.operatingCashFlow}
              </span>
              <span className="font-mono tabular-nums font-semibold text-emerald-700 whitespace-nowrap shrink-0">
                {formatCurrency(cashflowData.operating)} {ui.common.currencyUnit}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 gap-2">
              <span className="font-semibold text-slate-800 whitespace-nowrap shrink-0">
                {ui.auditor.financialStatements.investingCashFlow}
              </span>
              <span className="font-mono tabular-nums font-semibold text-rose-700 whitespace-nowrap shrink-0">
                {formatCurrency(cashflowData.investing)} {ui.common.currencyUnit}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 gap-2">
              <span className="font-semibold text-slate-800 whitespace-nowrap shrink-0">
                {ui.auditor.financialStatements.financingCashFlow}
              </span>
              <span className="font-mono tabular-nums font-semibold text-slate-700 whitespace-nowrap shrink-0">
                {formatCurrency(cashflowData.financing)} {ui.common.currencyUnit}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t-2 border-slate-300 flex flex-wrap justify-between items-center font-bold text-sm text-slate-900 bg-slate-50 p-4 rounded-md gap-2">
            <span className="whitespace-nowrap shrink-0">{ui.auditor.financialStatements.netCashChange}</span>
            <span className="font-mono tabular-nums text-base text-sky-700 whitespace-nowrap shrink-0">
              {formatCurrency(cashflowData.netChange)} {ui.common.currencyUnit}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
