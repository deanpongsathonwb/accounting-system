import React, { useState } from 'react';
import { Plus, Search, Filter, Receipt, CheckCircle } from 'lucide-react';
import { Header } from '../../components/layout/Header.tsx';
import { EmptyState, Modal } from '../../components/feedback/index.ts';
import { DatePicker } from '../../components/common/index.ts';
import { UI } from '../../constants/index.ts';
import { useAppStore } from '../../stores/app.store.ts';
import { InvoiceItem } from '../../types/common.types.ts';
import { formatCurrency } from '../../utils/format.ts';

export const InvoicesPage: React.FC = () => {
  const invoices = useAppStore((state) => state.invoices);
  const settings = useAppStore((state) => state.settings);
  const addInvoice = useAppStore((state) => state.addInvoice);
  const updateInvoiceStatus = useAppStore((state) => state.updateInvoiceStatus);
  const addNotification = useAppStore((state) => state.addNotification);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New invoice state
  const [customer, setCustomer] = useState('');
  const [description, setDescription] = useState('');
  const [subtotalStr, setSubtotalStr] = useState('');
  const [dueDate, setDueDate] = useState(UI.defaults.invoiceDueDate);

  const subtotal = parseFloat(subtotalStr) || 0;
  const vatAmount = (subtotal * settings.defaultVatRate) / 100;
  const grandTotal = subtotal + vatAmount;

  // KPI Metrics Calculation
  const totalCount = invoices.length;
  const totalAmount = invoices.reduce((s, i) => s + i.grandTotal, 0);

  const paidInvoices = invoices.filter((i) => i.status === 'paid');
  const paidCount = paidInvoices.length;
  const paidAmount = paidInvoices.reduce((s, i) => s + i.grandTotal, 0);

  const pendingInvoices = invoices.filter((i) => i.status === 'pending');
  const pendingCount = pendingInvoices.length;
  const pendingAmount = pendingInvoices.reduce((s, i) => s + i.grandTotal, 0);

  const overdueInvoices = invoices.filter((i) => i.status === 'overdue');
  const overdueCount = overdueInvoices.length;
  const overdueAmount = overdueInvoices.reduce((s, i) => s + i.grandTotal, 0);

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || subtotal <= 0) return;

    const nextNo = `${settings.invoicePrefix}${String(invoices.length + 1).padStart(3, '0')}`;
    const newInv: InvoiceItem = {
      id: `inv-${Date.now()}`,
      invoiceNo: nextNo,
      customer,
      issueDate: UI.defaults.currentDate,
      dueDate,
      subtotal,
      vatAmount,
      grandTotal,
      status: 'pending',
      description
    };

    addInvoice(newInv);
    addNotification({
      title: `${UI.finance.newInvoice}: ${nextNo}`,
      message: `${customer} • ${UI.common.total} ${grandTotal.toLocaleString()} ${UI.units.baht}`,
      type: 'info',
      link: '/finance/invoices',
      targetRole: 'finance'
    });

    setIsModalOpen(false);
    setCustomer('');
    setDescription('');
    setSubtotalStr('');
  };

  const handleRecordPayment = (inv: InvoiceItem) => {
    updateInvoiceStatus(inv.id, 'paid');
    addNotification({
      title: `${UI.finance.recordPayment}: ${inv.invoiceNo}`,
      message: `${inv.customer} • ${UI.common.amount} ${inv.grandTotal.toLocaleString()} ${UI.units.baht}`,
      type: 'success',
      link: '/finance/invoices',
      targetRole: 'all'
    });
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title={UI.finance.invoicesTitle}
        subtitle={UI.finance.invoicesSubtitle}
      />

      <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-full">
        {/* Responsive SaaS-Grade KPI Metric Card Deck with Subtle Status Dots */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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

          {/* Card: Overdue */}
          <button
            type="button"
            role="button"
            aria-pressed={statusFilter === 'overdue'}
            onClick={() => setStatusFilter(statusFilter === 'overdue' ? 'all' : 'overdue')}
            className={`p-4 rounded-xl border text-left transition-all ${
              statusFilter === 'overdue'
                ? 'bg-rose-50/70 border-rose-600 ring-2 ring-rose-600/20 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
              <span>{UI.common.overdue}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              {overdueCount}
            </div>
            <div className="text-xs text-rose-600 font-medium font-mono mt-1 break-words">
              {formatCurrency(overdueAmount)}
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
              <label htmlFor="invoice-status-filter" className="sr-only">
                {UI.common.filter}
              </label>
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                id="invoice-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label={UI.common.filter}
                className="w-full sm:w-auto text-sm font-semibold border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">{UI.common.all}</option>
                <option value="pending">{UI.common.pending}</option>
                <option value="paid">{UI.common.paid}</option>
                <option value="overdue">{UI.common.overdue}</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{UI.finance.newInvoice}</span>
          </button>
        </div>

        {/* Invoices Table & Stacked Cards */}
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
                      <th className="py-3 px-4">{UI.finance.invoiceNo}</th>
                      <th className="py-3 px-4">{UI.finance.customer}</th>
                      <th className="py-3 px-4">{UI.finance.issueDate}</th>
                      <th className="py-3 px-4">{UI.finance.dueDate}</th>
                      <th className="py-3 px-4 text-right">{UI.finance.subtotal}</th>
                      <th className="py-3 px-4 text-right">{UI.finance.grandTotal}</th>
                      <th className="py-3 px-4 text-center">{UI.common.status}</th>
                      <th className="py-3 px-4 text-center">{UI.common.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/70">
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                          {inv.invoiceNo}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-medium text-slate-800">{inv.customer}</p>
                          <p className="text-xs text-slate-500">{inv.description}</p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 text-xs">{inv.issueDate}</td>
                        <td className="py-3.5 px-4 text-slate-600 text-xs">{inv.dueDate}</td>
                        <td className="py-3.5 px-4 text-right font-mono text-slate-700">
                          {formatCurrency(inv.subtotal)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                          {formatCurrency(inv.grandTotal)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                inv.status === 'paid'
                                  ? 'bg-emerald-500'
                                  : inv.status === 'overdue'
                                  ? 'bg-rose-500'
                                  : 'bg-amber-500'
                              }`}
                            />
                            <span>
                              {inv.status === 'paid'
                                ? UI.common.paid
                                : inv.status === 'overdue'
                                ? UI.common.overdue
                                : UI.common.pending}
                            </span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {inv.status !== 'paid' ? (
                            <button
                              onClick={() => handleRecordPayment(inv)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>{UI.finance.recordPayment}</span>
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
                {filtered.map((inv) => (
                  <div key={inv.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-xs font-bold text-blue-700 block">{inv.invoiceNo}</span>
                        <h4 className="font-semibold text-slate-900 text-sm break-words">{inv.customer}</h4>
                        {inv.description && <p className="text-xs text-slate-500 mt-0.5">{inv.description}</p>}
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 shrink-0">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            inv.status === 'paid'
                              ? 'bg-emerald-500'
                              : inv.status === 'overdue'
                              ? 'bg-rose-500'
                              : 'bg-amber-500'
                          }`}
                        />
                        <span>
                          {inv.status === 'paid'
                            ? UI.common.paid
                            : inv.status === 'overdue'
                            ? UI.common.overdue
                            : UI.common.pending}
                        </span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-2 border-t border-slate-50">
                      <div>
                        <span className="block text-[11px] text-slate-400">{UI.finance.issueDate}</span>
                        <span className="font-medium text-slate-700">{inv.issueDate}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] text-slate-400">{UI.finance.dueDate}</span>
                        <span className="font-medium text-slate-700">{inv.dueDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                      <div>
                        <span className="block text-[11px] text-slate-400">{UI.finance.grandTotal}</span>
                        <span className="font-mono text-base font-bold text-slate-900">{formatCurrency(inv.grandTotal)}</span>
                      </div>
                      {inv.status !== 'paid' && (
                        <button
                          onClick={() => handleRecordPayment(inv)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{UI.finance.recordPayment}</span>
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

      {/* New Invoice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={UI.finance.newInvoice}
        icon={<Receipt className="w-5 h-5 text-blue-600" />}
        maxWidth="lg"
      >
        <form onSubmit={handleCreate} className="space-y-4 max-w-full">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {UI.finance.customer}
            </label>
            <input
              type="text"
              required
              placeholder={UI.finance.customer}
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
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

          {/* Automatic Calculation Preview */}
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
