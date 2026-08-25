import React from 'react';
import { Student } from '../../../types/student';
import { Avatar } from '../../../components/common/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { Edit2, Trash2, Eye } from 'lucide-react';

export interface StudentListTableProps {
  students: Student[];
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export const StudentListTable: React.FC<StudentListTableProps> = ({
  students,
  onView,
  onEdit,
  onDelete,
}) => {
  if (students.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
        ยังไม่มีข้อมูลนักเรียนในห้องเรียนนี้
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
              <th className="px-4 py-3.5">รหัสนักเรียน</th>
              <th className="px-4 py-3.5">ชื่อ - นามสกุล</th>
              <th className="px-4 py-3.5">เพศ</th>
              <th className="px-4 py-3.5">เบอร์ผู้ปกครอง</th>
              <th className="px-4 py-3.5 text-center">สถานะ</th>
              <th className="px-4 py-3.5 text-right w-28">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3 text-center font-bold text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-slate-100 inline-flex items-center justify-center text-xs">
                    {student.rollNumber}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-600 font-semibold">
                  {student.studentNumber}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={`${student.firstName} ${student.lastName}`}
                      gender={student.gender}
                      size="sm"
                    />
                    <div>
                      <span className="font-semibold text-slate-900">
                        {student.prefix} {student.firstName} {student.lastName}
                      </span>
                      {student.nickname && (
                        <span className="text-xs text-indigo-600 font-medium ml-1.5">
                          ({student.nickname})
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">
                  {student.gender === 'male' ? 'ชาย' : student.gender === 'female' ? 'หญิง' : 'อื่นๆ'}
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">
                  {student.parentPhone || '-'}
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge variant={student.status === 'active' ? 'success' : 'neutral'} size="sm">
                    {student.status === 'active' ? 'กำลังศึกษา' : 'พักการเรียน'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onView(student)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="ดูรายละเอียด"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(student)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                      title="แก้ไขข้อมูล"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(student)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="ลบนักเรียน"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
