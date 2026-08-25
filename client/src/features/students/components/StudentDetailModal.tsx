import React from 'react';
import { Modal } from '../../../components/dialogs/Modal';
import { Button } from '../../../components/ui/Button';
import { Avatar } from '../../../components/common/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { Student } from '../../../types/student';
import { Phone, School, UserCheck, Calendar } from 'lucide-react';

export interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onEdit?: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  isOpen,
  onClose,
  student,
  onEdit,
}) => {
  if (!student) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ข้อมูลประวัตินักเรียน"
      description={`รหัสประจำตัว: ${student.studentNumber}`}
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Header Profile */}
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
          <Avatar
            name={`${student.firstName} ${student.lastName}`}
            gender={student.gender}
            size="lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-slate-900">
                {student.prefix} {student.firstName} {student.lastName}
              </h4>
              {student.nickname && (
                <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">
                  ({student.nickname})
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant={student.status === 'active' ? 'success' : 'neutral'} size="sm">
                {student.status === 'active' ? 'กำลังศึกษา' : 'พักการเรียน'}
              </Badge>
              <span className="text-xs text-slate-500">เลขที่ {student.rollNumber}</span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
            <School className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-400 text-xs">ชั้น/ห้องเรียน</p>
              <p className="font-semibold text-slate-800">{student.classroomName || student.classroomId}</p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-400 text-xs">เบอร์โทรผู้ปกครอง</p>
              <p className="font-semibold text-slate-800">{student.parentPhone || 'ไม่ได้ระบุ'}</p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
            <UserCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-400 text-xs">เพศ</p>
              <p className="font-semibold text-slate-800">
                {student.gender === 'male' ? 'ชาย' : student.gender === 'female' ? 'หญิง' : 'อื่นๆ'}
              </p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-400 text-xs">สถิติการเข้าเรียนสะสม</p>
              <p className="font-semibold text-emerald-600">92.5% (มาสม่ำเสมอ)</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            ปิดหน้าต่าง
          </Button>
          {onEdit && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(student);
              }}
            >
              แก้ไขข้อมูล
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
