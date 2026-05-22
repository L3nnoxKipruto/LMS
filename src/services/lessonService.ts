import { Lesson } from '../types';
import { dbGetAllModules } from '../mock-db/db';
import { getIDBData, setIDBData } from './indexedDB';

const delay = (ms: number = 180) => new Promise((resolve) => setTimeout(resolve, ms));

const lessonNoteKey = (lessonId: string) => `lesson-notes:${lessonId}`;
const watchProgressKey = (lessonId: string) => `lesson-watch:${lessonId}`;

export const lessonService = {
  getLessonById: async (lessonId: string): Promise<Lesson> => {
    await delay();
    const modules = dbGetAllModules();
    const lesson = Object.values(modules).flatMap((courseModules) => courseModules.flatMap((module) => module.lessons)).find((item) => item.id === lessonId);
    if (!lesson) throw new Error('Lesson not found');

    const savedNotes = localStorage.getItem(lessonNoteKey(lessonId)) || '';
    const watchProgress = await getIDBData<number>(watchProgressKey(lessonId), 0);

    return {
      ...lesson,
      notes: savedNotes || lesson.notes,
      downloadProgress: watchProgress
    };
  },
  saveLessonNotes: async (lessonId: string, notes: string) => {
    await delay(100);
    localStorage.setItem(lessonNoteKey(lessonId), notes);
    await setIDBData(lessonNoteKey(lessonId), notes);
    return { success: true };
  },
  getLessonNotes: async (lessonId: string) => {
    await delay(80);
    return getIDBData<string>(lessonNoteKey(lessonId), localStorage.getItem(lessonNoteKey(lessonId)) || '');
  },
  saveWatchProgress: async (lessonId: string, progress: number) => {
    await delay(80);
    const normalized = Math.max(0, Math.min(100, Math.round(progress)));
    localStorage.setItem(watchProgressKey(lessonId), String(normalized));
    await setIDBData(watchProgressKey(lessonId), normalized);
    return { success: true, progress: normalized };
  },
  getWatchProgress: async (lessonId: string) => {
    await delay(80);
    return getIDBData<number>(watchProgressKey(lessonId), Number(localStorage.getItem(watchProgressKey(lessonId)) || 0));
  }
};
