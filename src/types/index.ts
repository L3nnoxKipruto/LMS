export type UserRole = 'student' | 'lecturer' | 'admin' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  institution?: string;
  department?: string;
  bio?: string;
  xp?: number;
  streak?: number;
  totalHours?: number;
  badges?: string[];
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

export interface LessonResource {
  type: 'pdf' | 'github' | 'doc' | 'cheatsheet' | 'exercise' | 'link';
  title: string;
  url: string;
  description?: string;
}

export interface ReviewSnippet {
  studentName: string;
  rating: number;
  comment: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  instructor?: string;
  category: string;
  department?: string;
  lecturerName: string;
  lecturerId: string;
  lecturerAvatar?: string;
  thumbnail?: string;
  thumbnailUrl: string;
  banner?: string;
  bannerUrl?: string;
  youtubeUrl?: string;
  modules?: Module[];
  lessons?: Lesson[];
  quizzes?: Quiz[];
  assignments?: Assignment[];
  resources?: LessonResource[];
  enrollmentCount?: number;
  enrolledStudentsCount: number;
  rating: number;
  reviews?: ReviewSnippet[] | number;
  reviewsCount?: number;
  reviewScore?: number;
  duration: string; // e.g. "12 weeks"
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  lessonsCount: number;
  modulesCount: number;
  isOfflineAvailable: boolean;
  downloadSize?: string; // e.g. "240 MB"
  progress?: number; // for enrolled student (0 - 100)
  skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  tags?: string[];
  skillsGained?: string[];
  language?: string;
  certificateAvailable?: boolean;
  hasCertificate?: boolean;
  completionRate?: number; // 0-100
  createdAt?: string;
  lastUpdated?: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: Lesson[];
  description?: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  duration: string;
  type: 'video' | 'pdf' | 'quiz' | 'document';
  videoUrl?: string;
  pdfUrl?: string;
  content?: string;
  notes?: string; // Markdown formatted lesson notes
  resources?: LessonResource[];
  exercises?: string[];
  isCompleted?: boolean;
  isDownloaded?: boolean;
  downloadProgress?: number; // 0 - 100
  downloadSize?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: string;
  feedback?: string;
  points: number;
  attachmentUrl?: string;
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  description: string;
  questionsCount: number;
  durationMinutes: number;
  passingScore: number;
  status: 'available' | 'completed' | 'in-progress';
  maxAttempts: number;
  attemptsLeft: number;
  bestScore?: number;
  questions?: QuizQuestion[];
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  issueDate: string;
  studentName: string;
  studentId?: string;
  grade: string;
  verificationCode: string;
  instructorName?: string;
}

export interface CourseReview {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  helpful?: number;
}

export interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string; // emoji
  xpReward: number;
  unlockedAt?: string;
  progress?: number; // 0-100 for in-progress achievements
  maxProgress?: number;
  isUnlocked: boolean;
}

export interface UserAchievement {
  userId: string;
  achievements: Achievement[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  studentName: string;
  avatarUrl?: string;
  xp: number;
  streak: number;
  coursesCompleted: number;
  department?: string;
  badge?: string;
}

export interface ActivityFeedItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  type: 'enrolled' | 'completed_lesson' | 'completed_course' | 'earned_achievement' | 'earned_certificate' | 'submitted_assignment' | 'posted_review';
  message: string;
  courseTitle?: string;
  courseId?: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  targetRole?: 'all' | 'student' | 'lecturer';
  department?: string;
  authorName: string;
  authorId: string;
  createdAt: string;
  expiresAt?: string;
  isPinned?: boolean;
}

export interface PlatformLog {
  id: string;
  level: 'info' | 'warning' | 'error' | 'success';
  action: string;
  description: string;
  userId?: string;
  userName?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface SyncItem {
  id: string;
  type: 'upload_assignment' | 'download_course' | 'sync_progress' | 'quiz_submission';
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  title: string;
  size?: string;
  progress: number; // 0-100
  error?: string;
  timestamp: string;
}

export interface Device {
  id: string;
  name: string;
  ipAddress: string;
  type: 'tablet' | 'laptop' | 'classroom-server';
  status: 'online' | 'offline';
  lastSeen: string;
  storageUsed: string;
  storageTotal: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headName: string;
  coursesCount: number;
  studentsCount: number;
  lecturersCount: number;
  description?: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  courseThumbnail?: string;
  courseCategory?: string;
  savedAt: string;
}

export interface StudyStreak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  streakHistory: { date: string; minutesStudied: number }[];
}
