import React from 'react';
import { Classroom } from '../../../types/classroom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Users, GraduationCap, Edit2, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { useAppStore } from '../../../stores/appStore';

export interface ClassroomCardProps {
  classroom: Classroom;
  onEdit: (classroom: Classroom) => void;
  onDelete: (classroom: Classroom) => void;
}

export const ClassroomCard: React.FC<ClassroomCardProps> = ({ classroom, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { setSelectedClassroomId } = useAppStore();

  const handleStartAttendance = () => {
    setSelectedClassroomId(classroom.id);
    navigate(ROUTES.ATTENDANCE);
  };

  return (
    <Card hoverEffect className="flex flex-col justify-between relative group">
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                ห้อง {classroom.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium">{classroom.gradeLevel}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(classroom)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
              title="แก้ไขห้องเรียน"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(classroom)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="ลบห้องเรียน"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-600 py-1 border-b border-slate-100">
            <span className="text-slate-400">ห้องเรียน</span>
            <span className="font-semibold text-slate-700">ห้อง {classroom.roomNumber}</span>
          </div>
          <div className="flex items-center justify-between text-slate-600 py-1 border-b border-slate-100">
            <span className="text-slate-400">ครูที่ปรึกษา</span>
            <span className="font-medium text-slate-800 truncate max-w-[150px]">{classroom.advisorName}</span>
          </div>
          <div className="flex items-center justify-between text-slate-600 py-1">
            <span className="text-slate-400">จำนวนนักเรียน</span>
            <span className="inline-flex items-center gap-1 font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
              <Users className="w-3.5 h-3.5" />
              {classroom.totalStudents ?? 0} คน
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={handleStartAttendance}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          className="w-full"
        >
          เช็คชื่อห้องนี้
        </Button>
      </div>
    </Card>
  );
};
