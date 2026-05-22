import React from 'react';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  colorClass?: string;
  trailColorClass?: string;
  textColorClass?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  colorClass = 'stroke-indigo-600',
  trailColorClass = 'stroke-zinc-100 dark:stroke-zinc-800',
  textColorClass = 'text-zinc-950 dark:text-zinc-50'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className={`fill-none ${trailColorClass}`}
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`fill-none transition-all duration-500 ease-out ${colorClass}`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className={`absolute flex flex-col items-center justify-center`}>
        <span className={`text-xl font-extrabold ${textColorClass}`}>{Math.round(progress)}%</span>
        <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Progress</span>
      </div>
    </div>
  );
};
export default ProgressRing;
