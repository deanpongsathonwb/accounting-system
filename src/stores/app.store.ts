import { useState, useCallback } from 'react';
import type { AccountItem, JournalEntry, Invoice, SystemSettings, AuditLog } from '../types/common.types.ts';
import initialSettings from '../seed/settings.json';
import initialAccounts from '../seed/accounts.json';
import initialJournals from '../seed/journals.json';
import initialInvoicesData from '../seed/invoices.json';
import initialReconciliationData from '../seed/reconciliations.json';
import initialAuditLogs from '../seed/auditLogs.json';
import { STORAGE_KEYS } from '../constants/storage.ts';

function loadStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {
    // technical error recovery
  }
  return fallback;
}

export function useAccountingData() {
  const [settings, setSettingsState] = useState<SystemSettings>(() =>
    loadStored<SystemSettings>(STORAGE_KEYS.SETTINGS, initialSettings as SystemSettings)
  );

  const [accounts, setAccountsState] = useState<AccountItem[]>(() =>
    loadStored<AccountItem[]>(STORAGE_KEYS.ACCOUNTS, initialAccounts as AccountItem[])
  );

  const [journals, setJournalsState] = useState<JournalEntry[]>(() =>
    loadStored<JournalEntry[]>(STORAGE_KEYS.JOURNALS, initialJournals as JournalEntry[])
  );

  const [invoices, setInvoicesState] = useState<Invoice[]>(() =>
    loadStored<Invoice[]>(STORAGE_KEYS.INVOICES, initialInvoicesData.invoices as Invoice[])
  );

  const [reconciliations, setReconciliationsState] = useState(() => initialReconciliationData);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => initialAuditLogs as AuditLog[]);

  const updateSettings = useCallback((newSettings: SystemSettings) => {
    setSettingsState(newSettings);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
  }, []);

  const addJournalEntry = useCallback((entry: JournalEntry) => {
    setJournalsState((prev) => {
      const next = [entry, ...prev];
      localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(next));
      return next;
    });
  }, []);

  const postJournalEntry = useCallback((id: string) => {
    setJournalsState((prev) => {
      const next = prev.map((j) => (j.id === id ? { ...j, status: 'posted' as const } : j));
      localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(next));
      return next;
    });
  }, []);

  const addAccount = useCallback((acc: AccountItem) => {
    setAccountsState((prev) => {
      const next = [...prev, acc];
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(next));
      return next;
    });
  }, []);

  const markInvoicePaid = useCallback((invoiceNumber: string) => {
    setInvoicesState((prev) => {
      const next = prev.map((inv) =>
        inv.invoiceNumber === invoiceNumber ? { ...inv, status: 'paid' as const } : inv
      );
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(next));
      return next;
    });
  }, []);

  const togglePeriodStatus = useCallback(() => {
    setReconciliationsState((prev) => ({
      ...prev,
      periodStatus: {
        ...prev.periodStatus,
        status: prev.periodStatus.status === 'open' ? 'closed' : 'open',
      },
    }));
  }, []);

  const addAuditLog = useCallback((log: AuditLog) => {
    setAuditLogs((prev) => [log, ...prev]);
  }, []);

  return {
    settings,
    updateSettings,
    accounts,
    addAccount,
    journals,
    addJournalEntry,
    postJournalEntry,
    invoices,
    markInvoicePaid,
    reconciliations,
    togglePeriodStatus,
    auditLogs,
    addAuditLog,
    customers: initialInvoicesData.customers,
    receipts: initialInvoicesData.receipts,
    agingSummary: initialInvoicesData.agingSummary,
  };
}
