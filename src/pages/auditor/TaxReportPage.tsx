import React from 'react';
import { ui } from '../../constants/index.ts';
import { formatCurrency } from '../../utils/format.ts';
import type { Invoice } from '../../types/common.types.ts';
import { renderSemantic } from '../../utils/text.tsx';

interface TaxReportPageProps {
  invoices: Invoice[];
  taxSummary: {
    outputTaxTotal: number;
    inputTaxTotal: number;
    netTaxPayable: number;
    filingPeriod: string;
  };
}

export const TaxReportPage: React.FC<TaxReportPageProps> = ({ invoices, taxSummary }) => {
  return (
    <div className="space-y-4 sm:space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug break-words">
            {renderSemantic(ui.auditor.tax.title)}
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed break-words">
            {renderSemantic(ui.auditor.tax.description)}
          </p>
        </div>

        <div className="self-start sm:self-center">
          <div className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-md border border-slate-200 flex items-center gap-1.5 shadow-xs whitespace-nowrap shrink-0">
            <span className="whitespace-nowrap shrink-0">{ui.common.periodPrefix}</span>
            <span className="font-mono font-medium whitespace-nowrap shrink-0">{taxSummary.filingPeriod}</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
        <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium whitespace-nowrap shrink-0">{ui.auditor.tax.outputTax}</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums whitespace-nowrap shrink-0">
            {formatCurrency(taxSummary.outputTaxTotal)} {ui.common.currencyUnit}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium whitespace-nowrap shrink-0">{ui.auditor.tax.inputTax}</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums whitespace-nowrap shrink-0">
            {formatCurrency(taxSummary.inputTaxTotal)} {ui.common.currencyUnit}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium whitespace-nowrap shrink-0">{ui.auditor.tax.netTaxPayable}</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-sky-700 mt-1 tabular-nums whitespace-nowrap shrink-0">
            {formatCurrency(taxSummary.netTaxPayable)} {ui.common.currencyUnit}
          </div>
        </div>
      </div>

      {/* Tax Invoices: Responsive Card View on Mobile, Table on Tablet/Desktop */}
      <div className="md:hidden space-y-3">
        <div className="px-1 py-1 font-bold text-xs text-slate-900 whitespace-nowrap shrink-0">
          {ui.auditor.tax.outputTax}
        </div>
        {invoices.map((inv) => (
          <div
            key={inv.invoiceNumber}
            className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs font-mono font-bold text-slate-900 whitespace-nowrap shrink-0">
                  {inv.invoiceNumber}
                </div>
                <div className="text-[11px] text-slate-500 font-mono tabular-nums whitespace-nowrap shrink-0 mt-0.5">
                  {inv.issueDate}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-slate-400 block text-[11px] whitespace-nowrap shrink-0">
                  {ui.auditor.tax.taxAmount}
                </span>
                <span className="font-mono font-bold text-xs text-slate-900 tabular-nums whitespace-nowrap shrink-0">
                  {formatCurrency(inv.vat)} {ui.common.currencyUnit}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
              <span className="text-slate-800 font-medium break-words leading-relaxed">
                {inv.customerName}
              </span>
              <div className="text-right shrink-0">
                <span className="text-slate-400 block text-[11px] whitespace-nowrap shrink-0">
                  {ui.auditor.tax.taxableAmount}
                </span>
                <span className="font-mono text-slate-700 tabular-nums whitespace-nowrap shrink-0">
                  {formatCurrency(inv.subtotal)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop / Tablet Table */}
      <div className="hidden md:block bg-white rounded-lg border border-slate-200 overflow-x-auto shadow-xs">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-900 whitespace-nowrap shrink-0">
          {ui.auditor.tax.outputTax}
        </div>
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr>
              <th className="text-left px-3 sm:px-4 py-2.5 font-semibold whitespace-nowrap shrink-0">{ui.common.date}</th>
              <th className="text-left px-3 sm:px-4 py-2.5 font-semibold whitespace-nowrap shrink-0">
                {ui.auditor.tax.invoiceNumber}
              </th>
              <th className="text-left px-3 sm:px-4 py-2.5 font-semibold whitespace-nowrap shrink-0">{ui.billing.invoices.customer}</th>
              <th className="text-right px-3 sm:px-4 py-2.5 font-semibold whitespace-nowrap shrink-0">
                {ui.auditor.tax.taxableAmount}
              </th>
              <th className="text-right px-3 sm:px-4 py-2.5 font-semibold whitespace-nowrap shrink-0">
                {ui.auditor.tax.taxAmount}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((inv) => (
              <tr key={inv.invoiceNumber} className="hover:bg-slate-50 transition-colors">
                <td className="px-3 sm:px-4 py-2.5 font-mono text-slate-600 whitespace-nowrap shrink-0">{inv.issueDate}</td>
                <td className="px-3 sm:px-4 py-2.5 font-mono font-medium text-slate-900 whitespace-nowrap shrink-0">
                  {inv.invoiceNumber}
                </td>
                <td className="px-3 sm:px-4 py-2.5 text-slate-800 break-words leading-relaxed">{inv.customerName}</td>
                <td className="px-3 sm:px-4 py-2.5 text-right font-mono tabular-nums text-slate-900 whitespace-nowrap shrink-0">
                  {formatCurrency(inv.subtotal)}
                </td>
                <td className="px-3 sm:px-4 py-2.5 text-right font-mono tabular-nums text-slate-900 font-semibold whitespace-nowrap shrink-0">
                  {formatCurrency(inv.vat)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
