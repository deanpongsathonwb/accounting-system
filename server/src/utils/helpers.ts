export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateAttendanceRate(present: number, late: number, total: number): number {
  if (total === 0) return 0;
  // Late counts as attended with 0.5 weight or standard present
  return Math.round(((present + late * 0.5) / total) * 100);
}
