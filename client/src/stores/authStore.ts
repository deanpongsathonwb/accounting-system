import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../constants/storage';

export interface UserProfile {
  id: string;
  name: string;
  role: 'teacher' | 'admin' | 'staff';
  email: string;
  school: string;
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
      isAuthenticated: true, // Default to demo logged-in state for smooth preview
      user: {
        id: 'usr-001',
        name: 'อ.วรรณภา จันทร์เพ็ญ',
        role: 'teacher',
        email: 'wannapha@school.ac.th',
        school: 'โรงเรียนสาธิตวิทยาคม',
      },
      token: 'mock-jwt-token-attendance-system',
      login: (user, token) => set({ isAuthenticated: true, user, token }),
      logout: () => set({ isAuthenticated: false, user: null, token: null }),
    }),
    {
      name: STORAGE_KEYS.AUTH_TOKEN,
    }
  )
);
