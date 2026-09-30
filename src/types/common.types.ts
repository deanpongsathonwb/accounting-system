export type UserRole = 'accountant' | 'auditor' | 'billing' | 'admin';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  status: string;
  lastLogin: string;
}

export interface AccountItem {
  code: string;
  name: string;
  category: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  normalBalance: 'debit' | 'credit';
  balance: number;
  active: boolean;
}

export interface JournalLine {
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  reference: string;
  description: string;
  status: 'draft' | 'posted';
  lines: JournalLine[];
}

export interface Customer {
  code: string;
  name: string;
  taxId: string;
  creditLimit: number;
  currentDebt: number;
  phone: string;
  contactPerson: string;
  logoKey: string;
}

export interface Invoice {
  invoiceNumber: string;
  customerCode: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  vat: number;
  total: number;
  status: 'pending' | 'paid' | 'overdue';
}

export interface Receipt {
  receiptNumber: string;
  invoiceNumber: string;
  customerName: string;
  date: string;
  amount: number;
  paymentMethod: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
}

export interface SystemSettings {
  systemOwner: string;
  taxId: string;
  address: string;
  fiscalYear: number;
  taxRatePercent: number;
  withholdingTaxPercent: number;
  invoiceDueDays: number;
  autoPostJournals: boolean;
  accountingStandard: string;
}
