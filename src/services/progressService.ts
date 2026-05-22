import { dbGetEnrollments } from '../mock-db/db';
import { courseService } from './courseService';
import { lessonService } from './lessonService';

const delay = (ms: number = 160) => new Promise((resolve) => setTimeout(resolve, ms));

const getCurrentUserId = (): string => {
  const userJson = localStorage.getItem('jh_user');
  if (!userJson) return '';
  try {
    return JSON.parse(userJson).id;
  } catch {
    return '';
  }
};

export const progressService = {
  getCourseProgress: async (courseId: string) => {
    await delay();
    const userId = getCurrentUserId();
    const enrollment = dbGetEnrollments().find((item) => item.studentId === userId && item.courseId === courseId);
    return {
      progress: enrollment?.progress || 0,
      completedLessons: enrollment?.completedLessons || []
    };
  },
  completeLesson: async (lessonId: string, watchProgress: number = 100) => {
    await lessonService.saveWatchProgress(lessonId, watchProgress);
    return courseService.completeLesson(lessonId, Math.round((watchProgress / 100) * 900), watchProgress >= 95);
  },
  setLessonWatchProgress: async (lessonId: string, watchProgress: number) => {
    await delay(100);
    return lessonService.saveWatchProgress(lessonId, watchProgress);
  }
};
