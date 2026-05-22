import { ActivityFeedItem } from '../types';
import { dbGetActivityFeed } from '../mock-db/db';

const delay = (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms));

export const activityService = {
  getGlobalFeed: async (): Promise<ActivityFeedItem[]> => {
    await delay(100);
    return dbGetActivityFeed();
  }
};
