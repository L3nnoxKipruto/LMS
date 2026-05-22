import { LeaderboardEntry } from '../types';
import { dbGetLeaderboard } from '../mock-db/db';

const delay = (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms));

export const leaderboardService = {
  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    await delay(100);
    return dbGetLeaderboard();
  }
};
