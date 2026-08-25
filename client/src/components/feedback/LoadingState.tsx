import React from 'react';
import { Spinner } from '../ui/Spinner';

export interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'กำลังโหลดข้อมูล...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3">
      <Spinner size="lg" />
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
};
