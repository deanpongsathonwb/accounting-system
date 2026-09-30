import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { APP_ROUTES } from './constants/routes.ts';
import { useAuthSession } from './stores/auth.store.ts';
import { useAccountingData } from './stores/app.store.ts';
import { RequireRole } from './routes/index.ts';

import { AppLayout } from './components/layout/AppLayout.tsx';
import { LoginPage } from './pages/public/LoginPage.tsx';

// Accountant Pages
import { JournalsPage } from './pages/accountant/JournalsPage.tsx';
import { AccountsPage } from './pages/accountant/AccountsPage.tsx';
import { LedgerPage } from './pages/accountant/LedgerPage.tsx';
import { TrialBalancePage } from './pages/accountant/TrialBalancePage.tsx';

// Auditor Pages
import { FinancialStatementsPage } from './pages/auditor/FinancialStatementsPage.tsx';
import { ReconciliationPage } from './pages/auditor/ReconciliationPage.tsx';
import { TaxReportPage } from './pages/auditor/TaxReportPage.tsx';
import { PeriodClosingPage } from './pages/auditor/PeriodClosingPage.tsx';

// Billing Pages
import { InvoicesPage } from './pages/billing/InvoicesPage.tsx';
import { ReceiptsPage } from './pages/billing/ReceiptsPage.tsx';
import { AgingPage } from './pages/billing/AgingPage.tsx';
import { CustomersPage } from './pages/billing/CustomersPage.tsx';

// Admin Pages
import { ConfigurationPage } from './pages/admin/ConfigurationPage.tsx';
import { UsersPage } from './pages/admin/UsersPage.tsx';
import { AuditPage } from './pages/admin/AuditPage.tsx';
import { MaintenancePage } from './pages/admin/MaintenancePage.tsx';

export default function App() {
  const { user, loginAsRole, logout } = useAuthSession();
  const accounting = useAccountingData();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route
          path={APP_ROUTES.PUBLIC}
          element={
            <LoginPage
              user={user}
              settings={accounting.settings}
              onLogin={loginAsRole}
            />
          }
        />
        <Route
          path={APP_ROUTES.LOGIN}
          element={
            <LoginPage
              user={user}
              settings={accounting.settings}
              onLogin={loginAsRole}
            />
          }
        />

        {/* Accountant Protected Routes */}
        <Route
          path={APP_ROUTES.ACCOUNTANT.ROOT}
          element={
            <RequireRole user={user} allowedRole="accountant">
              {user ? (
                <AppLayout
                  user={user}
                  settings={accounting.settings}
                  onLogout={logout}
                  onSwitchRole={loginAsRole}
                />
              ) : (
                <Navigate to={APP_ROUTES.LOGIN} replace />
              )}
            </RequireRole>
          }
        >
          <Route index element={<Navigate to={APP_ROUTES.ACCOUNTANT.JOURNALS} replace />} />
          <Route
            path="journals"
            element={
              <JournalsPage
                journals={accounting.journals}
                accounts={accounting.accounts}
                onAddJournal={accounting.addJournalEntry}
                onPostJournal={accounting.postJournalEntry}
              />
            }
          />
          <Route
            path="accounts"
            element={
              <AccountsPage
                accounts={accounting.accounts}
                onAddAccount={accounting.addAccount}
              />
            }
          />
          <Route
            path="ledger"
            element={
              <LedgerPage
                accounts={accounting.accounts}
                journals={accounting.journals}
              />
            }
          />
          <Route
            path="trial-balance"
            element={
              <TrialBalancePage
                accounts={accounting.accounts}
                settings={accounting.settings}
              />
            }
          />
        </Route>

        {/* Auditor Protected Routes */}
        <Route
          path={APP_ROUTES.AUDITOR.ROOT}
          element={
            <RequireRole user={user} allowedRole="auditor">
              {user ? (
                <AppLayout
                  user={user}
                  settings={accounting.settings}
                  onLogout={logout}
                  onSwitchRole={loginAsRole}
                />
              ) : (
                <Navigate to={APP_ROUTES.LOGIN} replace />
              )}
            </RequireRole>
          }
        >
          <Route
            index
            element={<Navigate to={APP_ROUTES.AUDITOR.FINANCIAL_STATEMENTS} replace />}
          />
          <Route
            path="financial-statements"
            element={
              <FinancialStatementsPage
                accounts={accounting.accounts}
                settings={accounting.settings}
              />
            }
          />
          <Route
            path="reconciliation"
            element={
              <ReconciliationPage
                reconciliations={accounting.reconciliations}
              />
            }
          />
          <Route
            path="tax"
            element={
              <TaxReportPage
                invoices={accounting.invoices}
                taxSummary={accounting.reconciliations.taxSummary}
              />
            }
          />
          <Route
            path="closing"
            element={
              <PeriodClosingPage
                periodStatus={accounting.reconciliations.periodStatus}
                onTogglePeriod={accounting.togglePeriodStatus}
              />
            }
          />
        </Route>

        {/* Billing Protected Routes */}
        <Route
          path={APP_ROUTES.BILLING.ROOT}
          element={
            <RequireRole user={user} allowedRole="billing">
              {user ? (
                <AppLayout
                  user={user}
                  settings={accounting.settings}
                  onLogout={logout}
                  onSwitchRole={loginAsRole}
                />
              ) : (
                <Navigate to={APP_ROUTES.LOGIN} replace />
              )}
            </RequireRole>
          }
        >
          <Route index element={<Navigate to={APP_ROUTES.BILLING.INVOICES} replace />} />
          <Route
            path="invoices"
            element={
              <InvoicesPage
                invoices={accounting.invoices}
                onMarkPaid={accounting.markInvoicePaid}
              />
            }
          />
          <Route
            path="receipts"
            element={<ReceiptsPage receipts={accounting.receipts} />}
          />
          <Route
            path="aging"
            element={
              <AgingPage
                agingSummary={accounting.agingSummary}
                customers={accounting.customers}
              />
            }
          />
          <Route
            path="customers"
            element={<CustomersPage customers={accounting.customers} />}
          />
        </Route>

        {/* Admin Protected Routes */}
        <Route
          path={APP_ROUTES.ADMIN.ROOT}
          element={
            <RequireRole user={user} allowedRole="admin">
              {user ? (
                <AppLayout
                  user={user}
                  settings={accounting.settings}
                  onLogout={logout}
                  onSwitchRole={loginAsRole}
                />
              ) : (
                <Navigate to={APP_ROUTES.LOGIN} replace />
              )}
            </RequireRole>
          }
        >
          <Route
            index
            element={<Navigate to={APP_ROUTES.ADMIN.CONFIGURATION} replace />}
          />
          <Route
            path="configuration"
            element={
              <ConfigurationPage
                settings={accounting.settings}
                onUpdateSettings={accounting.updateSettings}
              />
            }
          />
          <Route path="users" element={<UsersPage />} />
          <Route path="audit" element={<AuditPage auditLogs={accounting.auditLogs} />} />
          <Route path="maintenance" element={<MaintenancePage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={APP_ROUTES.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
