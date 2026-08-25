import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../../../components/dialogs/Modal';
import { Button } from '../../../components/ui/Button';
import { FormInput } from '../../../components/forms/FormInput';
import { FormSelect } from '../../../components/forms/FormSelect';
import { studentSchema, StudentFormValues } from '../../../validations/student.schema';
import { Student } from '../../../types/student';
import { Classroom } from '../../../types/classroom';

export interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: StudentFormValues) => void;
  student?: Student | null;
  classrooms: Classroom[];
  isLoading?: boolean;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  student,
  classrooms,
  isLoading,
}) => {
  const isEdit = !!student;

  const methods = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      studentNumber: '',
      prefix: 'เด็กชาย',
      firstName: '',
      lastName: '',
      nickname: '',
      gender: 'male',
      classroomId: classrooms[0]?.id || '',
      rollNumber: 1,
      parentPhone: '',
      status: 'active',
    },
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (student) {
      reset({
        studentNumber: student.studentNumber,
        prefix: student.prefix,
        firstName: student.firstName,
        lastName: student.lastName,
        nickname: student.nickname || '',
        gender: student.gender,
        classroomId: student.classroomId,
        rollNumber: student.rollNumber,
        parentPhone: student.parentPhone || '',
        status: student.status,
      });
    } else {
      reset({
        studentNumber: '',
        prefix: 'เด็กชาย',
        firstName: '',
        lastName: '',
        nickname: '',
        gender: 'male',
        classroomId: classrooms[0]?.id || '',
        rollNumber: 1,
        parentPhone: '',
        status: 'active',
      });
    }
  }, [student, classrooms, reset, isOpen]);

  const classroomOptions = classrooms.map((c) => ({
    value: c.id,
    label: `${c.name} (${c.gradeLevel})`,
  }));

  const prefixOptions = [
    { value: 'เด็กชาย', label: 'เด็กชาย (ด.ช.)' },
    { value: 'เด็กหญิง', label: 'เด็กหญิง (ด.ญ.)' },
    { value: 'นาย', label: 'นาย' },
    { value: 'นางสาว', label: 'นางสาว (น.ส.)' },
  ];

  const genderOptions = [
    { value: 'male', label: 'ชาย' },
    { value: 'female', label: 'หญิง' },
    { value: 'other', label: 'อื่นๆ' },
  ];

  const statusOptions = [
    { value: 'active', label: 'กำลังศึกษา (Active)' },
    { value: 'inactive', label: 'พักการเรียน / พ้นสภาพ' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'แก้ไขข้อมูลนักเรียน' : 'เพิ่มนักเรียนใหม่'}
      description="กรอกข้อมูลประจำตัวนักเรียนและห้องเรียน"
      maxWidth="lg"
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              name="studentNumber"
              label="เลขประจำตัวนักเรียน *"
              placeholder="เช่น 10001"
            />
            <FormSelect
              name="classroomId"
              label="ห้องเรียน *"
              options={classroomOptions}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormSelect
              name="prefix"
              label="คำนำหน้าชื่อ *"
              options={prefixOptions}
            />
            <FormInput
              name="firstName"
              label="ชื่อจริง *"
              placeholder="เช่น กิตติศักดิ์"
            />
            <FormInput
              name="lastName"
              label="นามสกุล *"
              placeholder="เช่น มีชัย"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput
              name="nickname"
              label="ชื่อเล่น"
              placeholder="เช่น บอส"
            />
            <FormSelect
              name="gender"
              label="เพศ *"
              options={genderOptions}
            />
            <FormInput
              name="rollNumber"
              type="number"
              label="เลขที่ *"
              placeholder="เช่น 1"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              name="parentPhone"
              label="เบอร์โทรศัพท์ผู้ปกครอง"
              placeholder="เช่น 081-234-5678"
            />
            <FormSelect
              name="status"
              label="สถานะนักเรียน"
              options={statusOptions}
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
              ยกเลิก
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
              {isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มนักเรียน'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
