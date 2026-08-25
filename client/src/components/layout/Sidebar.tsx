import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardCheck,
  Users,
  GraduationCap,
  FileBarChart2,
  Settings,
  X,
  School,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
} from 'lucide-react';
import { useUiStore } from '../../stores/uiStore';
import { useAppStore } from '../../stores/appStore';
import { useAuthStore } from '../../stores/authStore';
import { ROUTES } from '../../constants/routes';
import { cn } from '../../utils/cn';

export const Sidebar: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useUiStore();
  const { settings } = useAppStore();
  const { user } = useAuthStore();

  const role = user?.role || 'teacher';

  const getPortalInfo = () => {
    switch (role) {
      case 'admin':
        return {
          title: 'พอร์ทัลผู้ดูแลระบบ',
          subtitle: 'Admin Portal',
          badge: 'Administrator',
          icon: <ShieldCheck className="w-5 h-5 text-indigo-400" />,
          items: [
            { to: ROUTES.ADMIN_DASHBOARD, icon: <LayoutDashboard className="w-5 h-5" />, label: 'ภาพรวมระบบ' },
            { to: ROUTES.ADMIN_ATTENDANCE, icon: <ClipboardCheck className="w-5 h-5" />, label: 'เช็คชื่อรายห้อง' },
            { to: ROUTES.ADMIN_STUDENTS, icon: <Users className="w-5 h-5" />, label: 'จัดการข้อมูลนักเรียน' },
            { to: ROUTES.ADMIN_CLASSROOMS, icon: <GraduationCap className="w-5 h-5" />, label: 'จัดการห้องเรียน' },
            { to: ROUTES.ADMIN_REPORTS, icon: <FileBarChart2 className="w-5 h-5" />, label: 'รายงาน & สถิติ' },
            { to: ROUTES.ADMIN_SETTINGS, icon: <Settings className="w-5 h-5" />, label: 'ตั้งค่าระบบ' },
          ],
        };
      case 'staff':
        return {
          title: 'พอร์ทัลกิจการนักเรียน',
          subtitle: 'Staff Portal',
          badge: 'Student Affairs',
          icon: <UserCheck className="w-5 h-5 text-amber-400" />,
          items: [
            { to: ROUTES.STAFF_ATTENDANCE, icon: <ClipboardCheck className="w-5 h-5" />, label: 'จุดสแกนเช็คชื่อ' },
            { to: ROUTES.STAFF_ABSENCES, icon: <AlertTriangle className="w-5 h-5" />, label: 'ติดตามกลุ่มเสี่ยงขาดเรียน' },
            { to: ROUTES.STAFF_STUDENTS, icon: <Users className="w-5 h-5" />, label: 'ข้อมูลนักเรียน' },
            { to: ROUTES.STAFF_REPORTS, icon: <FileBarChart2 className="w-5 h-5" />, label: 'รายงานภาพรวม' },
          ],
        };
      case 'teacher':
      default:
        return {
          title: 'พอร์ทัลครูผู้สอน',
          subtitle: 'Teacher Portal',
          badge: 'Homeroom Teacher',
          icon: <School className="w-5 h-5 text-indigo-400" />,
          items: [
            { to: ROUTES.TEACHER_ATTENDANCE, icon: <ClipboardCheck className="w-5 h-5" />, label: 'เช็คชื่อประจำวัน' },
            { to: ROUTES.TEACHER_STUDENTS, icon: <Users className="w-5 h-5" />, label: 'นักเรียนในห้อง' },
            { to: ROUTES.TEACHER_REPORTS, icon: <FileBarChart2 className="w-5 h-5" />, label: 'สรุปสถิติประจำห้อง' },
          ],
        };
    }
  };

  const portal = getPortalInfo();

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar aside container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none">
                {portal.title}
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-1 truncate max-w-[140px]">
                {portal.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              เมนูพอร์ทัล
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-slate-100 text-slate-600">
              {portal.badge}
            </span>
          </div>

          {portal.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => {
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Footer info box */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 m-3 rounded-xl border border-slate-200/60">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-700">ปีการศึกษา {settings.schoolYear}</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">ภาคเรียนที่ {settings.schoolTerm} • {settings.schoolName}</p>
        </div>
      </aside>
    </>
  );
};
