import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../constants/storage';

export interface AppSettings {
  schoolName: string;
  schoolTerm: string;
  schoolYear: string;
  lateCutoffTime: string; // e.g. "08:00"
  morningCutoffTime: string; // e.g. "08:30"
  teacherName: string;
  autoSave: boolean;
}

interface AppStoreState {
  settings: AppSettings;
  selectedClassroomId: string;
  selectedDate: string;
  selectedPeriod: string;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  setSelectedClassroomId: (id: string) => void;
  setSelectedDate: (date: string) => void;
  setSelectedPeriod: (period: string) => void;
}

export const useAppStore = create<AppStoreState>()(
  persist(
    (set) => ({
      settings: {
        schoolName: 'โรงเรียนสาธิตวิทยาคม',
        schoolTerm: '1',
        schoolYear: '2569',
        lateCutoffTime: '08:00',
        morningCutoffTime: '08:30',
        teacherName: 'อ.วรรณภา จันทร์เพ็ญ',
        autoSave: true,
      },
      selectedClassroomId: 'cls-1',
      selectedDate: new Date().toISOString().split('T')[0],
      selectedPeriod: 'morning',
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      setSelectedClassroomId: (selectedClassroomId) => set({ selectedClassroomId }),
      setSelectedDate: (selectedDate) => set({ selectedDate }),
      setSelectedPeriod: (selectedPeriod) => set({ selectedPeriod }),
    }),
    {
      name: STORAGE_KEYS.USER_SETTINGS,
    }
  )
);
