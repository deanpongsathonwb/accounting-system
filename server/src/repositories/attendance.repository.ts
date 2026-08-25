import { dbStore } from '../database/inMemoryStore';
import { AttendanceRecord } from '../types/attendance';

export class AttendanceRepository {
  async findRecords(filter?: { classroomId?: string; date?: string; studentId?: string }): Promise<AttendanceRecord[]> {
    return dbStore.getAttendanceRecords(filter);
  }

  async saveRecord(record: AttendanceRecord): Promise<AttendanceRecord> {
    return dbStore.saveAttendanceRecord(record);
  }

  async saveBatch(records: AttendanceRecord[]): Promise<AttendanceRecord[]> {
    return records.map((r) => dbStore.saveAttendanceRecord(r));
  }

  async deleteRecord(id: string): Promise<boolean> {
    return dbStore.deleteAttendanceRecord(id);
  }
}

export const attendanceRepository = new AttendanceRepository();
