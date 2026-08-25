import React from 'react';
import { Card } from '../../../components/ui/Card';
import { StudentAbsenceRisk } from '../types';
import { AlertCircle, PhoneCall } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';

export interface HighAbsenceListProps {
  risks: StudentAbsenceRisk[];
}

export const HighAbsenceList: React.FC<HighAbsenceListProps> = ({ risks }) => {
  if (risks.length === 0) {
    return (
      <Card className="p-6 text-center text-sm text-slate-500">
        <p className="text-emerald-600 font-semibold mb-1">ยอดเยี่ยมมาก!</p>
        <p className="text-xs text-slate-400">ไม่มีนักเรียนที่มีสถิติขาดเรียนเกินเกณฑ์ในสัปดาห์นี้</p>
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-rose-100 text-rose-600 rounded-lg">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">นักเรียนที่ต้องติดตามเป็นพิเศษ</h3>
            <p className="text-xs text-slate-500">ขาดเรียนสะสมเกินเกณฑ์ความเสี่ยง</p>
          </div>
        </div>
        <Badge variant="danger" size="sm">
          {risks.length} คน
        </Badge>
      </div>

      <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
        {risks.map((item) => (
          <div key={item.studentId} className="py-3 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">{item.studentName}</span>
                <span className="text-[11px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-medium">
                  {item.classroomName}
                </span>
              </div>
              <p className="text-xs text-rose-600 font-medium mt-0.5">
                ขาด {item.absentCount} ครั้ง • มาสาย {item.lateCount} ครั้ง
              </p>
            </div>

            {item.parentPhone && (
              <a
                href={`tel:${item.parentPhone}`}
                className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-lg transition-colors"
                title={`โทร ${item.parentPhone}`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{item.parentPhone}</span>
              </a>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
