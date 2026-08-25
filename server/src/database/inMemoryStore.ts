import { Classroom } from '../types/classroom';
import { Student } from '../types/student';
import { User } from '../types/user';
import { AttendanceRecord, AttendanceSession } from '../types/attendance';
import { SEED_USERS, SEED_CLASSROOMS, SEED_STUDENTS, SEED_ATTENDANCE_RECORDS } from './seed';
import { logger } from '../utils/logger';

class InMemoryStore {
  private users: Map<string, User> = new Map();
  private classrooms: Map<string, Classroom> = new Map();
  private students: Map<string, Student> = new Map();
  private attendanceRecords: Map<string, AttendanceRecord> = new Map();
  private attendanceSessions: Map<string, AttendanceSession> = new Map();
  private initialized = false;

  constructor() {
    this.init();
  }

  public init(): void {
    if (this.initialized) return;

    SEED_USERS.forEach((u) => this.users.set(u.id, { ...u }));
    SEED_CLASSROOMS.forEach((c) => this.classrooms.set(c.id, { ...c }));
    SEED_STUDENTS.forEach((s) => this.students.set(s.id, { ...s }));
    SEED_ATTENDANCE_RECORDS.forEach((a) => this.attendanceRecords.set(a.id, { ...a }));

    this.initialized = true;
    logger.info('In-memory database store initialized with seed records.');
  }

  // Users
  public getUsers(): User[] {
    return Array.from(this.users.values());
  }

  public getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  public getUserByUsername(username: string): User | undefined {
    return Array.from(this.users.values()).find((u) => u.username.toLowerCase() === username.toLowerCase());
  }

  // Classrooms
  public getClassrooms(): Classroom[] {
    return Array.from(this.classrooms.values()).map((cls) => {
      const count = Array.from(this.students.values()).filter((s) => s.classroomId === cls.id && s.isActive).length;
      return { ...cls, studentCount: count };
    });
  }

  public getClassroomById(id: string): Classroom | undefined {
    const cls = this.classrooms.get(id);
    if (!cls) return undefined;
    const count = Array.from(this.students.values()).filter((s) => s.classroomId === cls.id && s.isActive).length;
    return { ...cls, studentCount: count };
  }

  public createClassroom(classroom: Classroom): Classroom {
    this.classrooms.set(classroom.id, classroom);
    return classroom;
  }

  public updateClassroom(id: string, updates: Partial<Classroom>): Classroom | undefined {
    const existing = this.classrooms.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.classrooms.set(id, updated);
    return updated;
  }

  public deleteClassroom(id: string): boolean {
    return this.classrooms.delete(id);
  }

  // Students
  public getStudents(classroomId?: string): Student[] {
    let list = Array.from(this.students.values());
    if (classroomId) {
      list = list.filter((s) => s.classroomId === classroomId);
    }
    return list.map((s) => {
      const cls = this.classrooms.get(s.classroomId);
      const studentRecords = Array.from(this.attendanceRecords.values()).filter((a) => a.studentId === s.id);
      const total = studentRecords.length;
      const present = studentRecords.filter((a) => a.status === 'present').length;
      const late = studentRecords.filter((a) => a.status === 'late').length;
      const leave = studentRecords.filter((a) => a.status === 'leave').length;
      const absent = studentRecords.filter((a) => a.status === 'absent').length;
      const attendanceRate = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 100;

      return {
        ...s,
        classroomName: cls?.name || s.classroomName,
        attendanceStats: {
          totalDays: total,
          present,
          late,
          leave,
          absent,
          attendanceRate,
        },
      };
    });
  }

  public getStudentById(id: string): Student | undefined {
    const s = this.students.get(id);
    if (!s) return undefined;
    const cls = this.classrooms.get(s.classroomId);
    const studentRecords = Array.from(this.attendanceRecords.values()).filter((a) => a.studentId === s.id);
    const total = studentRecords.length;
    const present = studentRecords.filter((a) => a.status === 'present').length;
    const late = studentRecords.filter((a) => a.status === 'late').length;
    const leave = studentRecords.filter((a) => a.status === 'leave').length;
    const absent = studentRecords.filter((a) => a.status === 'absent').length;
    const attendanceRate = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 100;

    return {
      ...s,
      classroomName: cls?.name || s.classroomName,
      attendanceStats: {
        totalDays: total,
        present,
        late,
        leave,
        absent,
        attendanceRate,
      },
    };
  }

  public getStudentByCodeOrBarcode(code: string): Student | undefined {
    return Array.from(this.students.values()).find(
      (s) => s.studentCode === code || s.barcode === code || s.rfid === code
    );
  }

  public createStudent(student: Student): Student {
    this.students.set(student.id, student);
    return student;
  }

  public updateStudent(id: string, updates: Partial<Student>): Student | undefined {
    const existing = this.students.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.students.set(id, updated);
    return updated;
  }

  public deleteStudent(id: string): boolean {
    return this.students.delete(id);
  }

  // Attendance
  public getAttendanceRecords(filter?: { classroomId?: string; date?: string; studentId?: string }): AttendanceRecord[] {
    let list = Array.from(this.attendanceRecords.values());
    if (filter?.classroomId) {
      list = list.filter((r) => r.classroomId === filter.classroomId);
    }
    if (filter?.date) {
      list = list.filter((r) => r.date === filter.date);
    }
    if (filter?.studentId) {
      list = list.filter((r) => r.studentId === filter.studentId);
    }
    return list;
  }

  public saveAttendanceRecord(record: AttendanceRecord): AttendanceRecord {
    // Find if duplicate student on same date exists, replace it
    const existing = Array.from(this.attendanceRecords.values()).find(
      (r) => r.studentId === record.studentId && r.date === record.date
    );
    if (existing) {
      const updated = { ...existing, ...record, id: existing.id };
      this.attendanceRecords.set(existing.id, updated);
      return updated;
    }
    this.attendanceRecords.set(record.id, record);
    return record;
  }

  public deleteAttendanceRecord(id: string): boolean {
    return this.attendanceRecords.delete(id);
  }
}

export const dbStore = new InMemoryStore();
