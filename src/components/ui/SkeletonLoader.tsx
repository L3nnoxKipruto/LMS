import React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className,
  variant = 'rect',
  count = 1,
}) => {
  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, idx) => (
        <div
          key={idx}
          className={cn(
            'bg-zinc-200 animate-pulse',
            {
              'h-4 w-full rounded-md': variant === 'text',
              'h-24 w-full rounded-xl': variant === 'rect',
              'h-12 w-12 rounded-full': variant === 'circle',
            },
            className
          )}
        />
      ))}
    </>
  );
};
