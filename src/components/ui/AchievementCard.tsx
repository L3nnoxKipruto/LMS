import React from 'react';
import { Achievement } from '../../types';

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  return (
    <div className={`p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 ${
      achievement.isUnlocked 
        ? 'bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-150/40 dark:border-indigo-800/40 shadow-sm hover:shadow-md' 
        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 opacity-60'
    }`}>
      <div className={`h-12 w-12 rounded-full flex items-center justify-center text-2xl shrink-0 ${
        achievement.isUnlocked 
          ? 'bg-indigo-100 dark:bg-indigo-900/60 scale-105 animate-pulse' 
          : 'bg-zinc-100 dark:bg-zinc-800 grayscale'
      }`}>
        {achievement.icon}
      </div>
      <div className="flex-grow space-y-1">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-50">{achievement.title}</h4>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{achievement.description}</p>
          </div>
          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 uppercase tracking-wider">
            +{achievement.xpReward} XP
          </span>
        </div>

        {!achievement.isUnlocked && achievement.progress !== undefined && achievement.maxProgress !== undefined && (
          <div className="space-y-1 pt-1.5">
            <div className="flex justify-between text-[9px] font-bold text-zinc-400">
              <span>Progress</span>
              <span>{achievement.progress}/{achievement.maxProgress}</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-850 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
              />
            </div>
          </div>
        )}

        {achievement.isUnlocked && achievement.unlockedAt && (
          <p className="text-[9px] font-semibold text-indigo-650 dark:text-indigo-400">
            Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};
export default AchievementCard;
