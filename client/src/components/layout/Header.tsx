import React from 'react';
import { Menu, Calendar, Clock, UserCheck } from 'lucide-react';
import { useUiStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { formatThaiDate, getTodayString } from '../../utils/date';

export const Header: React.FC = () => {
  const { toggleSidebar } = useUiStore();
  const { user } = useAuthStore();
  const todayStr = getTodayString();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/50">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <span>{formatThaiDate(todayStr, 'full')}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/60">
          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="text-left hidden md:block">
            <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name || 'ครูผู้สอน'}</p>
            <p className="text-[10px] text-slate-500">{user?.school || 'ระบบเช็คชื่อ'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
