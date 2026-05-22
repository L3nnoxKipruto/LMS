import { dbAddActivityFeedItem, dbGetCourses, dbGetUsers, dbAddNotification } from '../mock-db/db';

type LiveCallback = (type: string, data: any) => void;
const listeners = new Set<LiveCallback>();

let activeCount = 482;
let intervalId: any = null;

const FAKE_MESSAGES = [
  'enrolled in the course',
  'completed a practical lesson in',
  'successfully graduated from',
  'unlocked a new achievement in',
  'submitted code for assignment in'
];

const FAKE_BADGES = ['Consistent Learner', 'Quiz Champion', 'Speed Demon', 'Perfect Score', 'Problem Solver'];

export const liveSimulationService = {
  subscribe: (cb: LiveCallback) => {
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  },
  
  getActiveOnlineCount: (): number => {
    // Return a slightly fluctuating count
    const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
    activeCount = Math.max(120, activeCount + change);
    return activeCount;
  },

  startSimulation: () => {
    if (intervalId) return;

    intervalId = setInterval(() => {
      const users = dbGetUsers().filter(u => u.role === 'student' && u.id !== 'u1');
      const courses = dbGetCourses();
      
      if (users.length === 0 || courses.length === 0) return;

      const randomStudent = users[Math.floor(Math.random() * users.length)];
      const randomCourse = courses[Math.floor(Math.random() * courses.length)];
      const randomActionIdx = Math.floor(Math.random() * FAKE_MESSAGES.length);
      const action = FAKE_MESSAGES[randomActionIdx];

      let feedType: 'enrolled' | 'completed_lesson' | 'completed_course' | 'earned_achievement' | 'submitted_assignment' = 'enrolled';
      if (randomActionIdx === 1) feedType = 'completed_lesson';
      else if (randomActionIdx === 2) feedType = 'completed_course';
      else if (randomActionIdx === 3) feedType = 'earned_achievement';
      else if (randomActionIdx === 4) feedType = 'submitted_assignment';

      let message = `${action} ${randomCourse.title}`;
      if (feedType === 'earned_achievement') {
        const badge = FAKE_BADGES[Math.floor(Math.random() * FAKE_BADGES.length)];
        message = `unlocked the achievement: ${badge}`;
      }

      const feedItem = {
        id: `feed_live_${Date.now()}`,
        userId: randomStudent.id,
        userName: randomStudent.name,
        userAvatar: randomStudent.avatarUrl,
        type: feedType,
        message,
        courseTitle: randomCourse.title,
        courseId: randomCourse.id,
        createdAt: new Date().toISOString()
      };

      // Add to mock-db activity feed
      dbAddActivityFeedItem(feedItem);

      // Randomly notify the current user about a trending topic/announcement to make platform feel alive
      const currentUserId = 'u1';
      if (Math.random() > 0.7) {
        const announcementTitles = [
          'Instructor published new notes in Electrical Systems',
          'A student posted a discussion question in React',
          'Graduation certificates for Phase 2 are now ready',
          'Technical forum meeting scheduled for tomorrow'
        ];
        dbAddNotification(
          currentUserId, 
          'Live Update', 
          announcementTitles[Math.floor(Math.random() * announcementTitles.length)]
        );
      }

      // Notify all UI listeners
      listeners.forEach(cb => cb('feed_update', feedItem));
    }, 45000); // Trigger every 45s
  },

  stopSimulation: () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
};
