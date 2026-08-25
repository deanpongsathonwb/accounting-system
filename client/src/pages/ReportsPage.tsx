import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { useClassroomsQuery } from '../services/queries/classrooms.queries';
import { useStudentsQuery } from '../services/queries/students.queries';
import { ReportSummaryChart } from '../features/reports/components/ReportSummaryChart';
import { HighAbsenceList } from '../features/reports/components/HighAbsenceList';
import { ExportReportButton } from '../features/reports/components/ExportReportButton';
import { StudentAbsenceRisk } from '../features/reports/types';
import { Card } from '../components/ui/Card';
import { Calendar, Filter, FileSpreadsheet, Printer } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { getTodayString, formatThaiDate } from '../utils/date';

export const ReportsPage: React.FC = () => {
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>('all');
  const { data: classrooms = [] } = useClassroomsQuery();
  const { data: students = [] } = useStudentsQuery(selectedClassroomId === 'all' ? undefined : selectedClassroomId);

  const today = getTodayString();

  const mockWeeklyStats = [
    { date: '2026-08-18', dayLabel: 'อังคาร 18 ส.ค.', presentRate: 92.5, presentCount: 37, lateCount: 2, absentCount: 1, leaveCount: 0, total: 40 },
    { date: '2026-08-19', dayLabel: 'พุธ 19 ส.ค.', presentRate: 95.0, presentCount: 38, lateCount: 1, absentCount: 0, leaveCount: 1, total: 40 },
    { date: '2026-08-20', dayLabel: 'พฤหัส 20 ส.ค.', presentRate: 90.0, presentCount: 36, lateCount: 2, absentCount: 1, leaveCount: 1, total: 40 },
    { date: '2026-08-21', dayLabel: 'ศุกร์ 21 ส.ค.', presentRate: 97.5, presentCount: 39, lateCount: 1, absentCount: 0, leaveCount: 0, total: 40 },
    { date: '2026-08-25', dayLabel: 'อังคาร 25 ส.ค.', presentRate: 85.0, presentCount: 34, lateCount: 3, absentCount: 2, leaveCount: 1, total: 40 },
  ];

  const sampleRisks: StudentAbsenceRisk[] = [
    {
      studentId: 'std-107',
      studentNumber: '10007',
      studentName: 'ด.ช.พงศกร เจริญสุข',
      classroomName: 'ม.1/1',
      absentCount: 4,
      lateCount: 3,
      leaveCount: 1,
      parentPhone: '087-890-1234',
      riskLevel: 'high',
    },
    {
      studentId: 'std-103',
      studentNumber: '10003',
      studentName: 'ด.ช.ชานนท์ สุขสถิตย์',
      classroomName: 'ม.1/1',
      absentCount: 3,
      lateCount: 5,
      leaveCount: 0,
      parentPhone: '083-456-7890',
      riskLevel: 'medium',
    },
  ];

  const exportSummaryData = students.map((s) => ({
    รหัสนักเรียน: s.studentNumber,
    ชื่อสกุล: `${s.prefix} ${s.firstName} ${s.lastName}`,
    ห้อง: classrooms.find((c) => c.id === s.classroomId)?.name || s.classroomId,
    เลขที่: s.rollNumber,
    อัตราการเข้าเรียน: '92.5%',
    มาเรียนสะสม: 18,
    สายสะสม: 1,
    ขาดสะสม: s.id === 'std-107' ? 4 : 0,
    ลาสะสม: s.id === 'std-105' ? 2 : 0,
  }));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="รายงานและสถิติการเช็คชื่อ (Reports & Analytics)"
        subtitle="สรุปผลการเข้าเรียนรายสัปดาห์ รายเดือน และนักเรียนกลุ่มเสี่ยง"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-4 h-4 text-slate-500" />}
            >
              พิมพ์รายงาน
            </Button>
            <ExportReportButton filename={`attendance_report_${today}`} data={exportSummaryData} />
          </div>
        }
      />

      {/* Filter Bar */}
      <Card className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">ตัวกรองรายงาน</h4>
            <p className="text-xs text-slate-500">เลือกช่วงเวลาและห้องเรียนที่ต้องการดูสถิติ</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedClassroomId}
            onChange={(e) => setSelectedClassroomId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">ทุกห้องเรียน (All Classrooms)</option>
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                ห้อง {c.name} ({c.gradeLevel})
              </option>
            ))}
          </select>

          <span className="text-xs text-slate-400 font-medium">
            ข้อมูลอัปเดต ณ {formatThaiDate(today, 'short')}
          </span>
        </div>
      </Card>

      {/* Summary Chart */}
      <ReportSummaryChart stats={mockWeeklyStats} />

      {/* High Absence Alert List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <HighAbsenceList risks={sampleRisks} />

        <Card className="space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              เกณฑ์การประเมินการเข้าชั้นเรียน
            </h3>
            <div className="space-y-3 pt-3 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">เข้าเรียนสม่ำเสมอ (&gt; 80%)</p>
                  <p className="text-slate-500">มีสิทธิ์เข้าสอบตามเกณฑ์ระเบียบกระทรวงศึกษาธิการ</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">กลุ่มเฝ้าระวัง (60% - 80%)</p>
                  <p className="text-slate-500">แจ้งเตือนครูประจำชั้นเพื่อประสานผู้ปกครอง</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">กลุ่มเสี่ยงหมดสิทธิ์สอบ (&lt; 60%)</p>
                  <p className="text-slate-500">ขาดเรียนเกิน 4 ครั้ง หรือมีเวลาเรียนไม่ถึงเกณฑ์</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-600">
            💡 คุณสามารถดาวน์โหลดไฟล์ Excel/CSV หรือพิมพ์รายงานเพื่อส่งฝ่ายทะเบียนได้ทันที
          </div>
        </Card>
      </div>
    </div>
  );
};
