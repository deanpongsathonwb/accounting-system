import React, { useState } from 'react';
import { Plus, Building2, Wallet } from 'lucide-react';
import { Header } from '../../components/layout/Header.tsx';
import { EmptyState, Modal } from '../../components/feedback/index.ts';
import { UI } from '../../constants/index.ts';
import { useAppStore } from '../../stores/app.store.ts';
import { BankAccountItem } from '../../types/common.types.ts';
import { formatCurrency } from '../../utils/format.ts';
import { renderSemanticText } from '../../components/common/index.ts';

export const BankAccountsPage: React.FC = () => {
  const bankAccounts = useAppStore((state) => state.bankAccounts);
  const addBankAccount = useAppStore((state) => state.addBankAccount);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New account form
  const [bankName, setBankName] = useState('');
  const [branch, setBranch] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState<string>(UI.finance.defaultAccountType);
  const [balanceStr, setBalanceStr] = useState('');

  const totalBalance = bankAccounts.reduce((s, b) => s + b.balance, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName || !accountNumber) return;

    const newBank: BankAccountItem = {
      id: `bank-${Date.now()}`,
      bankName,
      branch,
      accountNumber,
      accountType,
      balance: parseFloat(balanceStr) || 0,
      lastReconciled: UI.defaults.currentDate
    };

    addBankAccount(newBank);
    setIsModalOpen(false);
    setBankName('');
    setBranch('');
    setAccountNumber('');
    setBalanceStr('');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title={UI.finance.bankTitle}
        subtitle={UI.finance.bankSubtitle}
      />

      <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-full">
        {/* Total Summary */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Wallet className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">{renderSemanticText(UI.finance.bankSubtitle)}</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{formatCurrency(totalBalance)}</p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{UI.finance.newBankAccount}</span>
          </button>
        </div>

        {/* Bank Accounts Grid */}
        {bankAccounts.length === 0 ? (
          <EmptyState
            title={UI.feedback.noData}
            subtitle={UI.feedback.noDataSubtitle}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {bankAccounts.map((acc) => (
              <div
                key={acc.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{acc.bankName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{acc.branch}</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg text-blue-600 border border-slate-200">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-400 block">{UI.finance.accountNumber}</span>
                  <span className="font-mono text-sm font-semibold text-slate-800">
                    {acc.accountNumber}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-end">
                  <div>
                    <span className="text-xs text-slate-400 block">{UI.finance.currentBalance}</span>
                    <span className="font-mono text-lg font-bold text-blue-700">
                      {formatCurrency(acc.balance)}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {acc.accountType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Bank Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={UI.finance.newBankAccount}
        icon={<Building2 className="w-5 h-5 text-blue-600" />}
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4 max-w-full">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {UI.finance.bankName}
            </label>
            <input
              type="text"
              required
              placeholder={UI.finance.bankName}
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {UI.common.description}
            </label>
            <input
              type="text"
              placeholder={UI.common.description}
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {UI.finance.accountNumber}
            </label>
            <input
              type="text"
              required
              placeholder={UI.finance.accountNumber}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {UI.finance.currentBalance}
            </label>
            <input
              type="number"
              min="0"
              step="any"
              placeholder={UI.common.zeroAmount}
              value={balanceStr}
              onChange={(e) => setBalanceStr(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
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
