import React from 'react';
import { LeaderboardEntry } from '../../types';
import { Award, Flame, Zap } from 'lucide-react';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries, currentUserId = 'u1' }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
        <div>
          <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-50">Global Leaderboard</h3>
          <p className="text-[10px] text-zinc-400 mt-0.5">Compete with student fellows in XP gains and study consistency.</p>
        </div>
        <div className="h-8 w-8 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
          <Award className="h-4.5 w-4.5" />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-850/50 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800">
              <th className="px-5 py-3 text-center w-16">Rank</th>
              <th className="px-5 py-3">Student</th>
              <th className="px-5 py-3">Department</th>
              <th className="px-5 py-3 text-right">Streak</th>
              <th className="px-5 py-3 text-right pr-6">Total XP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
            {entries.map((entry) => {
              const isMe = entry.userId === currentUserId;
              const rankIcon = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : null;
              
              return (
                <tr 
                  key={entry.userId} 
                  className={`text-xs transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-850/20 ${
                    isMe ? 'bg-indigo-50/40 dark:bg-indigo-950/10 font-bold' : ''
                  }`}
                >
                  <td className="px-5 py-3.5 text-center font-extrabold text-zinc-500">
                    {rankIcon ? (
                      <span className="text-base">{rankIcon}</span>
                    ) : (
                      <span>#{entry.rank}</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img 
                        src={entry.avatarUrl} 
                        alt={entry.studentName} 
                        className={`h-8 w-8 rounded-full border bg-zinc-50 ${
                          isMe ? 'border-indigo-500 ring-2 ring-indigo-100 dark:ring-indigo-950' : 'border-zinc-200 dark:border-zinc-750'
                        }`} 
                      />
                      <div className="truncate max-w-[150px]">
                        <p className={`truncate ${isMe ? 'text-indigo-650 dark:text-indigo-400' : 'text-zinc-900 dark:text-zinc-50'}`}>
                          {entry.studentName} {isMe && <span className="text-[9px] px-1 py-0.2 bg-indigo-600 text-white rounded ml-1 font-bold">ME</span>}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-zinc-500 dark:text-zinc-400 max-w-[180px] truncate">
                    {entry.department || 'Technical Faculty'}
                  </td>
                  <td className="px-5 py-3.5 text-right font-extrabold text-amber-600 dark:text-amber-400">
                    <div className="flex items-center justify-end gap-1">
                      <span>{entry.streak}</span>
                      <Flame className="h-3.5 w-3.5 fill-amber-500 stroke-none" />
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right pr-6 font-extrabold text-zinc-950 dark:text-zinc-50 tabular-nums">
                    <div className="flex items-center justify-end gap-1.5 text-indigo-600 dark:text-indigo-400">
                      <Zap className="h-3 w-3 fill-indigo-600 dark:fill-indigo-400 stroke-none" />
                      <span>{entry.xp.toLocaleString()} XP</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default LeaderboardTable;
