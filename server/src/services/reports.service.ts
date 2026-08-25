import { attendanceRepository } from '../repositories/attendance.repository';
import { classroomsRepository } from '../repositories/classrooms.repository';
import { studentsRepository } from '../repositories/students.repository';

export class ReportsService {
  async getSummary(classroomId?: string, startDate?: string, endDate?: string) {
    const classrooms = await classroomsRepository.findAll();
    const students = await studentsRepository.findAll(classroomId);
    const records = await attendanceRepository.findRecords({ classroomId });

    let filteredRecords = records;
    if (startDate) {
      filteredRecords = filteredRecords.filter((r) => r.date >= startDate);
    }
    if (endDate) {
      filteredRecords = filteredRecords.filter((r) => r.date <= endDate);
    }

    const totalRecords = filteredRecords.length;
    const present = filteredRecords.filter((r) => r.status === 'present').length;
    const absent = filteredRecords.filter((r) => r.status === 'absent').length;
    const late = filteredRecords.filter((r) => r.status === 'late').length;
    const leave = filteredRecords.filter((r) => r.status === 'leave').length;
    const overallRate = totalRecords > 0 ? Math.round(((present + late * 0.5) / totalRecords) * 100) : 100;

    return {
      totalClassrooms: classrooms.length,
      totalStudents: students.length,
      totalRecords,
      stats: {
        present,
        absent,
        late,
        leave,
        overallRate,
      },
    };
  }

  async getHighAbsenceList(threshold: number = 3) {
    const students = await studentsRepository.findAll();
    const records = await attendanceRepository.findRecords();

    return students
      .map((student) => {
        const studentRecords = records.filter((r) => r.studentId === student.id);
        const absentCount = studentRecords.filter((r) => r.status === 'absent').length;
        const lateCount = studentRecords.filter((r) => r.status === 'late').length;
        const total = studentRecords.length;
        const rate = total > 0 ? Math.round(((total - absentCount) / total) * 100) : 100;

        return {
          studentId: student.id,
          studentCode: student.studentCode,
          studentName: `${student.title}${student.firstName} ${student.lastName}`,
          studentNumber: student.studentNumber,
          classroomName: student.classroomName || 'ไม่ระบุห้องเรียน',
          absentCount,
          lateCount,
          attendanceRate: rate,
          parentPhone: student.parentPhone,
        };
      })
      .filter((s) => s.absentCount >= threshold || s.lateCount >= 4)
      .sort((a, b) => b.absentCount - a.absentCount);
  }
}

export const reportsService = new ReportsService();
