import React, { useState } from 'react';
import { ui } from '../../constants/index.ts';
import type { AccountItem } from '../../types/common.types.ts';
import { formatCurrency } from '../../utils/format.ts';
import { Plus, Search } from 'lucide-react';
import { renderSemantic } from '../../utils/text.tsx';
import { Modal } from '../../components/common/Modal.tsx';

interface AccountsPageProps {
  accounts: AccountItem[];
  onAddAccount: (acc: AccountItem) => void;
}

export const AccountsPage: React.FC<AccountsPageProps> = ({ accounts, onAddAccount }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'asset' | 'liability' | 'equity' | 'revenue' | 'expense'>('asset');
  const [normalBalance, setNormalBalance] = useState<'debit' | 'credit'>('debit');

  const categories = [
    { key: 'all', label: ui.common.all },
    { key: 'asset', label: ui.accountant.accounts.categoryAsset },
    { key: 'liability', label: ui.accountant.accounts.categoryLiability },
    { key: 'equity', label: ui.accountant.accounts.categoryEquity },
    { key: 'revenue', label: ui.accountant.accounts.categoryRevenue },
    { key: 'expense', label: ui.accountant.accounts.categoryExpense },
  ];

  const categoryNameMap: Record<string, string> = {
    asset: ui.accountant.accounts.categoryAsset,
    liability: ui.accountant.accounts.categoryLiability,
    equity: ui.accountant.accounts.categoryEquity,
    revenue: ui.accountant.accounts.categoryRevenue,
    expense: ui.accountant.accounts.categoryExpense,
  };

  const filtered = accounts.filter((acc) => {
    const matchesSearch =
      acc.code.includes(searchTerm) || acc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || acc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSave = () => {
    if (!code.trim() || !name.trim()) return;

    const newAcc: AccountItem = {
      code: code.trim(),
      name: name.trim(),
      category,
      normalBalance,
      balance: 0,
      active: true,
    };

    onAddAccount(newAcc);
    setModalOpen(false);
    setCode('');
    setName('');
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug break-words">
            {renderSemantic(ui.accountant.accounts.title)}
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed break-words">
            {renderSemantic(ui.accountant.accounts.description)}
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="self-start sm:self-center inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs hover:shadow-sm transition-all duration-150 shrink-0 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap shrink-0">{ui.accountant.accounts.addAccount}</span>
        </button>
      </div>

      {/* Filter and Category Tabs */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center flex-wrap gap-1.5 p-1 bg-slate-100 rounded-md">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === c.key
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-slate-400 w-full lg:w-64 border border-slate-200 px-3 py-1.5 rounded-md bg-white">
          <Search className="w-4 h-4 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={ui.common.search}
            className="w-full text-xs text-slate-800 placeholder-slate-400 outline-hidden bg-transparent"
          />
        </div>
      </div>

      {/* Accounts List: Responsive Card View on Mobile, Table on Tablet/Desktop */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-6 text-center text-xs text-slate-500 break-words">
            {ui.common.emptySearch}
          </div>
        ) : (
          filtered.map((acc) => (
            <div
              key={acc.code}
              className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-mono font-bold text-slate-900 whitespace-nowrap shrink-0">
                    {acc.code}
                  </div>
                  <div className="text-xs font-medium text-slate-800 break-words leading-relaxed mt-0.5">
                    {acc.name}
                  </div>
                </div>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium shrink-0 whitespace-nowrap ${
                    acc.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {acc.active ? ui.accountant.accounts.active : ui.accountant.accounts.inactive}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[11px] whitespace-nowrap shrink-0">
                    {ui.accountant.accounts.category}
                  </span>
                  <span className="text-slate-700 font-medium whitespace-nowrap shrink-0">
                    {categoryNameMap[acc.category]}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] whitespace-nowrap shrink-0">
                    {ui.accountant.accounts.normalBalance}
                  </span>
                  <span className="text-slate-700 font-medium whitespace-nowrap shrink-0">
                    {acc.normalBalance === 'debit' ? ui.common.debit : ui.common.credit}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium whitespace-nowrap shrink-0">
                  {ui.accountant.accounts.currentBalance}
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap shrink-0">
                  {formatCurrency(acc.balance)} {ui.common.currencyUnit}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop / Tablet Table */}
      <div className="hidden md:block bg-white rounded-lg border border-slate-200 overflow-x-auto shadow-xs">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr>
              <th className="text-left px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.accountant.accounts.code}
              </th>
              <th className="text-left px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.accountant.accounts.name}
              </th>
              <th className="text-left px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.accountant.accounts.category}
              </th>
              <th className="text-left px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.accountant.accounts.normalBalance}
              </th>
              <th className="text-right px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.accountant.accounts.currentBalance}
              </th>
              <th className="text-center px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.common.status}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((acc) => (
              <tr key={acc.code} className="hover:bg-slate-50 transition-colors">
                <td className="px-3 sm:px-4 py-3 font-mono font-semibold text-slate-900 whitespace-nowrap shrink-0">
                  {acc.code}
                </td>
                <td className="px-3 sm:px-4 py-3 text-slate-800 font-medium break-words leading-relaxed">
                  {acc.name}
                </td>
                <td className="px-3 sm:px-4 py-3 text-slate-600 whitespace-nowrap shrink-0">
                  {categoryNameMap[acc.category]}
                </td>
                <td className="px-3 sm:px-4 py-3 text-slate-600 whitespace-nowrap shrink-0">
                  {acc.normalBalance === 'debit' ? ui.common.debit : ui.common.credit}
                </td>
                <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-900 font-semibold whitespace-nowrap shrink-0">
                  {formatCurrency(acc.balance)} {ui.common.currencyUnit}
                </td>
                <td className="px-3 sm:px-4 py-3 text-center whitespace-nowrap shrink-0">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap shrink-0 ${
                      acc.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {acc.active ? ui.accountant.accounts.active : ui.accountant.accounts.inactive}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Account Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={ui.accountant.accounts.addAccount}
        maxWidth="max-w-md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-slate-300 hover:bg-slate-100 active:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {ui.common.cancel}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!code.trim() || !name.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {ui.common.save}
            </button>
          </>
        }
      >
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1 whitespace-nowrap shrink-0">
            {ui.accountant.accounts.code}
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={ui.accountant.accounts.code}
            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md outline-hidden focus:border-sky-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1 whitespace-nowrap shrink-0">
            {ui.accountant.accounts.name}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={ui.accountant.accounts.name}
            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md outline-hidden focus:border-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1 whitespace-nowrap shrink-0">
            {ui.accountant.accounts.category}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as typeof category)}
            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md outline-hidden bg-white"
          >
            <option value="asset">{ui.accountant.accounts.categoryAsset}</option>
            <option value="liability">{ui.accountant.accounts.categoryLiability}</option>
            <option value="equity">{ui.accountant.accounts.categoryEquity}</option>
            <option value="revenue">{ui.accountant.accounts.categoryRevenue}</option>
            <option value="expense">{ui.accountant.accounts.categoryExpense}</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1 whitespace-nowrap shrink-0">
            {ui.accountant.accounts.normalBalance}
          </label>
          <select
            value={normalBalance}
            onChange={(e) => setNormalBalance(e.target.value as typeof normalBalance)}
            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md outline-hidden bg-white"
          >
            <option value="debit">{ui.common.debit}</option>
            <option value="credit">{ui.common.credit}</option>
          </select>
        </div>
      </Modal>
    </div>
  );
};
