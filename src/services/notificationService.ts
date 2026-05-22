import { dbGetNotifications, dbMarkNotificationsRead, dbGetCertificates } from '../mock-db/db';

const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

const getCurrentUserId = (): string => {
  const userJson = localStorage.getItem('jh_user');
  if (!userJson) return '';
  try {
    return JSON.parse(userJson).id;
  } catch {
    return '';
  }
};

export const notificationService = {
  getNotifications: async (): Promise<any[]> => {
    await delay(100);
    const userId = getCurrentUserId();
    if (!userId) return [];
    return dbGetNotifications(userId);
  },
  markAllRead: async (): Promise<any> => {
    await delay(100);
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Unauthorized');
    dbMarkNotificationsRead(userId);
    return { success: true };
  },
  getAchievements: async (): Promise<any[]> => {
    await delay(150);
    const userId = getCurrentUserId();
    if (!userId) return [];
    return dbGetCertificates(userId);
  }
};
