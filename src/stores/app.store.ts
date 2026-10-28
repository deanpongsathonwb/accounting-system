import { create } from 'zustand';
import {
  AccountItem,
  JournalEntry,
  InvoiceItem,
  BillItem,
  BankAccountItem,
  AuditLogItem,
  SystemSettings,
  User,
  NotificationItem
} from '../types/common.types.ts';
import { STORAGE_KEYS } from '../constants/storage.ts';
import { storageService } from '../storage/index.ts';
import { generateUniqueId } from '../utils/security.ts';

import seedAccounts from '../seed/accounts.json';
import seedJournals from '../seed/journals.json';
import seedInvoices from '../seed/invoices.json';
import seedBills from '../seed/bills.json';
import seedBankAccounts from '../seed/bankAccounts.json';
import seedUsers from '../seed/users.json';
import seedSettings from '../seed/settings.json';
import seedAuditLogs from '../seed/auditLogs.json';
import seedNotifications from '../seed/notifications.json';

interface AppPersistedState {
  accounts: AccountItem[];
  journals: JournalEntry[];
  invoices: InvoiceItem[];
  bills: BillItem[];
  bankAccounts: BankAccountItem[];
  users: User[];
  settings: SystemSettings;
  auditLogs: AuditLogItem[];
  notifications: NotificationItem[];
}

interface AppStore extends AppPersistedState {
  addAccount: (account: AccountItem) => void;
  addJournalEntry: (entry: JournalEntry) => void;
  addInvoice: (invoice: InvoiceItem) => void;
  updateInvoiceStatus: (id: string, status: InvoiceItem['status']) => void;
  addBill: (bill: BillItem) => void;
  updateBillStatus: (id: string, status: BillItem['status']) => void;
  addBankAccount: (bank: BankAccountItem) => void;
  updateSettings: (newSettings: SystemSettings) => void;
  addUser: (user: User) => void;
  addAuditLog: (log: AuditLogItem) => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  resetAllData: () => void;
  isMobileSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  isDesktopSidebarCollapsed: boolean;
  toggleDesktopSidebar: () => void;
}

const getInitialState = (): AppPersistedState => {
  const stored = storageService.getItem<AppPersistedState>(STORAGE_KEYS.APP_DATA);
  if (stored) {
    return stored;
  }
  return {
    accounts: seedAccounts as AccountItem[],
    journals: seedJournals as JournalEntry[],
    invoices: seedInvoices as InvoiceItem[],
    bills: seedBills as BillItem[],
    bankAccounts: seedBankAccounts as BankAccountItem[],
    users: seedUsers as User[],
    settings: seedSettings as SystemSettings,
    auditLogs: seedAuditLogs as AuditLogItem[],
    notifications: seedNotifications as NotificationItem[]
  };
};

export const useAppStore = create<AppStore>((set, get) => {
  const initial = getInitialState();

  const persist = (nextState: Partial<AppPersistedState>) => {
    // Concurrency Protection: Read latest state from storage to avoid Lost Updates across concurrent tabs
    const latestStored = storageService.getItem<AppPersistedState>(STORAGE_KEYS.APP_DATA) || get();
    const updated: AppPersistedState = {
      accounts: nextState.accounts ?? latestStored.accounts,
      journals: nextState.journals ?? latestStored.journals,
      invoices: nextState.invoices ?? latestStored.invoices,
      bills: nextState.bills ?? latestStored.bills,
      bankAccounts: nextState.bankAccounts ?? latestStored.bankAccounts,
      users: nextState.users ?? latestStored.users,
      settings: nextState.settings ?? latestStored.settings,
      auditLogs: nextState.auditLogs ?? latestStored.auditLogs,
      notifications: nextState.notifications ?? latestStored.notifications
    };
    storageService.setItem(STORAGE_KEYS.APP_DATA, updated);
  };

  return {
    ...initial,

    addAccount: (account) => {
      set((state) => {
        const next = [account, ...state.accounts];
        persist({ accounts: next });
        return { accounts: next };
      });
    },

    addJournalEntry: (entry) => {
      set((state) => {
        const next = [entry, ...state.journals];
        persist({ journals: next });
        return { journals: next };
      });
    },

    addInvoice: (invoice) => {
      set((state) => {
        const next = [invoice, ...state.invoices];
        persist({ invoices: next });
        return { invoices: next };
      });
    },

    updateInvoiceStatus: (id, status) => {
      set((state) => {
        const next = state.invoices.map((inv) => (inv.id === id ? { ...inv, status } : inv));
        persist({ invoices: next });
        return { invoices: next };
      });
    },

    addBill: (bill) => {
      set((state) => {
        const next = [bill, ...state.bills];
        persist({ bills: next });
        return { bills: next };
      });
    },

    updateBillStatus: (id, status) => {
      set((state) => {
        const next = state.bills.map((b) => (b.id === id ? { ...b, status } : b));
        persist({ bills: next });
        return { bills: next };
      });
    },

    addBankAccount: (bank) => {
      set((state) => {
        const next = [bank, ...state.bankAccounts];
        persist({ bankAccounts: next });
        return { bankAccounts: next };
      });
    },

    updateSettings: (newSettings) => {
      set(() => {
        persist({ settings: newSettings });
        return { settings: newSettings };
      });
    },

    addUser: (user) => {
      set((state) => {
        const next = [...state.users, user];
        persist({ users: next });
        return { users: next };
      });
    },

    addAuditLog: (log) => {
      set((state) => {
        const next = [log, ...state.auditLogs];
        persist({ auditLogs: next });
        return { auditLogs: next };
      });
    },

    addNotification: (item) => {
      set((state) => {
        const newNotif: NotificationItem = {
          ...item,
          id: generateUniqueId('notif'),
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          read: false
        };
        const next = [newNotif, ...state.notifications];
        persist({ notifications: next });
        return { notifications: next };
      });
    },

    markNotificationAsRead: (id) => {
      set((state) => {
        const next = state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
        persist({ notifications: next });
        return { notifications: next };
      });
    },

    markAllNotificationsAsRead: () => {
      set((state) => {
        const next = state.notifications.map((n) => ({ ...n, read: true }));
        persist({ notifications: next });
        return { notifications: next };
      });
    },

    clearNotifications: () => {
      set(() => {
        const next: NotificationItem[] = [];
        persist({ notifications: next });
        return { notifications: next };
      });
    },

    resetAllData: () => {
      const resetState: AppPersistedState = {
        accounts: seedAccounts as AccountItem[],
        journals: seedJournals as JournalEntry[],
        invoices: seedInvoices as InvoiceItem[],
        bills: seedBills as BillItem[],
        bankAccounts: seedBankAccounts as BankAccountItem[],
        users: seedUsers as User[],
        settings: seedSettings as SystemSettings,
        auditLogs: seedAuditLogs as AuditLogItem[],
        notifications: seedNotifications as NotificationItem[]
      };
      persist(resetState);
      set(resetState);
    },

    isMobileSidebarOpen: false,
    toggleMobileSidebar: () => set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),
    setMobileSidebarOpen: (open: boolean) => set({ isMobileSidebarOpen: open }),
    isDesktopSidebarCollapsed: false,
    toggleDesktopSidebar: () => set((state) => ({ isDesktopSidebarCollapsed: !state.isDesktopSidebarCollapsed }))
  };
});

// Real-Time Cross-Tab Concurrency Synchronization Listener
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEYS.APP_DATA && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue) as AppPersistedState;
        useAppStore.setState((state) => ({
          ...state,
          accounts: parsed.accounts || state.accounts,
          journals: parsed.journals || state.journals,
          invoices: parsed.invoices || state.invoices,
          bills: parsed.bills || state.bills,
          bankAccounts: parsed.bankAccounts || state.bankAccounts,
          users: parsed.users || state.users,
          settings: parsed.settings || state.settings,
          auditLogs: parsed.auditLogs || state.auditLogs,
          notifications: parsed.notifications || state.notifications
        }));
      } catch {
        // Ignore JSON parse error during storage flush
      }
    }
  });
}
