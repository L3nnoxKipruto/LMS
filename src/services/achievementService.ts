import { Achievement } from '../types';
import { dbGetAchievements, dbUnlockAchievement } from '../mock-db/db';

const delay = (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms));

const getCurrentUserId = (): string => {
  const userJson = localStorage.getItem('jh_user');
  if (!userJson) return '';
  try {
    return JSON.parse(userJson).id;
  } catch {
    return '';
  }
};

export const achievementService = {
  getAchievements: async (): Promise<Achievement[]> => {
    await delay(100);
    const userId = getCurrentUserId();
    if (!userId) return [];
    return dbGetAchievements(userId);
  },
  unlockAchievement: async (achievementId: string): Promise<any> => {
    await delay(100);
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Unauthorized');
    const unlocked = dbUnlockAchievement(userId, achievementId);
    return { success: !!unlocked, achievement: unlocked };
  }
};
