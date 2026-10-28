import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  ShieldCheck,
  CheckCheck,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { UI } from '../../constants/index.ts';
import { useAppStore } from '../../stores/app.store.ts';
import { useAuthStore } from '../../stores/auth.store.ts';
import { NotificationItem, NotificationType } from '../../types/common.types.ts';
import { renderSemanticText } from '../common/index.ts';

export const NotificationDropdown: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const notifications = useAppStore((state) => state.notifications);
  const markNotificationAsRead = useAppStore((state) => state.markNotificationAsRead);
  const markAllNotificationsAsRead = useAppStore((state) => state.markAllNotificationsAsRead);
  const clearNotifications = useAppStore((state) => state.clearNotifications);

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Filter notifications relevant to current user role or 'all'
  const roleNotifications = notifications.filter((n) => {
    if (!currentUser) return true;
    return !n.targetRole || n.targetRole === 'all' || n.targetRole === currentUser.role;
  });

  const unreadCount = roleNotifications.filter((n) => !n.read).length;

  const displayList = roleNotifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'security':
        return <ShieldCheck className="w-4 h-4 text-blue-600" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-indigo-600" />;
    }
  };

  const getNotificationBg = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-100';
      case 'warning':
        return 'bg-amber-50 border-amber-100';
      case 'security':
        return 'bg-blue-50 border-blue-100';
      case 'info':
      default:
        return 'bg-indigo-50 border-indigo-100';
    }
  };

  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.read) {
      markNotificationAsRead(item.id);
    }
    if (item.link) {
      setIsOpen(false);
      navigate(item.link);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        aria-label={UI.notifications.bellAria}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={UI.notifications.title}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-rose-600 rounded-full border-2 border-white shadow-xs font-mono">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className="p-3.5 sm:p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 text-sm">
                {UI.notifications.title}
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 font-mono">
                  {unreadCount}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsAsRead}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
                title={UI.notifications.markAllAsRead}
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{UI.notifications.markAllAsRead}</span>
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="px-3 py-2 border-b border-slate-100 bg-white flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {UI.notifications.filterAll} ({roleNotifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filter === 'unread'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {UI.notifications.filterUnread} ({unreadCount})
            </button>
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto max-h-[380px] divide-y divide-slate-100 no-scrollbar">
            {displayList.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-2.5">
                  <Bell className="w-5 h-5 opacity-40" />
                </div>
                <p className="text-sm font-bold text-slate-700">
                  {UI.notifications.empty}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {UI.notifications.emptySubtitle}
                </p>
              </div>
            ) : (
              displayList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 sm:p-4 flex items-start gap-3 transition-colors cursor-pointer hover:bg-slate-50/80 ${
                    !item.read ? 'bg-blue-50/30' : 'bg-white'
                  }`}
                  role="button"
                  tabIndex={0}
                >
                  {/* Icon */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${getNotificationBg(
                      item.type
                    )}`}
                  >
                    {getNotificationIcon(item.type)}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-xs font-bold leading-snug break-words ${
                          !item.read ? 'text-slate-900' : 'text-slate-700'
                        }`}
                      >
                        {renderSemanticText(item.title)}
                      </h4>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed break-words font-medium">
                      {renderSemanticText(item.message)}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
                      <span>{item.timestamp}</span>
                      {item.link && (
                        <span className="text-blue-600 hover:underline flex items-center gap-0.5 font-sans font-semibold">
                          <span>{UI.notifications.viewDetails}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          {roleNotifications.length > 0 && (
            <div className="p-2.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={clearNotifications}
                className="text-xs text-slate-500 hover:text-rose-600 font-semibold px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                title={UI.notifications.clearAll}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{UI.notifications.clearAll}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
