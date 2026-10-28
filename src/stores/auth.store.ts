import { create } from 'zustand';
import { User } from '../types/common.types.ts';
import { STORAGE_KEYS } from '../constants/storage.ts';
import { storageService } from '../storage/index.ts';
import initialUsers from '../seed/users.json';
import { UI } from '../constants/index.ts';
import { sanitizeUserSession } from '../utils/security.ts';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  authenticate: (
    identifier: string,
    password: string,
    usersList?: User[]
  ) => { success: boolean; user?: User; error?: string };
  login: (user: User) => void;
  logout: () => void;
}

const getStoredUser = (): User | null => {
  const stored = storageService.getItem<User>(STORAGE_KEYS.AUTH_USER);
  if (!stored) return null;
  return sanitizeUserSession(stored);
};

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: getStoredUser(),
  isAuthenticated: Boolean(getStoredUser()),
  authenticate: (identifier: string, password: string, usersList?: User[]) => {
    const list = usersList && usersList.length > 0 ? usersList : (initialUsers as User[]);
    const trimmedId = identifier.trim().toLowerCase();
    
    const matchedUser = list.find(
      (u) =>
        u.username.toLowerCase() === trimmedId ||
        u.email.toLowerCase() === trimmedId
    );

    if (!matchedUser) {
      return { success: false, error: UI.auth.invalidCredentials };
    }

    // Simulated BaaS Auth Provider boundary:
    // In real BaaS, credentials are authenticated by the auth server, not stored in the frontend user model.
    if (!password || password.length < 6) {
      return { success: false, error: UI.auth.invalidCredentials };
    }

    if (matchedUser.status === 'inactive') {
      return { success: false, error: UI.auth.accountInactive };
    }

    // Save sanitized authenticated session (strictly omit passwords from storage/state)
    const safeUser = sanitizeUserSession(matchedUser);
    storageService.setItem(STORAGE_KEYS.AUTH_USER, safeUser);
    set({ currentUser: safeUser, isAuthenticated: true });
    return { success: true, user: safeUser };
  },
  login: (user: User) => {
    const safeUser = sanitizeUserSession(user);
    storageService.setItem(STORAGE_KEYS.AUTH_USER, safeUser);
    set({ currentUser: safeUser, isAuthenticated: true });
  },
  logout: () => {
    storageService.removeItem(STORAGE_KEYS.AUTH_USER);
    set({ currentUser: null, isAuthenticated: false });
  }
}));
