import { User, Department, Device } from '../types';
import { 
  generateLecturers, generateStudents,
  generateEnrollments, generateNotifications, generateAnalytics,
  generateLeaderboard, generateActivityFeed, generatePlatformLogs,
  generateReviews
} from './generators';
import { ANNOUNCEMENTS_POOL } from './social-data';
import {
  COURSE_DEPARTMENTS,
  SEED_ASSIGNMENTS as COURSE_ASSIGNMENTS,
  SEED_COURSES,
  SEED_MODULES,
  SEED_QUIZZES
} from './courses';

// 1. Core Users (Admin & Guest Fallbacks)
export const CORE_ADMINS: (User & { password?: string })[] = [
  {
    id: 'u3',
    name: 'System Administrator',
    email: 'sysadmin@jifunzehub.ac.ke',
    password: 'jifunzehub123',
    role: 'admin',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=sysadmin@jifunzehub.ac.ke',
    institution: 'Naserian TVET Institute',
    department: 'Main Classroom Host 1',
    bio: 'System Administrator managing the local network fleet and offline course sync operations.'
  }
];

// 2. Generate lecturers & students
export const LECTURERS = generateLecturers();
export const STUDENTS = generateStudents();

export const SEED_USERS: (User & { password?: string })[] = [
  ...STUDENTS,
  ...LECTURERS,
  ...CORE_ADMINS
];

// 3. TVET Departments registry
export const SEED_DEPARTMENTS: Department[] = COURSE_DEPARTMENTS.map((name, index) => {
  const coursesCount = SEED_COURSES.filter((course) => course.department === name).length;
  const studentMultiplier = 60 + index * 12;
  const headNameByDept: Record<string, string> = {
    'ICT & Software Development': 'Elena Rodriguez',
    Engineering: 'Dr. Sarah Mitchell',
    Business: 'Wanjiku Mwangi',
    Hospitality: 'Lucy Wangare',
    Agriculture: 'James Carter',
    'Health Sciences': 'Amina Yusuf',
    'Fashion & Beauty': 'Lucy Wangare',
    Construction: 'Dennis Kipkemboi',
    'Media & Creative Arts': 'Elena Rodriguez',
    'Technical Skills': 'Peter Kamau'
  };

  return {
    id: `d${index + 1}`,
    code: name.split(/[\s&]+/).map((part) => part[0]).join('').slice(0, 4).toUpperCase(),
    name,
    headName: headNameByDept[name] || 'Academic Registrar',
    coursesCount,
    studentsCount: coursesCount * studentMultiplier,
    lecturersCount: Math.max(3, Math.ceil(coursesCount / 2)),
    description: `${name} pathways include active enrollments, tracked progress, practical assignments, and certificate-ready learning journeys.`
  };
});

// 4. Local network device fleet records
export const SEED_DEVICES: Device[] = [
  {
    id: 'dev1',
    name: 'Dennis Tablet B1',
    ipAddress: '192.168.1.15',
    type: 'tablet',
    status: 'online',
    lastSeen: new Date().toISOString(),
    storageUsed: '12 GB',
    storageTotal: '32 GB'
  },
  {
    id: 'dev2',
    name: 'Wanjiku Laptop',
    ipAddress: '192.168.1.18',
    type: 'laptop',
    status: 'online',
    lastSeen: new Date().toISOString(),
    storageUsed: '48 GB',
    storageTotal: '256 GB'
  },
  {
    id: 'dev3',
    name: 'Classroom Server Hub',
    ipAddress: '192.168.1.1',
    type: 'classroom-server',
    status: 'online',
    lastSeen: new Date().toISOString(),
    storageUsed: '450 GB',
    storageTotal: '1024 GB'
  }
];

// 5. Rich course dataset with generated modules, lessons, quizzes and assignments
export { SEED_COURSES, SEED_MODULES, SEED_QUIZZES };

// 6. Course modules and quizzes

// 7. Generate assignments & submissions
export const SEED_ASSIGNMENTS = COURSE_ASSIGNMENTS;

// 8. Generate student enrollments & notification feeds
export const SEED_ENROLLMENTS = generateEnrollments(STUDENTS, SEED_COURSES, SEED_MODULES);
export const SEED_NOTIFICATIONS = generateNotifications(STUDENTS);

// 9. Generate user-specific study analytics matrices
export const SEED_ANALYTICS = generateAnalytics(STUDENTS, SEED_ENROLLMENTS);

// 10. Social feeds and logs
export const SEED_LEADERBOARD = generateLeaderboard(STUDENTS);
export const SEED_ACTIVITY_FEED = generateActivityFeed(STUDENTS, SEED_COURSES);
export const SEED_PLATFORM_LOGS = generatePlatformLogs(STUDENTS);
export const SEED_REVIEWS = generateReviews(SEED_COURSES);

export const SEED_ANNOUNCEMENTS = ANNOUNCEMENTS_POOL.map((ann, idx) => ({
  id: `ann_${idx}`,
  title: ann.title,
  message: ann.message,
  type: ann.type,
  targetRole: 'all' as const,
  authorName: ann.authorName,
  authorId: 'u3',
  createdAt: new Date(Date.now() - ann.daysAgo * 86400000).toISOString()
}));
