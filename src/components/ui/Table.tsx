import React from 'react';
import { cn } from '../../lib/utils';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  headers: string[];
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({
  className,
  headers,
  children,
  ...props
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-zinc-200 bg-white">
      <table className={cn('min-w-full divide-y divide-zinc-200 text-left text-sm', className)} {...props}>
        <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          <tr>
            {headers.map((h, idx) => (
              <th key={idx} scope="col" className="px-6 py-4 font-bold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 text-zinc-700">
          {children}
        </tbody>
      </table>
    </div>
  );
};
