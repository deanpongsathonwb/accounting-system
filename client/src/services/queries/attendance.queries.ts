import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../apiClient';
import { AttendanceSession, AttendanceStatsSummary } from '../../types/attendance';
import { API_ENDPOINTS } from '../../constants/api';
import { MOCK_ATTENDANCE_SESSIONS } from '../../mocks/attendance.mock';

export const ATTENDANCE_KEYS = {
  all: ['attendance'] as const,
  session: (classroomId: string, date: string, period: string) =>
    [...ATTENDANCE_KEYS.all, 'session', classroomId, date, period] as const,
  stats: (date: string) => [...ATTENDANCE_KEYS.all, 'stats', date] as const,
  history: (classroomId?: string, startDate?: string, endDate?: string) =>
    [...ATTENDANCE_KEYS.all, 'history', classroomId, startDate, endDate] as const,
};

export function getFallbackStats(date: string): AttendanceStatsSummary {
  try {
    // Check localStorage for saved sessions on this date
    let totalPresent = 0;
    let totalLate = 0;
    let totalAbsent = 0;
    let totalLeave = 0;
    let totalActivity = 0;
    let classroomsCheckedSet = new Set<string>();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('att_') && key.includes(date)) {
        const item = localStorage.getItem(key);
        if (item) {
          const session = JSON.parse(item) as AttendanceSession;
          if (session?.summary) {
            totalPresent += session.summary.present || 0;
            totalLate += session.summary.late || 0;
            totalAbsent += session.summary.absent || 0;
            totalLeave += session.summary.leave || 0;
            totalActivity += session.summary.activity || 0;
            if (session.classroomId) classroomsCheckedSet.add(session.classroomId);
          }
        }
      }
    }

    // If sessions found in localStorage, compute from them
    const totalStudentsChecked = totalPresent + totalLate + totalAbsent + totalLeave + totalActivity;
    if (totalStudentsChecked > 0) {
      const rate = Math.round(((totalPresent + totalLate * 0.5 + totalActivity) / totalStudentsChecked) * 1000) / 10;
      return {
        todayTotalStudents: 40,
        todayCheckedCount: totalStudentsChecked,
        todayPresentCount: totalPresent,
        todayLateCount: totalLate,
        todayAbsentCount: totalAbsent,
        todayLeaveCount: totalLeave,
        overallRate: rate,
        classroomsChecked: classroomsCheckedSet.size,
        totalClassrooms: 4,
      };
    }
  } catch {
    // ignore and return default
  }

  // Default fallback stats
  return {
    todayTotalStudents: 40,
    todayCheckedCount: 12,
    todayPresentCount: 8,
    todayLateCount: 1,
    todayAbsentCount: 1,
    todayLeaveCount: 1,
    overallRate: 83.3,
    classroomsChecked: 1,
    totalClassrooms: 4,
  };
}

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
    if (res.data && typeof res.data === 'object' && 'data' in res.data && res.data.data !== undefined) {
      return res.data.data;
    }
    const local = localStorage.getItem(`att_${classroomId}_${date}_${period}`);
    if (local) return JSON.parse(local);
    const mock = MOCK_ATTENDANCE_SESSIONS.find(
      (s) => s.classroomId === classroomId && s.date === date && s.period === period
    );
    return mock || null;
  } catch {
    const local = localStorage.getItem(`att_${classroomId}_${date}_${period}`);
    if (local) return JSON.parse(local);
    const mock = MOCK_ATTENDANCE_SESSIONS.find(
      (s) => s.classroomId === classroomId && s.date === date && s.period === period
    );
    return mock || null;
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
    return getFallbackStats(date);
  } catch {
    return getFallbackStats(date);
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
