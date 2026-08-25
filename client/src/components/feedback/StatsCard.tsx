import React from 'react';
import { Card } from '../ui/Card';
import { cn } from '../../utils/cn';

export interface StatsCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon,
  iconBgColor = 'bg-indigo-50 text-indigo-600',
  trend,
  className,
}) => {
  return (
    <Card id={id} className={cn('relative overflow-hidden', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
            {trend && (
              <span
                className={cn(
                  'text-xs font-medium px-1.5 py-0.5 rounded-sm',
                  trend.isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                )}
              >
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className={cn('p-2.5 rounded-xl shrink-0', iconBgColor)}>
          {icon}
        </div>
      </div>
    </Card>
  );
};
