import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useAttendanceDraftStore } from '../stores/attendanceStore';
import { ATTENDANCE_STATUS_CONFIG } from '../../../constants/ui';
import { AttendanceStatus } from '../../../types/attendance';
import { cn } from '../../../utils/cn';

export const AttendanceFilterBar: React.FC = () => {
  const { filterStatus, setFilterStatus, searchQuery, setSearchQuery } = useAttendanceDraftStore();

  const filterOptions: Array<{ id: 'all' | AttendanceStatus; label: string; count?: number }> = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'present', label: ATTENDANCE_STATUS_CONFIG.present.shortTh },
    { id: 'late', label: ATTENDANCE_STATUS_CONFIG.late.shortTh },
    { id: 'absent', label: ATTENDANCE_STATUS_CONFIG.absent.shortTh },
    { id: 'leave', label: ATTENDANCE_STATUS_CONFIG.leave.shortTh },
    { id: 'activity', label: ATTENDANCE_STATUS_CONFIG.activity.shortTh },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
      <div className="relative flex-1 max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="ค้นหาชื่อ, นามสกุล, หรือเลขที่..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white"
        />
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
        <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0 hidden sm:block" />
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setFilterStatus(opt.id)}
            className={cn(
              'px-2.5 py-1 text-xs font-medium rounded-lg transition-all shrink-0 cursor-pointer',
              filterStatus === opt.id
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};
