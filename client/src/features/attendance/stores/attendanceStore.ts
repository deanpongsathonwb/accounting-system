import { create } from 'zustand';
import { AttendanceStatus } from '../../../types/attendance';

interface AttendanceDraftState {
  recordsMap: Record<string, { status: AttendanceStatus; remark: string; checkInTime?: string }>;
  filterStatus: 'all' | AttendanceStatus;
  searchQuery: string;
  isDirty: boolean;
  setStudentStatus: (studentId: string, status: AttendanceStatus, checkInTime?: string) => void;
  setStudentRemark: (studentId: string, remark: string) => void;
  setBulkStatus: (studentIds: string[], status: AttendanceStatus) => void;
  setInitialRecords: (
    records: Array<{ studentId: string; status: AttendanceStatus; remark?: string; checkInTime?: string }>
  ) => void;
  setFilterStatus: (filter: 'all' | AttendanceStatus) => void;
  setSearchQuery: (query: string) => void;
  resetDraft: () => void;
}

export const useAttendanceDraftStore = create<AttendanceDraftState>((set) => ({
  recordsMap: {},
  filterStatus: 'all',
  searchQuery: '',
  isDirty: false,

  setStudentStatus: (studentId, status, checkInTime) =>
    set((state) => ({
      isDirty: true,
      recordsMap: {
        ...state.recordsMap,
        [studentId]: {
          status,
          remark: state.recordsMap[studentId]?.remark || '',
          checkInTime: checkInTime || state.recordsMap[studentId]?.checkInTime || (status === 'present' || status === 'late' ? new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : undefined),
        },
      },
    })),

  setStudentRemark: (studentId, remark) =>
    set((state) => ({
      isDirty: true,
      recordsMap: {
        ...state.recordsMap,
        [studentId]: {
          status: state.recordsMap[studentId]?.status || 'present',
          remark,
          checkInTime: state.recordsMap[studentId]?.checkInTime,
        },
      },
    })),

  setBulkStatus: (studentIds, status) =>
    set((state) => {
      const updated = { ...state.recordsMap };
      const nowTime = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
      studentIds.forEach((id) => {
        updated[id] = {
          status,
          remark: updated[id]?.remark || '',
          checkInTime: status === 'present' ? nowTime : undefined,
        };
      });
      return { recordsMap: updated, isDirty: true };
    }),

  setInitialRecords: (records) =>
    set(() => {
      const map: Record<string, { status: AttendanceStatus; remark: string; checkInTime?: string }> = {};
      records.forEach((r) => {
        map[r.studentId] = {
          status: r.status,
          remark: r.remark || '',
          checkInTime: r.checkInTime,
        };
      });
      return { recordsMap: map, isDirty: false };
    }),

  setFilterStatus: (filterStatus) => set({ filterStatus }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  resetDraft: () => set({ recordsMap: {}, isDirty: false, searchQuery: '', filterStatus: 'all' }),
}));
