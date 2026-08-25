import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../../../components/dialogs/Modal';
import { Button } from '../../../components/ui/Button';
import { FormInput } from '../../../components/forms/FormInput';
import { classroomSchema, ClassroomFormValues } from '../../../validations/classroom.schema';
import { Classroom } from '../../../types/classroom';

export interface ClassroomFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ClassroomFormValues) => void;
  classroom?: Classroom | null;
  isLoading?: boolean;
}

export const ClassroomFormModal: React.FC<ClassroomFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  classroom,
  isLoading,
}) => {
  const isEdit = !!classroom;

  const methods = useForm<ClassroomFormValues>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      name: '',
      gradeLevel: 'มัธยมศึกษาปีที่ 1',
      roomNumber: '',
      academicYear: '2569',
      semester: '1',
      advisorName: '',
      color: 'indigo',
    },
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (classroom) {
      reset({
        name: classroom.name,
        gradeLevel: classroom.gradeLevel,
        roomNumber: classroom.roomNumber,
        academicYear: classroom.academicYear,
        semester: classroom.semester,
        advisorName: classroom.advisorName,
        color: classroom.color || 'indigo',
      });
    } else {
      reset({
        name: '',
        gradeLevel: 'มัธยมศึกษาปีที่ 1',
        roomNumber: '',
        academicYear: '2569',
        semester: '1',
        advisorName: '',
        color: 'indigo',
      });
    }
  }, [classroom, reset, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'แก้ไขข้อมูลห้องเรียน' : 'เพิ่มห้องเรียนใหม่'}
      description="ระบุระดับชั้น ข้อมูลประจำห้อง และครูที่ปรึกษา"
      maxWidth="md"
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              name="name"
              label="ชื่อห้องเรียน *"
              placeholder="เช่น ม.1/1 หรือ ม.4/2"
            />
            <FormInput
              name="gradeLevel"
              label="ระดับชั้น *"
              placeholder="เช่น มัธยมศึกษาปีที่ 1"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput
              name="roomNumber"
              label="เลขที่ห้องเรียน *"
              placeholder="เช่น 111, 421"
            />
            <FormInput
              name="academicYear"
              label="ปีการศึกษา *"
              placeholder="เช่น 2569"
            />
            <FormInput
              name="semester"
              label="ภาคเรียน *"
              placeholder="เช่น 1"
            />
          </div>

          <FormInput
            name="advisorName"
            label="ครูที่ปรึกษา / ครูประจำชั้น *"
            placeholder="เช่น อ.วรรณภา จันทร์เพ็ญ"
          />

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
              ยกเลิก
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
              {isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มห้องเรียน'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
