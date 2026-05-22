// Seed social interaction data for JifunzeHub
export interface ReviewSeed {
  studentName: string;
  avatarSeed: string;
  rating: number;
  comment: string;
  daysAgo: number;
}

export const REVIEWS_POOL: ReviewSeed[] = [
  { studentName: 'Dennis Kiprop', avatarSeed: 'dennis', rating: 5, comment: 'Absolutely brilliant course! The practical real-world examples were extremely clear and easy to follow.', daysAgo: 2 },
  { studentName: 'Naserian Wanjiku', avatarSeed: 'naserian', rating: 5, comment: 'Highly detailed course structure. Excellent pace for both beginners and experts.', daysAgo: 5 },
  { studentName: 'Albert Mutua', avatarSeed: 'albert', rating: 4, comment: 'Excellent presentation. The lab worksheets helped me configure my local system correctly.', daysAgo: 10 },
  { studentName: 'Faith Chepngetich', avatarSeed: 'faith', rating: 5, comment: 'I love the offline availability! I studied this during my commute with no network issues.', daysAgo: 1 },
  { studentName: 'John Mwangi', avatarSeed: 'john', rating: 4, comment: 'Great depth of concepts. I highly recommend the hands-on project at the end.', daysAgo: 14 },
  { studentName: 'Grace Otieno', avatarSeed: 'grace', rating: 5, comment: 'Perfect course for TVET certification preparation. Everything is well-organized.', daysAgo: 3 },
  { studentName: 'Brian Kipkemboi', avatarSeed: 'brian', rating: 5, comment: 'Best explanation of complex diagrams. The instructor is very clear and concise.', daysAgo: 7 },
  { studentName: 'Mercy Wambui', avatarSeed: 'mercy', rating: 4, comment: 'Very practical and engaging. A few minor typos in cheat sheets, but overall superb.', daysAgo: 12 },
  { studentName: 'Kevin Onyango', avatarSeed: 'kevin', rating: 5, comment: 'A complete masterclass. It helped me land an internship in my field!', daysAgo: 8 },
  { studentName: 'Joy Cherotich', avatarSeed: 'joy', rating: 5, comment: 'Structured perfectly. The embedded videos were of extremely high quality.', daysAgo: 4 },
];

export const ANNOUNCEMENTS_POOL = [
  {
    title: 'Offline Sync Integration Completed',
    message: 'All TVET courses can now be synced to your tablet and laptop databases for offline learning in rural labs.',
    type: 'success' as const,
    authorName: 'System Administrator',
    daysAgo: 1,
  },
  {
    title: 'Upcoming National TVET Engineering Challenge',
    message: 'Submit your practical projects by next Friday to qualify for the national innovation awards.',
    type: 'urgent' as const,
    authorName: 'Dr. Sarah Mitchell',
    daysAgo: 3,
  },
  {
    title: 'New Solar PV Mounting Workshop',
    message: 'Join us this Wednesday at the main lab for hands-on mounting tutorials.',
    type: 'info' as const,
    authorName: 'Peter Kamau',
    daysAgo: 5,
  },
  {
    title: 'Maintenance: Offline Server Upgrade',
    message: 'Local server sync will be down briefly on Sunday at 2:00 AM for database updates.',
    type: 'warning' as const,
    authorName: 'System Administrator',
    daysAgo: 6,
  },
];

export const ACHIEVEMENTS_POOL = [
  { id: 'ach_first_steps', type: 'progress', title: 'First Steps', description: 'Complete your first lesson', icon: '🚀', xpReward: 100 },
  { id: 'ach_streak_3', type: 'streak', title: 'Triathlete', description: 'Maintain a 3-day study streak', icon: '🔥', xpReward: 200 },
  { id: 'ach_streak_7', type: 'streak', title: 'Unstoppable', description: 'Maintain a 7-day study streak', icon: '⚡', xpReward: 500 },
  { id: 'ach_course_master', type: 'completion', title: 'Course Master', description: 'Complete a full professional course with 100%', icon: '🎓', xpReward: 1000 },
  { id: 'ach_quiz_champ', type: 'quiz', title: 'Quiz Champion', description: 'Get a perfect 100% on any quiz', icon: '🏆', xpReward: 300 },
  { id: 'ach_offline_warrior', type: 'offline', title: 'Offline Warrior', description: 'Download 3 or more courses for offline access', icon: '💾', xpReward: 250 },
  { id: 'ach_early_bird', type: 'time', title: 'Early Bird', description: 'Complete a lesson before 7:00 AM', icon: '🌅', xpReward: 150 },
  { id: 'ach_night_owl', type: 'time', title: 'Night Owl', description: 'Study after 10:00 PM', icon: '🦉', xpReward: 150 },
];
