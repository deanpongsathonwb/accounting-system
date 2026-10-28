import React, { useState } from 'react';
import { Plus, CheckCircle2, AlertCircle, Trash2, FileSpreadsheet, Search, Filter } from 'lucide-react';
import { Header } from '../../components/layout/Header.tsx';
import { EmptyState, Modal } from '../../components/feedback/index.ts';
import { CustomSelect, DatePicker, renderSemanticText } from '../../components/common/index.ts';
import { UI } from '../../constants/index.ts';
import { useAppStore } from '../../stores/app.store.ts';
import { useAuthStore } from '../../stores/auth.store.ts';
import { JournalEntry, JournalLine } from '../../types/common.types.ts';
import { formatCurrency } from '../../utils/format.ts';
import { journalSchema } from '../../validations/index.ts';

export const GeneralJournalPage: React.FC = () => {
  const journals = useAppStore((state) => state.journals);
  const accounts = useAppStore((state) => state.accounts);
  const settings = useAppStore((state) => state.settings);
  const addJournalEntry = useAppStore((state) => state.addJournalEntry);
  const addAuditLog = useAppStore((state) => state.addAuditLog);
  const addNotification = useAppStore((state) => state.addNotification);
  const currentUser = useAuthStore((state) => state.currentUser);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState(UI.defaults.currentDate);
  const [memo, setMemo] = useState('');

  const filteredJournals = journals.filter((j) => {
    const matchesSearch =
      j.journalNumber.toLowerCase().includes(search.toLowerCase()) ||
      j.memo.toLowerCase().includes(search.toLowerCase()) ||
      j.lines.some(
        (l) =>
          l.accountName.toLowerCase().includes(search.toLowerCase()) ||
          l.accountCode.includes(search)
      );
    const matchesStatus = statusFilter === 'all' || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const [lines, setLines] = useState<JournalLine[]>([
    {
      accountId: accounts[0]?.id || '',
      accountCode: accounts[0]?.code || '',
      accountName: accounts[0]?.name || '',
      debit: 0,
      credit: 0
    },
    {
      accountId: accounts[1]?.id || '',
      accountCode: accounts[1]?.code || '',
      accountName: accounts[1]?.name || '',
      debit: 0,
      credit: 0
    }
  ]);

  const totalDebit = lines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, line) => sum + (Number(line.credit) || 0), 0);
  const difference = Math.abs(totalDebit - totalCredit);
  const isBalanced = difference === 0 && totalDebit > 0;

  const handleAccountChange = (index: number, accountId: string) => {
    const acc = accounts.find((a) => a.id === accountId);
    if (!acc) return;
    const updated = [...lines];
    updated[index] = {
      ...updated[index],
      accountId: acc.id,
      accountCode: acc.code,
      accountName: acc.name
    };
    setLines(updated);
  };

  const handleAmountChange = (index: number, field: 'debit' | 'credit', value: string) => {
    const num = parseFloat(value) || 0;
    const updated = [...lines];
    updated[index] = {
      ...updated[index],
      [field]: num,
      ...(field === 'debit' && num > 0 ? { credit: 0 } : {}),
      ...(field === 'credit' && num > 0 ? { debit: 0 } : {})
    };
    setLines(updated);
  };

  const handleAddLine = () => {
    const defaultAcc = accounts[0];
    setLines([
      ...lines,
      {
        accountId: defaultAcc?.id || '',
        accountCode: defaultAcc?.code || '',
        accountName: defaultAcc?.name || '',
        debit: 0,
        credit: 0
      }
    ]);
  };

  const handleRemoveLine = (index: number) => {
    if (lines.length <= 2) return;
    setLines(lines.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) return;

    const validation = journalSchema.safeParse({
      date,
      memo: memo.trim(),
      lines
    });

    if (!validation.success) return;

    const nextId = `${settings.journalPrefix}${String(journals.length + 1).padStart(3, '0')}`;
    const newEntry: JournalEntry = {
      id: `jv-${Date.now()}`,
      journalNumber: nextId,
      date: validation.data.date,
      memo: validation.data.memo,
      status: 'posted',
      createdBy: currentUser?.fullName || '',
      lines
    };

    addJournalEntry(newEntry);
    addNotification({
      title: `${UI.accountant.journalTitle}: ${nextId}`,
      message: `${validation.data.memo} • ${UI.accountant.totalDebit} ${totalDebit.toLocaleString()} ${UI.units.baht}`,
      type: 'info',
      link: '/accountant/journal',
      targetRole: 'accountant'
    });

    if (currentUser) {
      addAuditLog({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: currentUser.fullName,
        role: currentUser.role,
        actionType: 'CREATE_JOURNAL',
        entity: nextId,
        ipAddress: 'Web Client (Accountant Session)'
      });
    }

    setIsModalOpen(false);
    setMemo('');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title={UI.accountant.journalTitle}
        subtitle={UI.accountant.journalSubtitle}
      />

      <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-full">
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
              <label htmlFor="journal-status-filter" className="sr-only">
                {UI.common.filter}
              </label>
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                id="journal-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label={UI.common.filter}
                className="w-full sm:w-auto text-sm font-semibold border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">{UI.common.all}</option>
                <option value="posted">{UI.common.posted}</option>
                <option value="draft">{UI.common.draft}</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{UI.accountant.newJournal}</span>
          </button>
        </div>

        {/* Journals Listing */}
        <div className="space-y-4">
          {filteredJournals.length === 0 ? (
            <EmptyState
              title={UI.feedback.noData}
              subtitle={UI.feedback.noDataSubtitle}
            />
          ) : (
            filteredJournals.map((journal) => {
            const entryTotal = journal.lines.reduce((s, l) => s + l.debit, 0);

            return (
              <div
                key={journal.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 min-w-0">
                    <span className="font-mono font-bold text-blue-700 text-sm">
                      {journal.journalNumber}
                    </span>
                    <span className="text-xs text-slate-500">{journal.date}</span>
                    <span className="text-sm font-medium text-slate-800 break-words">
                      {journal.memo}
                    </span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>{UI.common.posted}</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {formatCurrency(entryTotal)}
                    </span>
                  </div>
                </div>

                {/* Desktop Lines Table */}
                <div className="hidden md:block">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="py-2.5 px-4">{UI.accountant.accountCode}</th>
                        <th className="py-2.5 px-4">{UI.accountant.accountName}</th>
                        <th className="py-2.5 px-4 text-right">{UI.common.debit}</th>
                        <th className="py-2.5 px-4 text-right">{UI.common.credit}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {journal.lines.map((l, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-4 font-mono text-slate-600 text-xs">
                            {l.accountCode}
                          </td>
                          <td className="py-2.5 px-4 font-medium text-slate-800">
                            {l.accountName}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono text-slate-900">
                            {l.debit > 0 ? formatCurrency(l.debit) : UI.common.emptyValue}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono text-slate-900">
                            {l.credit > 0 ? formatCurrency(l.credit) : UI.common.emptyValue}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Lines Stacked View */}
                <div className="md:hidden divide-y divide-slate-100">
                  {journal.lines.map((l, idx) => (
                    <div key={idx} className="p-3 text-xs space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-blue-700 font-bold">{l.accountCode}</span>
                        <span className="text-slate-800 font-medium break-words text-right">{l.accountName}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 text-slate-600">
                        <span>
                          {l.debit > 0 ? (
                            <span className="text-emerald-700 font-mono font-medium">
                              {UI.common.debit}: {formatCurrency(l.debit)}
                            </span>
                          ) : '-'}
                        </span>
                        <span>
                          {l.credit > 0 ? (
                            <span className="text-slate-700 font-mono font-medium">
                              {UI.common.credit}: {formatCurrency(l.credit)}
                            </span>
                          ) : '-'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }))}
        </div>
      </div>

      {/* New Journal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={UI.accountant.newJournal}
        icon={<FileSpreadsheet className="w-5 h-5 text-blue-600" />}
        maxWidth="3xl"
      >
        <form onSubmit={handleSave} className="space-y-4 max-w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {UI.accountant.journalDate}
              </label>
              <DatePicker
                value={date}
                onChange={(newDate) => setDate(newDate)}
                placeholder={UI.accountant.journalDate}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {UI.accountant.memo}
              </label>
              <input
                type="text"
                required
                placeholder={UI.accountant.memo}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Journal Lines */}
          <div className="border border-slate-200 rounded-xl overflow-hidden max-w-full">
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">{UI.accountant.accountName}</th>
                    <th className="py-2.5 px-3 text-right w-36">{UI.common.debit}</th>
                    <th className="py-2.5 px-3 text-right w-36">{UI.common.credit}</th>
                    <th className="py-2.5 px-3 text-center w-12">{UI.common.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lines.map((line, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3">
                        <CustomSelect
                          value={line.accountId}
                          onChange={(val) => handleAccountChange(idx, val)}
                          options={accounts.map((acc) => ({
                            value: acc.id,
                            label: `${acc.code} - ${acc.name}`
                          }))}
                          buttonClassName="py-1 px-2 text-xs"
                        />
                      </td>
                      <td className="py-2 px-3 text-right">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={line.debit || ''}
                          onChange={(e) => handleAmountChange(idx, 'debit', e.target.value)}
                          placeholder={UI.common.zeroAmount}
                          className="w-full text-right text-xs font-mono border border-slate-200 rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-2 px-3 text-right">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={line.credit || ''}
                          onChange={(e) => handleAmountChange(idx, 'credit', e.target.value)}
                          placeholder={UI.common.zeroAmount}
                          className="w-full text-right text-xs font-mono border border-slate-200 rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveLine(idx)}
                          disabled={lines.length <= 2}
                          className="text-slate-400 hover:text-rose-600 disabled:opacity-30 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Lines View */}
            <div className="sm:hidden divide-y divide-slate-100 p-3 space-y-3">
              {lines.map((line, idx) => (
                <div key={idx} className="space-y-2 pt-2 first:pt-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-600">
                      #{idx + 1} {UI.accountant.accountName}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLine(idx)}
                      disabled={lines.length <= 2}
                      className="text-slate-400 hover:text-rose-600 disabled:opacity-30 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <CustomSelect
                    value={line.accountId}
                    onChange={(val) => handleAccountChange(idx, val)}
                    options={accounts.map((acc) => ({
                      value: acc.id,
                      label: `${acc.code} - ${acc.name}`
                    }))}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-0.5">
                        {UI.common.debit}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={line.debit || ''}
                        onChange={(e) => handleAmountChange(idx, 'debit', e.target.value)}
                        placeholder={UI.common.zeroAmount}
                        className="w-full text-xs font-mono border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-0.5">
                        {UI.common.credit}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={line.credit || ''}
                        onChange={(e) => handleAmountChange(idx, 'credit', e.target.value)}
                        placeholder={UI.common.zeroAmount}
                        className="w-full text-xs font-mono border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2">
              <button
                type="button"
                onClick={handleAddLine}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-center sm:justify-start gap-1 px-2 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{UI.accountant.addJournalLine}</span>
              </button>

              <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 text-xs font-mono">
                <span>
                  {UI.accountant.totalDebit}: {formatCurrency(totalDebit)}
                </span>
                <span>
                  {UI.accountant.totalCredit}: {formatCurrency(totalCredit)}
                </span>
              </div>
            </div>
          </div>

          {/* Balance Validation Status */}
          <div
            className={`p-3 rounded-lg border flex items-center gap-2 text-xs font-medium ${
              isBalanced
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {isBalanced ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{UI.accountant.balancedStatus}</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="break-words">
                  {renderSemanticText(UI.accountant.unbalancedStatus)} ({renderSemanticText(UI.accountant.balanceDifference)}: {formatCurrency(difference)})
                </span>
              </>
            )}
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
              disabled={!isBalanced || !memo}
              className="px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg shadow-sm transition-colors"
            >
              {UI.common.save}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
