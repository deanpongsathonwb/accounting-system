import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm border border-transparent',
      secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200',
      outline: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs',
      danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm border border-transparent',
      success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border border-transparent',
      ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border-transparent',
    };

    const sizes = {
      sm: 'px-2.5 py-1 text-xs font-medium rounded-md gap-1.5',
      md: 'px-4 py-2 text-sm font-medium rounded-lg gap-2',
      lg: 'px-5 py-2.5 text-base font-medium rounded-xl gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 select-none whitespace-nowrap',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
