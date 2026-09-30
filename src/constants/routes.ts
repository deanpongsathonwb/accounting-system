export const APP_ROUTES = {
  PUBLIC: '/',
  LOGIN: '/login',
  ACCOUNTANT: {
    ROOT: '/accountant',
    JOURNALS: '/accountant/journals',
    ACCOUNTS: '/accountant/accounts',
    LEDGER: '/accountant/ledger',
    TRIAL_BALANCE: '/accountant/trial-balance',
  },
  AUDITOR: {
    ROOT: '/auditor',
    FINANCIAL_STATEMENTS: '/auditor/financial-statements',
    RECONCILIATION: '/auditor/reconciliation',
    TAX: '/auditor/tax',
    CLOSING: '/auditor/closing',
  },
  BILLING: {
    ROOT: '/billing',
    INVOICES: '/billing/invoices',
    RECEIPTS: '/billing/receipts',
    AGING: '/billing/aging',
    CUSTOMERS: '/billing/customers',
  },
  ADMIN: {
    ROOT: '/admin',
    CONFIGURATION: '/admin/configuration',
    USERS: '/admin/users',
    AUDIT: '/admin/audit',
    MAINTENANCE: '/admin/maintenance',
  },
} as const;
