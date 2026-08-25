import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';
import { useClassroomsQuery } from '../services/queries/classrooms.queries';
import {
  useCreateClassroomMutation,
  useUpdateClassroomMutation,
  useDeleteClassroomMutation,
} from '../services/mutations/classrooms.mutations';
import { ClassroomCard } from '../features/classrooms/components/ClassroomCard';
import { ClassroomFormModal } from '../features/classrooms/components/ClassroomFormModal';
import { ConfirmDialog } from '../components/dialogs/ConfirmDialog';
import { LoadingState } from '../components/feedback/LoadingState';
import { useUiStore } from '../stores/uiStore';
import { Classroom } from '../types/classroom';
import { ClassroomFormValues } from '../validations/classroom.schema';

export const ClassroomsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);
  const [deletingClassroom, setDeletingClassroom] = useState<Classroom | null>(null);

  const { data: classrooms = [], isLoading } = useClassroomsQuery();
  const createMutation = useCreateClassroomMutation();
  const updateMutation = useUpdateClassroomMutation();
  const deleteMutation = useDeleteClassroomMutation();
  const { addToast } = useUiStore();

  const handleOpenAdd = () => {
    setEditingClassroom(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (classroom: Classroom) => {
    setEditingClassroom(classroom);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (values: ClassroomFormValues) => {
    try {
      if (editingClassroom) {
        await updateMutation.mutateAsync({
          id: editingClassroom.id,
          dto: values,
        });
        addToast({
          type: 'success',
          title: 'แก้ไขข้อมูลห้องเรียนสำเร็จ',
          message: `อัปเดตห้อง ${values.name} เรียบร้อยแล้ว`,
        });
      } else {
        await createMutation.mutateAsync(values);
        addToast({
          type: 'success',
          title: 'เพิ่มห้องเรียนสำเร็จ',
          message: `สร้างห้อง ${values.name} เรียบร้อยแล้ว`,
        });
      }
      setIsFormOpen(false);
    } catch {
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาดในการบันทึกห้องเรียน',
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingClassroom) return;
    try {
      await deleteMutation.mutateAsync(deletingClassroom.id);
      addToast({
        type: 'success',
        title: 'ลบห้องเรียนสำเร็จ',
        message: `ลบห้อง ${deletingClassroom.name} แล้ว`,
      });
      setDeletingClassroom(null);
    } catch {
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาดในการลบห้องเรียน',
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="จัดการห้องเรียน (Classrooms)"
        subtitle="เพิ่ม ลบ แก้ไขข้อมูลห้องเรียนและครูที่ปรึกษา"
        action={
          <Button
            variant="primary"
            onClick={handleOpenAdd}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            เพิ่มห้องเรียนใหม่
          </Button>
        }
      />

      {isLoading ? (
        <LoadingState message="กำลังโหลดข้อมูลห้องเรียน..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {classrooms.map((cls) => (
            <ClassroomCard
              key={cls.id}
              classroom={cls}
              onEdit={(c) => handleOpenEdit(c)}
              onDelete={(c) => setDeletingClassroom(c)}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <ClassroomFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        classroom={editingClassroom}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingClassroom}
        onClose={() => setDeletingClassroom(null)}
        onConfirm={handleDeleteConfirm}
        title="ยืนยันการลบห้องเรียน"
        message={`คุณต้องการลบห้องเรียน "${deletingClassroom?.name}" ใช่หรือไม่? นักเรียนในห้องเรียนนี้จะไม่ถูกลบ`}
        isDangerous
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
