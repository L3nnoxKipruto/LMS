import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, onSearch, onChange, placeholder = 'Search courses, devices, metrics...', ...props }, ref) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(e);
      if (onSearch) onSearch(e.target.value);
    };

    return (
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <input
          ref={ref}
          type="text"
          placeholder={placeholder}
          onChange={handleInputChange}
          className={cn(
            'flex h-10 w-full rounded-lg border border-zinc-300 bg-white pl-10 pr-4 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
SearchBar.displayName = 'SearchBar';
