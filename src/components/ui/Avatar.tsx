import React from 'react';
import { cn } from '../../lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({
  className,
  src,
  alt = 'User Avatar',
  size = 'md',
  ...props
}) => {
  const [error, setError] = React.useState(false);
  const initials = alt
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full bg-zinc-100 text-zinc-600 font-semibold items-center justify-center select-none border border-zinc-200',
        {
          'h-8 w-8 text-xs': size === 'sm',
          'h-10 w-10 text-sm': size === 'md',
          'h-14 w-14 text-base': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {src && !error ? (
        <img
          src={src}
          alt={alt}
          onError={() => setError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials || '?'}</span>
      )}
    </div>
  );
};
