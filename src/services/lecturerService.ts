import { Course, Lesson, Module } from '../types';
import { dbAddCourse, dbAddLesson, dbAddModule, dbAddQuiz, dbDeleteCourse, dbGetCourseModules, dbGetCourses, dbUpdateCourse } from '../mock-db/db';

const delay = (ms: number = 200) => new Promise((resolve) => setTimeout(resolve, ms));

const getCurrentUser = () => {
  const userJson = localStorage.getItem('jh_user');
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
};

export const lecturerService = {
  getPublishedCourses: async (): Promise<Course[]> => {
    await delay(150);
    const user = getCurrentUser();
    if (!user?.id) return [];
    return dbGetCourses().filter((course) => course.lecturerId === user.id);
  },
  createCourse: async (payload: Partial<Course>): Promise<Course> => {
    await delay(220);
    const user = getCurrentUser();
    if (!user?.id) throw new Error('Unauthorized');
    const course: Course = {
      id: `course_${Date.now()}`,
      title: payload.title || 'New Course Draft',
      subtitle: payload.subtitle || 'Draft curriculum ready for publishing.',
      description: payload.description || 'Lecturer-authored course draft stored in the local SaaS workspace.',
      instructor: user.name,
      category: payload.category || 'Custom Curriculum',
      department: payload.department || user.department || 'ICT & Software Development',
      lecturerName: user.name,
      lecturerId: user.id,
      thumbnail: payload.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      thumbnailUrl: payload.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      banner: payload.bannerUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80',
      bannerUrl: payload.bannerUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80',
      youtubeUrl: payload.youtubeUrl,
      modules: [],
      lessons: [],
      quizzes: [],
      assignments: [],
      resources: [],
      enrollmentCount: 0,
      enrolledStudentsCount: 0,
      rating: 5,
      reviews: [],
      reviewsCount: 0,
      duration: payload.duration || '6 Weeks',
      level: payload.level || 'Beginner',
      lessonsCount: 0,
      modulesCount: 0,
      isOfflineAvailable: true,
      downloadSize: '120 MB',
      progress: 0,
      skillLevel: payload.skillLevel || 'Beginner',
      tags: payload.tags || ['custom', 'draft'],
      skillsGained: payload.skillsGained || ['Draft learning outcome'],
      language: 'English',
      certificateAvailable: true,
      hasCertificate: true,
      completionRate: 0,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    return dbAddCourse(course);
  },
  updateCourse: async (courseId: string, payload: Partial<Course>) => {
    await delay(180);
    return dbUpdateCourse(courseId, { ...payload, lastUpdated: new Date().toISOString().split('T')[0] });
  },
  deleteCourse: async (courseId: string) => {
    await delay(150);
    dbDeleteCourse(courseId);
  },
  getCourseModules: async (courseId: string): Promise<Module[]> => {
    await delay(120);
    return dbGetCourseModules(courseId);
  },
  addModule: async (courseId: string, title: string) => {
    await delay(150);
    return dbAddModule(courseId, title);
  },
  addLesson: async (courseId: string, moduleId: string, lesson: Pick<Lesson, 'title' | 'duration' | 'type' | 'videoUrl' | 'content'>) => {
    await delay(150);
    return dbAddLesson(courseId, moduleId, lesson.title, lesson.duration, lesson.type, lesson.videoUrl, lesson.content);
  },
  publishQuiz: async (lessonId: string, title: string) => {
    await delay(150);
    dbAddQuiz(lessonId, title, `Auto-published lecturer assessment for ${title}`, 70, [
      { text: 'Have learners reviewed the lesson materials?', options: ['Yes', 'No'], correctOptionIndex: 0, explanation: 'Review should happen before assessment.' }
    ]);
    return { success: true };
  }
};
