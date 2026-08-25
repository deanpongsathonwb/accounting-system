import { attendanceRepository } from '../repositories/attendance.repository';
import { classroomsRepository } from '../repositories/classrooms.repository';
import { studentsRepository } from '../repositories/students.repository';
import { AttendanceRecord, AttendanceSession, BulkAttendancePayload } from '../types/attendance';
import { NotFoundError } from '../utils/errors';
import { generateId, getTodayDateString, calculateAttendanceRate } from '../utils/helpers';

export class AttendanceService {
  async getRecords(classroomId?: string, date?: string, studentId?: string): Promise<AttendanceRecord[]> {
    return attendanceRepository.findRecords({ classroomId, date, studentId });
  }

  async getSession(classroomId: string, date: string = getTodayDateString()): Promise<AttendanceSession> {
    const classroom = await classroomsRepository.findById(classroomId);
    if (!classroom) {
      throw new NotFoundError('ไม่พบข้อมูลห้องเรียน');
    }

    const students = await studentsRepository.findAll(classroomId);
    const existingRecords = await attendanceRepository.findRecords({ classroomId, date });
    const recordsMap = new Map<string, AttendanceRecord>(existingRecords.map((r) => [r.studentId, r]));

    const fullRecords: AttendanceRecord[] = students.map((std) => {
      const recorded = recordsMap.get(std.id);
      if (recorded) return recorded;

      return {
        id: generateId('att_rec'),
        studentId: std.id,
        studentName: `${std.title}${std.firstName} ${std.lastName}`,
        studentNumber: std.studentNumber,
        classroomId,
        classroomName: classroom.name,
        date,
        status: 'present',
        timestamp: new Date().toISOString(),
        method: 'manual',
      };
    });

    const totalStudents = fullRecords.length;
    const presentCount = fullRecords.filter((r) => r.status === 'present').length;
    const absentCount = fullRecords.filter((r) => r.status === 'absent').length;
    const lateCount = fullRecords.filter((r) => r.status === 'late').length;
    const leaveCount = fullRecords.filter((r) => r.status === 'leave').length;
    const presentRate = calculateAttendanceRate(presentCount, lateCount, totalStudents);

    return {
      id: `session_${classroomId}_${date}`,
      classroomId,
      date,
      title: `การเช็คชื่อ ${classroom.name} ประจำวันที่ ${date}`,
      status: existingRecords.length > 0 ? 'completed' : 'draft',
      totalStudents,
      presentCount,
      absentCount,
      lateCount,
      leaveCount,
      presentRate,
      records: fullRecords,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async saveBulkAttendance(payload: BulkAttendancePayload): Promise<AttendanceSession> {
    const classroom = await classroomsRepository.findById(payload.classroomId);
    if (!classroom) {
      throw new NotFoundError('ไม่พบข้อมูลห้องเรียน');
    }

    const students = await studentsRepository.findAll(payload.classroomId);
    const studentMap = new Map(students.map((s) => [s.id, s]));

    const recordsToSave: AttendanceRecord[] = payload.items.map((item) => {
      const student = studentMap.get(item.studentId);
      return {
        id: generateId('att_rec'),
        studentId: item.studentId,
        studentName: student ? `${student.title}${student.firstName} ${student.lastName}` : undefined,
        studentNumber: student?.studentNumber,
        classroomId: payload.classroomId,
        classroomName: classroom.name,
        date: payload.date,
        status: item.status,
        remark: item.remark,
        timestamp: new Date().toISOString(),
        method: 'batch',
      };
    });

    await attendanceRepository.saveBatch(recordsToSave);
    return this.getSession(payload.classroomId, payload.date);
  }

  async recordSingle(data: {
    studentId: string;
    classroomId: string;
    date: string;
    status: 'present' | 'absent' | 'late' | 'leave';
    remark?: string;
    method?: 'manual' | 'qr' | 'barcode' | 'batch';
  }): Promise<AttendanceRecord> {
    const student = await studentsRepository.findById(data.studentId);
    const classroom = await classroomsRepository.findById(data.classroomId);

    const record: AttendanceRecord = {
      id: generateId('att_rec'),
      studentId: data.studentId,
      studentName: student ? `${student.title}${student.firstName} ${student.lastName}` : undefined,
      studentNumber: student?.studentNumber,
      classroomId: data.classroomId,
      classroomName: classroom?.name,
      date: data.date,
      status: data.status,
      remark: data.remark,
      timestamp: new Date().toISOString(),
      method: data.method || 'manual',
    };

    return attendanceRepository.saveRecord(record);
  }
}

export const attendanceService = new AttendanceService();
