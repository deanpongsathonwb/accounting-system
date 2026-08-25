import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../constants/storage';

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'teacher' | 'staff';
  email: string;
  avatarUrl?: string;
  assignedClassrooms?: string[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  login: (user: UserProfile, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (user, token) => set({ isAuthenticated: true, user, token }),
      logout: () => {
        set({ isAuthenticated: false, user: null, token: null });
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_TOKEN,
    }
  )
);
