import React from 'react';
import { ATTENDANCE_STATUS_CONFIG } from '../../../constants/ui';
import { formatPercentage } from '../../../utils/format';
import { Sparkles } from 'lucide-react';

export interface AttendanceSummaryBarProps {
  summary: {
    total: number;
    present: number;
    late: number;
    absent: number;
    leave: number;
    activity: number;
    rate: number;
  };
}

export const AttendanceSummaryBar: React.FC<AttendanceSummaryBarProps> = ({ summary }) => {
  const isPerfect = summary.total > 0 && summary.present === summary.total;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              สรุปผลการเช็คชื่อรอบนี้
            </h3>
            {isPerfect && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full animate-bounce">
                <Sparkles className="w-3.5 h-3.5" /> มาครบ 100%!
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            นักเรียนทั้งหมด {summary.total} คน • อัตราการเข้าเรียนเฉลี่ย
          </p>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 tracking-tight">
            {formatPercentage(summary.rate)}
          </span>
          <span className="text-xs font-medium text-slate-500">อัตราการเข้าชั้นเรียน</span>
        </div>
      </div>

      {/* Progress Multi-bar */}
      <div className="space-y-1.5">
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
          {summary.total > 0 && (
            <>
              <div
                style={{ width: `${(summary.present / summary.total) * 100}%` }}
                className="bg-emerald-500 transition-all duration-300"
                title={`มา: ${summary.present}`}
              />
              <div
                style={{ width: `${(summary.late / summary.total) * 100}%` }}
                className="bg-amber-400 transition-all duration-300"
                title={`สาย: ${summary.late}`}
              />
              <div
                style={{ width: `${(summary.leave / summary.total) * 100}%` }}
                className="bg-blue-400 transition-all duration-300"
                title={`ลา: ${summary.leave}`}
              />
              <div
                style={{ width: `${(summary.activity / summary.total) * 100}%` }}
                className="bg-purple-400 transition-all duration-300"
                title={`กิจกรรม: ${summary.activity}`}
              />
              <div
                style={{ width: `${(summary.absent / summary.total) * 100}%` }}
                className="bg-rose-500 transition-all duration-300"
                title={`ขาด: ${summary.absent}`}
              />
            </>
          )}
        </div>
      </div>

      {/* Badge counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-emerald-800">{ATTENDANCE_STATUS_CONFIG.present.labelTh}</span>
          </div>
          <span className="text-sm font-bold text-emerald-900">{summary.present}</span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-100">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-medium text-amber-800">{ATTENDANCE_STATUS_CONFIG.late.labelTh}</span>
          </div>
          <span className="text-sm font-bold text-amber-900">{summary.late}</span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 border border-blue-100">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-xs font-medium text-blue-800">{ATTENDANCE_STATUS_CONFIG.leave.labelTh}</span>
          </div>
          <span className="text-sm font-bold text-blue-900">{summary.leave}</span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50 border border-purple-100">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-xs font-medium text-purple-800">{ATTENDANCE_STATUS_CONFIG.activity.labelTh}</span>
          </div>
          <span className="text-sm font-bold text-purple-900">{summary.activity}</span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50 border border-rose-100 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-xs font-medium text-rose-800">{ATTENDANCE_STATUS_CONFIG.absent.labelTh}</span>
          </div>
          <span className="text-sm font-bold text-rose-900">{summary.absent}</span>
        </div>
      </div>
    </div>
  );
};
