import React, { useState } from 'react';
import { Plus, Search, Filter, FileCheck2, CheckCircle } from 'lucide-react';
import { Header } from '../../components/layout/Header.tsx';
import { EmptyState, Modal } from '../../components/feedback/index.ts';
import { DatePicker } from '../../components/common/index.ts';
import { UI } from '../../constants/index.ts';
import { useAppStore } from '../../stores/app.store.ts';
import { BillItem } from '../../types/common.types.ts';
import { formatCurrency } from '../../utils/format.ts';

export const BillsPage: React.FC = () => {
  const bills = useAppStore((state) => state.bills);
  const settings = useAppStore((state) => state.settings);
  const addBill = useAppStore((state) => state.addBill);
  const updateBillStatus = useAppStore((state) => state.updateBillStatus);
  const addNotification = useAppStore((state) => state.addNotification);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New bill state
  const [vendor, setVendor] = useState('');
  const [description, setDescription] = useState('');
  const [subtotalStr, setSubtotalStr] = useState('');
  const [dueDate, setDueDate] = useState(UI.defaults.billDueDate);

  const subtotal = parseFloat(subtotalStr) || 0;
  const vatAmount = (subtotal * settings.defaultVatRate) / 100;
  const grandTotal = subtotal + vatAmount;

  // KPI Metrics Calculation
  const totalCount = bills.length;
  const totalAmount = bills.reduce((s, b) => s + b.grandTotal, 0);

  const pendingBills = bills.filter((b) => b.status === 'pending');
  const pendingCount = pendingBills.length;
  const pendingAmount = pendingBills.reduce((s, b) => s + b.grandTotal, 0);

  const paidBills = bills.filter((b) => b.status === 'paid');
  const paidCount = paidBills.length;
  const paidAmount = paidBills.reduce((s, b) => s + b.grandTotal, 0);

  const filtered = bills.filter((b) => {
    const matchesSearch =
      b.billNo.toLowerCase().includes(search.toLowerCase()) ||
      b.vendor.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor || subtotal <= 0) return;

    const nextNo = `${settings.billPrefix}${String(bills.length + 1).padStart(3, '0')}`;
    const newBillItem: BillItem = {
      id: `bill-${Date.now()}`,
      billNo: nextNo,
      vendor,
      issueDate: UI.defaults.currentDate,
      dueDate,
      subtotal,
      vatAmount,
      grandTotal,
      status: 'pending',
      description
    };

    addBill(newBillItem);
    addNotification({
      title: `${UI.finance.newBill}: ${nextNo}`,
      message: `${vendor} • ${UI.common.total} ${grandTotal.toLocaleString()} ${UI.units.baht}`,
      type: 'warning',
      link: '/finance/bills',
      targetRole: 'finance'
    });

    setIsModalOpen(false);
    setVendor('');
    setDescription('');
    setSubtotalStr('');
  };

  const handleRecordDisbursement = (b: BillItem) => {
    updateBillStatus(b.id, 'paid');
    addNotification({
      title: `${UI.finance.recordDisbursement}: ${b.billNo}`,
      message: `${b.vendor} • ${UI.common.amount} ${b.grandTotal.toLocaleString()} ${UI.units.baht}`,
      type: 'success',
      link: '/finance/bills',
      targetRole: 'all'
    });
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title={UI.finance.billsTitle}
        subtitle={UI.finance.billsSubtitle}
      />

      <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-full">
        {/* Responsive SaaS-Grade KPI Metric Card Deck with Subtle Status Dots */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* Card: All */}
          <button
            type="button"
            role="button"
            aria-pressed={statusFilter === 'all'}
            onClick={() => setStatusFilter('all')}
            className={`p-4 rounded-xl border text-left transition-all ${
              statusFilter === 'all'
                ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-600/20 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
              <span>{UI.common.all}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              {totalCount}
            </div>
            <div className="text-xs text-slate-500 font-medium font-mono mt-1 break-words">
              {formatCurrency(totalAmount)}
            </div>
          </button>

          {/* Card: Pending */}
          <button
            type="button"
            role="button"
            aria-pressed={statusFilter === 'pending'}
            onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
            className={`p-4 rounded-xl border text-left transition-all ${
              statusFilter === 'pending'
                ? 'bg-amber-50/70 border-amber-600 ring-2 ring-amber-600/20 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
              <span>{UI.common.pending}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              {pendingCount}
            </div>
            <div className="text-xs text-amber-600 font-medium font-mono mt-1 break-words">
              {formatCurrency(pendingAmount)}
            </div>
          </button>

          {/* Card: Paid */}
          <button
            type="button"
            role="button"
            aria-pressed={statusFilter === 'paid'}
            onClick={() => setStatusFilter(statusFilter === 'paid' ? 'all' : 'paid')}
            className={`p-4 rounded-xl border text-left transition-all ${
              statusFilter === 'paid'
                ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-600/20 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
              <span>{UI.common.paid}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              {paidCount}
            </div>
            <div className="text-xs text-emerald-600 font-medium font-mono mt-1 break-words">
              {formatCurrency(paidAmount)}
            </div>
          </button>
        </div>

        {/* Action Toolbar */}
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
              <label htmlFor="bill-status-filter" className="sr-only">
                {UI.common.filter}
              </label>
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                id="bill-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label={UI.common.filter}
                className="w-full sm:w-auto text-sm font-semibold border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">{UI.common.all}</option>
                <option value="pending">{UI.common.pending}</option>
                <option value="paid">{UI.common.paid}</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{UI.finance.newBill}</span>
          </button>
        </div>

        {/* Bills Table & Stacked Cards */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
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
                      <th className="py-3 px-4">{UI.finance.billNo}</th>
                      <th className="py-3 px-4">{UI.finance.vendor}</th>
                      <th className="py-3 px-4">{UI.finance.issueDate}</th>
                      <th className="py-3 px-4">{UI.finance.dueDate}</th>
                      <th className="py-3 px-4 text-right">{UI.finance.subtotal}</th>
                      <th className="py-3 px-4 text-right">{UI.finance.grandTotal}</th>
                      <th className="py-3 px-4 text-center">{UI.common.status}</th>
                      <th className="py-3 px-4 text-center">{UI.common.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/70">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {b.billNo}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-medium text-slate-800">{b.vendor}</p>
                          <p className="text-xs text-slate-500">{b.description}</p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 text-xs">{b.issueDate}</td>
                        <td className="py-3.5 px-4 text-slate-600 text-xs">{b.dueDate}</td>
                        <td className="py-3.5 px-4 text-right font-mono text-slate-700">
                          {formatCurrency(b.subtotal)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                          {formatCurrency(b.grandTotal)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                b.status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                            />
                            <span>{b.status === 'paid' ? UI.common.paid : UI.common.pending}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {b.status !== 'paid' ? (
                            <button
                              onClick={() => handleRecordDisbursement(b)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>{UI.finance.recordDisbursement}</span>
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium">{UI.common.emptyValue}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Card View */}
              <div className="md:hidden divide-y divide-slate-100">
                {filtered.map((b) => (
                  <div key={b.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-xs font-bold text-blue-700 block">{b.billNo}</span>
                        <h4 className="font-semibold text-slate-900 text-sm break-words">{b.vendor}</h4>
                        {b.description && <p className="text-xs text-slate-500 mt-0.5">{b.description}</p>}
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 shrink-0">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            b.status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        <span>{b.status === 'paid' ? UI.common.paid : UI.common.pending}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-2 border-t border-slate-50">
                      <div>
                        <span className="block text-[11px] text-slate-400">{UI.finance.issueDate}</span>
                        <span className="font-medium text-slate-700">{b.issueDate}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] text-slate-400">{UI.finance.dueDate}</span>
                        <span className="font-medium text-slate-700">{b.dueDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                      <div>
                        <span className="block text-[11px] text-slate-400">{UI.finance.grandTotal}</span>
                        <span className="font-mono text-base font-bold text-slate-900">{formatCurrency(b.grandTotal)}</span>
                      </div>
                      {b.status !== 'paid' && (
                        <button
                          onClick={() => handleRecordDisbursement(b)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{UI.finance.recordDisbursement}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* New Bill Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={UI.finance.newBill}
        icon={<FileCheck2 className="w-5 h-5 text-blue-600" />}
        maxWidth="lg"
      >
        <form onSubmit={handleCreate} className="space-y-4 max-w-full">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {UI.finance.vendor}
            </label>
            <input
              type="text"
              required
              placeholder={UI.finance.vendor}
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {UI.finance.subtotal}
              </label>
              <input
                type="number"
                min="0"
                step="any"
                required
                placeholder={UI.common.zeroAmount}
                value={subtotalStr}
                onChange={(e) => setSubtotalStr(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {UI.finance.dueDate}
              </label>
              <DatePicker
                value={dueDate}
                onChange={(newDate) => setDueDate(newDate)}
                placeholder={UI.finance.dueDate}
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1 font-mono">
            <div className="flex justify-between text-slate-600">
              <span>{UI.finance.vatAmount}:</span>
              <span>{formatCurrency(vatAmount)}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
              <span>{UI.finance.grandTotal}:</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
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
