import { Announcement } from '../types';
import { dbGetAnnouncements } from '../mock-db/db';

const delay = (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms));

export const announcementService = {
  getAnnouncements: async (): Promise<Announcement[]> => {
    await delay(100);
    return dbGetAnnouncements();
  }
};
