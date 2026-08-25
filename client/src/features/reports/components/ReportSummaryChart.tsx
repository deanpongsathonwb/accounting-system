import React from 'react';
import { Card } from '../../../components/ui/Card';
import { DailyAttendanceStat } from '../types';
import { formatPercentage } from '../../../utils/format';

export interface ReportSummaryChartProps {
  stats: DailyAttendanceStat[];
}

export const ReportSummaryChart: React.FC<ReportSummaryChartProps> = ({ stats }) => {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">สถิติอัตราการเข้าเรียนย้อนหลัง 5 วัน</h3>
          <p className="text-xs text-slate-500 mt-0.5">ภาพรวมแนวโน้มการมาเรียนของโรงเรียน</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600">มาเรียน</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600">สาย</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-600">ขาด</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 pt-2">
        {stats.map((stat, idx) => {
          const heightPercent = Math.max(20, Math.min(100, stat.presentRate));

          return (
            <div key={idx} className="flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-slate-700">
                {formatPercentage(stat.presentRate, 0)}
              </span>

              <div className="w-full bg-slate-100 h-36 rounded-xl relative overflow-hidden flex flex-col justify-end p-1">
                <div
                  className="w-full bg-indigo-600 rounded-lg transition-all duration-500 flex flex-col justify-end overflow-hidden"
                  style={{ height: `${heightPercent}%` }}
                >
                  <div className="w-full bg-emerald-500 flex-1" />
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs font-semibold text-slate-800">{stat.dayLabel}</p>
                <p className="text-[10px] text-slate-400">มา {stat.presentCount}/{stat.total}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
