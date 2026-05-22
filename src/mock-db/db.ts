import { 
  User, Course, Module, Lesson, Assignment, Department, Device, Certificate, SyncItem,
  LeaderboardEntry, ActivityFeedItem, Announcement, PlatformLog, Bookmark, StudyStreak,
  Achievement, CourseReview
} from '../types';
import { 
  SEED_USERS, SEED_DEPARTMENTS, SEED_DEVICES, SEED_COURSES, 
  SEED_MODULES, SEED_ASSIGNMENTS, SEED_ENROLLMENTS, SEED_NOTIFICATIONS, 
  SEED_ANALYTICS, SEED_QUIZZES, SEED_LEADERBOARD, SEED_ACTIVITY_FEED,
  SEED_PLATFORM_LOGS, SEED_REVIEWS, SEED_ANNOUNCEMENTS
} from './seeds';
import { ACHIEVEMENTS_POOL } from './social-data';

// Keys used in localStorage
const KEYS = {
  USERS: 'jh_db_users',
  DEPARTMENTS: 'jh_db_departments',
  DEVICES: 'jh_db_devices',
  COURSES: 'jh_db_courses',
  MODULES: 'jh_db_modules',
  ASSIGNMENTS: 'jh_db_assignments',
  ENROLLMENTS: 'jh_db_enrollments',
  NOTIFICATIONS: 'jh_db_notifications',
  ANALYTICS: 'jh_db_analytics',
  QUIZZES: 'jh_db_quizzes',
  CERTIFICATES: 'jh_db_certificates',
  LEADERBOARD: 'jh_db_leaderboard',
  ACTIVITY_FEED: 'jh_db_activity_feed',
  ANNOUNCEMENTS: 'jh_db_announcements',
  REVIEWS: 'jh_db_reviews',
  PLATFORM_LOGS: 'jh_db_platform_logs',
  BOOKMARKS: 'jh_db_bookmarks',
  STREAKS: 'jh_db_streaks',
  ACHIEVEMENTS: 'jh_db_achievements',
  VERSION: 'jh_db_version_key_v4' // Bump key to clear old storage
};

// Database Initializer
export const initMockDatabase = () => {
  if (typeof window === 'undefined') return;

  const currentVersion = localStorage.getItem(KEYS.VERSION);
  const targetVersion = '4.0';

  if (currentVersion !== targetVersion) {
    // Clear old keys to reseed
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    localStorage.setItem(KEYS.VERSION, targetVersion);
  }

  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem(KEYS.DEPARTMENTS)) {
    localStorage.setItem(KEYS.DEPARTMENTS, JSON.stringify(SEED_DEPARTMENTS));
  }
  if (!localStorage.getItem(KEYS.DEVICES)) {
    localStorage.setItem(KEYS.DEVICES, JSON.stringify(SEED_DEVICES));
  }
  if (!localStorage.getItem(KEYS.COURSES)) {
    localStorage.setItem(KEYS.COURSES, JSON.stringify(SEED_COURSES));
  }
  if (!localStorage.getItem(KEYS.MODULES)) {
    localStorage.setItem(KEYS.MODULES, JSON.stringify(SEED_MODULES));
  }
  if (!localStorage.getItem(KEYS.ASSIGNMENTS)) {
    localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(SEED_ASSIGNMENTS));
  }
  if (!localStorage.getItem(KEYS.ENROLLMENTS)) {
    localStorage.setItem(KEYS.ENROLLMENTS, JSON.stringify(SEED_ENROLLMENTS));
  }
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
  }
  if (!localStorage.getItem(KEYS.ANALYTICS)) {
    localStorage.setItem(KEYS.ANALYTICS, JSON.stringify(SEED_ANALYTICS));
  }
  if (!localStorage.getItem(KEYS.QUIZZES)) {
    localStorage.setItem(KEYS.QUIZZES, JSON.stringify(SEED_QUIZZES));
  }
  if (!localStorage.getItem(KEYS.CERTIFICATES)) {
    // Seed initial certificates for student Dennis Kiprop 'u1' on course 8 or 15 if needed
    localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.LEADERBOARD)) {
    localStorage.setItem(KEYS.LEADERBOARD, JSON.stringify(SEED_LEADERBOARD));
  }
  if (!localStorage.getItem(KEYS.ACTIVITY_FEED)) {
    localStorage.setItem(KEYS.ACTIVITY_FEED, JSON.stringify(SEED_ACTIVITY_FEED));
  }
  if (!localStorage.getItem(KEYS.ANNOUNCEMENTS)) {
    localStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(SEED_ANNOUNCEMENTS));
  }
  if (!localStorage.getItem(KEYS.REVIEWS)) {
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(SEED_REVIEWS));
  }
  if (!localStorage.getItem(KEYS.PLATFORM_LOGS)) {
    localStorage.setItem(KEYS.PLATFORM_LOGS, JSON.stringify(SEED_PLATFORM_LOGS));
  }
  if (!localStorage.getItem(KEYS.BOOKMARKS)) {
    localStorage.setItem(KEYS.BOOKMARKS, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.STREAKS)) {
    // Seed initial streaks
    const initialStreaks: Record<string, StudyStreak> = {
      'u1': { userId: 'u1', currentStreak: 12, longestStreak: 15, lastStudyDate: new Date().toISOString().split('T')[0], streakHistory: [] }
    };
    localStorage.setItem(KEYS.STREAKS, JSON.stringify(initialStreaks));
  }
  if (!localStorage.getItem(KEYS.ACHIEVEMENTS)) {
    // Seed initial achievements unlocked state for student u1
    const initialAchievements: Record<string, Achievement[]> = {
      'u1': ACHIEVEMENTS_POOL.map((ach, idx) => ({
        ...ach,
        isUnlocked: idx < 3,
        unlockedAt: idx < 3 ? new Date(Date.now() - idx * 86400000).toISOString() : undefined,
        progress: idx >= 3 ? 20 * idx : undefined,
        maxProgress: idx >= 3 ? 100 : undefined
      }))
    };
    localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(initialAchievements));
  }
};

// Helper getter/setter
const getLocal = <T>(key: string, fallback: T): T => {
  initMockDatabase();
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : fallback;
};

const setLocal = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// ─── USER DB OPERATIONS ─────────────────────────────────────────────────
export const dbGetUsers = (): (User & { password?: string })[] => getLocal(KEYS.USERS, []);
export const dbSaveUsers = (users: User[]) => setLocal(KEYS.USERS, users);

export const dbAddUser = (user: User & { password?: string }): User => {
  const users = dbGetUsers();
  users.push(user);
  dbSaveUsers(users);
  return user;
};

export const dbUpdateUser = (userId: string, data: Partial<User>): User => {
  const users = dbGetUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) throw new Error('User not found');
  users[index] = { ...users[index], ...data };
  dbSaveUsers(users);
  return users[index];
};

// ─── COURSE DB OPERATIONS ───────────────────────────────────────────────
export const dbGetCourses = (): Course[] => getLocal(KEYS.COURSES, []);
export const dbSaveCourses = (courses: Course[]) => setLocal(KEYS.COURSES, courses);

export const dbAddCourse = (course: Course): Course => {
  const courses = dbGetCourses();
  courses.push(course);
  dbSaveCourses(courses);
  return course;
};

export const dbUpdateCourse = (courseId: string, data: Partial<Course>): Course => {
  const courses = dbGetCourses();
  const idx = courses.findIndex(c => c.id === courseId);
  if (idx === -1) throw new Error('Course not found');
  courses[idx] = { ...courses[idx], ...data };
  dbSaveCourses(courses);
  return courses[idx];
};

export const dbDeleteCourse = (courseId: string) => {
  const courses = dbGetCourses();
  const updated = courses.filter(c => c.id !== courseId);
  dbSaveCourses(updated);

  // Clean modules
  const modules = dbGetAllModules();
  delete modules[courseId];
  setLocal(KEYS.MODULES, modules);
};

// ─── MODULE & LESSON OPERATIONS ─────────────────────────────────────────
export const dbGetAllModules = (): Record<string, Module[]> => getLocal(KEYS.MODULES, {});
export const dbGetCourseModules = (courseId: string): Module[] => {
  const modules = dbGetAllModules();
  return modules[courseId] || [];
};

export const dbSaveCourseModules = (courseId: string, courseModules: Module[]) => {
  const allModules = dbGetAllModules();
  allModules[courseId] = courseModules;
  setLocal(KEYS.MODULES, allModules);
};

export const dbAddModule = (courseId: string, title: string): Module => {
  const modules = dbGetCourseModules(courseId);
  const newModule: Module = {
    id: `m_${Date.now()}`,
    courseId,
    title,
    order: modules.length + 1,
    lessons: []
  };
  modules.push(newModule);
  dbSaveCourseModules(courseId, modules);
  
  dbUpdateCourse(courseId, { modulesCount: modules.length });
  return newModule;
};

export const dbAddLesson = (courseId: string, moduleId: string, title: string, duration: string, type: 'video' | 'pdf' | 'quiz' | 'document', videoUrl?: string, content?: string): Lesson => {
  const modules = dbGetCourseModules(courseId);
  const modIdx = modules.findIndex(m => m.id === moduleId);
  if (modIdx === -1) throw new Error('Module not found');

  const newLesson: Lesson = {
    id: `l_${Date.now()}`,
    moduleId,
    title,
    duration,
    type,
    videoUrl,
    content,
    isCompleted: false,
    isDownloaded: true
  };

  modules[modIdx].lessons.push(newLesson);
  dbSaveCourseModules(courseId, modules);

  const lessonsCount = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  dbUpdateCourse(courseId, { lessonsCount });

  return newLesson;
};

// ─── ENROLLMENTS & LESSON COMPLETIONS ───────────────────────────────────
export interface EnrollmentRecord {
  id: string;
  studentId: string;
  courseId: string;
  progress: number;
  completedLessons: string[];
}

export const dbGetEnrollments = (): EnrollmentRecord[] => getLocal(KEYS.ENROLLMENTS, []);
export const dbSaveEnrollments = (enrollments: EnrollmentRecord[]) => setLocal(KEYS.ENROLLMENTS, enrollments);

export const dbEnrollInCourse = (studentId: string, courseId: string): EnrollmentRecord => {
  const enrollments = dbGetEnrollments();
  const existing = enrollments.find(e => e.studentId === studentId && e.courseId === courseId);
  if (existing) return existing;

  const newEnrollment: EnrollmentRecord = {
    id: `e_${Date.now()}`,
    studentId,
    courseId,
    progress: 0,
    completedLessons: []
  };
  enrollments.push(newEnrollment);
  dbSaveEnrollments(enrollments);

  // Increment course enrolled count
  const course = dbGetCourses().find(c => c.id === courseId);
  if (course) {
    dbUpdateCourse(courseId, { enrolledStudentsCount: course.enrolledStudentsCount + 1 });
  }

  // Create notifications & activity log
  dbAddNotification(studentId, 'Enrolled Successfully', `You have registered for the course: ${course?.title || courseId}`);
  dbAddActivity(studentId, 'enrolled', { course_title: course?.title || 'Course' });

  // Add global activity feed
  const user = dbGetUsers().find(u => u.id === studentId);
  if (user) {
    dbAddActivityFeedItem({
      id: `feed_${Date.now()}`,
      userId: studentId,
      userName: user.name,
      userAvatar: user.avatarUrl,
      type: 'enrolled',
      message: `enrolled in the course ${course?.title || courseId}`,
      courseTitle: course?.title,
      courseId,
      createdAt: new Date().toISOString()
    });
  }

  return newEnrollment;
};

export const dbUnenrollFromCourse = (studentId: string, courseId: string) => {
  const enrollments = dbGetEnrollments();
  const updated = enrollments.filter(e => !(e.studentId === studentId && e.courseId === courseId));
  dbSaveEnrollments(updated);

  const course = dbGetCourses().find(c => c.id === courseId);
  if (course) {
    dbUpdateCourse(courseId, { enrolledStudentsCount: Math.max(0, course.enrolledStudentsCount - 1) });
  }
};

export const dbCompleteLesson = (studentId: string, lessonId: string, isCompleted: boolean = true) => {
  const modules = dbGetAllModules();
  let courseId = '';
  let lessonTitle = 'Lesson';
  
  for (const cId of Object.keys(modules)) {
    const lesson = modules[cId].flatMap(m => m.lessons).find(l => l.id === lessonId);
    if (lesson) {
      courseId = cId;
      lessonTitle = lesson.title;
      break;
    }
  }

  if (!courseId) return;

  const enrollments = dbGetEnrollments();
  const enrollIdx = enrollments.findIndex(e => e.studentId === studentId && e.courseId === courseId);
  if (enrollIdx === -1) return;

  const enrollment = enrollments[enrollIdx];
  const isAlreadyCompleted = enrollment.completedLessons.includes(lessonId);

  if (isCompleted && !isAlreadyCompleted) {
    enrollment.completedLessons.push(lessonId);
  } else if (!isCompleted && isAlreadyCompleted) {
    enrollment.completedLessons = enrollment.completedLessons.filter(id => id !== lessonId);
  }

  // Re-calculate progress percent
  const totalLessons = dbGetCourseModules(courseId).flatMap(m => m.lessons).length;
  enrollment.progress = totalLessons > 0 ? Math.round((enrollment.completedLessons.length / totalLessons) * 100) : 0;

  enrollments[enrollIdx] = enrollment;
  dbSaveEnrollments(enrollments);

  // Save activity and update analytics metrics
  if (isCompleted && !isAlreadyCompleted) {
    dbAddActivity(studentId, 'completed_lesson', { lesson_title: lessonTitle });
    
    // Add global activity feed
    const user = dbGetUsers().find(u => u.id === studentId);
    const course = dbGetCourses().find(c => c.id === courseId);
    if (user && course) {
      dbAddActivityFeedItem({
        id: `feed_${Date.now()}`,
        userId: studentId,
        userName: user.name,
        userAvatar: user.avatarUrl,
        type: 'completed_lesson',
        message: `completed a practical lesson in ${course.category}`,
        courseTitle: course.title,
        courseId: course.id,
        createdAt: new Date().toISOString()
      });
    }

    dbUpdateAnalyticsMetrics(studentId, {
      lessons_completed_increment: 1,
      time_spent_increment: 20 // add mock 20 minutes
    });

    // Check if course is 100% completed to issue Certificate
    if (enrollment.progress === 100) {
      dbIssueCertificate(studentId, courseId);
    }
  }
};

// ─── ASSIGNMENT DB OPERATIONS ───────────────────────────────────────────
export const dbGetAssignments = (): Assignment[] => getLocal(KEYS.ASSIGNMENTS, []);
export const dbSaveAssignments = (assignments: Assignment[]) => setLocal(KEYS.ASSIGNMENTS, assignments);

export const dbSubmitAssignment = (studentId: string, assignmentId: string, submissionContent: string) => {
  const assignments = dbGetAssignments();
  const idx = assignments.findIndex(a => a.id === assignmentId);
  if (idx === -1) return;

  assignments[idx] = {
    ...assignments[idx],
    status: 'submitted',
    attachmentUrl: '#'
  };
  dbSaveAssignments(assignments);

  // Add activity log
  const assignment = assignments[idx];
  dbAddActivity(studentId, 'submitted_assignment', { assignment_title: assignment.title });
  
  // Add to global activity feed
  const user = dbGetUsers().find(u => u.id === studentId);
  const course = dbGetCourses().find(c => c.id === assignment.courseId);
  if (user && course) {
    dbAddActivityFeedItem({
      id: `feed_${Date.now()}`,
      userId: studentId,
      userName: user.name,
      userAvatar: user.avatarUrl,
      type: 'submitted_assignment',
      message: `submitted code for assignment in ${course.title}`,
      courseTitle: course.title,
      courseId: course.id,
      createdAt: new Date().toISOString()
    });
  }

  // Send notification to lecturer (predefined lecturer id u2 or course-specific lecturer)
  dbAddNotification(course?.lecturerId || 'u2', 'Assignment Submitted', `Learner submitted code for assignment: ${assignment.title}`);
};

export const dbGradeAssignment = (assignmentId: string, grade: string, feedback: string) => {
  const assignments = dbGetAssignments();
  const idx = assignments.findIndex(a => a.id === assignmentId);
  if (idx === -1) return;

  assignments[idx] = {
    ...assignments[idx],
    status: 'graded',
    grade,
    feedback
  };
  dbSaveAssignments(assignments);

  const assignment = assignments[idx];
  dbAddNotification(assignment.courseId, 'Assignment Graded', `Your submission for ${assignment.title} has been graded: ${grade}`);
};

// ─── QUIZZES DB OPERATIONS ──────────────────────────────────────────────
export const dbGetQuizzes = (): Record<string, any> => getLocal(KEYS.QUIZZES, {});
export const dbSaveQuizzes = (quizzes: Record<string, any>) => setLocal(KEYS.QUIZZES, quizzes);

export const dbAddQuiz = (lessonId: string, title: string, description: string, passScore: number, questions: any[]) => {
  const quizzes = dbGetQuizzes();
  quizzes[lessonId] = {
    id: `q_${lessonId}`,
    title,
    description,
    pass_score: passScore,
    time_limit_minutes: 15,
    max_attempts: 3,
    questions
  };
  dbSaveQuizzes(quizzes);
};

// ─── DEPARTMENTS DB OPERATIONS ──────────────────────────────────────────
export const dbGetDepartments = (): Department[] => getLocal(KEYS.DEPARTMENTS, []);
export const dbSaveDepartments = (depts: Department[]) => setLocal(KEYS.DEPARTMENTS, depts);

export const dbAddDepartment = (code: string, name: string, headName: string): Department => {
  const depts = dbGetDepartments();
  const newDept: Department = {
    id: `d_${Date.now()}`,
    code,
    name,
    headName,
    coursesCount: 0,
    studentsCount: 0,
    lecturersCount: 0
  };
  depts.push(newDept);
  dbSaveDepartments(depts);
  return newDept;
};

export const dbDeleteDepartment = (id: string) => {
  const depts = dbGetDepartments();
  const filtered = depts.filter(d => d.id !== id);
  dbSaveDepartments(filtered);
};

// ─── DEVICES DB OPERATIONS ──────────────────────────────────────────────
export const dbGetDevices = (): Device[] => getLocal(KEYS.DEVICES, []);
export const dbSaveDevices = (devices: Device[]) => setLocal(KEYS.DEVICES, devices);

export const dbAddDevice = (name: string, ipAddress: string, type: 'tablet' | 'laptop' | 'classroom-server'): Device => {
  const devices = dbGetDevices();
  const newDevice: Device = {
    id: `dev_${Date.now()}`,
    name,
    ipAddress,
    type,
    status: 'online',
    lastSeen: new Date().toISOString(),
    storageUsed: '0 GB',
    storageTotal: type === 'tablet' ? '32 GB' : type === 'laptop' ? '256 GB' : '1024 GB'
  };
  devices.push(newDevice);
  dbSaveDevices(devices);
  return newDevice;
};

export const dbDeleteDevice = (id: string) => {
  const devices = dbGetDevices();
  const filtered = devices.filter(d => d.id !== id);
  dbSaveDevices(filtered);
};

// ─── NOTIFICATIONS DB OPERATIONS ────────────────────────────────────────
export const dbGetNotifications = (userId: string): any[] => {
  const all = getLocal<any[]>(KEYS.NOTIFICATIONS, []);
  return all.filter(n => n.userId === userId).sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export const dbAddNotification = (userId: string, title: string, message: string) => {
  const all = getLocal<any[]>(KEYS.NOTIFICATIONS, []);
  all.push({
    id: `n_${Date.now()}`,
    userId,
    title,
    message,
    read: false,
    created_at: new Date().toISOString()
  });
  setLocal(KEYS.NOTIFICATIONS, all);
};

export const dbMarkNotificationsRead = (userId: string) => {
  const all = getLocal<any[]>(KEYS.NOTIFICATIONS, []);
  const updated = all.map(n => n.userId === userId ? { ...n, read: true } : n);
  setLocal(KEYS.NOTIFICATIONS, updated);
};

// ─── CERTIFICATES DB OPERATIONS ─────────────────────────────────────────
export const dbGetCertificates = (studentId: string): Certificate[] => {
  const all = getLocal<Certificate[]>(KEYS.CERTIFICATES, []);
  return all.filter(c => c.studentId === studentId);
};

export const dbIssueCertificate = (studentId: string, courseId: string) => {
  const all = getLocal<Certificate[]>(KEYS.CERTIFICATES, []);
  const course = dbGetCourses().find(c => c.id === courseId);
  const users = dbGetUsers();
  const user = users.find(u => u.id === studentId);

  const cert: Certificate = {
    id: `cert_${Date.now()}`,
    courseId,
    courseTitle: course?.title || 'Resilient Tech Course',
    issueDate: new Date().toISOString(),
    studentName: user?.name || 'Dennis Kiprop',
    studentId: studentId,
    grade: 'A',
    verificationCode: `JH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
  };

  all.push(cert);
  setLocal(KEYS.CERTIFICATES, all);

  dbAddNotification(studentId, 'Certificate Issued!', `Congratulations! You earned a TVETA certification in: ${cert.courseTitle}`);
  dbAddActivity(studentId, 'earned_certificate', { course_title: cert.courseTitle });

  // Add global activity feed
  if (user && course) {
    dbAddActivityFeedItem({
      id: `feed_${Date.now()}`,
      userId: studentId,
      userName: user.name,
      userAvatar: user.avatarUrl,
      type: 'earned_certificate',
      message: `graduated and earned a certificate in ${course.title}!`,
      courseTitle: course.title,
      courseId: course.id,
      createdAt: new Date().toISOString()
    });
  }

  dbUpdateAnalyticsMetrics(studentId, { courses_completed_increment: 1 });
};

// ─── ANALYTICS DB OPERATIONS ────────────────────────────────────────────
export const dbGetAnalytics = (userId: string): any => {
  const all = getLocal<Record<string, any>>(KEYS.ANALYTICS, {});
  if (!all[userId]) {
    all[userId] = {
      metrics: {
        total_lessons_completed: 0,
        total_time_spent_minutes: 0,
        avg_score: 0,
        courses_completed: 0,
        current_streak: 1
      },
      recent_activity: [],
      daily_stats: [
        { date: new Date().toISOString().split('T')[0], lessons_completed: 0, time_spent_minutes: 0, assignments_submitted: 0 }
      ]
    };
    setLocal(KEYS.ANALYTICS, all);
  }
  return all[userId];
};

export const dbAddActivity = (userId: string, type: string, metadata: any) => {
  const all = getLocal<Record<string, any>>(KEYS.ANALYTICS, {});
  if (!all[userId]) dbGetAnalytics(userId);
  
  const userAnalytics = all[userId] || getLocal<Record<string, any>>(KEYS.ANALYTICS, {})[userId];
  if (userAnalytics) {
    userAnalytics.recent_activity.unshift({
      id: Date.now(),
      activity_type: type,
      created_at: new Date().toISOString(),
      metadata
    });
    userAnalytics.recent_activity = userAnalytics.recent_activity.slice(0, 15);
    all[userId] = userAnalytics;
    setLocal(KEYS.ANALYTICS, all);
  }
};

export const dbUpdateAnalyticsMetrics = (userId: string, updates: { lessons_completed_increment?: number; time_spent_increment?: number; courses_completed_increment?: number }) => {
  const all = getLocal<Record<string, any>>(KEYS.ANALYTICS, {});
  const userAnalytics = all[userId];
  if (userAnalytics) {
    const m = userAnalytics.metrics;
    if (updates.lessons_completed_increment) {
      m.total_lessons_completed += updates.lessons_completed_increment;
    }
    if (updates.time_spent_increment) {
      m.total_time_spent_minutes += updates.time_spent_increment;
    }
    if (updates.courses_completed_increment) {
      m.courses_completed += updates.courses_completed_increment;
    }
    
    const today = new Date().toISOString().split('T')[0];
    let daily = userAnalytics.daily_stats.find((d: any) => d.date === today);
    if (!daily) {
      daily = { date: today, lessons_completed: 0, time_spent_minutes: 0, assignments_submitted: 0 };
      userAnalytics.daily_stats.push(daily);
    }
    if (updates.lessons_completed_increment) {
      daily.lessons_completed += updates.lessons_completed_increment;
    }
    if (updates.time_spent_increment) {
      daily.time_spent_minutes += updates.time_spent_increment;
    }

    all[userId] = userAnalytics;
    setLocal(KEYS.ANALYTICS, all);
  }
};

// ─── LEADERBOARD DB OPERATIONS ──────────────────────────────────────────
export const dbGetLeaderboard = (): LeaderboardEntry[] => getLocal(KEYS.LEADERBOARD, []);

// ─── ACTIVITY FEED DB OPERATIONS ────────────────────────────────────────
export const dbGetActivityFeed = (): ActivityFeedItem[] => getLocal(KEYS.ACTIVITY_FEED, []);
export const dbAddActivityFeedItem = (item: ActivityFeedItem) => {
  const all = getLocal<ActivityFeedItem[]>(KEYS.ACTIVITY_FEED, []);
  all.unshift(item);
  setLocal(KEYS.ACTIVITY_FEED, all.slice(0, 100)); // Cap at 100 items
};

// ─── ANNOUNCEMENTS DB OPERATIONS ────────────────────────────────────────
export const dbGetAnnouncements = (): Announcement[] => getLocal(KEYS.ANNOUNCEMENTS, []);

// ─── REVIEWS DB OPERATIONS ──────────────────────────────────────────────
export const dbGetCourseReviews = (courseId: string): CourseReview[] => {
  const all = getLocal<CourseReview[]>(KEYS.REVIEWS, []);
  return all.filter(r => r.courseId === courseId);
};

export const dbAddCourseReview = (review: CourseReview) => {
  const all = getLocal<CourseReview[]>(KEYS.REVIEWS, []);
  all.unshift(review);
  setLocal(KEYS.REVIEWS, all);

  // Recalculate course rating
  const courses = dbGetCourses();
  const cIdx = courses.findIndex(c => c.id === review.courseId);
  if (cIdx !== -1) {
    const courseReviews = all.filter(r => r.courseId === review.courseId);
    const sum = courseReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = parseFloat((sum / courseReviews.length).toFixed(1));
    dbUpdateCourse(review.courseId, {
      rating: avg,
      reviewsCount: courseReviews.length
    });
  }
};

// ─── PLATFORM LOGS DB OPERATIONS ────────────────────────────────────────
export const dbGetPlatformLogs = (): PlatformLog[] => getLocal(KEYS.PLATFORM_LOGS, []);
export const dbAddPlatformLog = (log: PlatformLog) => {
  const all = getLocal<PlatformLog[]>(KEYS.PLATFORM_LOGS, []);
  all.unshift(log);
  setLocal(KEYS.PLATFORM_LOGS, all.slice(0, 200)); // Cap at 200 items
};

// ─── BOOKMARKS DB OPERATIONS ────────────────────────────────────────────
export const dbGetBookmarks = (userId: string): Bookmark[] => {
  const all = getLocal<Bookmark[]>(KEYS.BOOKMARKS, []);
  return all.filter(b => b.userId === userId);
};

export const dbAddBookmark = (userId: string, courseId: string) => {
  const all = getLocal<Bookmark[]>(KEYS.BOOKMARKS, []);
  const exists = all.some(b => b.userId === userId && b.courseId === courseId);
  if (exists) return;

  const course = dbGetCourses().find(c => c.id === courseId);
  if (!course) return;

  all.push({
    id: `bm_${Date.now()}`,
    userId,
    courseId,
    courseTitle: course.title,
    courseThumbnail: course.thumbnailUrl,
    courseCategory: course.category,
    savedAt: new Date().toISOString()
  });
  setLocal(KEYS.BOOKMARKS, all);
};

export const dbRemoveBookmark = (userId: string, courseId: string) => {
  const all = getLocal<Bookmark[]>(KEYS.BOOKMARKS, []);
  const updated = all.filter(b => !(b.userId === userId && b.courseId === courseId));
  setLocal(KEYS.BOOKMARKS, updated);
};

// ─── STREAKS DB OPERATIONS ──────────────────────────────────────────────
export const dbGetStreak = (userId: string): StudyStreak => {
  const all = getLocal<Record<string, StudyStreak>>(KEYS.STREAKS, {});
  if (!all[userId]) {
    all[userId] = {
      userId,
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: '',
      streakHistory: []
    };
    setLocal(KEYS.STREAKS, all);
  }
  return all[userId];
};

export const dbUpdateStreak = (userId: string, minutes: number = 20) => {
  const all = getLocal<Record<string, StudyStreak>>(KEYS.STREAKS, {});
  const streak = dbGetStreak(userId);
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const historyToday = streak.streakHistory.find(h => h.date === today);
  if (historyToday) {
    historyToday.minutesStudied += minutes;
  } else {
    streak.streakHistory.push({ date: today, minutesStudied: minutes });
    
    if (streak.lastStudyDate === yesterday) {
      streak.currentStreak += 1;
    } else if (streak.lastStudyDate !== today) {
      streak.currentStreak = 1;
    }

    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }
    streak.lastStudyDate = today;
  }

  all[userId] = streak;
  setLocal(KEYS.STREAKS, all);
};

// ─── ACHIEVEMENTS DB OPERATIONS ─────────────────────────────────────────
export const dbGetAchievements = (userId: string): Achievement[] => {
  const all = getLocal<Record<string, Achievement[]>>(KEYS.ACHIEVEMENTS, {});
  if (!all[userId]) {
    all[userId] = ACHIEVEMENTS_POOL.map(ach => ({
      ...ach,
      isUnlocked: false
    }));
    setLocal(KEYS.ACHIEVEMENTS, all);
  }
  return all[userId];
};

export const dbUnlockAchievement = (userId: string, achievementId: string): Achievement | null => {
  const all = getLocal<Record<string, Achievement[]>>(KEYS.ACHIEVEMENTS, {});
  const userAchs = dbGetAchievements(userId);
  const idx = userAchs.findIndex(a => a.id === achievementId);
  if (idx === -1 || userAchs[idx].isUnlocked) return null;

  userAchs[idx].isUnlocked = true;
  userAchs[idx].unlockedAt = new Date().toISOString();
  all[userId] = userAchs;
  setLocal(KEYS.ACHIEVEMENTS, all);

  dbAddNotification(userId, 'New Achievement Unlocked!', `Congratulations! You unlocked the badge: ${userAchs[idx].title}`);
  
  // Update XP
  const users = dbGetUsers();
  const uIdx = users.findIndex(u => u.id === userId);
  if (uIdx !== -1) {
    users[uIdx].xp = (users[uIdx].xp || 0) + userAchs[idx].xpReward;
    dbSaveUsers(users);
  }

  // Update Global Feed
  const user = users.find(u => u.id === userId);
  if (user) {
    dbAddActivityFeedItem({
      id: `feed_${Date.now()}`,
      userId,
      userName: user.name,
      userAvatar: user.avatarUrl,
      type: 'earned_achievement',
      message: `unlocked the achievement: ${userAchs[idx].title}`,
      createdAt: new Date().toISOString()
    });
  }

  return userAchs[idx];
};
