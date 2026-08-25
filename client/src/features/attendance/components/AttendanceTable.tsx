import React from 'react';
import { Student } from '../../../types/student';
import { AttendanceStatus } from '../../../types/attendance';
import { ATTENDANCE_STATUS_CONFIG } from '../../../constants/ui';
import { useAttendanceDraftStore } from '../stores/attendanceStore';
import { Avatar } from '../../../components/common/Avatar';
import { cn } from '../../../utils/cn';

export interface AttendanceTableProps {
  students: Student[];
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({ students }) => {
  const { recordsMap, setStudentStatus, setStudentRemark, filterStatus, searchQuery } = useAttendanceDraftStore();

  const statuses: AttendanceStatus[] = ['present', 'late', 'absent', 'leave', 'activity'];

  const filteredStudents = students.filter((student) => {
    const record = recordsMap[student.id] || { status: 'present' };
    const matchesFilter = filterStatus === 'all' || record.status === filterStatus;

    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesFilter;

    const matchesSearch =
      student.firstName.toLowerCase().includes(query) ||
      student.lastName.toLowerCase().includes(query) ||
      (student.nickname && student.nickname.toLowerCase().includes(query)) ||
      student.studentNumber.includes(query) ||
      String(student.rollNumber) === query;

    return matchesFilter && matchesSearch;
  });

  if (filteredStudents.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
        ไม่พบรายชื่อนักเรียนที่ตรงกับเงื่อนไขการค้นหา
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3.5 text-center w-16">เลขที่</th>
              <th className="px-4 py-3.5">ข้อมูลนักเรียน</th>
              <th className="px-4 py-3.5 text-center min-w-[320px]">สถานะการเข้าเรียน</th>
              <th className="px-4 py-3.5 w-48">หมายเหตุ / ใบลา</th>
              <th className="px-4 py-3.5 text-center w-24">เวลา</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.map((student) => {
              const record = recordsMap[student.id] || { status: 'present', remark: '', checkInTime: '' };
              const currentStatus = record.status;

              return (
                <tr
                  key={student.id}
                  id={`student-row-${student.id}`}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {/* Roll Number */}
                  <td className="px-4 py-3.5 text-center font-bold text-slate-700">
                    <span className="w-7 h-7 rounded-full bg-slate-100 inline-flex items-center justify-center text-xs text-slate-700">
                      {student.rollNumber}
                    </span>
                  </td>

                  {/* Student Info */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={`${student.firstName} ${student.lastName}`}
                        gender={student.gender}
                        size="md"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900">
                            {student.prefix} {student.firstName} {student.lastName}
                          </span>
                          {student.nickname && (
                            <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-1.5 py-0.5 rounded">
                              ({student.nickname})
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          รหัส: {student.studentNumber}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Attendance Status Buttons */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/50 max-w-sm mx-auto">
                      {statuses.map((status) => {
                        const config = ATTENDANCE_STATUS_CONFIG[status];
                        const isSelected = currentStatus === status;

                        return (
                          <button
                            key={status}
                            type="button"
                            onClick={() => setStudentStatus(student.id, status)}
                            className={cn(
                              'flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-all select-none cursor-pointer',
                              isSelected
                                ? 'bg-white shadow-xs text-slate-900 border border-slate-200/80 ring-2'
                                : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                            )}
                            style={
                              isSelected
                                ? {
                                    borderColor: config.color,
                                    boxShadow: `0 0 0 1px ${config.color}`,
                                    color: config.color,
                                  }
                                : undefined
                            }
                          >
                            {config.shortTh}
                          </button>
                        );
                      })}
                    </div>
                  </td>

                  {/* Remark input */}
                  <td className="px-4 py-3.5">
                    <input
                      type="text"
                      placeholder="ระบุหมายเหตุ (ถ้ามี)..."
                      value={record.remark || ''}
                      onChange={(e) => setStudentRemark(student.id, e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400"
                    />
                  </td>

                  {/* Time */}
                  <td className="px-4 py-3.5 text-center text-xs font-mono text-slate-500">
                    {record.checkInTime || '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
