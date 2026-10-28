import React, { useState } from 'react';
import { Plus, Search, Filter, BookOpen } from 'lucide-react';
import { Header } from '../../components/layout/Header.tsx';
import { EmptyState, Modal } from '../../components/feedback/index.ts';
import { CustomSelect } from '../../components/common/index.ts';
import { UI } from '../../constants/index.ts';
import { useAppStore } from '../../stores/app.store.ts';
import { AccountItem, AccountType, NormalBalance } from '../../types/common.types.ts';
import { formatCurrency } from '../../utils/format.ts';
import { accountSchema } from '../../validations/index.ts';

export const ChartOfAccountsPage: React.FC = () => {
  const accounts = useAppStore((state) => state.accounts);
  const addAccount = useAppStore((state) => state.addAccount);
  const addNotification = useAppStore((state) => state.addNotification);

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New account form state
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<AccountType>('asset');
  const [newNormalBalance, setNewNormalBalance] = useState<NormalBalance>('debit');
  const [newInitialBalance, setNewInitialBalance] = useState('');

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.code.includes(search) || acc.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'all' || acc.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedBalance = parseFloat(newInitialBalance) || 0;
    const validation = accountSchema.safeParse({
      code: newCode.trim(),
      name: newName.trim(),
      type: newType,
      normalBalance: newNormalBalance,
      balance: parsedBalance
    });

    if (!validation.success) return;

    const newAcc: AccountItem = {
      id: `acc-${Date.now()}`,
      code: validation.data.code,
      name: validation.data.name,
      type: validation.data.type,
      normalBalance: validation.data.normalBalance,
      balance: validation.data.balance,
      status: 'active'
    };

    addAccount(newAcc);
    addNotification({
      title: `${UI.accountant.newAccount}: ${newAcc.code}`,
      message: `${newAcc.name} (${getTypeLabel(newAcc.type)})`,
      type: 'info',
      link: '/accountant/chart-of-accounts',
      targetRole: 'accountant'
    });

    setIsModalOpen(false);
    setNewCode('');
    setNewName('');
    setNewInitialBalance('');
  };

  const getTypeLabel = (type: AccountType) => {
    switch (type) {
      case 'asset':
        return UI.accountant.types.asset;
      case 'liability':
        return UI.accountant.types.liability;
      case 'equity':
        return UI.accountant.types.equity;
      case 'revenue':
        return UI.accountant.types.revenue;
      case 'expense':
        return UI.accountant.types.expense;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title={UI.accountant.coaTitle}
        subtitle={UI.accountant.coaSubtitle}
      />

      <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-full">
        {/* Controls Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 w-full max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={UI.common.search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label htmlFor="account-type-filter" className="sr-only">{UI.common.filter}</label>
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                id="account-type-filter"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                aria-label={UI.common.filter}
                className="w-full sm:w-auto text-sm font-semibold border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">{UI.common.all}</option>
                <option value="asset">{UI.accountant.types.asset}</option>
                <option value="liability">{UI.accountant.types.liability}</option>
                <option value="equity">{UI.accountant.types.equity}</option>
                <option value="revenue">{UI.accountant.types.revenue}</option>
                <option value="expense">{UI.accountant.types.expense}</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{UI.accountant.newAccount}</span>
          </button>
        </div>

        {/* Accounts Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredAccounts.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title={UI.feedback.noData}
                subtitle={UI.feedback.noDataSubtitle}
              />
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">{UI.accountant.accountCode}</th>
                      <th className="py-3 px-4">{UI.accountant.accountName}</th>
                      <th className="py-3 px-4">{UI.accountant.accountType}</th>
                      <th className="py-3 px-4">{UI.accountant.normalBalance}</th>
                      <th className="py-3 px-4 text-right">{UI.common.balance}</th>
                      <th className="py-3 px-4 text-center">{UI.common.status}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAccounts.map((acc) => (
                      <tr key={acc.id} className="hover:bg-slate-50/70">
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                          {acc.code}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-900">
                          {acc.name}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {getTypeLabel(acc.type)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                            {acc.normalBalance === 'debit' ? UI.common.debit : UI.common.credit}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900">
                          {formatCurrency(acc.balance)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                            <span>{UI.common.active}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Card View */}
              <div className="md:hidden divide-y divide-slate-100">
                {filteredAccounts.map((acc) => (
                  <div key={acc.id} className="p-4 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="font-mono text-xs font-bold text-blue-700 block">
                          {acc.code}
                        </span>
                        <h4 className="font-semibold text-slate-900 text-sm break-words">
                          {acc.name}
                        </h4>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 shrink-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <span>{UI.common.active}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-slate-500">
                        <span>{getTypeLabel(acc.type)}</span>
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                          {acc.normalBalance === 'debit' ? UI.common.debit : UI.common.credit}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-sm font-bold text-slate-900">
                          {formatCurrency(acc.balance)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create Account Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={UI.accountant.newAccount}
        icon={<BookOpen className="w-5 h-5 text-blue-600" />}
        maxWidth="lg"
      >
        <form onSubmit={handleCreateAccount} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {UI.accountant.accountCode}
            </label>
            <input
              type="text"
              required
              placeholder={UI.accountant.accountCode}
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {UI.accountant.accountName}
            </label>
            <input
              type="text"
              required
              placeholder={UI.accountant.accountName}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {UI.accountant.accountType}
              </label>
              <CustomSelect
                value={newType}
                onChange={(val) => {
                  const typeVal = val as AccountType;
                  setNewType(typeVal);
                  setNewNormalBalance(typeVal === 'asset' || typeVal === 'expense' ? 'debit' : 'credit');
                }}
                options={[
                  { value: 'asset', label: UI.accountant.types.asset },
                  { value: 'liability', label: UI.accountant.types.liability },
                  { value: 'equity', label: UI.accountant.types.equity },
                  { value: 'revenue', label: UI.accountant.types.revenue },
                  { value: 'expense', label: UI.accountant.types.expense }
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {UI.accountant.normalBalance}
              </label>
              <CustomSelect
                value={newNormalBalance}
                onChange={(val) => setNewNormalBalance(val as NormalBalance)}
                options={[
                  { value: 'debit', label: UI.common.debit },
                  { value: 'credit', label: UI.common.credit }
                ]}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {UI.accountant.beginningBalance}
            </label>
            <input
              type="number"
              placeholder={UI.common.zeroAmount}
              value={newInitialBalance}
              onChange={(e) => setNewInitialBalance(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {UI.common.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors"
            >
              {UI.common.save}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
