// Rich educational content library for lessons across all categories
export interface LessonContentTemplate {
  videoUrl: string;
  notes: string;
  resources: { type: 'pdf' | 'github' | 'doc' | 'cheatsheet' | 'link'; title: string; url: string }[];
  exercises: string[];
  quizQuestions?: { text: string; options: string[]; correctOptionIndex: number; explanation: string }[];
}

// Real YouTube video IDs from educational channels
export const YOUTUBE_VIDEOS = {
  webDev: [
    'https://www.youtube.com/embed/rfscVS0vtbw',   // Python freeCodeCamp
    'https://www.youtube.com/embed/bMknfKXIFA8',   // React freeCodeCamp
    'https://www.youtube.com/embed/Ke90Tje7VS0',   // JS Crash Course Mosh
    'https://www.youtube.com/embed/hdI2bqOjy3c',   // JS Traversy
    'https://www.youtube.com/embed/PkZNo7MFNFg',   // JS freeCodeCamp
    'https://www.youtube.com/embed/9bZkp7q19f0',   // Gangnam (placeholder test)
    'https://www.youtube.com/embed/mU6anWqZJcc',   // HTML/CSS Traversy
    'https://www.youtube.com/embed/4UZrsTqKCw4',   // HTML freeCodeCamp
    'https://www.youtube.com/embed/EerdGm-ehJQ',   // CSS freeCodeCamp
    'https://www.youtube.com/embed/zJSY8tJY_mM',   // Tailwind Traversy
    'https://www.youtube.com/embed/w7ejDZ8SWv8',   // React Traversy
    'https://www.youtube.com/embed/f55qeKGgB_M',   // TypeScript Net Ninja
    'https://www.youtube.com/embed/SpwzRDUQ1GI',   // TypeScript freeCodeCamp
    'https://www.youtube.com/embed/qw--VYLpxG4',   // GraphQL freeCodeCamp
    'https://www.youtube.com/embed/7S_tz1z_5bA',   // MySQL freeCodeCamp
    'https://www.youtube.com/embed/t705_v-y6-c',   // SQL freeCodeCamp
    'https://www.youtube.com/embed/BRssQPHZwdA',   // Node.js freeCodeCamp
    'https://www.youtube.com/embed/F5mRW0jo-U4',   // Django freeCodeCamp
    'https://www.youtube.com/embed/jS4aFq5-91M',   // JS Modern Traversy
    'https://www.youtube.com/embed/vLnPwxZdW4Y',   // C++ freeCodeCamp
  ],
  python: [
    'https://www.youtube.com/embed/rfscVS0vtbw',   // Python freeCodeCamp full
    'https://www.youtube.com/embed/eWRfhZUzrAc',   // Python intermediate
    'https://www.youtube.com/embed/HGOBQPFzWKo',   // Python Mosh
    'https://www.youtube.com/embed/8DvywoWv6fI',   // Python OOP Mosh
    'https://www.youtube.com/embed/YYXdXT2l-Gg',   // Python list comp
    'https://www.youtube.com/embed/_uQrJ0TkZlc',   // Python tutorial full
  ],
  dataScience: [
    'https://www.youtube.com/embed/LHBE0uHNPqI',   // Data Science freeCodeCamp
    'https://www.youtube.com/embed/r-uOLxNrNk8',   // Pandas tutorial
    'https://www.youtube.com/embed/GPVsHOlRBBI',   // NumPy
    'https://www.youtube.com/embed/vmEHCJofslg',   // Matplotlib
    'https://www.youtube.com/embed/ha5-T0sHKLg',   // Machine learning intro
  ],
  cybersecurity: [
    'https://www.youtube.com/embed/3Kq1MIfTWCE',   // Ethical hacking freeCodeCamp
    'https://www.youtube.com/embed/fNzpcB7ODxQ',   // Network security
    'https://www.youtube.com/embed/hXSFdwIOfnE',   // Kali Linux
    'https://www.youtube.com/embed/qiQR5rTSshw',   // Cybersecurity intro
    'https://www.youtube.com/embed/usNscAndMdE',   // Penetration testing
  ],
  cloud: [
    'https://www.youtube.com/embed/ulprqHHWlng',   // AWS full course freeCodeCamp
    'https://www.youtube.com/embed/8U9IioFisMU',   // Docker freeCodeCamp
    'https://www.youtube.com/embed/X48VuDVv0do',   // Kubernetes freeCodeCamp
    'https://www.youtube.com/embed/s_o8dwzRlu4',   // Docker Traversy
    'https://www.youtube.com/embed/3c-iBn73dDE',   // Docker full course
  ],
  engineering: [
    'https://www.youtube.com/embed/FgwXp62-L6M',   // Solar energy basics
    'https://www.youtube.com/embed/LfaMCXJxg3U',   // CS50 Harvard
    'https://www.youtube.com/embed/8A7ffXp8NY0',   // Python OOP CS50
    'https://www.youtube.com/embed/JsTqg_Jc680',   // MIT Calculus
    'https://www.youtube.com/embed/ZMSbDwpIyF4',   // Electrical basics
  ],
  business: [
    'https://www.youtube.com/embed/ysEN5RaKOlA',   // Entrepreneurship
    'https://www.youtube.com/embed/Gv9_4yMHFhI',   // Marketing
    'https://www.youtube.com/embed/WEDIj9JBTC8',   // Project management
    'https://www.youtube.com/embed/dA4vs_KXuO4',   // Finance basics
    'https://www.youtube.com/embed/S_oGpO_bDZY',   // Accounting
  ],
  uiux: [
    'https://www.youtube.com/embed/c9Wg6Cb_YlU',   // UI/UX full course
    'https://www.youtube.com/embed/B242nuM3y2s',   // Figma tutorial
    'https://www.youtube.com/embed/FTFaQWZBqQ8',   // Design thinking
    'https://www.youtube.com/embed/68w2VwalD5w',   // UX fundamentals
    'https://www.youtube.com/embed/vIChKMPIQds',   // Figma crash course
  ],
};

// Pool all videos for general use
export const ALL_VIDEOS = [
  ...YOUTUBE_VIDEOS.webDev,
  ...YOUTUBE_VIDEOS.python,
  ...YOUTUBE_VIDEOS.dataScience,
  ...YOUTUBE_VIDEOS.cybersecurity,
  ...YOUTUBE_VIDEOS.cloud,
  ...YOUTUBE_VIDEOS.engineering,
  ...YOUTUBE_VIDEOS.business,
  ...YOUTUBE_VIDEOS.uiux,
];

export function getVideoForCategory(category: string, index: number): string {
  const cat = category.toLowerCase();
  let pool = YOUTUBE_VIDEOS.webDev;
  if (cat.includes('python') || cat.includes('data science')) pool = YOUTUBE_VIDEOS.python;
  else if (cat.includes('security') || cat.includes('hacking') || cat.includes('cyber')) pool = YOUTUBE_VIDEOS.cybersecurity;
  else if (cat.includes('cloud') || cat.includes('devops') || cat.includes('docker')) pool = YOUTUBE_VIDEOS.cloud;
  else if (cat.includes('data') || cat.includes('ml') || cat.includes('machine') || cat.includes('ai')) pool = YOUTUBE_VIDEOS.dataScience;
  else if (cat.includes('electrical') || cat.includes('solar') || cat.includes('mechanical') || cat.includes('engineering') || cat.includes('welding') || cat.includes('plumbing')) pool = YOUTUBE_VIDEOS.engineering;
  else if (cat.includes('business') || cat.includes('marketing') || cat.includes('finance') || cat.includes('entrepreneur') || cat.includes('accounting')) pool = YOUTUBE_VIDEOS.business;
  else if (cat.includes('design') || cat.includes('ui') || cat.includes('ux') || cat.includes('figma')) pool = YOUTUBE_VIDEOS.uiux;
  return pool[Math.abs(index) % pool.length];
}

// Lesson topic banks per category
export const LESSON_TOPICS: Record<string, string[]> = {
  'Web Development': [
    'Setting Up Your Development Environment',
    'HTML5 Semantic Structure & Accessibility',
    'CSS Flexbox Layout System',
    'CSS Grid & Responsive Layouts',
    'JavaScript ES6+ Fundamentals',
    'DOM Manipulation & Event Handling',
    'Asynchronous JavaScript: Promises & Async/Await',
    'Fetch API & REST Integration',
    'Introduction to React & JSX',
    'React Components & Props',
    'React Hooks: useState & useEffect',
    'React Context API & State Management',
    'React Router & Navigation',
    'Form Handling & Validation',
    'Deployment with Netlify & Vercel',
  ],
  'React Development': [
    'React 18 New Features Overview',
    'Functional Components & JSX Deep Dive',
    'useState Hook & State Management',
    'useEffect & Component Lifecycle',
    'useRef & useMemo Optimization',
    'Custom Hooks Design Patterns',
    'Context API for Global State',
    'React Router v6 Navigation',
    'React Query for Server State',
    'Performance Optimization Techniques',
    'Testing React Components with Jest',
    'Deploying React Apps to Production',
  ],
  'TypeScript': [
    'TypeScript Setup & Configuration',
    'Type Annotations & Inference',
    'Interfaces & Type Aliases',
    'Generics & Type Parameters',
    'Union & Intersection Types',
    'Enums & Literal Types',
    'Utility Types: Partial, Required, Pick, Omit',
    'TypeScript with React',
    'Advanced Type Guards',
    'Declaration Files & Third-party Types',
    'TypeScript Decorators',
    'Migrating JavaScript to TypeScript',
  ],
  'Node.js': [
    'Node.js Architecture & Event Loop',
    'CommonJS Modules & npm',
    'File System Operations',
    'Express.js Setup & Routing',
    'Middleware & Error Handling',
    'REST API Design Principles',
    'Authentication with JWT',
    'Database Integration with MongoDB',
    'Input Validation with Joi',
    'Unit Testing with Jest',
    'API Documentation with Swagger',
    'Deployment to Railway & Render',
  ],
  'Python': [
    'Python Environment & Virtual Environments',
    'Variables, Data Types & Type Hints',
    'Control Flow: if/elif/else & Loops',
    'Functions, Lambda & Closures',
    'Lists, Tuples, Sets & Dictionaries',
    'Object-Oriented Programming in Python',
    'File I/O & Exception Handling',
    'Modules, Packages & pip',
    'List Comprehensions & Generators',
    'Regular Expressions',
    'Working with APIs using requests',
    'Python Testing with pytest',
  ],
  'Cybersecurity': [
    'Introduction to Ethical Hacking',
    'Network Protocols & TCP/IP Stack',
    'Reconnaissance & OSINT Techniques',
    'Scanning & Enumeration with Nmap',
    'Vulnerability Assessment with Metasploit',
    'Web Application Security (OWASP Top 10)',
    'SQL Injection & XSS Attacks',
    'Password Cracking Techniques',
    'Social Engineering & Phishing',
    'Wireless Network Security',
    'Incident Response & Forensics',
    'CTF Challenges & Write-ups',
  ],
  'AI & Machine Learning': [
    'Introduction to Machine Learning Concepts',
    'Python for Data Science: NumPy & Pandas',
    'Data Visualization with Matplotlib & Seaborn',
    'Supervised Learning: Regression',
    'Supervised Learning: Classification',
    'Unsupervised Learning: Clustering',
    'Decision Trees & Random Forests',
    'Support Vector Machines',
    'Neural Networks from Scratch',
    'Deep Learning with TensorFlow',
    'Convolutional Neural Networks (CNN)',
    'Natural Language Processing (NLP)',
    'Model Evaluation & Hyperparameter Tuning',
    'Deploying ML Models to Production',
  ],
  'Data Science': [
    'Data Science Workflow Overview',
    'Data Wrangling with Pandas',
    'Exploratory Data Analysis (EDA)',
    'Statistical Analysis & Hypothesis Testing',
    'Data Visualization Best Practices',
    'Feature Engineering Techniques',
    'SQL for Data Analysis',
    'Working with Large Datasets',
    'Business Intelligence with Tableau',
    'Data Science Portfolio Projects',
  ],
  'Cloud Computing': [
    'Cloud Computing Fundamentals',
    'AWS Core Services: EC2, S3, RDS',
    'Identity & Access Management (IAM)',
    'VPC Networking & Security Groups',
    'Lambda Functions & Serverless',
    'Auto Scaling & Load Balancers',
    'CloudWatch Monitoring & Alerts',
    'Infrastructure as Code with Terraform',
    'Docker Containers Fundamentals',
    'Kubernetes Cluster Management',
    'CI/CD Pipelines with GitHub Actions',
    'Cloud Cost Optimization',
  ],
  'UI/UX Design': [
    'Design Thinking & User-Centered Design',
    'User Research Methods & Personas',
    'Information Architecture & Sitemaps',
    'Wireframing with Figma',
    'Prototyping & User Flows',
    'Typography, Color Theory & Grids',
    'Component Libraries & Design Systems',
    'Usability Testing Methods',
    'Accessibility (WCAG) Guidelines',
    'Mobile-First Design Principles',
    'Motion Design & Micro-interactions',
    'Handoff to Developers',
  ],
  'Electrical Engineering': [
    'Electrical Fundamentals: Voltage, Current, Resistance',
    'Ohm\'s Law & Kirchhoff\'s Laws',
    'AC vs DC Circuits',
    'Circuit Analysis Techniques',
    'Capacitors & Inductors',
    'Transformers & Power Distribution',
    'Motor Control & Starters',
    'Programmable Logic Controllers (PLC)',
    'Electrical Safety & Regulations',
    'Solar PV System Design',
    'Battery Storage Systems',
    'Grid-Tie vs Off-Grid Systems',
  ],
  'Solar Installation': [
    'Solar Energy Fundamentals',
    'Solar Panel Technologies & Efficiency',
    'Site Assessment & Shading Analysis',
    'System Sizing Calculations',
    'Mounting & Racking Systems',
    'Wiring & Cable Sizing',
    'Inverter Types & Selection',
    'Battery Bank Configuration',
    'Charge Controllers (PWM vs MPPT)',
    'Grid-Tie System Installation',
    'Off-Grid System Setup',
    'System Commissioning & Testing',
    'Maintenance & Troubleshooting',
  ],
  'Automotive Engineering': [
    'Automotive Systems Overview',
    'Engine Types & Operating Principles',
    'Fuel Systems & Injection',
    'Cooling & Lubrication Systems',
    'Transmission & Drivetrain',
    'Braking Systems & ABS',
    'Electrical Systems & ECU',
    'Hybrid & EV Technology',
    'OBD-II Diagnostics',
    'Wheel Alignment & Suspension',
    'Automotive Air Conditioning',
    'Workshop Safety & Tools',
  ],
  'Mechanical Engineering': [
    'Engineering Materials & Properties',
    'Statics & Dynamics',
    'Strength of Materials',
    'Thermodynamics Principles',
    'Fluid Mechanics Basics',
    'Machine Elements & Gears',
    'CNC Machining Fundamentals',
    'CAD with AutoCAD/SolidWorks',
    'Welding Processes & Metallurgy',
    'Quality Control & Inspection',
    'Hydraulics & Pneumatics',
    'Manufacturing Processes',
  ],
  'Welding': [
    'Welding Safety & PPE',
    'Metal Types & Properties',
    'SMAW (Stick) Welding Basics',
    'MIG/GMAW Welding Techniques',
    'TIG/GTAW Welding Precision',
    'Reading Welding Blueprints',
    'Joint Design & Fitup',
    'Welding Distortion Control',
    'Welder Qualification Tests',
    'Welding Defects & Inspection',
    'Stainless Steel Welding',
    'Aluminum Welding Techniques',
  ],
  'Plumbing': [
    'Plumbing Safety & Tools',
    'Pipe Types & Fittings',
    'Water Supply System Design',
    'Drainage & Venting Systems',
    'Pipe Joining Techniques',
    'Fixture Installation',
    'Water Heater Systems',
    'Pressure Testing',
    'Leak Detection & Repair',
    'Commercial Plumbing Standards',
    'Rainwater Harvesting Systems',
    'Solar Hot Water Systems',
  ],
  'Networking': [
    'Networking Fundamentals & OSI Model',
    'IP Addressing & Subnetting',
    'Network Topologies & Cables',
    'Switches & VLANs',
    'Routing Protocols (OSPF, BGP)',
    'Firewall Configuration',
    'Wireless Networks (Wi-Fi 6)',
    'Network Troubleshooting',
    'VPN & Remote Access',
    'Network Monitoring Tools',
    'Structured Cabling Standards',
    'Fiber Optic Technology',
  ],
  'CCTV Installation': [
    'CCTV System Components',
    'Camera Types & Specifications',
    'IP vs Analog Systems',
    'Network Video Recorder (NVR) Setup',
    'Camera Placement & Coverage',
    'Cable Routing & Installation',
    'Power over Ethernet (PoE)',
    'Video Management Software',
    'Remote Viewing Setup',
    'Storage Calculation & Management',
    'System Commissioning',
    'Maintenance & Troubleshooting',
  ],
  'Entrepreneurship': [
    'Business Idea Generation & Validation',
    'Market Research Techniques',
    'Business Model Canvas',
    'Creating a Business Plan',
    'Legal Business Structures in Kenya',
    'Funding Sources for Startups',
    'Financial Projections & Budgeting',
    'Branding & Marketing Basics',
    'Sales Strategies & Techniques',
    'Digital Marketing for Small Business',
    'Business Registration & Compliance',
    'Scaling Your Business',
  ],
  'Digital Marketing': [
    'Digital Marketing Overview',
    'Search Engine Optimization (SEO)',
    'Content Marketing Strategy',
    'Social Media Marketing',
    'Email Marketing Campaigns',
    'Google Ads & PPC',
    'Meta Ads & Instagram Marketing',
    'Analytics with Google Analytics 4',
    'Conversion Rate Optimization',
    'Influencer Marketing',
    'Building a Digital Marketing Plan',
  ],
  'Accounting': [
    'Accounting Principles & Concepts',
    'Double-Entry Bookkeeping',
    'Chart of Accounts',
    'Recording Transactions',
    'Bank Reconciliation',
    'Trial Balance & Adjusting Entries',
    'Income Statement & Balance Sheet',
    'Cash Flow Statement',
    'Taxation in Kenya (KRA)',
    'Payroll Processing',
    'Accounting Software (QuickBooks)',
    'Audit Fundamentals',
  ],
  'Finance': [
    'Financial Markets Overview',
    'Time Value of Money',
    'Financial Statement Analysis',
    'Capital Budgeting Techniques',
    'Working Capital Management',
    'Risk & Return Concepts',
    'Investment Appraisal Methods',
    'Microfinance & Group Lending',
    'Agribusiness Finance',
    'Personal Financial Planning',
    'Insurance Fundamentals',
    'Fintech & Mobile Banking (M-Pesa)',
  ],
  'Project Management': [
    'Project Management Fundamentals',
    'Project Life Cycle Phases',
    'Stakeholder Management',
    'Scope, Time & Cost Constraints',
    'Work Breakdown Structure (WBS)',
    'Risk Management Planning',
    'Agile Manifesto & Principles',
    'Scrum Framework & Ceremonies',
    'Kanban Boards & Workflow',
    'Microsoft Project Basics',
    'Project Communication Plan',
    'Project Closure & Lessons Learned',
  ],
  'Mobile Development': [
    'Mobile Development Landscape',
    'Flutter Setup & Dart Basics',
    'Widgets & Layouts in Flutter',
    'State Management in Flutter',
    'Navigation & Routing',
    'Networking & HTTP in Flutter',
    'Local Storage & SQLite',
    'Push Notifications',
    'Platform-Specific Features',
    'App Testing & Debugging',
    'Publishing to Play Store & App Store',
  ],
  'Civil Engineering': [
    'Construction Materials & Properties',
    'Structural Analysis Basics',
    'Concrete Mix Design',
    'Reinforcement Detailing',
    'Foundation Types & Design',
    'Masonry Construction',
    'Surveying & Setting Out',
    'Drainage & Sewerage Systems',
    'Road Construction Methods',
    'Quality Control & Testing',
    'Construction Safety (OSHA)',
    'BOQ & Cost Estimation',
  ],
};

// Generic fallback topics
export const GENERIC_TOPICS = [
  'Introduction & Course Overview',
  'Core Concepts & Fundamentals',
  'Practical Applications',
  'Advanced Techniques',
  'Industry Best Practices',
  'Hands-on Lab Exercise',
  'Assessment & Review',
];

export function getTopicsForCategory(category: string): string[] {
  return LESSON_TOPICS[category] || GENERIC_TOPICS;
}

// Generate rich markdown notes for a lesson
export function generateLessonNotes(lessonTitle: string, category: string, courseTitle: string): string {
  return `# ${lessonTitle}

## Overview
This lesson covers **${lessonTitle}** as part of the ${courseTitle} course. By the end of this session, you will have a solid understanding of the core concepts and be able to apply them in real-world scenarios.

## Learning Objectives
- Understand the fundamental principles of ${lessonTitle}
- Apply best practices used by industry professionals
- Complete hands-on exercises to reinforce learning
- Prepare for the assessment quiz

## Key Concepts

### 1. Foundation
Every professional in ${category} needs to master the basics before advancing. This section establishes the theoretical groundwork.

\`\`\`
Key Principle: Always start with a clear understanding of requirements
before implementing any solution.
\`\`\`

### 2. Practical Application
Theory without practice is incomplete. This module includes:
- Step-by-step walkthroughs
- Real-world case studies from Kenyan and international industries
- Common pitfalls to avoid

### 3. Industry Standards
In professional settings, following established standards is critical:
- Always document your work thoroughly
- Follow safety protocols where applicable
- Adhere to ${category} professional guidelines

## Summary & Key Takeaways
✅ Completed this lesson means you understand ${lessonTitle}  
✅ You can now apply these concepts in practical scenarios  
✅ Review the resources below to deepen your understanding  

## Next Steps
Proceed to the next lesson and complete the quiz to test your understanding.
`;
}

// Generate resources for a lesson
export function generateLessonResources(category: string, lessonTitle: string) {
  const catLower = category.toLowerCase();
  
  const githubRepos: Record<string, string[]> = {
    'web': ['https://github.com/bradtraversy/50projects50days', 'https://github.com/freeCodeCamp/freeCodeCamp', 'https://github.com/wesbos/JavaScript30'],
    'react': ['https://github.com/facebook/react', 'https://github.com/reduxjs/redux', 'https://github.com/tannerlinsley/react-query'],
    'python': ['https://github.com/TheAlgorithms/Python', 'https://github.com/vinta/awesome-python', 'https://github.com/psf/requests'],
    'security': ['https://github.com/danielmiessler/SecLists', 'https://github.com/rapid7/metasploit-framework'],
    'cloud': ['https://github.com/aws/aws-cli', 'https://github.com/terraform-aws-modules/terraform-aws-eks'],
    'data': ['https://github.com/jakevdp/PythonDataScienceHandbook', 'https://github.com/ageron/handson-ml2'],
    'default': ['https://github.com/practical-tutorials/project-based-learning', 'https://github.com/sindresorhus/awesome'],
  };

  const docLinks: Record<string, { title: string; url: string }[]> = {
    'web': [{ title: 'MDN Web Docs', url: 'https://developer.mozilla.org' }, { title: 'W3Schools', url: 'https://www.w3schools.com' }],
    'react': [{ title: 'React Official Docs', url: 'https://react.dev' }, { title: 'React Router Docs', url: 'https://reactrouter.com' }],
    'python': [{ title: 'Python Official Docs', url: 'https://docs.python.org/3/' }, { title: 'PyPI', url: 'https://pypi.org' }],
    'node': [{ title: 'Node.js Docs', url: 'https://nodejs.org/en/docs' }, { title: 'Express Docs', url: 'https://expressjs.com' }],
    'cloud': [{ title: 'AWS Docs', url: 'https://docs.aws.amazon.com' }, { title: 'Docker Docs', url: 'https://docs.docker.com' }],
    'security': [{ title: 'OWASP', url: 'https://owasp.org' }, { title: 'Hack The Box', url: 'https://www.hackthebox.com' }],
    'default': [{ title: 'Wikipedia', url: 'https://en.wikipedia.org' }, { title: 'Khan Academy', url: 'https://www.khanacademy.org' }],
  };

  let key = 'default';
  if (catLower.includes('web') || catLower.includes('css') || catLower.includes('html')) key = 'web';
  else if (catLower.includes('react')) key = 'react';
  else if (catLower.includes('python')) key = 'python';
  else if (catLower.includes('node')) key = 'node';
  else if (catLower.includes('cloud') || catLower.includes('aws') || catLower.includes('docker')) key = 'cloud';
  else if (catLower.includes('security') || catLower.includes('hack') || catLower.includes('cyber')) key = 'security';
  else if (catLower.includes('data') || catLower.includes('machine') || catLower.includes('ai')) key = 'data';

  const repos = githubRepos[key] || githubRepos['default'];
  const docs = docLinks[key] || docLinks['default'];

  return [
    { type: 'pdf' as const, title: `${lessonTitle} Reference Guide`, url: `https://www.w3.org/TR/` },
    { type: 'github' as const, title: `${category} Examples Repository`, url: repos[0] },
    { type: 'doc' as const, title: docs[0].title, url: docs[0].url },
    { type: 'cheatsheet' as const, title: `${category} Quick Reference Cheatsheet`, url: `https://devhints.io/` },
    ...(docs[1] ? [{ type: 'link' as const, title: docs[1].title, url: docs[1].url }] : []),
  ];
}

// Generate quiz questions for a lesson
export function generateQuizQuestions(lessonTitle: string, category: string) {
  const questions = [
    {
      text: `What is the primary goal of ${lessonTitle}?`,
      options: [
        `To understand and apply ${category} fundamentals effectively`,
        `To memorize all documentation without practice`,
        `To avoid using industry standards`,
        `To work only with legacy systems`,
      ],
      correctOptionIndex: 0,
      explanation: `The primary goal is always to apply knowledge practically using ${category} best practices.`,
    },
    {
      text: `Which approach is considered best practice in ${category}?`,
      options: [
        `Ignoring documentation and coding by guesswork`,
        `Following established standards and testing thoroughly`,
        `Copy-pasting code without understanding it`,
        `Skipping the planning phase`,
      ],
      correctOptionIndex: 1,
      explanation: `Industry professionals always follow established standards and ensure thorough testing.`,
    },
    {
      text: `What should you do after completing ${lessonTitle}?`,
      options: [
        `Move on immediately without reviewing`,
        `Practice with real projects and review the resources provided`,
        `Skip the quiz and proceed to advanced topics`,
        `Only read theory without hands-on practice`,
      ],
      correctOptionIndex: 1,
      explanation: `Hands-on practice and reviewing supplementary resources greatly reinforces learning retention.`,
    },
  ];
  return questions;
}
