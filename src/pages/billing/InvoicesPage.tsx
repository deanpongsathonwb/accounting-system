import React, { useState } from 'react';
import { ui } from '../../constants/index.ts';
import type { Invoice } from '../../types/common.types.ts';
import { formatCurrency } from '../../utils/format.ts';
import { Search } from 'lucide-react';
import { renderSemantic } from '../../utils/text.tsx';

interface InvoicesPageProps {
  invoices: Invoice[];
  onMarkPaid: (invoiceNumber: string) => void;
}

export const InvoicesPage: React.FC<InvoicesPageProps> = ({ invoices, onMarkPaid }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 whitespace-nowrap shrink-0">
            {ui.billing.invoices.statusPaid}
          </span>
        );
      case 'overdue':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 whitespace-nowrap shrink-0">
            {ui.billing.invoices.statusOverdue}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 whitespace-nowrap shrink-0">
            {ui.billing.invoices.statusPending}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug break-words">
          {renderSemantic(ui.billing.invoices.title)}
        </h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed break-words">
          {renderSemantic(ui.billing.invoices.description)}
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center flex-wrap gap-1.5 p-1 bg-slate-100 rounded-md">
          <button
            onClick={() => setStatusFilter('all')}
            className={`inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
              statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            {ui.common.all}
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
              statusFilter === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            {ui.billing.invoices.statusPending}
          </button>
          <button
            onClick={() => setStatusFilter('overdue')}
            className={`inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
              statusFilter === 'overdue' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            {ui.billing.invoices.statusOverdue}
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
              statusFilter === 'paid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            {ui.billing.invoices.statusPaid}
          </button>
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

      {/* Invoices List: Responsive Card View on Mobile, Table on Tablet/Desktop */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-6 text-center text-xs text-slate-500 break-words">
            {ui.common.emptySearch}
          </div>
        ) : (
          filtered.map((inv) => (
            <div
              key={inv.invoiceNumber}
              className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-mono font-bold text-slate-900 whitespace-nowrap shrink-0">
                    {inv.invoiceNumber}
                  </div>
                  <div className="text-xs font-medium text-slate-800 break-words leading-relaxed mt-0.5">
                    {inv.customerName}
                  </div>
                </div>
                <div className="shrink-0">{getStatusBadge(inv.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[11px] whitespace-nowrap shrink-0">
                    {ui.billing.invoices.issueDate}
                  </span>
                  <span className="font-mono text-slate-600 whitespace-nowrap shrink-0">
                    {inv.issueDate}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] whitespace-nowrap shrink-0">
                    {ui.billing.invoices.dueDate}
                  </span>
                  <span className="font-mono text-slate-600 whitespace-nowrap shrink-0">
                    {inv.dueDate}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                <div>
                  <span className="text-slate-400 block text-[11px] whitespace-nowrap shrink-0">
                    {ui.billing.invoices.grandTotal}
                  </span>
                  <span className="font-mono font-bold text-sm text-slate-900 tabular-nums whitespace-nowrap shrink-0">
                    {formatCurrency(inv.total)} {ui.common.currencyUnit}
                  </span>
                </div>

                {inv.status !== 'paid' && (
                  <button
                    onClick={() => onMarkPaid(inv.invoiceNumber)}
                    className="inline-flex items-center justify-center px-3 py-1.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white rounded-lg text-xs font-semibold shadow-2xs hover:shadow-xs transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus:outline-hidden"
                  >
                    {ui.billing.invoices.markAsPaid}
                  </button>
                )}
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
                {ui.billing.invoices.invoiceNumber}
              </th>
              <th className="text-left px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.billing.invoices.customer}
              </th>
              <th className="text-left px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.billing.invoices.issueDate}
              </th>
              <th className="text-left px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.billing.invoices.dueDate}
              </th>
              <th className="text-right px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.billing.invoices.subtotal}
              </th>
              <th className="text-right px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.billing.invoices.vat}
              </th>
              <th className="text-right px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.billing.invoices.grandTotal}
              </th>
              <th className="text-center px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.common.status}
              </th>
              <th className="text-right px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.common.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((inv) => (
              <tr key={inv.invoiceNumber} className="hover:bg-slate-50 transition-colors">
                <td className="px-3 sm:px-4 py-3 font-mono font-semibold text-slate-900 whitespace-nowrap shrink-0">
                  {inv.invoiceNumber}
                </td>
                <td className="px-3 sm:px-4 py-3 font-medium text-slate-800 break-words leading-relaxed">
                  {inv.customerName}
                </td>
                <td className="px-3 sm:px-4 py-3 font-mono text-slate-600 whitespace-nowrap shrink-0">
                  {inv.issueDate}
                </td>
                <td className="px-3 sm:px-4 py-3 font-mono text-slate-600 whitespace-nowrap shrink-0">
                  {inv.dueDate}
                </td>
                <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-900 whitespace-nowrap shrink-0">
                  {formatCurrency(inv.subtotal)}
                </td>
                <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-600 whitespace-nowrap shrink-0">
                  {formatCurrency(inv.vat)}
                </td>
                <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums font-bold text-slate-900 whitespace-nowrap shrink-0">
                  {formatCurrency(inv.total)} {ui.common.currencyUnit}
                </td>
                <td className="px-3 sm:px-4 py-3 text-center whitespace-nowrap shrink-0">
                  {getStatusBadge(inv.status)}
                </td>
                <td className="px-3 sm:px-4 py-3 text-right whitespace-nowrap shrink-0">
                  {inv.status !== 'paid' && (
                    <button
                      onClick={() => onMarkPaid(inv.invoiceNumber)}
                      className="inline-flex items-center justify-center px-3 py-1.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white rounded-lg text-xs font-semibold shadow-2xs hover:shadow-xs transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus:outline-hidden"
                    >
                      {ui.billing.invoices.markAsPaid}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
