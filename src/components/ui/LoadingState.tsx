import React from 'react';

export interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading resilient module database...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="h-10 w-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
      <span className="text-sm font-semibold text-zinc-500 mt-4 animate-pulse">
        {message}
      </span>
    </div>
  );
};
