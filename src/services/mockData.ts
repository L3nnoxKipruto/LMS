import { Course, Module, Lesson } from '../types';

// ─── Generators & Seed Data ─────────────────────────────────────────────

const categories = [
  'Programming', 'Cybersecurity', 'AI & Machine Learning', 
  'Business', 'Design', 'Marketing', 'Mobile Development', 'Data Science'
];

const instructors = [
  'Dr. Sarah Mitchell', 'freeCodeCamp.org', 'Prof. David Chen', 
  'Elena Rodriguez', 'James Carter', 'Dr. Alan Turing', 'Design Systems Academy'
];

const videoLinks = [
  'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python
  'https://www.youtube.com/watch?v=bMknfKXIFA8', // React
  'https://www.youtube.com/watch?v=F5mRW0jo-U4', // Django
  'https://www.youtube.com/watch?v=jS4aFq5-91M', // JS
  'https://www.youtube.com/watch?v=mU6anWqZJcc', // HTML/CSS
  'https://www.youtube.com/watch?v=vLnPwxZdW4Y', // C++
];

const titles = [
  'Advanced React Patterns & State Management',
  'Python Automation Scripting Masterclass',
  'Ethical Hacking & Network Security Essentials',
  'Deep Learning with PyTorch',
  'Product Management 101: From Idea to Launch',
  'UI/UX Foundations for Modern Apps',
  'Digital Marketing Analytics & SEO',
  'Flutter Development for iOS & Android',
  'Data Analysis with Pandas and NumPy',
  'Full-Stack Web Development Bootcamp',
  'Practical Machine Learning Algorithms',
  'Agile Methodologies for Software Teams',
  'Figma Prototyping Masterclass',
  'Social Media Growth Strategies',
  'iOS Development with Swift 5',
  'Big Data Architecture & Cloud Computing',
  'Penetration Testing Fundamentals',
  'Go for Enterprise Web Development',
  'Data Visualization in R and Tableau',
  'Leadership Strategies in Tech',
  'Cybersecurity Incident Response',
  'React Native App Development',
  'C++ Systems Programming',
  'Docker & Kubernetes for DevOps'
];

const descriptions = [
  "Master the fundamentals and advanced topics in this comprehensive bootcamp. No prior experience required, just a willingness to learn and build real-world projects.",
  "Elevate your career with this hands-on course. You will build multiple applications from scratch and learn best practices used by top industry professionals.",
  "Learn how to design, develop, and deploy scalable solutions. This course covers everything from basic syntax to advanced architecture patterns.",
  "Dive deep into the core concepts and emerge as an expert. This module focuses heavily on practical exercises and real-world case studies.",
  "An intensive guide for ambitious professionals looking to upskill quickly. Get access to premium resources, blueprints, and cheat sheets."
];

const lessonTopics = [
  "Introduction & Setup", "Core Syntax & Concepts", "Variables & Data Types",
  "Control Flow & Logic", "Functions & Modules", "Object-Oriented Design",
  "Working with Databases", "Authentication & Security", "Advanced Patterns",
  "State Management", "API Integration", "Deployment & Hosting",
  "Performance Optimization", "Testing & Debugging", "Final Project Review"
];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ─── Data Generation ───────────────────────────────────────────────────

const generatedCourses: any[] = [];
const generatedModules: Record<string, any[]> = {};
const generatedLessons: Record<string, any> = {};

let lessonIdCounter = 1000;

for (let i = 0; i < 24; i++) {
  const courseId = i + 1;
  const title = titles[i];
  const cat = randomChoice(categories);
  const instructor = randomChoice(instructors);
  
  const numModules = randomInt(2, 5);
  let totalLessons = 0;
  
  const courseModules = [];
  
  for (let m = 0; m < numModules; m++) {
    const moduleId = courseId * 100 + m + 1;
    const numLessons = randomInt(3, 6);
    totalLessons += numLessons;
    
    const lessonsInModule = [];
    
    for (let l = 0; l < numLessons; l++) {
      const lId = ++lessonIdCounter;
      const lessonTitle = lessonTopics[(m * 3 + l) % lessonTopics.length] + ` - Part ${l + 1}`;
      const dur = randomInt(10, 60);
      const video = randomChoice(videoLinks);
      
      const completed = Math.random() > 0.6;
      
      const lessonObj = {
        id: lId,
        title: lessonTitle,
        duration_minutes: dur,
        lesson_type: "video",
        progress: { completed, watch_time_seconds: completed ? dur * 60 : randomInt(0, dur * 30) }
      };
      lessonsInModule.push(lessonObj);
      
      generatedLessons[String(lId)] = {
        ...lessonObj,
        module: moduleId,
        video_file: video,
        content: `In this comprehensive lesson on ${lessonTitle}, we will explore the fundamental concepts necessary for mastery. Please ensure you take notes and review the attached PDF cheat sheets.`,
        resources: Math.random() > 0.5 ? [{ id: randomInt(1, 1000), title: `${title} Cheat Sheet`, file: "#" }] : []
      };
    }
    
    courseModules.push({
      id: moduleId,
      title: `Module ${m + 1}: ${randomChoice(lessonTopics)}`,
      order: m + 1,
      lessons: lessonsInModule
    });
  }
  
  generatedModules[String(courseId)] = courseModules;
  
  // Use unique thumbnails for visual variety based on id
  const thumbBaseUrl = `https://picsum.photos/seed/${courseId * 42}/600/400`;
  
  generatedCourses.push({
    id: courseId,
    title,
    description: randomChoice(descriptions),
    category: cat,
    instructor_name: instructor,
    thumbnail: thumbBaseUrl,
    enrollment_count: randomInt(100, 25000),
    rating: (Math.random() * (5.0 - 4.2) + 4.2).toFixed(1),
    duration: `${randomInt(4, 40)} Hours`,
    lessons_count: totalLessons,
    modules_count: numModules,
    is_offline_available: true,
    download_size: `${randomInt(100, 900)} MB`,
    progress_percent: randomChoice([0, 0, 10, 25, 50, 75, 100]),
  });
}

const certificates = [
  {
    id: 1,
    course: 1,
    course_title: generatedCourses[0].title,
    issue_date: new Date().toISOString(),
    certificate_id: "JH-A8F3B9C2",
    file: "#"
  },
  {
    id: 2,
    course: 2,
    course_title: generatedCourses[1].title,
    issue_date: new Date(Date.now() - 86400000 * 5).toISOString(),
    certificate_id: "JH-B9C2D1E4",
    file: "#"
  }
];

export const MOCK_DATA = {
  profile: {
    id: 1,
    username: "dennis_kiprop",
    email: "dennis.kiprop@student.ac.ke",
    first_name: "Dennis",
    last_name: "Kiprop",
    role: "student",
    avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=dennis.kiprop@student.ac.ke",
    institution: "Nairobi Institute of Technology",
    program: "Computer Science",
  },
  courses: generatedCourses,
  modules: generatedModules,
  lessons: generatedLessons,
  studentAnalytics: {
    metrics: {
      total_lessons_completed: 45,
      total_time_spent_minutes: 1850,
      avg_score: 92,
      courses_completed: 2,
      current_streak: 14
    },
    recent_activity: [
      { id: 1, activity_type: "completed_lesson", created_at: new Date().toISOString(), metadata: { lesson_title: "State Management - Part 2" } },
      { id: 2, activity_type: "earned_certificate", created_at: new Date(Date.now() - 86400000).toISOString(), metadata: { course_title: generatedCourses[0].title } },
      { id: 3, activity_type: "started_course", created_at: new Date(Date.now() - 86400000 * 2).toISOString(), metadata: { course_title: generatedCourses[5].title } }
    ],
    daily_stats: [
      { date: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0], lessons_completed: 2, time_spent_minutes: 60, assignments_submitted: 0 },
      { date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0], lessons_completed: 4, time_spent_minutes: 120, assignments_submitted: 1 },
      { date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0], lessons_completed: 1, time_spent_minutes: 30, assignments_submitted: 0 },
      { date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], lessons_completed: 3, time_spent_minutes: 90, assignments_submitted: 0 },
      { date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], lessons_completed: 2, time_spent_minutes: 65, assignments_submitted: 1 },
      { date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], lessons_completed: 0, time_spent_minutes: 0, assignments_submitted: 0 },
      { date: new Date().toISOString().split('T')[0], lessons_completed: 5, time_spent_minutes: 140, assignments_submitted: 1 }
    ]
  },
  dailyStats: [
    { date: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0], lessons_completed: 2, time_spent_minutes: 60, assignments_submitted: 0 },
    { date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0], lessons_completed: 4, time_spent_minutes: 120, assignments_submitted: 1 },
    { date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0], lessons_completed: 1, time_spent_minutes: 30, assignments_submitted: 0 },
    { date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], lessons_completed: 3, time_spent_minutes: 90, assignments_submitted: 0 },
    { date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], lessons_completed: 2, time_spent_minutes: 65, assignments_submitted: 1 },
    { date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], lessons_completed: 0, time_spent_minutes: 0, assignments_submitted: 0 },
    { date: new Date().toISOString().split('T')[0], lessons_completed: 5, time_spent_minutes: 140, assignments_submitted: 1 }
  ],
  certificates: certificates,
  adminStats: {
    total_users: 15420,
    active_users: 4890,
    total_enrollments: 34500,
    total_revenue: 0, // Free LMS
    growth_data: [
      { name: "Jan", users: 12000 },
      { name: "Feb", users: 13500 },
      { name: "Mar", users: 14100 },
      { name: "Apr", users: 14800 },
      { name: "May", users: 15420 }
    ]
  },
  lecturerStats: {
    total_students: 3450,
    active_courses: 5,
    average_rating: 4.8,
    engagement_data: [
      { name: "Week 1", views: 4000 },
      { name: "Week 2", views: 4500 },
      { name: "Week 3", views: 3200 },
      { name: "Week 4", views: 5600 }
    ]
  }
};

export const getMockResponse = (config: any) => {
  const url = config.url || '';
  
  if (url.includes('/auth/profile/')) return MOCK_DATA.profile;
  if (url.includes('/courses/published/')) return MOCK_DATA.courses;
  if (url.includes('/courses/my/')) return MOCK_DATA.courses.filter(c => c.progress_percent > 0);
  if (url.match(/\/courses\/\d+\/$/)) {
    const id = url.split('/').filter(Boolean).pop();
    return MOCK_DATA.courses.find(c => String(c.id) === id) || MOCK_DATA.courses[0];
  }
  if (url.match(/\/courses\/\d+\/modules\//)) {
    const id = url.split('/')[2];
    return MOCK_DATA.modules[id] || [];
  }
  if (url.match(/\/courses\/lessons\/\d+\/quiz/)) {
    return {
      id: randomInt(1, 1000),
      title: "Module Knowledge Check",
      description: "Test your understanding of the core concepts presented in this module.",
      pass_score: 70,
      time_limit_minutes: 15,
      max_attempts: 3,
      question_count: 3,
      user_attempts: randomInt(0, 2),
      best_score: randomChoice([null, 40, 60, 80, 100]),
      questions: [
        {
          id: randomInt(100, 200),
          text: "Which of the following is considered a best practice in this context?",
          order: 1,
          points: 10,
          choices: [
            { id: 1, text: "Using hardcoded global variables", order: 1 },
            { id: 2, text: "Following architectural design patterns", order: 2 },
            { id: 3, text: "Ignoring error handling completely", order: 3 },
            { id: 4, text: "Writing tightly coupled modules", order: 4 }
          ]
        },
        {
          id: randomInt(201, 300),
          text: "What is the primary benefit of the tool discussed in the video?",
          order: 2,
          points: 10,
          choices: [
            { id: 5, text: "It decreases productivity", order: 1 },
            { id: 6, text: "It automates repetitive workflows", order: 2 },
            { id: 7, text: "It creates infinite loops", order: 3 },
            { id: 8, text: "It increases server costs", order: 4 }
          ]
        },
        {
          id: randomInt(301, 400),
          text: "How do you properly initialize the core framework?",
          order: 3,
          points: 10,
          choices: [
            { id: 9, text: "Through the designated setup CLI", order: 1 },
            { id: 10, text: "By editing system registry files", order: 2 }
          ]
        }
      ]
    };
  }
  
  if (url.match(/\/courses\/quizzes\/\d+\/start\//)) {
    return { attempt_id: randomInt(10000, 99999) };
  }
  
  if (url.match(/\/courses\/quizzes\/attempts\/\d+\/submit\//)) {
    const passed = Math.random() > 0.3;
    const score = passed ? randomInt(70, 100) : randomInt(20, 60);
    return {
      id: randomInt(1, 1000),
      score,
      points_earned: Math.floor(score / 10),
      points_total: 10,
      status: passed ? 'passed' : 'failed',
      started_at: new Date(Date.now() - 600000).toISOString(),
      completed_at: new Date().toISOString(),
      passed,
      pass_score: 70,
      answers: []
    };
  }

  if (url.match(/\/courses\/lessons\/\d+\/notes/)) {
    return [
      { id: randomInt(1, 500), content: "Key formula: E = mc^2. Need to review chapter 4 before the exam.", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: randomInt(501, 1000), content: "The instructor mentioned that state management is crucial for large applications. Check out Redux or Context API.", created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date(Date.now() - 86400000).toISOString() }
    ];
  }
  if (url.match(/\/courses\/lessons\/\d+\//)) {
    const id = url.split('/').filter(Boolean).pop() || '';
    return MOCK_DATA.lessons[id] || MOCK_DATA.lessons[Object.keys(MOCK_DATA.lessons)[0]];
  }
  if (url.includes('/analytics/student/')) return MOCK_DATA.studentAnalytics;
  if (url.includes('/analytics/daily/')) return MOCK_DATA.dailyStats;
  if (url.includes('/analytics/admin/')) return MOCK_DATA.adminStats;
  if (url.includes('/analytics/lecturer/')) return MOCK_DATA.lecturerStats;
  if (url.includes('/courses/certificates/')) return MOCK_DATA.certificates;
  if (url.includes('/auth/login/')) return {
    access: "mock-access-token",
    refresh: "mock-refresh-token",
    user: MOCK_DATA.profile
  };
  
  // Default empty/success responses
  if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
    return { success: true, message: "Mock operation successful" };
  }
  
  return [];
};
