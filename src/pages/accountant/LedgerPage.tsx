import React, { useState } from 'react';
import { ui } from '../../constants/index.ts';
import type { AccountItem, JournalEntry } from '../../types/common.types.ts';
import { formatCurrency } from '../../utils/format.ts';
import { renderSemantic } from '../../utils/text.tsx';

interface LedgerPageProps {
  accounts: AccountItem[];
  journals: JournalEntry[];
}

export const LedgerPage: React.FC<LedgerPageProps> = ({ accounts, journals }) => {
  const [selectedAccountCode, setSelectedAccountCode] = useState<string>(accounts[0]?.code || '');

  const currentAccount = accounts.find((a) => a.code === selectedAccountCode) || accounts[0];

  // Find all journal lines targeting this account
  const ledgerLines: {
    entryNumber: string;
    date: string;
    description: string;
    reference: string;
    debit: number;
    credit: number;
  }[] = [];

  journals.forEach((j) => {
    j.lines.forEach((l) => {
      if (l.accountCode === selectedAccountCode) {
        ledgerLines.push({
          entryNumber: j.entryNumber,
          date: j.date,
          description: j.description,
          reference: j.reference,
          debit: l.debit,
          credit: l.credit,
        });
      }
    });
  });

  const totalDebit = ledgerLines.reduce((acc, cur) => acc + cur.debit, 0);
  const totalCredit = ledgerLines.reduce((acc, cur) => acc + cur.credit, 0);

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug break-words">
          {renderSemantic(ui.accountant.ledger.title)}
        </h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed break-words">
          {renderSemantic(ui.accountant.ledger.description)}
        </p>
      </div>

      {/* Account Selector */}
      <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto flex-1">
          <label className="text-xs font-semibold text-slate-700 whitespace-nowrap shrink-0">
            {renderSemantic(ui.accountant.ledger.selectAccount)}
          </label>
          <select
            value={selectedAccountCode}
            onChange={(e) => setSelectedAccountCode(e.target.value)}
            className="text-xs font-medium px-3 py-2 border border-slate-300 rounded-md outline-hidden bg-slate-50 w-full sm:max-w-md break-words"
          >
            {accounts.map((a) => (
              <option key={a.code} value={a.code}>
                {a.code} {a.name}
              </option>
            ))}
          </select>
        </div>

        {currentAccount && (
          <div className="flex items-center gap-1.5 text-xs self-start sm:self-center shrink-0">
            <span className="text-slate-500 whitespace-nowrap shrink-0">{ui.accountant.accounts.normalBalance}</span>
            <span className="text-slate-400 shrink-0">{ui.common.symbolColon}</span>
            <span className="font-semibold text-slate-800 whitespace-nowrap shrink-0">
              {currentAccount.normalBalance === 'debit' ? ui.common.debit : ui.common.credit}
            </span>
          </div>
        )}
      </div>

      {/* Ledger Cards & Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 whitespace-nowrap shrink-0">{ui.accountant.ledger.movementDebit}</div>
          <div className="text-base sm:text-lg font-bold font-mono text-slate-900 mt-1 tabular-nums whitespace-nowrap shrink-0">
            {formatCurrency(totalDebit)} {ui.common.currencyUnit}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 whitespace-nowrap shrink-0">{ui.accountant.ledger.movementCredit}</div>
          <div className="text-base sm:text-lg font-bold font-mono text-slate-900 mt-1 tabular-nums whitespace-nowrap shrink-0">
            {formatCurrency(totalCredit)} {ui.common.currencyUnit}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 whitespace-nowrap shrink-0">{ui.accountant.ledger.closingBalance}</div>
          <div className="text-base sm:text-lg font-bold font-mono text-sky-600 mt-1 tabular-nums whitespace-nowrap shrink-0">
            {currentAccount ? formatCurrency(currentAccount.balance) : formatCurrency(0)}{' '}
            {ui.common.currencyUnit}
          </div>
        </div>
      </div>

      {/* Ledger Transactions: Responsive Card View on Mobile, Table on Tablet/Desktop */}
      <div className="md:hidden space-y-3">
        {ledgerLines.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-6 text-center text-xs text-slate-500 break-words">
            {ui.common.emptyData}
          </div>
        ) : (
          ledgerLines.map((l, i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-mono font-bold text-slate-900 whitespace-nowrap shrink-0">
                    {l.entryNumber}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono tabular-nums whitespace-nowrap shrink-0 mt-0.5">
                    {l.date}
                  </div>
                </div>
                <div className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded whitespace-nowrap shrink-0">
                  {l.reference}
                </div>
              </div>

              <div className="text-xs text-slate-800 break-words leading-relaxed">
                {l.description}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[11px] whitespace-nowrap shrink-0">
                    {ui.accountant.journals.debitAmount}
                  </span>
                  <span className="font-mono tabular-nums text-slate-900 font-semibold whitespace-nowrap shrink-0">
                    {l.debit > 0 ? formatCurrency(l.debit) : ui.common.symbolDash}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] whitespace-nowrap shrink-0">
                    {ui.accountant.journals.creditAmount}
                  </span>
                  <span className="font-mono tabular-nums text-slate-900 font-semibold whitespace-nowrap shrink-0">
                    {l.credit > 0 ? formatCurrency(l.credit) : ui.common.symbolDash}
                  </span>
                </div>
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
              <th className="text-left px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">{ui.common.date}</th>
              <th className="text-left px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.accountant.journals.entryNumber}
              </th>
              <th className="text-left px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.accountant.journals.reference}
              </th>
              <th className="text-left px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">{ui.common.description}</th>
              <th className="text-right px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.accountant.journals.debitAmount}
              </th>
              <th className="text-right px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.accountant.journals.creditAmount}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ledgerLines.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400 break-words">
                  {ui.common.emptyData}
                </td>
              </tr>
            ) : (
              ledgerLines.map((l, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3 sm:px-4 py-2.5 font-mono text-slate-600 whitespace-nowrap shrink-0">{l.date}</td>
                  <td className="px-3 sm:px-4 py-2.5 font-mono font-medium text-slate-900 whitespace-nowrap shrink-0">
                    {l.entryNumber}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 text-slate-600 whitespace-nowrap shrink-0">{l.reference}</td>
                  <td className="px-3 sm:px-4 py-2.5 text-slate-800 break-words leading-relaxed">{l.description}</td>
                  <td className="px-3 sm:px-4 py-2.5 text-right font-mono tabular-nums text-slate-900 whitespace-nowrap shrink-0">
                    {l.debit > 0 ? formatCurrency(l.debit) : ui.common.symbolDash}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 text-right font-mono tabular-nums text-slate-900 whitespace-nowrap shrink-0">
                    {l.credit > 0 ? formatCurrency(l.credit) : ui.common.symbolDash}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {ledgerLines.length > 0 && (
            <tfoot>
              <tr className="border-t border-slate-200 bg-slate-50 font-semibold text-slate-900">
                <td colSpan={4} className="px-3 sm:px-4 py-2.5 text-right whitespace-nowrap shrink-0">
                  {ui.common.total}
                </td>
                <td className="px-3 sm:px-4 py-2.5 text-right font-mono tabular-nums whitespace-nowrap shrink-0">
                  {formatCurrency(totalDebit)}
                </td>
                <td className="px-3 sm:px-4 py-2.5 text-right font-mono tabular-nums whitespace-nowrap shrink-0">
                  {formatCurrency(totalCredit)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};
