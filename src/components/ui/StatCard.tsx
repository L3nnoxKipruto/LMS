import React from 'react';
import { Card } from './Card';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: {
    value: string;
    type: 'up' | 'down' | 'neutral';
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
}) => {
  return (
    <Card hoverEffect className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
          {value}
        </p>
        {(description || trend) && (
          <div className="flex items-center gap-1.5 text-xs">
            {trend && (
              <span
                className={
                  trend.type === 'up'
                    ? 'text-emerald-600 font-bold'
                    : trend.type === 'down'
                    ? 'text-rose-600 font-bold'
                    : 'text-zinc-400'
                }
              >
                {trend.value}
              </span>
            )}
            {description && (
              <span className="text-zinc-500 truncate">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
