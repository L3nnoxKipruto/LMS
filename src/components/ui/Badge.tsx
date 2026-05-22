import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold select-none',
        {
          'bg-emerald-50 text-emerald-700 border border-emerald-200': variant === 'success',
          'bg-amber-50 text-amber-700 border border-amber-200': variant === 'warning',
          'bg-red-50 text-red-700 border border-red-200': variant === 'error',
          'bg-blue-50 text-blue-700 border border-blue-200': variant === 'info',
          'bg-zinc-100 text-zinc-700 border border-zinc-200': variant === 'neutral',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
