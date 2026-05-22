import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Sync failure or query timeout',
  description = 'Could not load data from the local classroom mesh node. Ensure server router is turned on.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-500/5 border border-red-500/10 rounded-2xl">
      <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="font-bold text-base text-zinc-900">{title}</h3>
      <p className="text-sm text-zinc-500 mt-1 max-w-sm leading-relaxed">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="mt-4 border-red-200 text-red-700 hover:bg-red-50">
          Retry Request
        </Button>
      )}
    </div>
  );
};
