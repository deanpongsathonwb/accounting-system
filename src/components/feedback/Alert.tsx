import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  message: string;
  description?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  message,
  description
}) => {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    error: 'bg-rose-50 border-rose-200 text-rose-800'
  };

  const icons = {
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
  };

  return (
    <div className={`p-4 rounded-lg border flex items-start gap-3 ${styles[type]}`}>
      {icons[type]}
      <div className="flex-1 text-sm">
        <p className="font-medium">{message}</p>
        {description && <p className="mt-1 opacity-90 text-xs">{description}</p>}
      </div>
    </div>
  );
};
