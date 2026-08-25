import { AttendanceStatus } from '../../../types/attendance';

export function calculateAttendanceStats(records: Array<{ status: AttendanceStatus }>) {
  const total = records.length;
  if (total === 0) {
    return { total: 0, present: 0, late: 0, absent: 0, leave: 0, activity: 0, rate: 0 };
  }

  const present = records.filter((r) => r.status === 'present').length;
  const late = records.filter((r) => r.status === 'late').length;
  const absent = records.filter((r) => r.status === 'absent').length;
  const leave = records.filter((r) => r.status === 'leave').length;
  const activity = records.filter((r) => r.status === 'activity').length;

  // Standard attendance rate formula: Present + (Late * 0.5) + Activity / Total
  const rate = Math.round(((present + late * 0.5 + activity) / total) * 1000) / 10;

  return { total, present, late, absent, leave, activity, rate };
}
