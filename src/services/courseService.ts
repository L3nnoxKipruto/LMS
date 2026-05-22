import { Course, Module, Lesson, CourseReview } from '../types';
import { 
  dbGetCourses, dbGetEnrollments, dbGetCourseModules, 
  dbGetAllModules, dbCompleteLesson, dbEnrollInCourse, 
  dbUnenrollFromCourse, dbGetQuizzes, dbGetCourseReviews,
  dbAddCourseReview, dbGetUsers
} from '../mock-db/db';

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

const mapCourseWithProgress = (c: Course, studentId: string): Course => {
  const enrollments = dbGetEnrollments();
  const enrollment = enrollments.find(e => e.studentId === studentId && e.courseId === c.id);
  return {
    ...c,
    progress: enrollment ? enrollment.progress : 0
  };
};

export const courseService = {
  getCourses: async (): Promise<Course[]> => {
    await delay(200);
    const userId = getCurrentUserId();
    const courses = dbGetCourses();
    return courses.map(c => mapCourseWithProgress(c, userId));
  },
  getMyCourses: async (): Promise<Course[]> => {
    await delay(200);
    const userId = getCurrentUserId();
    if (!userId) return [];
    
    const enrollments = dbGetEnrollments().filter(e => e.studentId === userId);
    const enrolledIds = enrollments.map(e => e.courseId);
    
    const courses = dbGetCourses().filter(c => enrolledIds.includes(c.id));
    return courses.map(c => mapCourseWithProgress(c, userId));
  },
  getCourseById: async (id: string): Promise<Course> => {
    await delay(150);
    const userId = getCurrentUserId();
    const course = dbGetCourses().find(c => c.id === id);
    if (!course) throw new Error('Course not found');
    return mapCourseWithProgress(course, userId);
  },
  getCourseModules: async (courseId: string): Promise<Module[]> => {
    await delay(200);
    const userId = getCurrentUserId();
    const modules = dbGetCourseModules(courseId);
    const enrollments = dbGetEnrollments();
    const enrollment = enrollments.find(e => e.studentId === userId && e.courseId === courseId);
    const completedLessonIds = enrollment ? enrollment.completedLessons : [];

    return modules.map(m => ({
      ...m,
      lessons: m.lessons.map(l => ({
        ...l,
        isCompleted: completedLessonIds.includes(l.id),
        isDownloaded: true,
        downloadSize: '20 MB'
      }))
    }));
  },
  getLessonDetail: async (lessonId: string): Promise<Lesson> => {
    await delay(100);
    const userId = getCurrentUserId();
    
    const modules = dbGetAllModules();
    let foundLesson: Lesson | null = null;
    let foundCourseId = '';
    
    for (const cId of Object.keys(modules)) {
      const lesson = modules[cId].flatMap(m => m.lessons).find(l => l.id === lessonId);
      if (lesson) {
        foundLesson = lesson;
        foundCourseId = cId;
        break;
      }
    }
    
    if (!foundLesson) throw new Error('Lesson not found');
    
    const enrollment = dbGetEnrollments().find(e => e.studentId === userId && e.courseId === foundCourseId);
    const isCompleted = enrollment ? enrollment.completedLessons.includes(lessonId) : false;
    
    return {
      ...foundLesson,
      isCompleted,
      isDownloaded: true
    };
  },
  completeLesson: async (lessonId: string, watchTime: number = 0, isCompleted: boolean = true): Promise<any> => {
    await delay(100);
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Unauthorized');
    dbCompleteLesson(userId, lessonId, isCompleted);
    return { success: true };
  },
  enrollInCourse: async (courseId: string): Promise<any> => {
    await delay(250);
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Unauthorized');
    dbEnrollInCourse(userId, courseId);
    return { success: true };
  },
  unenrollFromCourse: async (courseId: string): Promise<any> => {
    await delay(200);
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Unauthorized');
    dbUnenrollFromCourse(userId, courseId);
    return { success: true };
  },
  getQuizzes: async (): Promise<any[]> => {
    await delay(150);
    const quizzesRecord = dbGetQuizzes();
    return Object.values(quizzesRecord);
  },
  getCourseReviews: async (courseId: string): Promise<CourseReview[]> => {
    await delay(100);
    return dbGetCourseReviews(courseId);
  },
  addCourseReview: async (
    courseId: string,
    ratingOrPayload: number | { rating: number; comment: string },
    commentArg?: string
  ): Promise<any> => {
    await delay(150);
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Unauthorized');
    const user = dbGetUsers().find(u => u.id === userId);
    const payload = typeof ratingOrPayload === 'number'
      ? { rating: ratingOrPayload, comment: commentArg || '' }
      : ratingOrPayload;
    
    const newReview: CourseReview = {
      id: `rev_${Date.now()}`,
      courseId,
      studentId: userId,
      studentName: user?.name || 'Dennis Kiprop',
      studentAvatar: user?.avatarUrl,
      rating: payload.rating,
      comment: payload.comment,
      createdAt: new Date().toISOString(),
      helpful: 0
    };

    dbAddCourseReview(newReview);
    return { success: true, review: newReview };
  }
};
