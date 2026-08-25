import { AttendanceSession } from '../types/attendance';
import { getTodayString } from '../utils/date';

const today = getTodayString();

export const MOCK_ATTENDANCE_SESSIONS: AttendanceSession[] = [
  {
    id: `att-cls-1-${today}-morning`,
    classroomId: 'cls-1',
    date: today,
    period: 'morning',
    recordedBy: 'อ.วรรณภา จันทร์เพ็ญ',
    records: [
      { id: 'rec-1', studentId: 'std-101', studentNumber: '10001', studentName: 'ด.ช.กิตติศักดิ์ มีชัย', rollNumber: 1, classroomId: 'cls-1', date: today, period: 'morning', status: 'present', checkInTime: '07:45' },
      { id: 'rec-2', studentId: 'std-102', studentNumber: '10002', studentName: 'ด.ช.จิรายุ ทองหล่อ', rollNumber: 2, classroomId: 'cls-1', date: today, period: 'morning', status: 'present', checkInTime: '07:50' },
      { id: 'rec-3', studentId: 'std-103', studentNumber: '10003', studentName: 'ด.ช.ชานนท์ สุขสถิตย์', rollNumber: 3, classroomId: 'cls-1', date: today, period: 'morning', status: 'late', checkInTime: '08:08', remark: 'รถติด' },
      { id: 'rec-4', studentId: 'std-104', studentNumber: '10004', studentName: 'ด.ญ.ณัฐณิชา ประเสริฐ', rollNumber: 4, classroomId: 'cls-1', date: today, period: 'morning', status: 'present', checkInTime: '07:35' },
      { id: 'rec-5', studentId: 'std-105', studentNumber: '10005', studentName: 'ด.ญ.ธัญญารัตน์ วงษ์สุวรรณ', rollNumber: 5, classroomId: 'cls-1', date: today, period: 'morning', status: 'leave', remark: 'มีใบลาป่วย (ไข้หวัด)' },
      { id: 'rec-6', studentId: 'std-106', studentNumber: '10006', studentName: 'ด.ญ.ปรียาภรณ์ บุญมี', rollNumber: 6, classroomId: 'cls-1', date: today, period: 'morning', status: 'present', checkInTime: '07:40' },
      { id: 'rec-7', studentId: 'std-107', studentNumber: '10007', studentName: 'ด.ช.พงศกร เจริญสุข', rollNumber: 7, classroomId: 'cls-1', date: today, period: 'morning', status: 'absent', remark: 'ติดต่อผู้ปกครองแล้ว' },
      { id: 'rec-8', studentId: 'std-108', studentNumber: '10008', studentName: 'ด.ญ.พิชญ์สินี เรืองฤทธิ์', rollNumber: 8, classroomId: 'cls-1', date: today, period: 'morning', status: 'present', checkInTime: '07:42' },
      { id: 'rec-9', studentId: 'std-109', studentNumber: '10009', studentName: 'ด.ช.ภาณุวิชญ์ ศรีสุวรรณ', rollNumber: 9, classroomId: 'cls-1', date: today, period: 'morning', status: 'present', checkInTime: '07:55' },
      { id: 'rec-10', studentId: 'std-110', studentNumber: '10010', studentName: 'ด.ญ.ศศิธร มณีฉาย', rollNumber: 10, classroomId: 'cls-1', date: today, period: 'morning', status: 'present', checkInTime: '07:30' },
      { id: 'rec-11', studentId: 'std-111', studentNumber: '10011', studentName: 'ด.ช.ศุภกฤต แก้วมณี', rollNumber: 11, classroomId: 'cls-1', date: today, period: 'morning', status: 'present', checkInTime: '07:48' },
      { id: 'rec-12', studentId: 'std-112', studentNumber: '10012', studentName: 'ด.ญ.อนันตญา โพธิ์ทอง', rollNumber: 12, classroomId: 'cls-1', date: today, period: 'morning', status: 'activity', remark: 'ตัวแทนแข่งขันตอบปัญหาวิชาการ' }
    ],
    summary: {
      total: 12,
      present: 8,
      late: 1,
      absent: 1,
      leave: 1,
      activity: 1,
      attendanceRate: 83.33
    },
    createdAt: new Date().toISOString(),
  }
];
