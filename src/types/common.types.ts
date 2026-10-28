export type UserRole = 'accountant' | 'finance' | 'auditor' | 'admin';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  email: string;
  avatarKey: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
export type NormalBalance = 'debit' | 'credit';

export interface AccountItem {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  normalBalance: NormalBalance;
  balance: number;
  status: 'active' | 'inactive';
}

export interface JournalLine {
  accountId: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  journalNumber: string;
  date: string;
  memo: string;
  status: 'draft' | 'posted' | 'void';
  createdBy: string;
  lines: JournalLine[];
}

export interface InvoiceItem {
  id: string;
  invoiceNo: string;
  customer: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  vatAmount: number;
  grandTotal: number;
  status: 'pending' | 'paid' | 'overdue' | 'void';
  description: string;
}

export interface BillItem {
  id: string;
  billNo: string;
  vendor: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  vatAmount: number;
  grandTotal: number;
  status: 'pending' | 'paid' | 'overdue' | 'void';
  description: string;
}

export interface BankAccountItem {
  id: string;
  bankName: string;
  branch: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  lastReconciled: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  actionType: string;
  entity: string;
  ipAddress: string;
}

export interface SystemSettings {
  systemOwner: string;
  taxId: string;
  fiscalYear: string;
  accountingMethod: string;
  defaultVatRate: number;
  withholdingTaxRate: number;
  allowBackdatedEntries: boolean;
  requireDoubleApproval: boolean;
  autoJournalNumbering: boolean;
  invoicePrefix: string;
  billPrefix: string;
  journalPrefix: string;
  currencyCode: string;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'security';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  link?: string;
  targetRole?: UserRole | 'all';
}

