import { useState, useEffect } from 'react';
import type { User, UserRole } from '../types/common.types.ts';
import seedUsers from '../seed/users.json';
import { STORAGE_KEYS } from '../constants/storage.ts';

export function getInitialUser(): User | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      return JSON.parse(saved) as User;
    }
  } catch {
    // Technical fallback
  }
  return null;
}

export function useAuthSession() {
  const [user, setUser] = useState<User | null>(getInitialUser);

  const loginAsRole = (role: UserRole) => {
    const usersList = seedUsers as User[];
    const matched = usersList.find((u) => u.role === role) ?? usersList[0];
    setUser(matched);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(matched));
  };

  const loginWithUser = (selectedUser: User) => {
    setUser(selectedUser);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(selectedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  };

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.CURRENT_USER) {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return {
    user,
    isAuthenticated: user !== null,
    loginAsRole,
    loginWithUser,
    logout,
  };
}
