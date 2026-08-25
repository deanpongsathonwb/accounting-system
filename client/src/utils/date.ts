/**
 * Date utility functions for Thai / International calendar
 */

export const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

export const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

export const THAI_DAYS = [
  'อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'
];

export function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatThaiDate(dateString: string, format: 'full' | 'medium' | 'short' = 'medium'): string {
  if (!dateString) return '-';
  const parts = dateString.split('-');
  if (parts.length < 3) return dateString;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const thaiYear = year + 543;

  if (format === 'short') {
    return `${day} ${THAI_MONTHS_SHORT[month]} ${String(thaiYear).slice(-2)}`;
  }

  if (format === 'medium') {
    return `${day} ${THAI_MONTHS_SHORT[month]} ${thaiYear}`;
  }

  const dateObj = new Date(year, month, day);
  const dayName = THAI_DAYS[dateObj.getDay()];
  return `วัน${dayName}ที่ ${day} ${THAI_MONTHS[month]} พ.ศ. ${thaiYear}`;
}

export function formatTime(isoString?: string): string {
  if (!isoString) return '-';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
}
