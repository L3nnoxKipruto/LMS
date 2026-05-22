import { User } from '../types';
import { dbGetUsers, dbUpdateUser } from '../mock-db/db';

const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

const getCurrentUserId = (): string => {
  const userJson = localStorage.getItem('jh_user');
  if (!userJson) return '';
  try {
    return JSON.parse(userJson).id;
  } catch {
    return '';
  }
};

export const authService = {
  getProfile: async (): Promise<User> => {
    await delay(150);
    const userId = getCurrentUserId();
    const users = dbGetUsers();
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('Unauthorized');
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.email}`,
      institution: user.institution || 'Naserian TVET Institute',
      department: user.department
    };
  },
  updateProfile: async (data: Partial<User>): Promise<User> => {
    await delay(250);
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Unauthorized');
    const updated = dbUpdateUser(userId, data);
    
    // Sync current session state
    localStorage.setItem('jh_user', JSON.stringify(updated));
    return updated;
  }
};
