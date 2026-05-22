import { User, Course, Module, Lesson, Assignment, Department, Device, Certificate, Quiz, Achievement, LeaderboardEntry, ActivityFeedItem, Announcement, PlatformLog, Bookmark, StudyStreak, CourseReview } from '../types';
import { getTopicsForCategory, getVideoForCategory, generateLessonNotes, generateLessonResources, generateQuizQuestions } from './course-content';
import { REVIEWS_POOL, ANNOUNCEMENTS_POOL, ACHIEVEMENTS_POOL } from './social-data';

const INSTRUCTORS = [
  { name: 'Dr. Sarah Mitchell', expertise: 'Solar Design & Grid Engineering', dept: 'EE', bio: 'Former advisor at Renewable Energy Agency with 15+ years of off-grid project deployments.', avatar: 'sarah' },
  { name: 'Prof. David Chen', expertise: 'Internal Combustion & EV Powertrains', dept: 'ME', bio: 'Automotive researcher specializing in engine conversions and hybrid power management.', avatar: 'david' },
  { name: 'Elena Rodriguez', expertise: 'Modern Javascript & Cloud Architectures', dept: 'ICT', bio: 'Full-stack developer advocate, open-source contributor, and technical program director.', avatar: 'elena' },
  { name: 'Dr. Alan Turing', expertise: 'Ethical Hacking & Network Routing', dept: 'ICT', bio: 'Security consultant specializing in penetration testing, threat detection, and packet routing.', avatar: 'alan' },
  { name: 'James Carter', expertise: 'Agricultural Farm Robotics', dept: 'ME', bio: 'Mechatronics engineer focused on automation of harvesting and precision agriculture machinery.', avatar: 'james' },
  { name: 'Wanjiku Mwangi', expertise: 'Entrepreneurship & TVET Business Development', dept: 'BUS', bio: 'Business strategist helping youth establish sustainable tech and technical enterprises.', avatar: 'wanjiku' },
  { name: 'Dennis Kipkemboi', expertise: 'Advanced Welding & Structural Integrity', dept: 'ME', bio: 'Certified master welder and structural inspector for large infrastructure projects.', avatar: 'kipkemboi' },
  { name: 'Lucy Wangare', expertise: 'Hydraulic Systems & Commercial Plumbing', dept: 'EE', bio: 'Hydraulics consultant designing commercial water systems and solar thermal assemblies.', avatar: 'lucy' },
  { name: 'Amina Yusuf', expertise: 'CCTV Protocols & Smart IoT Systems', dept: 'ICT', bio: 'Embedded systems engineer developing IoT automation and surveillance solutions.', avatar: 'amina' },
  { name: 'Peter Kamau', expertise: 'Microgrid Battery Balancing Systems', dept: 'EE', bio: 'Power systems engineer specializing in off-grid solar storage and battery chemistry.', avatar: 'peter' }
];

const FIRST_NAMES = ['Dennis', 'Naserian', 'Albert', 'Faith', 'John', 'Grace', 'Brian', 'Mercy', 'Kevin', 'Joy', 'Samuel', 'Esther', 'David', 'Alice', 'Emmanuel', 'Pauline', 'George', 'Sarah', 'Timothy', 'Phyllis', 'Joseph', 'Mary', 'Moses', 'Ann', 'Daniel', 'Jane', 'Peter', 'Hellen', 'James', 'Ruth', 'Francis', 'Catherine', 'Charles', 'Margaret', 'Michael', 'Florence', 'Stephen', 'Rose', 'Robert', 'Agnes'];
const LAST_NAMES = ['Kiprop', 'Wanjiku', 'Mutua', 'Chepngetich', 'Mwangi', 'Otieno', 'Kipkemboi', 'Wambui', 'Onyango', 'Cherotich', 'Kiprotich', 'Atieno', 'Kipkorir', 'Ngina', 'Omondi', 'Wambua', 'Langat', 'Nyambura', 'Kamau', 'Njoroge', 'Kariuki', 'Karanja', 'Maina', 'Githinji', 'Kipruto', 'Chebet', 'Jepchirchir', 'Kiplagat', 'Ochieng', 'Odhiambo', 'Achieng', 'Anyango', 'Okoth', 'Wekesa', 'Simiyu', 'Wafula', 'Nakhumicha', 'Nafula', 'Barasa', 'Kundu'];

// Generate 200+ unique student profiles
export const generateStudents = (): (User & { password?: string })[] => {
  const students: (User & { password?: string })[] = [
    {
      id: 'u1',
      name: 'Dennis Kiprop',
      email: 'dennis.kiprop@student.ac.ke',
      password: 'jifunzehub123',
      role: 'student',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=dennis.kiprop@student.ac.ke',
      institution: 'Naserian TVET Institute',
      department: 'ICT & Software Dev',
      xp: 2450,
      streak: 12,
      totalHours: 42,
      badges: ['Quick Learner', 'Streak Master', 'First Certificate'],
      bio: 'Enthusiastic ICT student specializing in full-stack web development and network defense.'
    }
  ];

  let studentIdCounter = 2;
  for (let i = 0; i < 200; i++) {
    const fName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lName = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    const fullName = `${fName} ${lName}`;
    const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@student.ac.ke`;
    const depts = ['Electrical & Solar Systems', 'Mechanical & Automotive', 'ICT & Software Dev', 'Business & Entrepreneurship'];
    const dept = depts[i % depts.length];

    students.push({
      id: `u_std_${studentIdCounter++}`,
      name: fullName,
      email,
      password: 'jifunzehub123',
      role: 'student',
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${fullName}`,
      institution: 'Naserian TVET Institute',
      department: dept,
      xp: 100 + (i * 37) % 5000,
      streak: (i * 2) % 15,
      totalHours: 5 + (i * 3) % 100,
      badges: i % 5 === 0 ? ['Consistent Learner'] : i % 8 === 0 ? ['Quiz Champion'] : [],
      bio: `Student at Naserian TVET Institute studying ${dept}.`
    });
  }

  return students;
};

export const generateLecturers = (): (User & { password?: string })[] => {
  return INSTRUCTORS.map((inst, idx) => ({
    id: `u_lec_${idx + 1}`,
    name: inst.name,
    email: `${inst.name.toLowerCase().replace('dr. ', '').replace('prof. ', '').replace(' ', '_')}@lecturer.ac.ke`,
    password: 'jifunzehub123',
    role: 'lecturer',
    avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${inst.avatar}`,
    institution: 'Naserian TVET Institute',
    department: inst.expertise,
    bio: inst.bio,
    socialLinks: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      twitter: 'https://twitter.com'
    }
  }));
};

const COURSE_TEMPLATES = [
  // Technology
  { category: 'Web Development', title: 'React 19 & Next.js 15 Deep Dive', subtitle: 'Master SSR, Server Components, and complex state architectures.', level: 'Advanced' as const },
  { category: 'Web Development', title: 'Modern CSS Layouts: Grid & Flexbox Masterclass', subtitle: 'Craft responsive, robust fluid interfaces without frameworks.', level: 'Beginner' as const },
  { category: 'React Development', title: 'State Management & Custom Hooks', subtitle: 'Scale React applications with Redux Toolkit, Zustand, and Context API.', level: 'Intermediate' as const },
  { category: 'TypeScript', title: 'TypeScript for Enterprise Applications', subtitle: 'Develop robust, type-safe web applications with advanced TypeScript features.', level: 'Intermediate' as const },
  { category: 'Node.js', title: 'Node.js Backend & API Development', subtitle: 'Build scalable RESTful and GraphQL APIs using Express and NestJS.', level: 'Intermediate' as const },
  { category: 'Python', title: 'Python Programming Essentials', subtitle: 'The foundation course for automation, web development, and data analysis.', level: 'Beginner' as const },
  { category: 'Cybersecurity', title: 'Certified Ethical Hacker (CEH) Lab Practice', subtitle: 'Understand network security, penetration testing, and ethical hacking protocols.', level: 'Advanced' as const },
  { category: 'Cybersecurity', title: 'Network Defense & Intrusion Detection Systems', subtitle: 'Secure local infrastructure networks against common attack vectors.', level: 'Intermediate' as const },
  { category: 'Cloud Computing', title: 'AWS Cloud Practitioner & Architecture Fundamentals', subtitle: 'S3, EC2, RDS, IAM, and Serverless deployment architectures.', level: 'Beginner' as const },
  { category: 'Cloud Computing', title: 'Docker Containers & Kubernetes Mesh Control', subtitle: 'Containerize and orchestrate high-availability microservices.', level: 'Advanced' as const },
  { category: 'AI & Machine Learning', title: 'Applied Machine Learning with Scikit-Learn & Python', subtitle: 'Build models for regression, classification, and clustering.', level: 'Intermediate' as const },
  { category: 'AI & Machine Learning', title: 'Neural Networks & Deep Learning with PyTorch', subtitle: 'Train deep convolutional and recurrent networks.', level: 'Advanced' as const },
  { category: 'Data Science', title: 'Data Analysis & Wrangling with Pandas & SQL', subtitle: 'Clean, parse, and analyze massive datasets with precision.', level: 'Intermediate' as const },
  { category: 'UI/UX Design', title: 'Figma Prototyping & Design Systems Frameworks', subtitle: 'Develop component libraries, auto-layouts, and interactive prototypes.', level: 'Beginner' as const },

  // Engineering
  { category: 'Electrical Engineering', title: 'Microgrid Power System Configurations', subtitle: 'Design and balance microgrid networks with hybrid source integration.', level: 'Advanced' as const },
  { category: 'Electrical Engineering', title: 'Industrial Programmable Logic Controllers (PLC)', subtitle: 'Program industrial automation machines using ladder logic.', level: 'Intermediate' as const },
  { category: 'Electrical Engineering', title: 'AC/DC Electric Motor Overhaul Protocols', subtitle: 'Step-by-step rewinding, balancing, and diagnosing electrical motors.', level: 'Intermediate' as const },
  { category: 'Automotive Engineering', title: 'Hybrid & EV Powertrain Diagnostic Systems', subtitle: 'Safely diagnose high-voltage battery banks, converters, and ECUs.', level: 'Advanced' as const },
  { category: 'Automotive Engineering', title: 'Diesel Engine Calibration & Injector Diagnostics', subtitle: 'Calibrate common-rail injection pumps and analyze combustion efficiency.', level: 'Intermediate' as const },
  { category: 'Automotive Engineering', title: 'Automotive Electrical Systems & ECU Remapping', subtitle: 'Troubleshoot automotive wiring harnesses and remap control units.', level: 'Intermediate' as const },
  { category: 'Mechanical Engineering', title: 'CNC Machine Setup & G-Code Programming', subtitle: 'Operate CNC mills and write custom toolpaths manually.', level: 'Intermediate' as const },
  { category: 'Mechanical Engineering', title: 'Hydraulic Systems, Valves & Pump Maintenance', subtitle: 'Maintain commercial pump gear, cylinders, and relief valves.', level: 'Intermediate' as const },
  { category: 'Civil Engineering', title: 'Concrete Strength Analysis & Structural Testing', subtitle: 'Conduct slump, compression, and concrete quality tests.', level: 'Beginner' as const },

  // Business
  { category: 'Entrepreneurship', title: 'Startup Launchpad: Business Plans for TVET Grads', subtitle: 'Establish your own technical workshop, hire teams, and register with KRA.', level: 'Beginner' as const },
  { category: 'Digital Marketing', title: 'SEO Strategies & Conversion Rate Optimization', subtitle: 'Rank local businesses on Google Maps and drive organic search traffic.', level: 'Beginner' as const },
  { category: 'Accounting', title: 'TVET Cooperative Bookkeeping & Auditing', subtitle: 'Double-entry books, balance sheets, and audit trails for cooperatives.', level: 'Beginner' as const },
  { category: 'Finance', title: 'Microfinance & Agribusiness Capital Planning', subtitle: 'Analyze crop yields, solar pump ROI, and secure micro-loans.', level: 'Beginner' as const },
  { category: 'Project Management', title: 'Agile Frameworks & Scrum Team Orchestration', subtitle: 'Coordinate software and hardware construction projects with Scrum.', level: 'Intermediate' as const },

  // TVET / Technical
  { category: 'Welding', title: 'Shielded Metal Arc Welding (SMAW) Safety & Tech', subtitle: 'Master stick welding positions 1G through 4G on carbon steel.', level: 'Beginner' as const },
  { category: 'Welding', title: 'Tungsten Inert Gas (TIG) Precision Weld Techniques', subtitle: 'Weld thin stainless steel and aluminum tubes with precision.', level: 'Advanced' as const },
  { category: 'Plumbing', title: 'Commercial Waste & Greywater Drainage Installation', subtitle: 'Install DWV lines, vents, and grease traps to national building codes.', level: 'Intermediate' as const },
  { category: 'Plumbing', title: 'Solar Hot Water System Plumbing Assemblies', subtitle: 'Assemble thermosyphon and forced-circulation collector arrays.', level: 'Beginner' as const },
  { category: 'Solar Installation', title: 'Off-Grid Solar PV Panels: Sizing & Wiring Layouts', subtitle: 'Calculate battery capacity, sizing panels, and wire charge controllers.', level: 'Beginner' as const },
  { category: 'Solar Installation', title: 'Lithium Battery Bank Configurations & Management', subtitle: 'Configure BMS systems, active cell balancers, and safety disconnects.', level: 'Intermediate' as const },
  { category: 'Networking', title: 'Structured LAN Cabling & Router Configuration', subtitle: 'Punch down patch panels, crimp RJ45, and configure Cisco routers.', level: 'Beginner' as const },
  { category: 'Networking', title: 'Fiber Optic Cable Splicing & Signal Testing', subtitle: 'Perform fusion splices and test attenuation using OTDR devices.', level: 'Advanced' as const },
  { category: 'CCTV Installation', title: 'IP CCTV Security Camera System Alignments', subtitle: 'Deploy IP cameras, calculate bandwidth, and focus varifocal lenses.', level: 'Beginner' as const },
  { category: 'CCTV Installation', title: 'NVR & DVR Networking & Remote Stream Controls', subtitle: 'Configure port forwarding, DDNS, and remote stream compression rates.', level: 'Intermediate' as const }
];

export const generateCourses = (lecturers: User[]): Course[] => {
  const courses: Course[] = [];
  
  // Make 55 courses (duplicating templates if necessary with suffix)
  for (let i = 0; i < 55; i++) {
    const template = COURSE_TEMPLATES[i % COURSE_TEMPLATES.length];
    const lecturer = lecturers[i % lecturers.length];
    const courseId = String(i + 1);

    const suffix = i >= COURSE_TEMPLATES.length ? ` (Phase ${Math.floor(i / COURSE_TEMPLATES.length) + 1})` : '';
    const title = `${template.title}${suffix}`;
    const enrCount = 34 + (i * 13) % 850;
    const rating = parseFloat((4.3 + (i % 7) * 0.1).toFixed(1));
    const reviewsCount = 5 + (i * 7) % 120;
    
    courses.push({
      id: courseId,
      title,
      subtitle: template.subtitle,
      description: `Become certified in ${template.category} through this complete professional track. This enterprise course covers ${title} with modular lectures, video tutorials from Traversy, CS50, and freeCodeCamp, printable worksheets, and official certification matching industry standards.`,
      category: template.category,
      lecturerName: lecturer.name,
      lecturerId: lecturer.id,
      thumbnailUrl: `https://images.unsplash.com/photo-${1500000000000 + (i * 1234567)}?w=600&auto=format&fit=crop&q=80`,
      bannerUrl: `https://images.unsplash.com/photo-${1500000000000 + (i * 1234567)}?w=1200&auto=format&fit=crop&q=80`,
      enrolledStudentsCount: enrCount,
      rating,
      reviewsCount,
      duration: `${6 + (i % 5) * 4} Weeks`,
      lessonsCount: 8 + (i % 8) * 2,
      modulesCount: 3 + (i % 4),
      isOfflineAvailable: i % 5 !== 0,
      downloadSize: `${120 + (i % 4) * 80} MB`,
      skillLevel: template.level,
      tags: [template.category, 'TVET', 'Practical', 'Certification'],
      skillsGained: [`Core ${template.category}`, 'Practical Troubleshooting', 'System Diagnostics', 'Compliance Standards'],
      language: 'English',
      hasCertificate: true,
      completionRate: 65 + (i * 3) % 30,
      lastUpdated: new Date(Date.now() - (i % 30) * 86400000).toISOString().split('T')[0]
    });
  }
  return courses;
};

export const generateModulesAndLessons = (courses: Course[]): { modules: Record<string, Module[]>; quizzes: Record<string, Quiz> } => {
  const allModules: Record<string, Module[]> = {};
  const allQuizzes: Record<string, Quiz> = {};

  courses.forEach((course) => {
    const modules: Module[] = [];
    const topics = getTopicsForCategory(course.category);
    
    for (let m = 1; m <= course.modulesCount; m++) {
      const moduleId = `m_${course.id}_${m}`;
      const lessons: Lesson[] = [];
      const lessonsPerMod = Math.ceil(course.lessonsCount / course.modulesCount);

      for (let l = 1; l <= lessonsPerMod; l++) {
        const lessonId = `l_${course.id}_${m}_${l}`;
        const topicIndex = ((m - 1) * lessonsPerMod + (l - 1)) % topics.length;
        const lessonTitle = topics[topicIndex] || `Advanced ${course.category} Practice ${m}.${l}`;
        const lessonType = l === lessonsPerMod ? 'quiz' : l % 3 === 0 ? 'pdf' : l % 3 === 1 ? 'video' : 'document';
        
        const videoUrl = lessonType === 'video' ? getVideoForCategory(course.category, m * 7 + l) : undefined;
        const notes = generateLessonNotes(lessonTitle, course.category, course.title);
        const resources = generateLessonResources(course.category, lessonTitle);

        const lesson: Lesson = {
          id: lessonId,
          moduleId,
          title: lessonTitle,
          duration: `${10 + (l * 4) % 30} mins`,
          type: lessonType,
          videoUrl,
          pdfUrl: lessonType === 'pdf' ? '/resources/sample.pdf' : undefined,
          notes,
          resources,
          exercises: [`Lab Practice Sheet #${course.id}-${m}-${l}`, `Case study read for ${lessonTitle}`],
          isCompleted: false,
          isDownloaded: true,
          downloadSize: `${5 + (l * 3) % 15} MB`
        };

        lessons.push(lesson);

        if (lessonType === 'quiz') {
          const qQuestions = generateQuizQuestions(lessonTitle, course.category).map((q, qIdx) => ({
            id: `q_q_${lessonId}_${qIdx}`,
            quizId: `q_${lessonId}`,
            text: q.text,
            options: q.options,
            correctOptionIndex: q.correctOptionIndex,
            explanation: q.explanation
          }));

          allQuizzes[lessonId] = {
            id: `q_${lessonId}`,
            courseId: course.id,
            courseTitle: course.title,
            title: `Quiz: ${lessonTitle}`,
            description: `Verify your technical competencies on ${lessonTitle}. Passing threshold is 70%.`,
            questionsCount: qQuestions.length,
            durationMinutes: 15,
            passingScore: 70,
            status: 'available',
            maxAttempts: 3,
            attemptsLeft: 3,
            questions: qQuestions
          };
        }
      }

      modules.push({
        id: moduleId,
        courseId: course.id,
        title: `Module ${m}: ${topics[m - 1] || 'Foundational Principles'}`,
        order: m,
        lessons
      });
    }

    allModules[course.id] = modules;
  });

  return { modules: allModules, quizzes: allQuizzes };
};

export const generateAssignments = (courses: Course[]): Assignment[] => {
  const assignments: Assignment[] = [];
  courses.forEach((course, idx) => {
    assignments.push({
      id: `a_${course.id}`,
      courseId: course.id,
      courseTitle: course.title,
      title: `Assignment: Practical ${course.category} Project`,
      description: `Prepare a full layout/configuration design for ${course.title}. Upload your circuit schematic, code repository link, or calculation sheet. Must conform to KRA/TVET standards.`,
      dueDate: new Date(Date.now() + (idx % 10 + 3) * 86400000).toISOString().split('T')[0],
      status: idx % 4 === 0 ? 'submitted' : idx % 4 === 1 ? 'graded' : 'pending',
      grade: idx % 4 === 1 ? 'A' : undefined,
      feedback: idx % 4 === 1 ? 'Superb submission! Clean design and detailed metrics sheet.' : undefined,
      points: 100
    });
  });
  return assignments;
};

export const generateEnrollments = (students: User[], courses: Course[], modules: Record<string, Module[]>): any[] => {
  const enrollments: any[] = [];
  
  // Enrolled courses for Dennis (u1)
  const dennisEnrolledIds = ['1', '2', '3', '4', '5', '8', '12', '15'];
  dennisEnrolledIds.forEach((courseId) => {
    const courseModules = modules[courseId] || [];
    const courseLessons = courseModules.flatMap(m => m.lessons);
    
    // Complete half the lessons for active feel
    const completedCount = Math.floor(courseLessons.length / 2);
    const completedLessons = courseLessons.slice(0, completedCount).map(l => l.id);
    const progress = Math.round((completedLessons.length / courseLessons.length) * 100);

    enrollments.push({
      id: `e_u1_${courseId}`,
      studentId: 'u1',
      courseId,
      progress,
      completedLessons
    });
  });

  // Enroll other students
  students.slice(1).forEach((student, sIdx) => {
    // 2-4 courses per student
    const count = 2 + (sIdx % 3);
    for (let c = 0; c < count; c++) {
      const courseId = String(1 + (sIdx * 3 + c) % courses.length);
      const courseModules = modules[courseId] || [];
      const courseLessons = courseModules.flatMap(m => m.lessons);
      
      const compCount = sIdx % 4 === 0 ? courseLessons.length : sIdx % 3 === 0 ? Math.floor(courseLessons.length / 3) : 0;
      const completedLessons = courseLessons.slice(0, compCount).map(l => l.id);
      const progress = courseLessons.length > 0 ? Math.round((completedLessons.length / courseLessons.length) * 100) : 0;

      enrollments.push({
        id: `e_${student.id}_${courseId}`,
        studentId: student.id,
        courseId,
        progress,
        completedLessons
      });
    }
  });

  return enrollments;
};

export const generateNotifications = (students: User[]): any[] => {
  const notifications: any[] = [];
  students.forEach((student, idx) => {
    notifications.push({
      id: `n_welcome_${student.id}`,
      userId: student.id,
      title: 'Welcome to JifunzeHub Platform',
      message: `Welcome, ${student.name}! You are registered under the ${student.department || 'TVET'} Department. Explore your catalog.`,
      read: true,
      created_at: new Date(Date.now() - 7 * 86400000).toISOString()
    });

    notifications.push({
      id: `n_sync_${student.id}`,
      userId: student.id,
      title: 'Offline Sync System Engaged',
      message: 'You have local database storage active. Download modules for off-grid operations.',
      read: true,
      created_at: new Date(Date.now() - 5 * 86400000).toISOString()
    });

    if (idx % 2 === 0) {
      notifications.push({
        id: `n_new_c_${student.id}`,
        userId: student.id,
        title: 'New Course Announcement',
        message: 'A brand-new course "Lithium Battery Bank Configurations" is now open for enrollment.',
        read: false,
        created_at: new Date(Date.now() - 1 * 86400000).toISOString()
      });
    }
  });
  return notifications;
};

export const generateAnalytics = (students: User[], enrollments: any[]): Record<string, any> => {
  const analytics: Record<string, any> = {};
  
  students.forEach((student) => {
    const studentEnrolls = enrollments.filter(e => e.studentId === student.id);
    const completedCount = studentEnrolls.filter(e => e.progress === 100).length;
    const lessonsCompletedCount = studentEnrolls.reduce((sum, e) => sum + e.completedLessons.length, 0);

    const dailyStats = [];
    for (let day = 6; day >= 0; day--) {
      const date = new Date(Date.now() - day * 86400000).toISOString().split('T')[0];
      const lessons = day === 0 ? (lessonsCompletedCount % 3) : (day % 3 === 0 ? 2 : 0);
      dailyStats.push({
        date,
        lessons_completed: lessons,
        time_spent_minutes: lessons * 25 + (day % 2 === 0 ? 15 : 0),
        assignments_submitted: day === 3 ? 1 : 0
      });
    }

    analytics[student.id] = {
      metrics: {
        total_lessons_completed: lessonsCompletedCount,
        total_time_spent_minutes: lessonsCompletedCount * 25 + 180,
        avg_score: 75 + (student.id === 'u1' ? 17 : (sIdx(student.id) % 20)),
        courses_completed: completedCount,
        current_streak: student.streak || 0
      },
      recent_activity: [
        {
          id: Date.now() - 86400000,
          activity_type: 'started_course',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          metadata: { course_title: 'Off-Grid Solar PV Panels' }
        }
      ],
      daily_stats: dailyStats
    };
  });

  return analytics;
};

function sIdx(id: string): number {
  const num = id.replace(/\D/g, '');
  return num ? parseInt(num) : 1;
}

// Generate platform activity feed items
export const generateActivityFeed = (students: User[], courses: Course[]): ActivityFeedItem[] => {
  const feed: ActivityFeedItem[] = [];
  const types = ['enrolled', 'completed_lesson', 'completed_course', 'earned_achievement', 'earned_certificate', 'submitted_assignment', 'posted_review'] as const;

  for (let i = 0; i < 60; i++) {
    const student = students[i % students.length];
    const course = courses[(i * 7) % courses.length];
    const type = types[i % types.length];
    
    let message = '';
    if (type === 'enrolled') message = `enrolled in the course ${course.title}`;
    else if (type === 'completed_lesson') message = `completed a practical lesson in ${course.category}`;
    else if (type === 'completed_course') message = `successfully graduated from ${course.title}!`;
    else if (type === 'earned_achievement') message = `unlocked the achievement: ${ACHIEVEMENTS_POOL[i % ACHIEVEMENTS_POOL.length].title}`;
    else if (type === 'earned_certificate') message = `obtained a certified TVETA grade in ${course.title}`;
    else if (type === 'submitted_assignment') message = `uploaded a solution for Practical ${course.category} Project`;
    else if (type === 'posted_review') message = `left a ${4 + (i % 2)} star review on ${course.title}`;

    feed.push({
      id: `feed_${i}_${Date.now()}`,
      userId: student.id,
      userName: student.name,
      userAvatar: student.avatarUrl,
      type,
      message,
      courseTitle: course.title,
      courseId: course.id,
      createdAt: new Date(Date.now() - (i % 15) * 2 * 3600000 - (i % 60) * 60000).toISOString()
    });
  }

  return feed;
};

// Generate leaderboard
export const generateLeaderboard = (students: User[]): LeaderboardEntry[] => {
  const sorted = [...students].sort((a, b) => (b.xp || 0) - (a.xp || 0));
  return sorted.slice(0, 30).map((std, idx) => ({
    rank: idx + 1,
    userId: std.id,
    studentName: std.name,
    avatarUrl: std.avatarUrl,
    xp: std.xp || 100,
    streak: std.streak || 0,
    coursesCompleted: Math.floor((std.xp || 100) / 1200),
    department: std.department
  }));
};

// Generate platform logs for admin
export const generatePlatformLogs = (students: User[]): PlatformLog[] => {
  const logs: PlatformLog[] = [];
  const levels = ['info', 'warning', 'error', 'success'] as const;
  const actions = ['USER_LOGIN', 'SYNC_COMPLETED', 'CERTIFICATE_ISSUED', 'QUIZ_SUBMITTED', 'DB_INITIALIZATION', 'DEVICE_OFFLINE'];

  for (let i = 0; i < 40; i++) {
    const student = students[i % students.length];
    const level = levels[i % levels.length];
    const action = actions[i % actions.length];
    
    logs.push({
      id: `log_${i}`,
      level,
      action,
      description: `System flag triggered for action ${action} by client session ID local_${i}`,
      userId: student.id,
      userName: student.name,
      timestamp: new Date(Date.now() - i * 15 * 60000).toISOString()
    });
  }

  return logs;
};

// Generate reviews
export const generateReviews = (courses: Course[]): CourseReview[] => {
  const reviews: CourseReview[] = [];
  courses.forEach((course) => {
    const reviewCount = 2 + (parseInt(course.id) % 4);
    for (let r = 0; r < reviewCount; r++) {
      const poolItem = REVIEWS_POOL[(parseInt(course.id) * 3 + r) % REVIEWS_POOL.length];
      reviews.push({
        id: `rev_${course.id}_${r}`,
        courseId: course.id,
        studentId: `u_std_${10 + r}`,
        studentName: poolItem.studentName,
        studentAvatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${poolItem.avatarSeed}`,
        rating: poolItem.rating,
        comment: poolItem.comment,
        createdAt: new Date(Date.now() - poolItem.daysAgo * 86400000).toISOString(),
        helpful: 1 + (r * 2) % 15
      });
    }
  });
  return reviews;
};
