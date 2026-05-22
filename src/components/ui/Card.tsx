import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  hoverEffect = false,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-white border border-zinc-200 rounded-xl p-5 shadow-sm transition-all duration-200',
        hoverEffect && 'hover:shadow-md hover:border-zinc-300 hover:scale-[1.005]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
