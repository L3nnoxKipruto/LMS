import { Bookmark } from '../types';
import { dbGetBookmarks, dbAddBookmark, dbRemoveBookmark } from '../mock-db/db';

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

export const bookmarkService = {
  getBookmarks: async (): Promise<Bookmark[]> => {
    await delay(100);
    const userId = getCurrentUserId();
    if (!userId) return [];
    return dbGetBookmarks(userId);
  },
  addBookmark: async (courseId: string): Promise<any> => {
    await delay(100);
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Unauthorized');
    dbAddBookmark(userId, courseId);
    return { success: true };
  },
  removeBookmark: async (courseId: string): Promise<any> => {
    await delay(100);
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Unauthorized');
    dbRemoveBookmark(userId, courseId);
    return { success: true };
  }
};
