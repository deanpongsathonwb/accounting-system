import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { UserPlus, Search, Filter } from 'lucide-react';
import { useStudentsQuery } from '../services/queries/students.queries';
import { useClassroomsQuery } from '../services/queries/classrooms.queries';
import {
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} from '../services/mutations/students.mutations';
import { StudentListTable } from '../features/students/components/StudentListTable';
import { StudentFormModal } from '../features/students/components/StudentFormModal';
import { StudentDetailModal } from '../features/students/components/StudentDetailModal';
import { ConfirmDialog } from '../components/dialogs/ConfirmDialog';
import { LoadingState } from '../components/feedback/LoadingState';
import { useUiStore } from '../stores/uiStore';
import { Student } from '../types/student';
import { StudentFormValues } from '../validations/student.schema';
import { ExportReportButton } from '../features/reports/components/ExportReportButton';

export const StudentsPage: React.FC = () => {
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  const { data: classrooms = [] } = useClassroomsQuery();
  const { data: students = [], isLoading } = useStudentsQuery(
    selectedClassroomId === 'all' ? undefined : selectedClassroomId
  );

  const createMutation = useCreateStudentMutation();
  const updateMutation = useUpdateStudentMutation();
  const deleteMutation = useDeleteStudentMutation();
  const { addToast } = useUiStore();

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (student: Student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (values: StudentFormValues) => {
    try {
      if (editingStudent) {
        await updateMutation.mutateAsync({
          id: editingStudent.id,
          dto: values,
        });
        addToast({
          type: 'success',
          title: 'แก้ไขข้อมูลสำเร็จ',
          message: `อัปเดตข้อมูล ${values.prefix} ${values.firstName} แล้ว`,
        });
      } else {
        await createMutation.mutateAsync(values);
        addToast({
          type: 'success',
          title: 'เพิ่มนักเรียนสำเร็จ',
          message: `เพิ่ม ${values.prefix} ${values.firstName} เข้าสู่ระบบแล้ว`,
        });
      }
      setIsFormOpen(false);
    } catch {
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถบันทึกข้อมูลได้',
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStudent) return;
    try {
      await deleteMutation.mutateAsync(deletingStudent.id);
      addToast({
        type: 'success',
        title: 'ลบข้อมูลนักเรียนแล้ว',
        message: `ลบ ${deletingStudent.prefix} ${deletingStudent.firstName} เรียบร้อยแล้ว`,
      });
      setDeletingStudent(null);
    } catch {
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาดในการลบ',
      });
    }
  };

  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q) ||
      (s.nickname && s.nickname.toLowerCase().includes(q)) ||
      s.studentNumber.includes(q)
    );
  });

  const exportData = filteredStudents.map((s) => ({
    รหัสประจำตัว: s.studentNumber,
    คำนำหน้า: s.prefix,
    ชื่อ: s.firstName,
    นามสกุล: s.lastName,
    ชื่อเล่น: s.nickname || '-',
    เพศ: s.gender === 'male' ? 'ชาย' : 'หญิง',
    ห้องเรียน: classrooms.find((c) => c.id === s.classroomId)?.name || s.classroomId,
    เลขที่: s.rollNumber,
    เบอร์ผู้ปกครอง: s.parentPhone || '-',
    สถานะ: s.status === 'active' ? 'กำลังศึกษา' : 'พักการเรียน',
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="จัดการข้อมูลนักเรียน (Students)"
        subtitle={`รวมนักเรียนทั้งหมด ${students.length} คน`}
        action={
          <div className="flex items-center gap-2">
            <ExportReportButton filename="student_list" data={exportData} />
            <Button
              variant="primary"
              onClick={handleOpenAddModal}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              เพิ่มนักเรียนใหม่
            </Button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อ, นามสกุล หรือรหัสนักเรียน..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedClassroomId}
            onChange={(e) => setSelectedClassroomId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">ทุกห้องเรียน (All Rooms)</option>
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                ห้อง {c.name} ({c.gradeLevel})
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <LoadingState message="กำลังโหลดข้อมูลนักเรียน..." />
      ) : (
        <StudentListTable
          students={filteredStudents}
          onView={(student) => setViewingStudent(student)}
          onEdit={(student) => handleOpenEditModal(student)}
          onDelete={(student) => setDeletingStudent(student)}
        />
      )}

      {/* Add / Edit Modal */}
      <StudentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        student={editingStudent}
        classrooms={classrooms}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* View Detail Modal */}
      <StudentDetailModal
        isOpen={!!viewingStudent}
        onClose={() => setViewingStudent(null)}
        student={viewingStudent}
        onEdit={(s) => handleOpenEditModal(s)}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(null)}
        onConfirm={handleDeleteConfirm}
        title="ยืนยันการลบนักเรียน"
        message={`คุณต้องการลบข้อมูลของ "${deletingStudent?.prefix} ${deletingStudent?.firstName} ${deletingStudent?.lastName}" ใช่หรือไม่? การกระทำนี้ไม่สามารถยกเลิกได้`}
        isDangerous
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
