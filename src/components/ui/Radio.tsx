import React from 'react';
import { cn } from '../../lib/utils';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          ref={ref}
          type="radio"
          className={cn(
            'h-4 w-4 border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer',
            className
          )}
          {...props}
        />
        {label && (
          <span className="text-sm font-medium text-zinc-700">
            {label}
          </span>
        )}
      </label>
    );
  }
);
Radio.displayName = 'Radio';
