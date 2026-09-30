import React, { useState } from 'react';
import { ui } from '../../constants/index.ts';
import type { JournalEntry, JournalLine, AccountItem } from '../../types/common.types.ts';
import { formatCurrency } from '../../utils/format.ts';
import { Plus, Check, Search, FileText } from 'lucide-react';
import { renderSemantic } from '../../utils/text.tsx';
import { Modal } from '../../components/common/Modal.tsx';

interface JournalsPageProps {
  journals: JournalEntry[];
  accounts: AccountItem[];
  onAddJournal: (entry: JournalEntry) => void;
  onPostJournal: (id: string) => void;
}

export const JournalsPage: React.FC<JournalsPageProps> = ({
  journals,
  accounts,
  onAddJournal,
  onPostJournal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [reference, setReference] = useState('');
  const [description, setDescription] = useState('');
  const [lines, setLines] = useState<JournalLine[]>([
    { accountCode: accounts[0]?.code || '', accountName: accounts[0]?.name || '', debit: 0, credit: 0 },
    { accountCode: accounts[1]?.code || '', accountName: accounts[1]?.name || '', debit: 0, credit: 0 },
  ]);

  const filtered = journals.filter(
    (j) =>
      j.entryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDebit = lines.reduce((acc, cur) => acc + (Number(cur.debit) || 0), 0);
  const totalCredit = lines.reduce((acc, cur) => acc + (Number(cur.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

  const handleLineChange = (index: number, field: keyof JournalLine, value: string | number) => {
    setLines((prev) => {
      const copy = [...prev];
      if (field === 'accountCode') {
        const found = accounts.find((a) => a.code === value);
        copy[index] = {
          ...copy[index],
          accountCode: String(value),
          accountName: found ? found.name : copy[index].accountName,
        };
      } else {
        copy[index] = { ...copy[index], [field]: value };
      }
      return copy;
    });
  };

  const addLine = () => {
    setLines((prev) => [
      ...prev,
      { accountCode: accounts[0]?.code || '', accountName: accounts[0]?.name || '', debit: 0, credit: 0 },
    ]);
  };

  const removeLine = (idx: number) => {
    if (lines.length > 2) {
      setLines((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const handleSave = () => {
    if (!isBalanced || !description.trim()) return;

    const newId = `j-${Date.now()}`;
    const newEntryNum = `JV-2569-${String(journals.length + 1).padStart(5, '0')}`;
    const today = new Date().toISOString().slice(0, 10);

    const newEntry: JournalEntry = {
      id: newId,
      entryNumber: newEntryNum,
      date: today,
      reference: reference || newEntryNum,
      description: description.trim(),
      status: 'draft',
      lines: lines.map((l) => ({
        ...l,
        debit: Number(l.debit) || 0,
        credit: Number(l.credit) || 0,
      })),
    };

    onAddJournal(newEntry);
    setModalOpen(false);
    setDescription('');
    setReference('');
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug break-words">
            {renderSemantic(ui.accountant.journals.title)}
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed break-words">
            {renderSemantic(ui.accountant.journals.description)}
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="self-start sm:self-center inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs hover:shadow-sm transition-all duration-150 shrink-0 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap shrink-0">{ui.accountant.journals.newEntry}</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-slate-400">
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

      {/* Entries List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-xs text-slate-500 break-words">
            {ui.common.emptySearch}
          </div>
        ) : (
          filtered.map((entry) => {
            const entryDebit = entry.lines.reduce((a, b) => a + b.debit, 0);
            return (
              <div
                key={entry.id}
                className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-2.5 gap-2">
                  <div className="flex items-center flex-wrap gap-2 text-xs leading-normal">
                    <span className="font-mono font-semibold text-slate-900 whitespace-nowrap shrink-0">
                      {entry.entryNumber}
                    </span>
                    <span className="text-slate-300 whitespace-nowrap shrink-0">{ui.common.symbolSeparator}</span>
                    <span className="text-slate-500 font-mono tabular-nums whitespace-nowrap shrink-0">
                      {entry.date}
                    </span>
                    <span className="text-slate-300 whitespace-nowrap shrink-0">{ui.common.symbolSeparator}</span>
                    <span className="text-slate-600 whitespace-nowrap shrink-0">
                      {entry.reference}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-sm whitespace-nowrap shrink-0 ${
                        entry.status === 'posted'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {entry.status === 'posted'
                        ? ui.accountant.journals.statusPosted
                        : ui.accountant.journals.statusDraft}
                    </span>

                    {entry.status === 'draft' && (
                      <button
                        onClick={() => onPostJournal(entry.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-semibold rounded-lg shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer focus:outline-hidden whitespace-nowrap shrink-0"
                      >
                        <Check className="w-3.5 h-3.5 shrink-0" />
                        <span className="whitespace-nowrap">{ui.common.postEntry}</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-xs text-slate-700 font-medium break-words leading-relaxed">
                  {entry.description}
                </div>

                {/* Lines View: Responsive Card view on small mobile, Table on sm+ */}
                <div className="sm:hidden space-y-2 pt-2 border-t border-slate-100">
                  {entry.lines.map((line, idx) => (
                    <div key={idx} className="bg-slate-50 p-2.5 rounded text-xs space-y-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-mono font-semibold text-slate-700 whitespace-nowrap shrink-0">{line.accountCode}</span>
                        <span className="font-medium text-slate-800 break-words leading-relaxed text-right">{line.accountName}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200">
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400 whitespace-nowrap shrink-0">{ui.common.debit}{ui.common.symbolColon}</span>
                          <span className="font-mono tabular-nums text-slate-900 font-semibold whitespace-nowrap shrink-0">{line.debit > 0 ? formatCurrency(line.debit) : ui.common.symbolDash}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400 whitespace-nowrap shrink-0">{ui.common.credit}{ui.common.symbolColon}</span>
                          <span className="font-mono tabular-nums text-slate-900 font-semibold whitespace-nowrap shrink-0">{line.credit > 0 ? formatCurrency(line.credit) : ui.common.symbolDash}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between font-bold text-xs pt-2 border-t border-slate-200 text-slate-900">
                    <span className="whitespace-nowrap shrink-0">{ui.common.total}</span>
                    <span className="font-mono tabular-nums text-sky-800 whitespace-nowrap shrink-0">{formatCurrency(entryDebit)} {ui.common.currencyUnit}</span>
                  </div>
                </div>

                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-normal">
                        <th className="text-left py-2 px-3 whitespace-nowrap shrink-0">{ui.accountant.journals.accountCode}</th>
                        <th className="text-left py-2 px-3 whitespace-nowrap shrink-0">{ui.accountant.journals.accountName}</th>
                        <th className="text-right py-2 px-3 whitespace-nowrap shrink-0">{ui.accountant.journals.debitAmount}</th>
                        <th className="text-right py-2 px-3 whitespace-nowrap shrink-0">{ui.accountant.journals.creditAmount}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {entry.lines.map((line, idx) => (
                        <tr key={idx} className="text-slate-700">
                          <td className="py-2 px-3 font-mono text-slate-500 whitespace-nowrap shrink-0">{line.accountCode}</td>
                          <td className="py-2 px-3 break-words leading-relaxed">{line.accountName}</td>
                          <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-900 whitespace-nowrap shrink-0">
                            {line.debit > 0 ? formatCurrency(line.debit) : ui.common.symbolDash}
                          </td>
                          <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-900 whitespace-nowrap shrink-0">
                            {line.credit > 0 ? formatCurrency(line.credit) : ui.common.symbolDash}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-slate-200 font-semibold text-slate-900">
                        <td colSpan={2} className="py-2.5 px-3 text-right whitespace-nowrap shrink-0">
                          {ui.common.total}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums whitespace-nowrap shrink-0">
                          {formatCurrency(entryDebit)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums whitespace-nowrap shrink-0">
                          {formatCurrency(entryDebit)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Journal Entry Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={ui.accountant.journals.newEntry}
        maxWidth="max-w-3xl"
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
              disabled={!isBalanced || !description.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {ui.common.save}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1 whitespace-nowrap shrink-0">
              {ui.accountant.journals.reference}
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder={ui.accountant.journals.reference}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md outline-hidden focus:border-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1 whitespace-nowrap shrink-0">
              {ui.accountant.journals.description}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={ui.accountant.journals.description}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md outline-hidden focus:border-sky-500"
            />
          </div>
        </div>

        {/* Line items */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800 whitespace-nowrap shrink-0">
              {ui.common.itemUnit}
            </span>
            <button
              type="button"
              onClick={addLine}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap shrink-0">{ui.accountant.journals.addLine}</span>
            </button>
          </div>

          <div className="space-y-3">
            {lines.map((l, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
              >
                <select
                  value={l.accountCode}
                  onChange={(e) => handleLineChange(idx, 'accountCode', e.target.value)}
                  className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-md flex-1 outline-hidden bg-white"
                >
                  {accounts.map((acc) => (
                    <option key={acc.code} value={acc.code}>
                      {acc.code} {acc.name}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={l.debit || ''}
                    onChange={(e) => handleLineChange(idx, 'debit', parseFloat(e.target.value) || 0)}
                    placeholder={ui.common.debit}
                    className="w-full sm:w-28 text-xs px-2.5 py-1.5 border border-slate-300 rounded-md text-right font-mono bg-white"
                  />

                  <input
                    type="number"
                    step="0.01"
                    value={l.credit || ''}
                    onChange={(e) => handleLineChange(idx, 'credit', parseFloat(e.target.value) || 0)}
                    placeholder={ui.common.credit}
                    className="w-full sm:w-28 text-xs px-2.5 py-1.5 border border-slate-300 rounded-md text-right font-mono bg-white"
                  />

                  <button
                    type="button"
                    onClick={() => removeLine(idx)}
                    disabled={lines.length <= 2}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer shrink-0"
                    title={ui.common.delete}
                  >
                    <span className="text-xs font-medium whitespace-nowrap shrink-0">{ui.common.delete}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Balance Summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 whitespace-nowrap shrink-0">{ui.accountant.journals.totalDebit}</span>
            <span className="text-slate-400 shrink-0">{ui.common.symbolColon}</span>
            <span className="font-mono font-semibold text-slate-900 tabular-nums whitespace-nowrap shrink-0">
              {formatCurrency(totalDebit)} {ui.common.currencyUnit}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 whitespace-nowrap shrink-0">{ui.accountant.journals.totalCredit}</span>
            <span className="text-slate-400 shrink-0">{ui.common.symbolColon}</span>
            <span className="font-mono font-semibold text-slate-900 tabular-nums whitespace-nowrap shrink-0">
              {formatCurrency(totalCredit)} {ui.common.currencyUnit}
            </span>
          </div>

          <div>
            <span
              className={`font-semibold px-2 py-1 rounded text-xs inline-block whitespace-nowrap shrink-0 ${
                isBalanced
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {isBalanced
                ? ui.accountant.journals.balanced
                : ui.accountant.journals.unbalanced}
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
};
