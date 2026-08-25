import { AttendanceStatus } from '../types/attendance';

export const ATTENDANCE_STATUS_CONFIG: Record<
  AttendanceStatus,
  {
    labelTh: string;
    labelEn: string;
    shortTh: string;
    color: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    badgeClass: string;
  }
> = {
  present: {
    labelTh: 'มาเรียน',
    labelEn: 'Present',
    shortTh: 'มา',
    color: '#10B981',
    bgClass: 'bg-emerald-50 hover:bg-emerald-100',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-500',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  late: {
    labelTh: 'มาสาย',
    labelEn: 'Late',
    shortTh: 'สาย',
    color: '#F59E0B',
    bgClass: 'bg-amber-50 hover:bg-amber-100',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-500',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  absent: {
    labelTh: 'ขาดเรียน',
    labelEn: 'Absent',
    shortTh: 'ขาด',
    color: '#EF4444',
    bgClass: 'bg-rose-50 hover:bg-rose-100',
    textClass: 'text-rose-700',
    borderClass: 'border-rose-500',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
  },
  leave: {
    labelTh: 'ลากิจ / ลาป่วย',
    labelEn: 'Leave',
    shortTh: 'ลา',
    color: '#3B82F6',
    bgClass: 'bg-blue-50 hover:bg-blue-100',
    textClass: 'text-blue-700',
    borderClass: 'border-blue-500',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  activity: {
    labelTh: 'กิจกรรม / ไปแข่งขัน',
    labelEn: 'Activity',
    shortTh: 'กิจกรรม',
    color: '#8B5CF6',
    bgClass: 'bg-purple-50 hover:bg-purple-100',
    textClass: 'text-purple-700',
    borderClass: 'border-purple-500',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
  },
};

export const PERIOD_OPTIONS = [
  { value: 'morning', label: 'เข้าแถวตอนเช้า (Homeroom 08:00)' },
  { value: 'p1', label: 'คาบที่ 1 (08:30 - 09:20)' },
  { value: 'p2', label: 'คาบที่ 2 (09:20 - 10:10)' },
  { value: 'p3', label: 'คาบที่ 3 (10:20 - 11:10)' },
  { value: 'p4', label: 'คาบที่ 4 (11:10 - 12:00)' },
  { value: 'afternoon', label: 'กิจกรรมช่วงบ่าย (13:00)' },
];
