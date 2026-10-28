export const ROUTES = {
  PUBLIC: {
    LOGIN: '/login',
    UNAUTHORIZED: '/unauthorized',
    NOT_FOUND: '*'
  },
  ACCOUNTANT: {
    ROOT: '/accountant',
    DASHBOARD: '/accountant/dashboard',
    CHART_OF_ACCOUNTS: '/accountant/chart-of-accounts',
    GENERAL_JOURNAL: '/accountant/general-journal',
    TRIAL_BALANCE: '/accountant/trial-balance',
    FINANCIAL_STATEMENTS: '/accountant/financial-statements'
  },
  FINANCE: {
    ROOT: '/finance',
    DASHBOARD: '/finance/dashboard',
    INVOICES: '/finance/invoices',
    BILLS: '/finance/bills',
    BANK_ACCOUNTS: '/finance/bank-accounts',
    RECONCILIATION: '/finance/reconciliation'
  },
  AUDITOR: {
    ROOT: '/auditor',
    DASHBOARD: '/auditor/dashboard',
    FINANCIAL_RATIOS: '/auditor/financial-ratios',
    AUDIT_TRAIL: '/auditor/audit-trail',
    COMPLIANCE: '/auditor/compliance'
  },
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    USER_MANAGEMENT: '/admin/user-management',
    SETTINGS: '/admin/settings',
    SYSTEM_HEALTH: '/admin/system-health'
  }
} as const;
