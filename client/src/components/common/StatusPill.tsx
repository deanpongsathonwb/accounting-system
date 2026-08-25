import React from 'react';
import { AttendanceStatus } from '../../types/attendance';
import { ATTENDANCE_STATUS_CONFIG } from '../../constants/ui';
import { cn } from '../../utils/cn';

export interface StatusPillProps {
  status: AttendanceStatus;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, size = 'md' }) => {
  const config = ATTENDANCE_STATUS_CONFIG[status] || ATTENDANCE_STATUS_CONFIG.present;

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium border rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        config.badgeClass
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: config.color }} />
      {config.labelTh}
    </span>
  );
};
