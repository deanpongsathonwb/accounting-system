import React from 'react';
import { cn } from '../../utils/cn';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full border-indigo-600 border-t-transparent',
        sizes[size],
        className
      )}
      role="status"
    >
      <span className="sr-only">กำลังโหลด...</span>
    </div>
  );
};
