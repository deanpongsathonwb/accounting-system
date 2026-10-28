import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/index.ts';
import { AuthGuard } from './guards/AuthGuard.tsx';
import { RoleGuard } from './guards/RoleGuard.tsx';
import { PortalRedirect } from './guards/PortalRedirect.tsx';
import { MainLayout } from '../components/layout/MainLayout.tsx';

// Public pages
import { LoginPage } from '../pages/public/LoginPage.tsx';
import { UnauthorizedPage } from '../pages/public/UnauthorizedPage.tsx';
import { NotFoundPage } from '../pages/public/NotFoundPage.tsx';

// Accountant pages
import { AccountantDashboardPage } from '../pages/accountant/AccountantDashboardPage.tsx';
import { ChartOfAccountsPage } from '../pages/accountant/ChartOfAccountsPage.tsx';
import { GeneralJournalPage } from '../pages/accountant/GeneralJournalPage.tsx';
import { TrialBalancePage } from '../pages/accountant/TrialBalancePage.tsx';
import { FinancialStatementsPage } from '../pages/accountant/FinancialStatementsPage.tsx';

// Finance pages
import { FinanceDashboardPage } from '../pages/finance/FinanceDashboardPage.tsx';
import { InvoicesPage } from '../pages/finance/InvoicesPage.tsx';
import { BillsPage } from '../pages/finance/BillsPage.tsx';
import { BankAccountsPage } from '../pages/finance/BankAccountsPage.tsx';
import { ReconciliationPage } from '../pages/finance/ReconciliationPage.tsx';

// Auditor pages
import { AuditorDashboardPage } from '../pages/auditor/AuditorDashboardPage.tsx';
import { FinancialRatiosPage } from '../pages/auditor/FinancialRatiosPage.tsx';
import { AuditTrailPage } from '../pages/auditor/AuditTrailPage.tsx';
import { CompliancePage } from '../pages/auditor/CompliancePage.tsx';

// Admin pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage.tsx';
import { UserManagementPage } from '../pages/admin/UserManagementPage.tsx';
import { SettingsPage } from '../pages/admin/SettingsPage.tsx';
import { SystemHealthPage } from '../pages/admin/SystemHealthPage.tsx';

export const router = createBrowserRouter([
  // Public Routes
  {
    path: ROUTES.PUBLIC.LOGIN,
    element: React.createElement(LoginPage)
  },
  {
    path: ROUTES.PUBLIC.UNAUTHORIZED,
    element: React.createElement(UnauthorizedPage)
  },

  // Protected Routes
  {
    path: '/',
    element: React.createElement(
      AuthGuard,
      null,
      React.createElement(MainLayout)
    ),
    children: [
      {
        index: true,
        element: React.createElement(PortalRedirect)
      },
      // Accountant Group
      {
        path: ROUTES.ACCOUNTANT.ROOT,
        element: React.createElement(Navigate, { to: ROUTES.ACCOUNTANT.DASHBOARD, replace: true })
      },
      {
        path: ROUTES.ACCOUNTANT.DASHBOARD,
        element: React.createElement(
          RoleGuard,
          { allowedRole: 'accountant' },
          React.createElement(AccountantDashboardPage)
        )
      },
      {
        path: ROUTES.ACCOUNTANT.CHART_OF_ACCOUNTS,
        element: React.createElement(
          RoleGuard,
          { allowedRole: 'accountant' },
          React.createElement(ChartOfAccountsPage)
        )
      },
      {
        path: ROUTES.ACCOUNTANT.GENERAL_JOURNAL,
        element: React.createElement(
          RoleGuard,
          { allowedRole: 'accountant' },
          React.createElement(GeneralJournalPage)
        )
      },
      {
        path: ROUTES.ACCOUNTANT.TRIAL_BALANCE,
        element: React.createElement(
          RoleGuard,
          { allowedRole: 'accountant' },
          React.createElement(TrialBalancePage)
        )
      },
      {
        path: ROUTES.ACCOUNTANT.FINANCIAL_STATEMENTS,
        element: React.createElement(
          RoleGuard,
          { allowedRole: 'accountant' },
          React.createElement(FinancialStatementsPage)
        )
      },

      // Finance Group
      {
        path: ROUTES.FINANCE.ROOT,
        element: React.createElement(Navigate, { to: ROUTES.FINANCE.DASHBOARD, replace: true })
      },
      {
        path: ROUTES.FINANCE.DASHBOARD,
        element: React.createElement(
          RoleGuard,
          { allowedRole: 'finance' },
          React.createElement(FinanceDashboardPage)
        )
      },
      {
        path: ROUTES.FINANCE.INVOICES,
        element: React.createElement(
          RoleGuard,
          { allowedRole: 'finance' },
          React.createElement(InvoicesPage)
        )
      },
      {
        path: ROUTES.FINANCE.BILLS,
        element: React.createElement(
          RoleGuard,
          { allowedRole: 'finance' },
          React.createElement(BillsPage)
        )
      },
      {
        path: ROUTES.FINANCE.BANK_ACCOUNTS,
        element: React.createElement(
          RoleGuard,
          { allowedRole: 'finance' },
          React.createElement(BankAccountsPage)
        )
      },
      {
        path: ROUTES.FINANCE.RECONCILIATION,
        element: React.createElement(
          RoleGuard,
          { allowedRole: 'finance' },
          React.createElement(ReconciliationPage)
        )
      },

      // Auditor Group
      {
        path: ROUTES.AUDITOR.ROOT,
        element: React.createElement(Navigate, { to: ROUTES.AUDITOR.DASHBOARD, replace: true })
      },
      {
        path: ROUTES.AUDITOR.DASHBOARD,
        element: React.createElement(
          RoleGuard,
          { allowedRole: 'auditor' },
          React.createElement(AuditorDashboardPage)
        )
      },
      {
        path: ROUTES.AUDITOR.FINANCIAL_RATIOS,
        element: React.createElement(
          RoleGuard,
          { allowedRole: 'auditor' },
          React.createElement(FinancialRatiosPage)
        )
      },
      {
        path: ROUTES.AUDITOR.AUDIT_TRAIL,
        element: React.createElement(
          RoleGuard,
          { allowedRole: 'auditor' },
          React.createElement(AuditTrailPage)
        )
      },
      {
        path: ROUTES.AUDITOR.COMPLIANCE,
        element: React.createElement(
          RoleGuard,
          { allowedRole: 'auditor' },
          React.createElement(CompliancePage)
        )
      },

      // Admin Group
      {
        path: ROUTES.ADMIN.ROOT,
        element: React.createElement(Navigate, { to: ROUTES.ADMIN.DASHBOARD, replace: true })
      },
      {
        path: ROUTES.ADMIN.DASHBOARD,
        element: React.createElement(
          RoleGuard,
          { allowedRole: 'admin' },
          React.createElement(AdminDashboardPage)
        )
      },
      {
        path: ROUTES.ADMIN.USER_MANAGEMENT,
        element: React.createElement(
          RoleGuard,
          { allowedRole: 'admin' },
          React.createElement(UserManagementPage)
        )
      },
      {
        path: ROUTES.ADMIN.SETTINGS,
        element: React.createElement(
          RoleGuard,
          { allowedRole: 'admin' },
          React.createElement(SettingsPage)
        )
      },
      {
        path: ROUTES.ADMIN.SYSTEM_HEALTH,
        element: React.createElement(
          RoleGuard,
          { allowedRole: 'admin' },
          React.createElement(SystemHealthPage)
        )
      }
    ]
  },

  // Fallback Route
  {
    path: ROUTES.PUBLIC.NOT_FOUND,
    element: React.createElement(NotFoundPage)
  }
]);
