import React from 'react';
import { Menu, Calendar, LogOut, ShieldCheck, UserCheck, School } from 'lucide-react';
import { useUiStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { formatThaiDate, getTodayString } from '../../utils/date';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const Header: React.FC = () => {
  const { toggleSidebar, addToast } = useUiStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const todayStr = getTodayString();

  const handleLogout = () => {
    logout();
    addToast({
      type: 'info',
      title: 'ออกจากระบบแล้ว',
      message: 'คุณได้ออกจากระบบเรียบร้อยแล้ว',
    });
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'admin':
        return { label: 'ผู้ดูแลระบบ', icon: <ShieldCheck className="w-3.5 h-3.5" />, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'staff':
        return { label: 'กิจการนักเรียน', icon: <UserCheck className="w-3.5 h-3.5" />, color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'teacher':
      default:
        return { label: 'ครูผู้สอน', icon: <School className="w-3.5 h-3.5" />, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
  };

  const roleInfo = getRoleBadge(user?.role);

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
        {/* User profile card */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/60">
          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs overflow-hidden">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span>{user?.name ? user.name[0] : 'U'}</span>
            )}
          </div>
          <div className="text-left hidden md:block">
            <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name || 'ผู้ใช้งาน'}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded border ${roleInfo.color}`}>
                {roleInfo.icon}
                {roleInfo.label}
              </span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title="ออกจากระบบ"
          className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors flex items-center gap-1.5 text-xs font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">ออกจากระบบ</span>
        </button>
      </div>
    </header>
  );
};
