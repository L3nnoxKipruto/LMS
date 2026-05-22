import { dbGetEnrollments, dbGetAnalytics } from '../mock-db/db';

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

export const analyticsService = {
  getStudentAnalytics: async (_userId?: string): Promise<any> => {
    await delay(150);
    const userId = getCurrentUserId();
    if (!userId) return null;
    return dbGetAnalytics(userId);
  },
  getDailyStats: async (): Promise<any> => {
    await delay(150);
    const userId = getCurrentUserId();
    if (!userId) return { enrolled_courses: 0, completed_courses: 0, in_progress_courses: 0, total_hours: 0 };
    
    const enrolls = dbGetEnrollments().filter(e => e.studentId === userId);
    const completed = enrolls.filter(e => e.progress === 100).length;
    const inProgress = enrolls.filter(e => e.progress > 0 && e.progress < 100).length;
    
    const analytics = dbGetAnalytics(userId);
    const totalMinutes = analytics.metrics.total_time_spent_minutes;
    const hours = Math.round((totalMinutes / 60) * 10) / 10;
    
    return {
      enrolled_courses: enrolls.length,
      completed_courses: completed,
      in_progress_courses: inProgress,
      total_hours: hours
    };
  },
  getActivityLog: async (): Promise<any[]> => {
    await delay(100);
    const userId = getCurrentUserId();
    if (!userId) return [];
    const analytics = dbGetAnalytics(userId);
    return analytics.recent_activity;
  }
};
