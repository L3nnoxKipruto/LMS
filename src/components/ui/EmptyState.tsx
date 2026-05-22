import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description = 'There are no active records in this offline database tab.',
  icon,
  actionText,
  actionLabel,
  onAction,
}) => {
  const buttonLabel = actionText || actionLabel;
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-dashed border-zinc-200 rounded-2xl">
      <div className="h-12 w-12 rounded-full bg-zinc-50 text-zinc-400 flex items-center justify-center mb-4">
        {icon || <Inbox className="h-6 w-6" />}
      </div>
      <h3 className="font-bold text-base text-zinc-900">{title}</h3>
      <p className="text-sm text-zinc-500 mt-1 max-w-sm leading-relaxed">{description}</p>
      {buttonLabel && onAction && (
        <Button onClick={onAction} size="sm" className="mt-4">
          {buttonLabel}
        </Button>
      )}
    </div>
  );
};
