import { StudyStreak } from '../types';
import { dbGetStreak, dbUpdateStreak } from '../mock-db/db';

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

export const streakService = {
  getStreak: async (): Promise<StudyStreak | null> => {
    await delay(100);
    const userId = getCurrentUserId();
    if (!userId) return null;
    return dbGetStreak(userId);
  },
  updateStreak: async (minutes: number): Promise<any> => {
    await delay(100);
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Unauthorized');
    dbUpdateStreak(userId, minutes);
    return { success: true };
  }
};
