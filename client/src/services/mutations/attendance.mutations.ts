import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../apiClient';
import { AttendanceSession, SaveAttendancePayload } from '../../types/attendance';
import { API_ENDPOINTS } from '../../constants/api';
import { ATTENDANCE_KEYS } from '../queries/attendance.queries';

export function useSaveAttendanceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SaveAttendancePayload): Promise<AttendanceSession> => {
      try {
        const res = await apiClient.post<{ success: boolean; data: AttendanceSession }>(
          API_ENDPOINTS.ATTENDANCE,
          payload
        );
        if (res.data && typeof res.data === 'object' && 'data' in res.data && res.data.data) {
          return res.data.data;
        }
        throw new Error('Local fallback');
      } catch {
        // Fallback local save
        const presentCount = payload.records.filter((r) => r.status === 'present').length;
        const lateCount = payload.records.filter((r) => r.status === 'late').length;
        const absentCount = payload.records.filter((r) => r.status === 'absent').length;
        const leaveCount = payload.records.filter((r) => r.status === 'leave').length;
        const activityCount = payload.records.filter((r) => r.status === 'activity').length;
        const total = payload.records.length;
        const rate = total > 0 ? ((presentCount + lateCount * 0.5 + activityCount) / total) * 100 : 0;

        const session: AttendanceSession = {
          id: `att-${payload.classroomId}-${payload.date}-${payload.period}`,
          classroomId: payload.classroomId,
          date: payload.date,
          period: payload.period,
          recordedBy: payload.recordedBy || 'ครูผู้สอน',
          records: payload.records.map((r, index) => ({
            id: `rec-${index + 1}`,
            studentId: r.studentId,
            studentNumber: String(10000 + index + 1),
            studentName: '',
            rollNumber: index + 1,
            classroomId: payload.classroomId,
            date: payload.date,
            period: payload.period,
            status: r.status,
            remark: r.remark,
            checkInTime: r.checkInTime || new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
          })),
          summary: {
            total,
            present: presentCount,
            late: lateCount,
            absent: absentCount,
            leave: leaveCount,
            activity: activityCount,
            attendanceRate: Math.round(rate * 10) / 10,
          },
          updatedAt: new Date().toISOString(),
        };

        localStorage.setItem(`att_${payload.classroomId}_${payload.date}_${payload.period}`, JSON.stringify(session));
        return session;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ATTENDANCE_KEYS.session(variables.classroomId, variables.date, variables.period),
      });
      queryClient.invalidateQueries({ queryKey: ATTENDANCE_KEYS.stats(variables.date) });
    },
  });
}
