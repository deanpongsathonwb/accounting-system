import React, { useState } from 'react';
import { Activity, CheckCircle2, TrendingUp, ShieldCheck, Filter } from 'lucide-react';
import { Header } from '../../components/layout/Header.tsx';
import { UI } from '../../constants/index.ts';
import { useAppStore } from '../../stores/app.store.ts';
import { formatPercent } from '../../utils/format.ts';

export const FinancialRatiosPage: React.FC = () => {
  const accounts = useAppStore((state) => state.accounts);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'liquidity' | 'profitability'>('all');

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

  const currentRatio = totalLiabilities > 0 ? totalAssets / totalLiabilities : 0;
  const debtToEquity = totalEquity > 0 ? totalLiabilities / totalEquity : 0;
  const netProfitMargin = totalRevenues > 0 ? (netIncome / totalRevenues) * 100 : 0;
  const roa = totalAssets > 0 ? (netIncome / totalAssets) * 100 : 0;
  const roe = totalEquity > 0 ? (netIncome / totalEquity) * 100 : 0;

  const allRatios = [
    {
      category: 'liquidity',
      title: UI.auditor.currentRatio,
      value: `${currentRatio.toFixed(2)}${UI.units.multiplier}`,
      benchmark: UI.auditor.benchmarks.currentRatio,
      status: currentRatio >= 1.5 ? UI.auditor.auditStatusNormal : UI.common.warning,
      isGood: currentRatio >= 1.5
    },
    {
      category: 'liquidity',
      title: UI.auditor.debtToEquity,
      value: `${debtToEquity.toFixed(2)}${UI.units.multiplier}`,
      benchmark: UI.auditor.benchmarks.debtToEquity,
      status: debtToEquity <= 1.0 ? UI.auditor.auditStatusNormal : UI.common.warning,
      isGood: debtToEquity <= 1.0
    },
    {
      category: 'profitability',
      title: UI.auditor.netProfitMargin,
      value: formatPercent(Number(netProfitMargin.toFixed(1))),
      benchmark: UI.auditor.benchmarks.netProfitMargin,
      status: netProfitMargin >= 10.0 ? UI.auditor.auditStatusNormal : UI.common.warning,
      isGood: netProfitMargin >= 10.0
    },
    {
      category: 'profitability',
      title: UI.auditor.roa,
      value: formatPercent(Number(roa.toFixed(1))),
      benchmark: UI.auditor.benchmarks.roa,
      status: roa >= 5.0 ? UI.auditor.auditStatusNormal : UI.common.warning,
      isGood: roa >= 5.0
    },
    {
      category: 'profitability',
      title: UI.auditor.roe,
      value: formatPercent(Number(roe.toFixed(1))),
      benchmark: UI.auditor.benchmarks.roe,
      status: roe >= 8.0 ? UI.auditor.auditStatusNormal : UI.common.warning,
      isGood: roe >= 8.0
    }
  ];

  const filteredRatios = allRatios.filter(
    (r) => categoryFilter === 'all' || r.category === categoryFilter
  );

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title={UI.auditor.ratiosTitle}
        subtitle={UI.auditor.ratiosSubtitle}
      />

      <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-full">
        {/* Header & Filter Toolbar */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <label
              htmlFor="ratio-category-filter"
              className="text-sm font-bold text-slate-700 whitespace-nowrap flex items-center gap-1.5"
            >
              <Filter className="w-4 h-4 text-slate-500 shrink-0" />
              <span>{UI.common.filter}:</span>
            </label>
            <div className="w-full sm:w-64">
              <select
                id="ratio-category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as 'all' | 'liquidity' | 'profitability')}
                aria-label={UI.common.filter}
                className="w-full text-sm font-semibold border border-slate-200 rounded-lg px-3.5 py-2 bg-white text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">{UI.auditor.ratioCategories.all}</option>
                <option value="liquidity">{UI.auditor.ratioCategories.liquidity}</option>
                <option value="profitability">{UI.auditor.ratioCategories.profitability}</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{UI.auditor.auditPassed}</span>
          </div>
        </div>

        {/* Ratios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredRatios.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                  <span className="text-xs font-mono text-slate-400 mt-1 block">
                    {item.benchmark}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border shrink-0 ${
                    item.isGood
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{item.status}</span>
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-blue-700">
                  {item.value}
                </span>
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
