import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../apiClient';
import { AttendanceSession, AttendanceStatsSummary } from '../../types/attendance';
import { API_ENDPOINTS } from '../../constants/api';

export const ATTENDANCE_KEYS = {
  all: ['attendance'] as const,
  session: (classroomId: string, date: string, period: string) =>
    [...ATTENDANCE_KEYS.all, 'session', classroomId, date, period] as const,
  stats: (date: string) => [...ATTENDANCE_KEYS.all, 'stats', date] as const,
  history: (classroomId?: string, startDate?: string, endDate?: string) =>
    [...ATTENDANCE_KEYS.all, 'history', classroomId, startDate, endDate] as const,
};

export async function fetchAttendanceSession(
  classroomId: string,
  date: string,
  period: string
): Promise<AttendanceSession | null> {
  if (!classroomId || !date || !period) return null;
  try {
    const res = await apiClient.get<{ success: boolean; data: AttendanceSession | null }>(
      `${API_ENDPOINTS.ATTENDANCE_BY_SESSION}?classroomId=${classroomId}&date=${date}&period=${period}`
    );
    if (res.data && typeof res.data === 'object' && 'data' in res.data) {
      return res.data.data;
    }
    return null;
  } catch {
    return null;
  }
}

export function useAttendanceSessionQuery(classroomId: string, date: string, period: string) {
  return useQuery({
    queryKey: ATTENDANCE_KEYS.session(classroomId, date, period),
    queryFn: () => fetchAttendanceSession(classroomId, date, period),
    enabled: !!classroomId && !!date && !!period,
  });
}

export async function fetchAttendanceStats(date: string): Promise<AttendanceStatsSummary> {
  try {
    const res = await apiClient.get<{ success: boolean; data: AttendanceStatsSummary }>(
      `${API_ENDPOINTS.ATTENDANCE_STATS}?date=${date}`
    );
    if (res.data && typeof res.data === 'object' && 'data' in res.data && res.data.data) {
      return res.data.data;
    }
    return {
      todayTotalStudents: 0,
      todayCheckedCount: 0,
      todayPresentCount: 0,
      todayLateCount: 0,
      todayAbsentCount: 0,
      todayLeaveCount: 0,
      overallRate: 0,
      classroomsChecked: 0,
      totalClassrooms: 0,
    };
  } catch {
    return {
      todayTotalStudents: 0,
      todayCheckedCount: 0,
      todayPresentCount: 0,
      todayLateCount: 0,
      todayAbsentCount: 0,
      todayLeaveCount: 0,
      overallRate: 0,
      classroomsChecked: 0,
      totalClassrooms: 0,
    };
  }
}

export function useAttendanceStatsQuery(date: string) {
  return useQuery({
    queryKey: ATTENDANCE_KEYS.stats(date),
    queryFn: () => fetchAttendanceStats(date),
    enabled: !!date,
    refetchInterval: 30000,
  });
}
