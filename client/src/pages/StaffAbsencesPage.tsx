import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import { API_ENDPOINTS } from '../constants/api';
import { StudentAbsenceRisk } from '../features/reports/types';
import { AlertTriangle, PhoneCall, CheckCircle2, Search, Filter, Mail, UserCheck } from 'lucide-react';
import { LoadingState } from '../components/feedback/LoadingState';
import { EmptyState } from '../components/feedback/EmptyState';
import { useUiStore } from '../stores/uiStore';

export const StaffAbsencesPage: React.FC = () => {
  const [threshold, setThreshold] = useState(2);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactedStudents, setContactedStudents] = useState<Record<string, boolean>>({});
  const { addToast } = useUiStore();

  const { data: risks = [], isLoading, refetch } = useQuery<StudentAbsenceRisk[]>({
    queryKey: ['staff-absence-risks', threshold],
    queryFn: async () => {
      try {
        const res = await apiClient.get<{ success: boolean; data: StudentAbsenceRisk[] }>(
          `${API_ENDPOINTS.REPORTS_HIGH_ABSENCE}?threshold=${threshold}`
        );
        return res.data?.data || [];
      } catch {
        return [];
      }
    },
  });

  const filteredRisks = risks.filter((r) =>
    r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.classroomName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarkContacted = (studentId: string, name: string) => {
    setContactedStudents((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
    addToast({
      type: 'info',
      title: 'บันทึกการติดตาม',
      message: `อัปเดตสถานะการติดต่อผู้ปกครองของ ${name} เรียบร้อยแล้ว`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="ติดตามกลุ่มเสี่ยงขาดเรียน (Student Absence Risks)"
        subtitle="ระบบเฝ้าระวังและติดตามนักเรียนที่มีสถิติขาดเรียนสะสมเพื่อการดูแลช่วยเหลือนักเรียน"
      />

      {/* Control Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาตามชื่อนักเรียน หรือห้องเรียน..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-xs">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 shrink-0">เกณฑ์ขาดเรียนตั้งแต่:</span>
          <select
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value={1}>1 ครั้งขึ้นไป</option>
            <option value={2}>2 ครั้งขึ้นไป (ค่าเริ่มต้น)</option>
            <option value={3}>3 ครั้งขึ้นไป (เฝ้าระวังสูง)</option>
            <option value={5}>5 ครั้งขึ้นไป (วิกฤต)</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <LoadingState message="กำลังตรวจสอบรายชื่อกลุ่มเสี่ยง..." />
      ) : filteredRisks.length === 0 ? (
        <EmptyState
          title="ไม่พบนักเรียนที่มีสถิติขาดเรียนเกินเกณฑ์"
          description={searchQuery ? 'ไม่พบข้อมูลที่ตรงกับคำค้นหาของคุณ' : 'นักเรียนทุกคนมีอัตราการเข้าเรียนอยู่ในเกณฑ์ปกติ'}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredRisks.map((item) => {
            const isDone = contactedStudents[item.studentId];
            return (
              <Card
                key={item.studentId}
                className={`p-4 sm:p-5 border transition-all ${
                  isDone ? 'bg-slate-50/70 border-slate-200' : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-xl mt-0.5 ${
                        item.absentCount >= 3
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-900">{item.studentName}</h3>
                        <Badge variant="primary" size="sm">
                          {item.classroomName}
                        </Badge>
                        {isDone && (
                          <Badge variant="success" size="sm">
                            ติดต่อแล้ว
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs mt-1 text-slate-600">
                        <span className="text-rose-600 font-semibold">
                          ขาดเรียน: {item.absentCount} วัน
                        </span>
                        <span>•</span>
                        <span className="text-amber-600 font-semibold">
                          มาสาย: {item.lateCount} วัน
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                    {item.parentPhone && (
                      <a
                        href={`tel:${item.parentPhone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>โทร {item.parentPhone}</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => handleMarkContacted(item.studentId, item.studentName)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        isDone
                          ? 'bg-slate-200 text-slate-700 border-slate-300'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                      <span>{isDone ? 'บันทึกแล้ว' : 'บันทึกการติดต่อ'}</span>
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
