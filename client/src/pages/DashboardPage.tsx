import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { StatsCard } from '../components/feedback/StatsCard';
import { useAttendanceStatsQuery } from '../services/queries/attendance.queries';
import { useClassroomsQuery } from '../services/queries/classrooms.queries';
import { getTodayString, formatThaiDate } from '../utils/date';
import { formatPercentage } from '../utils/format';
import {
  Users,
  CheckCircle2,
  Clock,
  UserX,
  CalendarDays,
  GraduationCap,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useAppStore } from '../stores/appStore';
import { ReportSummaryChart } from '../features/reports/components/ReportSummaryChart';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const today = getTodayString();
  const { data: stats } = useAttendanceStatsQuery(today);
  const { data: classrooms = [] } = useClassroomsQuery();
  const { setSelectedClassroomId, settings } = useAppStore();

  const handleGoAttendance = (classroomId: string) => {
    setSelectedClassroomId(classroomId);
    navigate(ROUTES.ATTENDANCE);
  };

  const sampleWeeklyStats = [
    { date: '2026-08-21', dayLabel: 'ศุกร์ 21 ส.ค.', presentRate: 95.0, presentCount: 38, lateCount: 2, absentCount: 0, leaveCount: 0, total: 40 },
    { date: '2026-08-22', dayLabel: 'เสาร์ 22 ส.ค.', presentRate: 0, presentCount: 0, lateCount: 0, absentCount: 0, leaveCount: 0, total: 0 },
    { date: '2026-08-23', dayLabel: 'อาทิตย์ 23 ส.ค.', presentRate: 0, presentCount: 0, lateCount: 0, absentCount: 0, leaveCount: 0, total: 0 },
    { date: '2026-08-24', dayLabel: 'จันทร์ 24 ส.ค.', presentRate: 90.0, presentCount: 36, lateCount: 3, absentCount: 1, leaveCount: 0, total: 40 },
    { date: '2026-08-25', dayLabel: 'วันนี้ (25 ส.ค.)', presentRate: stats?.overallRate || 83.3, presentCount: stats?.todayPresentCount || 8, lateCount: stats?.todayLateCount || 1, absentCount: stats?.todayAbsentCount || 1, leaveCount: stats?.todayLeaveCount || 1, total: 12 },
  ].filter(s => s.total > 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`ภาพรวมระบบเช็คชื่อ • ${settings.schoolName}`}
        subtitle={`ประจำ${formatThaiDate(today, 'full')} | ภาคเรียนที่ ${settings.schoolTerm}/${settings.schoolYear}`}
        action={
          <Button
            variant="primary"
            onClick={() => navigate(ROUTES.ATTENDANCE)}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            เริ่มเช็คชื่อวันนี้
          </Button>
        }
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          id="stat-present"
          title="มาเรียนวันนี้"
          value={`${stats?.todayPresentCount ?? 8} คน`}
          subtitle="คิดเป็นอัตราส่วนสูงสุด"
          icon={<CheckCircle2 className="w-6 h-6" />}
          iconBgColor="bg-emerald-50 text-emerald-600"
          trend={{ value: formatPercentage(stats?.overallRate ?? 83.3), isPositive: true }}
        />

        <StatsCard
          id="stat-late"
          title="มาสาย"
          value={`${stats?.todayLateCount ?? 1} คน`}
          subtitle={`หลังเวลา ${settings.lateCutoffTime} น.`}
          icon={<Clock className="w-6 h-6" />}
          iconBgColor="bg-amber-50 text-amber-600"
        />

        <StatsCard
          id="stat-absent"
          title="ขาดเรียน / ลา"
          value={`${(stats?.todayAbsentCount ?? 1) + (stats?.todayLeaveCount ?? 1)} คน`}
          subtitle={`ขาด ${stats?.todayAbsentCount ?? 1} | ลา ${stats?.todayLeaveCount ?? 1}`}
          icon={<UserX className="w-6 h-6" />}
          iconBgColor="bg-rose-50 text-rose-600"
        />

        <StatsCard
          id="stat-classrooms"
          title="ห้องเรียนที่เช็คแล้ว"
          value={`${stats?.classroomsChecked ?? 1} / ${classrooms.length || 4} ห้อง`}
          subtitle="สถานะความคืบหน้าการเช็คชื่อ"
          icon={<GraduationCap className="w-6 h-6" />}
          iconBgColor="bg-indigo-50 text-indigo-600"
        />
      </div>

      {/* Weekly Trends Chart */}
      <ReportSummaryChart stats={sampleWeeklyStats} />

      {/* Classrooms Quick Roll-Call Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">ห้องเรียนทั้งหมด (Classrooms)</h3>
            <p className="text-xs text-slate-500">เลือกห้องเรียนเพื่อทำการเช็คชื่อรายห้อง</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.CLASSROOMS)}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            จัดการห้องเรียน
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {classrooms.map((cls) => (
            <Card key={cls.id} hoverEffect className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                    ห้อง {cls.name}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">ห้อง {cls.roomNumber}</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-800">{cls.gradeLevel}</h4>
                <p className="text-xs text-slate-500 mt-1">ที่ปรึกษา: {cls.advisorName}</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cls.totalStudents || 0} คน</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleGoAttendance(cls.id)}
                  className="w-full"
                >
                  เช็คชื่อห้องนี้
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
