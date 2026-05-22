import React from 'react';
import { Filter } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string | number;
}

export interface FilterBarProps {
  options: FilterOption[];
  selectedValue: string | number;
  onSelect: (value: string | number) => void;
  label?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  options,
  selectedValue,
  onSelect,
  label = 'Filter by:',
}) => {
  return (
    <div className="flex items-center gap-2 select-none flex-wrap">
      <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
        <Filter className="h-3.5 w-3.5" /> {label}
      </span>
      <div className="flex items-center gap-1.5 flex-wrap">
        {options.map((opt) => {
          const isActive = selectedValue === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
