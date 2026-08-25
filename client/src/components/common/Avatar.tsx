import React from 'react';
import { getInitials } from '../../utils/format';
import { cn } from '../../utils/cn';

export interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  gender?: 'male' | 'female' | 'other';
}

export const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md', className, gender }) => {
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const bgColors = gender === 'female' ? 'bg-pink-100 text-pink-700' : 'bg-indigo-100 text-indigo-700';

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover border border-slate-200', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold tracking-tight select-none',
        sizes[size],
        bgColors,
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
};
