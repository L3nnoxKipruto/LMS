import { SyncItem } from '../types';

const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

export const syncService = {
  getSyncQueue: async (): Promise<SyncItem[]> => {
    await delay(50);
    return []; // Offline-first queue returns empty since SaaS simulation behaves instantly online
  },
  triggerSync: async (): Promise<{ success: boolean; syncedCount: number }> => {
    await delay(400);
    return { success: true, syncedCount: 0 };
  }
};
