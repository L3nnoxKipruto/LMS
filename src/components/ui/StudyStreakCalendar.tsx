import React from 'react';
import { StudyStreak } from '../../types';

interface StudyStreakCalendarProps {
  streak: StudyStreak | null;
}

export const StudyStreakCalendar: React.FC<StudyStreakCalendarProps> = ({ streak }) => {
  // Generate the last 49 days (7 weeks) of grid boxes
  const days = [];
  const today = new Date();
  
  for (let i = 48; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    // Find record in history
    const historyItem = streak?.streakHistory?.find(h => h.date === dateString);
    const minutes = historyItem ? historyItem.minutesStudied : 0;
    
    days.push({
      date,
      minutes,
      dateString
    });
  }

  const getIntensityClass = (minutes: number) => {
    if (minutes === 0) return 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-750';
    if (minutes < 15) return 'bg-indigo-100 dark:bg-indigo-950/80 border-indigo-200/50';
    if (minutes < 30) return 'bg-indigo-300 dark:bg-indigo-800 border-indigo-400/50';
    if (minutes < 60) return 'bg-indigo-500 dark:bg-indigo-600 border-indigo-600/50';
    return 'bg-indigo-700 dark:bg-indigo-400 border-indigo-800/50';
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-50">Study Heatmap</h4>
          <p className="text-[10px] text-zinc-400 mt-0.5">Your learning consistency over the last 7 weeks.</p>
        </div>
        <div className="flex gap-2 items-center text-[10px] font-bold text-zinc-400">
          <span>Less</span>
          <div className="h-2.5 w-2.5 bg-zinc-100 dark:bg-zinc-800 border rounded" />
          <div className="h-2.5 w-2.5 bg-indigo-150 dark:bg-indigo-950 rounded border" />
          <div className="h-2.5 w-2.5 bg-indigo-350 dark:bg-indigo-800 rounded border" />
          <div className="h-2.5 w-2.5 bg-indigo-550 dark:bg-indigo-600 rounded border" />
          <div className="h-2.5 w-2.5 bg-indigo-750 dark:bg-indigo-400 rounded border" />
          <span>More</span>
        </div>
      </div>

      <div className="grid grid-flow-col grid-rows-7 gap-1.5 justify-center py-2">
        {days.map((day, idx) => (
          <div
            key={idx}
            className={`h-3 w-3 rounded border transition-all duration-300 cursor-pointer ${getIntensityClass(day.minutes)}`}
            title={`${day.date.toDateString()}: ${day.minutes} mins studied`}
          />
        ))}
      </div>

      <div className="flex justify-between text-[10px] font-bold text-zinc-400 pt-1 border-t border-zinc-100 dark:border-zinc-800">
        <span>7 weeks ago</span>
        <span>Today</span>
      </div>
    </div>
  );
};
export default StudyStreakCalendar;
