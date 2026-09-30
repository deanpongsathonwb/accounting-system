import React from 'react';
import { ui } from '../../constants/index.ts';
import type { Receipt } from '../../types/common.types.ts';
import { formatCurrency } from '../../utils/format.ts';
import { renderSemantic } from '../../utils/text.tsx';

interface ReceiptsPageProps {
  receipts: Receipt[];
}

export const ReceiptsPage: React.FC<ReceiptsPageProps> = ({ receipts }) => {
  return (
    <div className="space-y-4 sm:space-y-6 max-w-full">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug break-words">
          {renderSemantic(ui.billing.receipts.title)}
        </h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed break-words">
          {renderSemantic(ui.billing.receipts.description)}
        </p>
      </div>

      {/* Receipts List: Responsive Card View on Mobile, Table on Tablet/Desktop */}
      <div className="md:hidden space-y-3">
        {receipts.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-6 text-center text-xs text-slate-500 break-words">
            {ui.common.emptyData}
          </div>
        ) : (
          receipts.map((rc) => (
            <div
              key={rc.receiptNumber}
              className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-mono font-bold text-slate-900 whitespace-nowrap shrink-0">
                    {rc.receiptNumber}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono whitespace-nowrap shrink-0 mt-0.5">
                    {rc.invoiceNumber}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-slate-400 block text-[11px] whitespace-nowrap shrink-0">
                    {ui.billing.receipts.amountReceived}
                  </span>
                  <span className="font-mono font-bold text-sm text-emerald-700 tabular-nums whitespace-nowrap shrink-0">
                    {formatCurrency(rc.amount)} {ui.common.currencyUnit}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-800 font-medium break-words leading-relaxed">
                {rc.customerName}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[11px] whitespace-nowrap shrink-0">
                    {ui.billing.receipts.paidDate}
                  </span>
                  <span className="font-mono text-slate-600 whitespace-nowrap shrink-0">
                    {rc.date}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] whitespace-nowrap shrink-0">
                    {ui.billing.receipts.paymentMethod}
                  </span>
                  <span className="text-slate-700 font-medium whitespace-nowrap shrink-0">
                    {rc.paymentMethod}
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
              <th className="text-left px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.billing.receipts.receiptNumber}
              </th>
              <th className="text-left px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.billing.invoices.invoiceNumber}
              </th>
              <th className="text-left px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.billing.invoices.customer}
              </th>
              <th className="text-left px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.billing.receipts.paidDate}
              </th>
              <th className="text-left px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.billing.receipts.paymentMethod}
              </th>
              <th className="text-right px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.billing.receipts.amountReceived}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {receipts.map((rc) => (
              <tr key={rc.receiptNumber} className="hover:bg-slate-50 transition-colors">
                <td className="px-3 sm:px-4 py-3 font-mono font-semibold text-slate-900 whitespace-nowrap shrink-0">
                  {rc.receiptNumber}
                </td>
                <td className="px-3 sm:px-4 py-3 font-mono text-slate-600 whitespace-nowrap shrink-0">
                  {rc.invoiceNumber}
                </td>
                <td className="px-3 sm:px-4 py-3 font-medium text-slate-800 break-words leading-relaxed">
                  {rc.customerName}
                </td>
                <td className="px-3 sm:px-4 py-3 font-mono text-slate-600 whitespace-nowrap shrink-0">
                  {rc.date}
                </td>
                <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap shrink-0">
                  {rc.paymentMethod}
                </td>
                <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums font-bold text-emerald-700 whitespace-nowrap shrink-0">
                  {formatCurrency(rc.amount)} {ui.common.currencyUnit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
