import React from 'react';
import { ui } from '../../constants/index.ts';
import { formatCurrency } from '../../utils/format.ts';
import type { Customer } from '../../types/common.types.ts';
import imagesData from '../../seed/images.json';
import { renderSemantic } from '../../utils/text.tsx';

interface CustomersPageProps {
  customers: Customer[];
}

export const CustomersPage: React.FC<CustomersPageProps> = ({ customers }) => {
  return (
    <div className="space-y-4 sm:space-y-6 max-w-full">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug break-words">
          {renderSemantic(ui.billing.customers.title)}
        </h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed break-words">
          {renderSemantic(ui.billing.customers.description)}
        </p>
      </div>

      {/* Customers List: Responsive Card View on Mobile, Table on Tablet/Desktop */}
      <div className="md:hidden space-y-3">
        {customers.map((c) => {
          const logo =
            imagesData.customerLogos[c.logoKey as keyof typeof imagesData.customerLogos] ||
            imagesData.customerLogos.c001;
          return (
            <div
              key={c.code}
              className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={logo} alt={c.name} className="w-8 h-8 rounded-sm shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 break-words leading-snug">
                      {c.name}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 whitespace-nowrap shrink-0 mt-0.5">
                      {c.code}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-slate-400 block text-[11px] whitespace-nowrap shrink-0">
                    {ui.billing.customers.currentDebt}
                  </span>
                  <span className="font-mono font-bold text-xs text-slate-900 tabular-nums whitespace-nowrap shrink-0">
                    {formatCurrency(c.currentDebt)} {ui.common.currencyUnit}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[11px] whitespace-nowrap shrink-0">
                    {ui.billing.customers.contactPerson}
                  </span>
                  <span className="text-slate-700 font-medium break-words leading-relaxed">
                    {c.contactPerson}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] whitespace-nowrap shrink-0">
                    {ui.billing.customers.phone}
                  </span>
                  <span className="font-mono text-slate-700 whitespace-nowrap shrink-0">
                    {c.phone}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] whitespace-nowrap shrink-0">
                    {ui.billing.customers.taxId}
                  </span>
                  <span className="font-mono text-slate-600 whitespace-nowrap shrink-0">
                    {c.taxId}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] whitespace-nowrap shrink-0">
                    {ui.billing.customers.creditLimit}
                  </span>
                  <span className="font-mono text-slate-600 tabular-nums whitespace-nowrap shrink-0">
                    {formatCurrency(c.creditLimit)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop / Tablet Table */}
      <div className="hidden md:block bg-white rounded-lg border border-slate-200 overflow-x-auto shadow-xs">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr>
              <th className="text-left px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.billing.customers.customerCode}
              </th>
              <th className="text-left px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.billing.customers.companyName}
              </th>
              <th className="text-left px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.billing.customers.taxId}
              </th>
              <th className="text-left px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.billing.customers.contactPerson}
              </th>
              <th className="text-left px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.billing.customers.phone}
              </th>
              <th className="text-right px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.billing.customers.creditLimit}
              </th>
              <th className="text-right px-3 sm:px-4 py-3 font-semibold whitespace-nowrap shrink-0">
                {ui.billing.customers.currentDebt}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((c) => {
              const logo =
                imagesData.customerLogos[c.logoKey as keyof typeof imagesData.customerLogos] ||
                imagesData.customerLogos.c001;
              return (
                <tr key={c.code} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3 sm:px-4 py-3 font-mono font-semibold text-slate-900 whitespace-nowrap shrink-0">
                    {c.code}
                  </td>
                  <td className="px-3 sm:px-4 py-3 font-medium text-slate-800 break-words leading-relaxed">
                    <div className="flex items-center gap-2.5">
                      <img src={logo} alt={c.name} className="w-6 h-6 rounded-sm shrink-0" />
                      <span className="break-words">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3 font-mono text-slate-600 whitespace-nowrap shrink-0">
                    {c.taxId}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-slate-700 break-words leading-relaxed">
                    {c.contactPerson}
                  </td>
                  <td className="px-3 sm:px-4 py-3 font-mono text-slate-600 whitespace-nowrap shrink-0">
                    {c.phone}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-600 whitespace-nowrap shrink-0">
                    {formatCurrency(c.creditLimit)}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums font-bold text-slate-900 whitespace-nowrap shrink-0">
                    {formatCurrency(c.currentDebt)} {ui.common.currencyUnit}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
