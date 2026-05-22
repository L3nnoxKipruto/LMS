import { Assignment, Course, Lesson, LessonResource, Module, Quiz, ReviewSnippet } from '../types';
import { getVideoForCategory } from './course-content';

type CourseSeedSpec = {
  title: string;
  category: string;
  department: string;
  instructor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  youtubeUrl: string;
  moduleNames: string[];
  tags: string[];
  image: string;
};

const toEmbedUrl = (url: string) => {
  const match = url.match(/(?:watch\?v=|youtu\.be\/)([^&?/]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

const THUMBNAIL_LIBRARY = {
  programming: 'https://images.pexels.com/photos/5474296/pexels-photo-5474296.jpeg?cs=srgb&dl=pexels-cottonbro-5474296.jpg&fm=jpg',
  engineering: 'https://images.pexels.com/photos/29206488/pexels-photo-29206488.jpeg?cs=srgb&dl=pexels-sdvmovies-29206488.jpg&fm=jpg',
  business: 'https://images.pexels.com/photos/7693758/pexels-photo-7693758.jpeg?cs=srgb&dl=pexels-yankrukov-7693758.jpg&fm=jpg',
  hospitality: 'https://images.pexels.com/photos/7821341/pexels-photo-7821341.jpeg?cs=srgb&dl=pexels-mikhail-nilov-7821341.jpg&fm=jpg',
  agriculture: 'https://images.pexels.com/photos/31665672/pexels-photo-31665672.jpeg?cs=srgb&dl=pexels-nanamusic-31665672.jpg&fm=jpg',
  health: 'https://images.pexels.com/photos/6285362/pexels-photo-6285362.jpeg?cs=srgb&dl=pexels-gustavo-fring-6285362.jpg&fm=jpg',
  fashion: 'https://images.pexels.com/photos/7998340/pexels-photo-7998340.jpeg?cs=srgb&dl=pexels-cristian-rojas-7998340.jpg&fm=jpg',
  construction: 'https://images.pexels.com/photos/6285142/pexels-photo-6285142.jpeg?cs=srgb&dl=pexels-gustavo-fring-6285142.jpg&fm=jpg',
  media: 'https://images.pexels.com/photos/34168280/pexels-photo-34168280.jpeg?cs=srgb&dl=pexels-jakubzerdzicki-34168280.jpg&fm=jpg',
  surveillance: 'https://images.pexels.com/photos/13156207/pexels-photo-13156207.jpeg?cs=srgb&dl=pexels-towfiqu-barbhuiya-3440682-13156207.jpg&fm=jpg'
} as const;

const IMAGE_THEME_MAP: Record<string, keyof typeof THUMBNAIL_LIBRARY> = {
  react: 'programming',
  frontend: 'programming',
  typescript: 'programming',
  node: 'programming',
  python: 'programming',
  data: 'programming',
  cloud: 'programming',
  cyber: 'programming',
  ml: 'programming',
  mobile: 'programming',
  networking: 'surveillance',
  uiux: 'programming',
  electrical: 'engineering',
  solar: 'engineering',
  plc: 'engineering',
  motor: 'engineering',
  automotive: 'engineering',
  ev: 'engineering',
  cnc: 'engineering',
  hydraulic: 'engineering',
  materials: 'construction',
  boq: 'construction',
  startup: 'business',
  marketing: 'business',
  accounting: 'business',
  finance: 'business',
  agile: 'business',
  hotel: 'hospitality',
  culinary: 'hospitality',
  events: 'hospitality',
  agriculture: 'agriculture',
  greenhouse: 'agriculture',
  agribusiness: 'agriculture',
  health: 'health',
  nutrition: 'health',
  records: 'health',
  fashion: 'fashion',
  beauty: 'fashion',
  tailoring: 'fashion',
  masonry: 'construction',
  cad: 'construction',
  plumbing: 'construction',
  graphic: 'media',
  video: 'media',
  photo: 'media',
  welding: 'engineering',
  refrigeration: 'engineering',
  cctv: 'surveillance',
  fiber: 'surveillance',
  drone: 'media'
};

const getCourseArtwork = (imageKey: string) => {
  const theme = IMAGE_THEME_MAP[imageKey] || 'programming';
  const baseUrl = THUMBNAIL_LIBRARY[theme];
  return {
    thumbnailUrl: `${baseUrl}&w=900&h=600&fit=crop`,
    bannerUrl: `${baseUrl}&w=1400&h=900&fit=crop`
  };
};

const reviewSnippets = (title: string, department: string): ReviewSnippet[] => ([
  {
    studentName: 'Dennis Kiprop',
    rating: 5,
    comment: `${title} feels like a real campus unit. The labs and notes were practical from day one.`
  },
  {
    studentName: 'Faith Chepngetich',
    rating: 4,
    comment: `Clear pacing, useful assignments, and realistic ${department.toLowerCase()} workflows throughout.`
  }
]);

const lessonResources = (courseTitle: string, lessonTitle: string): LessonResource[] => ([
  {
    type: 'pdf',
    title: `${lessonTitle} revision notes`,
    url: `/resources/${courseTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${lessonTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`,
    description: 'Downloadable lecture note pack for offline study.'
  },
  {
    type: 'doc',
    title: `${lessonTitle} worksheet`,
    url: `/resources/${courseTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-worksheet.docx`,
    description: 'Guided practice exercise and assessment prompts.'
  },
  {
    type: 'cheatsheet',
    title: `${courseTitle} quick reference`,
    url: `/resources/${courseTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-cheatsheet.pdf`,
    description: 'Compact formulas, commands, and safety reminders.'
  }
]);

const createLessons = (courseId: string, moduleId: string, moduleTitle: string, courseTitle: string, youtubeUrl: string, category: string, moduleIndex: number): Lesson[] => {
  const lessonTitles = [
    `${moduleTitle}: guided lesson`,
    `${moduleTitle}: practice walkthrough`,
    `${moduleTitle}: knowledge check`
  ];

  return lessonTitles.map((title, lessonIndex) => {
    const type = lessonIndex === 2 ? 'quiz' : lessonIndex === 1 ? 'document' : 'video';
    const lessonVideoUrl = lessonIndex === 0
      ? youtubeUrl
      : getVideoForCategory(category, moduleIndex * 5 + lessonIndex);
    return {
      id: `lesson_${courseId}_${moduleIndex + 1}_${lessonIndex + 1}`,
      moduleId,
      title,
      duration: `${12 + moduleIndex * 3 + lessonIndex * 4} mins`,
      type,
      videoUrl: toEmbedUrl(lessonVideoUrl),
      pdfUrl: type === 'document' ? `/resources/${courseId}-${moduleIndex + 1}-${lessonIndex + 1}.pdf` : undefined,
      notes: `This lesson covers ${moduleTitle.toLowerCase()} for ${courseTitle}. Focus on key procedures, terminology, and practical application steps.`,
      resources: lessonResources(courseTitle, title),
      exercises: [
        `Complete the ${moduleTitle.toLowerCase()} drill sheet.`,
        `Summarize the main workflow for ${moduleTitle.toLowerCase()}.`
      ],
      isCompleted: false,
      isDownloaded: true,
      downloadSize: `${8 + lessonIndex * 2} MB`
    };
  });
};

const createModules = (courseId: string, courseTitle: string, moduleNames: string[], youtubeUrl: string, category: string): Module[] => (
  moduleNames.map((moduleTitle, moduleIndex) => {
    const moduleId = `module_${courseId}_${moduleIndex + 1}`;
    return {
      id: moduleId,
      courseId,
      title: `Module ${moduleIndex + 1}: ${moduleTitle}`,
      order: moduleIndex + 1,
      description: `Applied training block on ${moduleTitle.toLowerCase()}.`,
      lessons: createLessons(courseId, moduleId, moduleTitle, courseTitle, youtubeUrl, category, moduleIndex)
    };
  })
);

const createQuizzes = (courseId: string, courseTitle: string, modules: Module[]): Quiz[] => (
  modules.map((module) => ({
    id: `quiz_${module.id}`,
    courseId,
    courseTitle,
    title: `${module.title} assessment`,
    description: `Measure competency after ${module.title.toLowerCase()}.`,
    questionsCount: 3,
    durationMinutes: 12,
    passingScore: 70,
    status: 'available',
    maxAttempts: 3,
    attemptsLeft: 3,
    questions: [
      {
        id: `qq_${module.id}_1`,
        quizId: `quiz_${module.id}`,
        text: `Which outcome best demonstrates mastery of ${module.title.toLowerCase()}?`,
        options: ['Safe setup and correct workflow', 'Skipping validation', 'Guessing values', 'Ignoring specifications'],
        correctOptionIndex: 0,
        explanation: 'Practical mastery combines safety, procedure, and accurate execution.'
      },
      {
        id: `qq_${module.id}_2`,
        quizId: `quiz_${module.id}`,
        text: `What should a learner review before the final practical?`,
        options: ['Notes and resource sheets', 'Only the certificate page', 'Social feed', 'Theme settings'],
        correctOptionIndex: 0,
        explanation: 'Revision notes and resources support higher practical accuracy.'
      },
      {
        id: `qq_${module.id}_3`,
        quizId: `quiz_${module.id}`,
        text: `Why is documentation important in this module?`,
        options: ['It supports repeatable results', 'It slows learning', 'It replaces practice', 'It removes safety checks'],
        correctOptionIndex: 0,
        explanation: 'Documentation helps learners reproduce and verify their work.'
      }
    ]
  }))
);

const createAssignments = (courseId: string, courseTitle: string, category: string): Assignment[] => ([
  {
    id: `assignment_${courseId}_1`,
    courseId,
    courseTitle,
    title: `${courseTitle} practical brief`,
    description: `Prepare a complete ${category.toLowerCase()} submission with screenshots, notes, and measurable outcomes.`,
    dueDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
    status: 'pending',
    points: 100
  },
  {
    id: `assignment_${courseId}_2`,
    courseId,
    courseTitle,
    title: `${courseTitle} capstone task`,
    description: `Build a portfolio-ready artifact that demonstrates readiness for industry assessment.`,
    dueDate: new Date(Date.now() + 11 * 86400000).toISOString().split('T')[0],
    status: 'pending',
    points: 150
  }
]);

const courseSpecs: CourseSeedSpec[] = [
  { title: 'React.js Complete Bootcamp', category: 'Web Development', department: 'ICT & Software Development', instructor: 'Elena Rodriguez', level: 'Intermediate', duration: '8 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8', moduleNames: ['React Basics', 'Components and Props', 'Hooks in Practice', 'Routing and Navigation', 'State Management', 'API Integration', 'Deployment'], tags: ['react', 'frontend', 'spa', 'vercel'], image: 'react' },
  { title: 'Frontend Foundations with HTML, CSS and JavaScript', category: 'Web Development', department: 'ICT & Software Development', instructor: 'Elena Rodriguez', level: 'Beginner', duration: '6 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=mU6anWqZJcc', moduleNames: ['Semantic HTML', 'Modern CSS', 'Responsive Layouts', 'JavaScript Essentials', 'DOM Projects'], tags: ['html', 'css', 'javascript', 'frontend'], image: 'frontend' },
  { title: 'TypeScript for Production Apps', category: 'TypeScript', department: 'ICT & Software Development', instructor: 'Elena Rodriguez', level: 'Intermediate', duration: '7 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=SpwzRDUQ1GI', moduleNames: ['TS Setup', 'Types and Interfaces', 'Generics', 'TS with React', 'Strict Refactoring'], tags: ['typescript', 'frontend', 'quality'], image: 'typescript' },
  { title: 'Node.js API Development Lab', category: 'Node.js', department: 'ICT & Software Development', instructor: 'Dr. Alan Turing', level: 'Intermediate', duration: '8 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=BRssQPHZwdA', moduleNames: ['Node Runtime', 'Express Routing', 'Databases', 'Authentication', 'Testing and Deployment'], tags: ['node', 'api', 'backend'], image: 'node' },
  { title: 'Python Programming Essentials', category: 'Python', department: 'ICT & Software Development', instructor: 'Dr. Alan Turing', level: 'Beginner', duration: '6 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw', moduleNames: ['Python Setup', 'Core Syntax', 'Functions', 'Files and APIs', 'Automation Practice'], tags: ['python', 'automation', 'fundamentals'], image: 'python' },
  { title: 'Data Analysis with Pandas and SQL', category: 'Data Science', department: 'ICT & Software Development', instructor: 'Elena Rodriguez', level: 'Intermediate', duration: '7 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=LHBE0uHNPqI', moduleNames: ['Data Cleaning', 'Pandas Operations', 'SQL Queries', 'Dashboards', 'Reporting'], tags: ['data', 'sql', 'analytics'], image: 'data' },
  { title: 'Cloud Computing with AWS Fundamentals', category: 'Cloud Computing', department: 'ICT & Software Development', instructor: 'Dr. Alan Turing', level: 'Beginner', duration: '6 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=ulprqHHWlng', moduleNames: ['Cloud Basics', 'Core AWS Services', 'Identity and Security', 'Storage and Compute', 'Deployment Review'], tags: ['aws', 'cloud', 'infra'], image: 'cloud' },
  { title: 'Cybersecurity and Ethical Hacking Fundamentals', category: 'Cybersecurity', department: 'ICT & Software Development', instructor: 'Dr. Alan Turing', level: 'Advanced', duration: '8 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE', moduleNames: ['Threat Landscape', 'Reconnaissance', 'Network Scanning', 'Web Security', 'Incident Response'], tags: ['security', 'ethical hacking', 'network'], image: 'cyber' },
  { title: 'Machine Learning for Applied TVET Projects', category: 'AI & Machine Learning', department: 'ICT & Software Development', instructor: 'Elena Rodriguez', level: 'Intermediate', duration: '8 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=ha5-T0sHKLg', moduleNames: ['ML Workflow', 'Classification', 'Regression', 'Model Evaluation', 'Project Deployment'], tags: ['ml', 'python', 'projects'], image: 'ml' },
  { title: 'Mobile App Development with React Native', category: 'Mobile Development', department: 'ICT & Software Development', instructor: 'Elena Rodriguez', level: 'Intermediate', duration: '7 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8', moduleNames: ['React Native Setup', 'Navigation', 'Native UI Patterns', 'APIs and Storage', 'Publishing'], tags: ['mobile', 'react native', 'apps'], image: 'mobile' },
  { title: 'Structured Networking and Router Configuration', category: 'Networking', department: 'ICT & Software Development', instructor: 'Amina Yusuf', level: 'Intermediate', duration: '6 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=fNzpcB7ODxQ', moduleNames: ['LAN Basics', 'Cable Termination', 'Router Setup', 'Switching', 'Network Troubleshooting'], tags: ['networking', 'routers', 'lan'], image: 'networking' },
  { title: 'Industrial Electrical Installation', category: 'Electrical Engineering', department: 'Engineering', instructor: 'Dr. Sarah Mitchell', level: 'Intermediate', duration: '9 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=ZMSbDwpIyF4', moduleNames: ['Safety and Tools', 'Circuit Reading', 'Panel Wiring', 'Load Balancing', 'Inspection'], tags: ['electrical', 'installation', 'safety'], image: 'electrical' },
  { title: 'Solar PV Sizing and Installation', category: 'Solar Installation', department: 'Engineering', instructor: 'Peter Kamau', level: 'Beginner', duration: '7 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=FgwXp62-L6M', moduleNames: ['Solar Fundamentals', 'Site Survey', 'Sizing Calculations', 'Battery Wiring', 'Commissioning'], tags: ['solar', 'pv', 'energy'], image: 'solar' },
  { title: 'PLC Programming and Automation Control', category: 'Electrical Engineering', department: 'Engineering', instructor: 'Dr. Sarah Mitchell', level: 'Advanced', duration: '8 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=ZMSbDwpIyF4', moduleNames: ['PLC Hardware', 'Ladder Logic', 'Input and Output Mapping', 'Fault Diagnostics', 'Automation Project'], tags: ['plc', 'automation', 'industry'], image: 'plc' },
  { title: 'Motor Rewinding and Maintenance', category: 'Electrical Engineering', department: 'Engineering', instructor: 'Peter Kamau', level: 'Intermediate', duration: '6 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=ZMSbDwpIyF4', moduleNames: ['Motor Anatomy', 'Testing', 'Rewinding Process', 'Assembly', 'Performance Checks'], tags: ['motors', 'maintenance', 'repair'], image: 'motor' },
  { title: 'Automotive Diagnostics and ECU Systems', category: 'Automotive Engineering', department: 'Engineering', instructor: 'Prof. David Chen', level: 'Advanced', duration: '9 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=FgwXp62-L6M', moduleNames: ['Engine Management', 'Diagnostic Scanners', 'ECU Signals', 'Electrical Faults', 'Workshop Simulation'], tags: ['automotive', 'diagnostics', 'ecu'], image: 'automotive' },
  { title: 'Hybrid and EV Powertrain Technology', category: 'Automotive Engineering', department: 'Engineering', instructor: 'Prof. David Chen', level: 'Advanced', duration: '8 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=FgwXp62-L6M', moduleNames: ['EV Safety', 'Battery Systems', 'Inverters', 'Drive Units', 'Maintenance Procedures'], tags: ['ev', 'hybrid', 'automotive'], image: 'ev' },
  { title: 'CNC Machining and G-Code Programming', category: 'Mechanical Engineering', department: 'Engineering', instructor: 'James Carter', level: 'Intermediate', duration: '8 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=JsTqg_Jc680', moduleNames: ['Machine Setup', 'Coordinate Systems', 'G-Code Basics', 'Toolpaths', 'Quality Control'], tags: ['cnc', 'manufacturing', 'gcode'], image: 'cnc' },
  { title: 'Hydraulic and Pneumatic Systems Maintenance', category: 'Mechanical Engineering', department: 'Engineering', instructor: 'James Carter', level: 'Intermediate', duration: '7 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=JsTqg_Jc680', moduleNames: ['Fluid Power Basics', 'Valves and Pumps', 'Maintenance Workflow', 'Diagnostics', 'System Optimization'], tags: ['hydraulics', 'pneumatics', 'maintenance'], image: 'hydraulic' },
  { title: 'Construction Materials Testing', category: 'Civil Engineering', department: 'Construction', instructor: 'Dennis Kipkemboi', level: 'Beginner', duration: '6 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=JsTqg_Jc680', moduleNames: ['Material Types', 'Sampling', 'Compression Tests', 'Site Reports', 'Compliance'], tags: ['construction', 'testing', 'civil'], image: 'materials' },
  { title: 'Project Cost Estimation and Site Quantities', category: 'Civil Engineering', department: 'Construction', instructor: 'Dennis Kipkemboi', level: 'Intermediate', duration: '6 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=JsTqg_Jc680', moduleNames: ['BOQ Basics', 'Measurement Rules', 'Rate Analysis', 'Budgeting', 'Tender Review'], tags: ['construction', 'boq', 'estimation'], image: 'boq' },
  { title: 'Entrepreneurship for TVET Graduates', category: 'Entrepreneurship', department: 'Business', instructor: 'Wanjiku Mwangi', level: 'Beginner', duration: '5 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=ysEN5RaKOlA', moduleNames: ['Idea Validation', 'Business Models', 'Registration', 'Pricing', 'Growth Planning'], tags: ['business', 'startup', 'entrepreneurship'], image: 'startup' },
  { title: 'Digital Marketing and Social Media Strategy', category: 'Digital Marketing', department: 'Business', instructor: 'Wanjiku Mwangi', level: 'Beginner', duration: '5 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=Gv9_4yMHFhI', moduleNames: ['Marketing Basics', 'Content Planning', 'Paid Campaigns', 'Analytics', 'Conversion Optimization'], tags: ['marketing', 'social media', 'seo'], image: 'marketing' },
  { title: 'Accounting and Cooperative Bookkeeping', category: 'Accounting', department: 'Business', instructor: 'Wanjiku Mwangi', level: 'Intermediate', duration: '6 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=S_oGpO_bDZY', moduleNames: ['Bookkeeping Basics', 'Ledgers', 'Cashflow', 'Audit Trails', 'Financial Statements'], tags: ['accounting', 'finance', 'bookkeeping'], image: 'accounting' },
  { title: 'Financial Literacy and SME Management', category: 'Finance', department: 'Business', instructor: 'Wanjiku Mwangi', level: 'Beginner', duration: '5 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=dA4vs_KXuO4', moduleNames: ['Budgeting', 'Loans and Credit', 'Cashflow Management', 'Pricing', 'Risk Control'], tags: ['finance', 'sme', 'literacy'], image: 'finance' },
  { title: 'Agile Project Management Essentials', category: 'Project Management', department: 'Business', instructor: 'Wanjiku Mwangi', level: 'Intermediate', duration: '6 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=WEDIj9JBTC8', moduleNames: ['Project Foundations', 'Scrum Roles', 'Backlogs', 'Sprints', 'Retrospectives'], tags: ['agile', 'scrum', 'delivery'], image: 'agile' },
  { title: 'Hotel Operations and Front Office Management', category: 'Hospitality Management', department: 'Hospitality', instructor: 'Lucy Wangare', level: 'Beginner', duration: '6 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=Gv9_4yMHFhI', moduleNames: ['Guest Experience', 'Reservations', 'Front Office Systems', 'Service Recovery', 'Reporting'], tags: ['hospitality', 'hotel', 'service'], image: 'hotel' },
  { title: 'Food Production and Kitchen Operations', category: 'Culinary Arts', department: 'Hospitality', instructor: 'Lucy Wangare', level: 'Intermediate', duration: '7 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=Gv9_4yMHFhI', moduleNames: ['Kitchen Safety', 'Prep Stations', 'Menu Production', 'Cost Control', 'Service Timing'], tags: ['culinary', 'kitchen', 'hospitality'], image: 'culinary' },
  { title: 'Event Planning and Banqueting Services', category: 'Hospitality Management', department: 'Hospitality', instructor: 'Lucy Wangare', level: 'Intermediate', duration: '5 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=Gv9_4yMHFhI', moduleNames: ['Event Concepts', 'Client Briefs', 'Venue Layouts', 'Banquet Flow', 'Post Event Review'], tags: ['events', 'banquet', 'hospitality'], image: 'events' },
  { title: 'Sustainable Agriculture and Smart Farming', category: 'Agriculture', department: 'Agriculture', instructor: 'James Carter', level: 'Beginner', duration: '7 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=FgwXp62-L6M', moduleNames: ['Farm Planning', 'Soil Health', 'Crop Scheduling', 'Data Logging', 'Sustainable Practices'], tags: ['agriculture', 'smart farming', 'sustainability'], image: 'agriculture' },
  { title: 'Greenhouse Management and Irrigation Systems', category: 'Agriculture', department: 'Agriculture', instructor: 'James Carter', level: 'Intermediate', duration: '6 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=FgwXp62-L6M', moduleNames: ['Greenhouse Setup', 'Water Management', 'Sensors', 'Nutrient Scheduling', 'Harvest Planning'], tags: ['greenhouse', 'irrigation', 'farming'], image: 'greenhouse' },
  { title: 'Agribusiness and Farm Enterprise Management', category: 'Agriculture', department: 'Agriculture', instructor: 'Wanjiku Mwangi', level: 'Intermediate', duration: '6 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=dA4vs_KXuO4', moduleNames: ['Farm Records', 'Enterprise Models', 'Costing', 'Market Access', 'Growth Strategy'], tags: ['agribusiness', 'management', 'enterprise'], image: 'agribusiness' },
  { title: 'Community Health Promotion', category: 'Public Health', department: 'Health Sciences', instructor: 'Amina Yusuf', level: 'Beginner', duration: '5 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=qiQR5rTSshw', moduleNames: ['Health Education', 'Screening Basics', 'Community Outreach', 'Reporting', 'Prevention Campaigns'], tags: ['health', 'community', 'promotion'], image: 'health' },
  { title: 'Nutrition and Dietetics Fundamentals', category: 'Nutrition', department: 'Health Sciences', instructor: 'Amina Yusuf', level: 'Beginner', duration: '6 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=qiQR5rTSshw', moduleNames: ['Food Groups', 'Meal Planning', 'Clinical Nutrition', 'Assessment', 'Behaviour Change'], tags: ['nutrition', 'diet', 'wellness'], image: 'nutrition' },
  { title: 'Medical Records and Health Information Systems', category: 'Health Informatics', department: 'Health Sciences', instructor: 'Amina Yusuf', level: 'Intermediate', duration: '6 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=qiQR5rTSshw', moduleNames: ['Patient Files', 'Data Privacy', 'Digital Records', 'Reporting', 'Quality Assurance'], tags: ['health informatics', 'records', 'systems'], image: 'records' },
  { title: 'Fashion Design and Garment Construction', category: 'Fashion Design', department: 'Fashion & Beauty', instructor: 'Lucy Wangare', level: 'Beginner', duration: '8 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU', moduleNames: ['Design Basics', 'Pattern Drafting', 'Fabric Selection', 'Machine Operations', 'Finishing'], tags: ['fashion', 'garment', 'design'], image: 'fashion' },
  { title: 'Beauty Therapy and Salon Operations', category: 'Beauty Therapy', department: 'Fashion & Beauty', instructor: 'Lucy Wangare', level: 'Beginner', duration: '6 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=68w2VwalD5w', moduleNames: ['Client Care', 'Skin Basics', 'Salon Hygiene', 'Treatment Setup', 'Business Operations'], tags: ['beauty', 'salon', 'therapy'], image: 'beauty' },
  { title: 'Tailoring Technology and Apparel Finishing', category: 'Fashion Design', department: 'Fashion & Beauty', instructor: 'Lucy Wangare', level: 'Intermediate', duration: '7 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=B242nuM3y2s', moduleNames: ['Measurement', 'Cutting', 'Assembly', 'Pressing', 'Quality Finish'], tags: ['tailoring', 'apparel', 'finishing'], image: 'tailoring' },
  { title: 'Masonry and Concrete Works', category: 'Construction Technology', department: 'Construction', instructor: 'Dennis Kipkemboi', level: 'Beginner', duration: '7 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=JsTqg_Jc680', moduleNames: ['Site Safety', 'Concrete Mixing', 'Block Work', 'Finishing', 'Inspection'], tags: ['masonry', 'concrete', 'construction'], image: 'masonry' },
  { title: 'Building Technology and CAD Drafting', category: 'Construction Technology', department: 'Construction', instructor: 'Dennis Kipkemboi', level: 'Intermediate', duration: '8 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=B242nuM3y2s', moduleNames: ['Drawing Basics', 'CAD Tools', 'Plan Reading', 'Detailing', 'Submission Packs'], tags: ['cad', 'building', 'drafting'], image: 'cad' },
  { title: 'Plumbing Installation and Maintenance', category: 'Plumbing', department: 'Construction', instructor: 'Lucy Wangare', level: 'Intermediate', duration: '7 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=ZMSbDwpIyF4', moduleNames: ['Pipe Systems', 'Tools and Safety', 'Fittings', 'Maintenance', 'Pressure Testing'], tags: ['plumbing', 'maintenance', 'installation'], image: 'plumbing' },
  { title: 'Graphic Design and Brand Communication', category: 'Graphic Design', department: 'Media & Creative Arts', instructor: 'Elena Rodriguez', level: 'Beginner', duration: '6 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU', moduleNames: ['Design Principles', 'Layouts', 'Brand Assets', 'Campaign Design', 'Portfolio Review'], tags: ['graphic design', 'branding', 'media'], image: 'graphic' },
  { title: 'Video Production and Editing', category: 'Media Production', department: 'Media & Creative Arts', instructor: 'Elena Rodriguez', level: 'Intermediate', duration: '7 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=vIChKMPIQds', moduleNames: ['Pre-Production', 'Cameras and Audio', 'Editing Workflow', 'Publishing', 'Client Delivery'], tags: ['video', 'editing', 'media'], image: 'video' },
  { title: 'Photography and Visual Storytelling', category: 'Media Production', department: 'Media & Creative Arts', instructor: 'Elena Rodriguez', level: 'Beginner', duration: '6 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8', moduleNames: ['Camera Basics', 'Lighting', 'Composition', 'Editing', 'Story Packages'], tags: ['photography', 'visual', 'storytelling'], image: 'photo' },
  { title: 'Welding Technology and Fabrication', category: 'Welding', department: 'Technical Skills', instructor: 'Dennis Kipkemboi', level: 'Intermediate', duration: '8 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=ZMSbDwpIyF4', moduleNames: ['Workshop Safety', 'SMAW Basics', 'Joint Preparation', 'Fabrication', 'Quality Checks'], tags: ['welding', 'fabrication', 'metalwork'], image: 'welding' },
  { title: 'Refrigeration and Air Conditioning Systems', category: 'Refrigeration', department: 'Technical Skills', instructor: 'Peter Kamau', level: 'Intermediate', duration: '8 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=ZMSbDwpIyF4', moduleNames: ['Cooling Principles', 'Components', 'Installation', 'Fault Finding', 'Servicing'], tags: ['refrigeration', 'cooling', 'service'], image: 'refrigeration' },
  { title: 'CCTV Installation and Surveillance Systems', category: 'CCTV Installation', department: 'Technical Skills', instructor: 'Amina Yusuf', level: 'Beginner', duration: '6 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=fNzpcB7ODxQ', moduleNames: ['Camera Types', 'Cable Routing', 'NVR Setup', 'Remote Viewing', 'Troubleshooting'], tags: ['cctv', 'security', 'installation'], image: 'cctv' },
  { title: 'Fiber Optic Splicing and Testing', category: 'Networking', department: 'Technical Skills', instructor: 'Amina Yusuf', level: 'Advanced', duration: '7 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=fNzpcB7ODxQ', moduleNames: ['Fiber Safety', 'Cable Prep', 'Fusion Splicing', 'OTDR Testing', 'Documentation'], tags: ['fiber', 'splicing', 'testing'], image: 'fiber' },
  { title: 'Drone Operations and Mapping Basics', category: 'Technical Operations', department: 'Technical Skills', instructor: 'James Carter', level: 'Beginner', duration: '5 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8', moduleNames: ['Drone Safety', 'Flight Controls', 'Mission Planning', 'Mapping Workflow', 'Data Review'], tags: ['drone', 'mapping', 'survey'], image: 'drone' },
  { title: 'UI UX Design and Figma Prototyping', category: 'UI/UX Design', department: 'ICT & Software Development', instructor: 'Elena Rodriguez', level: 'Beginner', duration: '6 Weeks', youtubeUrl: 'https://www.youtube.com/watch?v=B242nuM3y2s', moduleNames: ['UX Foundations', 'Wireframes', 'Design Systems', 'Prototyping', 'Usability Testing'], tags: ['figma', 'ui', 'ux'], image: 'uiux' }
];

export const COURSE_DEPARTMENTS = [
  'ICT & Software Development',
  'Engineering',
  'Business',
  'Hospitality',
  'Agriculture',
  'Health Sciences',
  'Fashion & Beauty',
  'Construction',
  'Media & Creative Arts',
  'Technical Skills'
] as const;

export const SEED_COURSES: Course[] = courseSpecs.map((spec, index) => {
  const courseId = String(index + 1);
  const youtubeUrl = toEmbedUrl(spec.youtubeUrl);
  const modules = createModules(courseId, spec.title, spec.moduleNames, youtubeUrl, spec.category);
  const lessons = modules.flatMap((module) => module.lessons);
  const quizzes = createQuizzes(courseId, spec.title, modules);
  const assignments = createAssignments(courseId, spec.title, spec.category);
  const resources = lessons.flatMap((lesson) => lesson.resources || []).slice(0, 6);
  const reviews = reviewSnippets(spec.title, spec.department);
  const enrollmentCount = 120 + (index * 37) % 850;
  const rating = parseFloat((4.4 + (index % 5) * 0.1).toFixed(1));
  const artwork = getCourseArtwork(spec.image);

  return {
    id: courseId,
    title: spec.title,
    subtitle: `${spec.department} pathway with guided video lessons, notes, quizzes, and capstone tasks.`,
    description: `${spec.title} is a complete frontend-only learning pathway for ${spec.department.toLowerCase()} learners. It includes guided labs, embedded YouTube lessons, revision notes, downloadable references, quizzes, assignments, progress tracking, and certificate issuance.`,
    instructor: spec.instructor,
    category: spec.category,
    department: spec.department,
    lecturerName: spec.instructor,
    lecturerId: `u_lec_${(index % 10) + 1}`,
    lecturerAvatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(spec.instructor)}`,
    thumbnail: artwork.thumbnailUrl,
    thumbnailUrl: artwork.thumbnailUrl,
    banner: artwork.bannerUrl,
    bannerUrl: artwork.bannerUrl,
    youtubeUrl,
    modules,
    lessons,
    quizzes,
    assignments,
    resources,
    enrollmentCount,
    enrolledStudentsCount: enrollmentCount,
    rating,
    reviews,
    reviewsCount: 24 + (index % 18),
    duration: spec.duration,
    level: spec.level,
    lessonsCount: lessons.length,
    modulesCount: modules.length,
    isOfflineAvailable: true,
    downloadSize: `${180 + (index % 5) * 35} MB`,
    progress: index < 8 ? 35 + (index % 4) * 15 : 0,
    skillLevel: spec.level,
    tags: [...spec.tags, spec.department, 'certificate-ready'],
    skillsGained: spec.moduleNames.slice(0, 4),
    language: 'English',
    certificateAvailable: true,
    hasCertificate: true,
    completionRate: 62 + (index % 22),
    createdAt: new Date(Date.now() - index * 86400000).toISOString(),
    lastUpdated: new Date(Date.now() - (index % 12) * 86400000).toISOString().split('T')[0]
  };
});

export const SEED_MODULES = Object.fromEntries(SEED_COURSES.map((course) => [course.id, course.modules || []]));
export const SEED_ASSIGNMENTS = SEED_COURSES.flatMap((course) => course.assignments || []);
export const SEED_QUIZZES = Object.fromEntries(
  SEED_COURSES.flatMap((course) => (course.quizzes || []).map((quiz) => [quiz.id.replace('quiz_module', 'lesson'), quiz]))
);
