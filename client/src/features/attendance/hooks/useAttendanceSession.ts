import { useEffect } from 'react';
import { useAttendanceSessionQuery } from '../../../services/queries/attendance.queries';
import { useStudentsQuery } from '../../../services/queries/students.queries';
import { useAttendanceDraftStore } from '../stores/attendanceStore';
import { useSaveAttendanceMutation } from '../../../services/mutations/attendance.mutations';
import { useUiStore } from '../../../stores/uiStore';
import { calculateAttendanceStats } from '../utils';
import confetti from 'canvas-confetti';

export function useAttendanceSession(classroomId: string, date: string, period: string) {
  const { data: session, isLoading: isSessionLoading } = useAttendanceSessionQuery(classroomId, date, period);
  const { data: students = [], isLoading: isStudentsLoading } = useStudentsQuery(classroomId);
  const saveMutation = useSaveAttendanceMutation();
  const { addToast } = useUiStore();

  const {
    recordsMap,
    setStudentStatus,
    setBulkStatus,
    setInitialRecords,
    resetDraft,
    isDirty,
  } = useAttendanceDraftStore();

  // Sync draft state with session records or initialize default "present" for all students
  useEffect(() => {
    if (session?.records && session.records.length > 0) {
      setInitialRecords(session.records);
    } else if (students.length > 0) {
      // Default all to 'present' initially
      const initial = students.map((s) => ({
        studentId: s.id,
        status: 'present' as const,
        checkInTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      }));
      setInitialRecords(initial);
    }
  }, [session, students, setInitialRecords]);

  // Compute live summary from draft recordsMap
  const currentRecordsArray = students.map((s) => recordsMap[s.id] || { status: 'present' as const });
  const liveSummary = calculateAttendanceStats(currentRecordsArray);

  const handleCheckAllPresent = () => {
    setBulkStatus(
      students.map((s) => s.id),
      'present'
    );
    addToast({
      type: 'info',
      title: 'เช็คชื่อ "มาเรียน" ครบทุกคนแล้ว',
    });
  };

  const handleResetAll = () => {
    resetDraft();
    const initial = students.map((s) => ({
      studentId: s.id,
      status: 'present' as const,
    }));
    setInitialRecords(initial);
  };

  const handleSave = async () => {
    const records = students.map((s) => {
      const draft = recordsMap[s.id] || { status: 'present' as const, remark: '' };
      return {
        studentId: s.id,
        status: draft.status,
        remark: draft.remark,
        checkInTime: draft.checkInTime,
      };
    });

    try {
      await saveMutation.mutateAsync({
        classroomId,
        date,
        period,
        records,
      });

      // Fire confetti if 100% attendance rate!
      if (liveSummary.total > 0 && liveSummary.present === liveSummary.total) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      addToast({
        type: 'success',
        title: 'บันทึกการเช็คชื่อสำเร็จ',
        message: `บันทึกข้อมูลนักเรียน ${students.length} คนเรียบร้อยแล้ว`,
      });
    } catch {
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาดในการบันทึก',
        message: 'กรุณาลองใหม่อีกครั้ง',
      });
    }
  };

  return {
    students,
    session,
    isLoading: isSessionLoading || isStudentsLoading,
    liveSummary,
    isDirty,
    isSaving: saveMutation.isPending,
    setStudentStatus,
    handleCheckAllPresent,
    handleResetAll,
    handleSave,
  };
}
