import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { useClassroomsQuery } from '../services/queries/classrooms.queries';
import { useAppStore } from '../stores/appStore';
import { useAttendanceSession } from '../features/attendance/hooks/useAttendanceSession';
import { AttendanceSummaryBar } from '../features/attendance/components/AttendanceSummaryBar';
import { AttendanceFilterBar } from '../features/attendance/components/AttendanceFilterBar';
import { AttendanceActionControls } from '../features/attendance/components/AttendanceActionControls';
import { AttendanceTable } from '../features/attendance/components/AttendanceTable';
import { BarcodeScannerModal } from '../components/common/BarcodeScannerModal';
import { LoadingState } from '../components/feedback/LoadingState';
import { PERIOD_OPTIONS } from '../constants/ui';
import { Calendar, Clock, Layers } from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { selectedClassroomId, setSelectedClassroomId, selectedDate, setSelectedDate, selectedPeriod, setSelectedPeriod } = useAppStore();
  const { data: classrooms = [], isLoading: isClassroomsLoading } = useClassroomsQuery();

  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // If no classroom selected yet, select first available
  const activeClassroomId = selectedClassroomId || classrooms[0]?.id || 'cls-1';

  const {
    students,
    isLoading,
    liveSummary,
    isDirty,
    isSaving,
    setStudentStatus,
    handleCheckAllPresent,
    handleResetAll,
    handleSave,
  } = useAttendanceSession(activeClassroomId, selectedDate, selectedPeriod);

  const currentClassroom = classrooms.find((c) => c.id === activeClassroomId) || classrooms[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="บันทึกการเช็คชื่อนักเรียน (Roll Call)"
        subtitle={`ห้อง ${currentClassroom?.name || 'ม.1/1'} • ${currentClassroom?.advisorName || 'ครูที่ปรึกษา'}`}
      />

      {/* Selector Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Classroom Selector */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            เลือกห้องเรียน
          </label>
          <select
            value={activeClassroomId}
            onChange={(e) => setSelectedClassroomId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          >
            {classrooms.map((cls) => (
              <option key={cls.id} value={cls.id}>
                ห้อง {cls.name} - {cls.gradeLevel} ({cls.totalStudents || 0} คน)
              </option>
            ))}
          </select>
        </div>

        {/* Date Selector */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            วันที่เช็คชื่อ
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        {/* Period Selector */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            รอบ / คาบเรียน
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          >
            {PERIOD_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <LoadingState message="กำลังโหลดข้อมูลรายชื่อนักเรียนและประวัติการเช็คชื่อ..." />
      ) : (
        <>
          {/* Real-time Summary Card */}
          <AttendanceSummaryBar summary={liveSummary} />

          {/* Action Buttons Toolbar */}
          <AttendanceActionControls
            onCheckAllPresent={handleCheckAllPresent}
            onResetAll={handleResetAll}
            onOpenScanner={() => setIsScannerOpen(true)}
            onSave={handleSave}
            isSaving={isSaving}
            isDirty={isDirty}
          />

          {/* Search & Filter Bar */}
          <AttendanceFilterBar />

          {/* Main Attendance Table */}
          <AttendanceTable students={students} />
        </>
      )}

      {/* Barcode / Quick Roll Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        students={students}
        onCheckStudent={(stdId, status) => setStudentStatus(stdId, status)}
      />
    </div>
  );
};
