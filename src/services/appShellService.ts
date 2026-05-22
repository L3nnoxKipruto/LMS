import { getIDBData, setIDBData } from './indexedDB';

type SupportTicket = {
  id: string;
  userId?: string;
  name: string;
  email: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  status: 'open' | 'resolved';
};

type UserSettings = {
  name: string;
  email: string;
  institution?: string;
  department?: string;
};

const delay = (ms: number = 180) => new Promise((resolve) => setTimeout(resolve, ms));

const keys = {
  tickets: 'jh_app_support_tickets',
  notes: (userId: string) => `jh_app_notes_${userId}`,
  settings: (userId: string) => `jh_app_settings_${userId}`,
  messages: (userId: string) => `jh_app_messages_${userId}`
};

const getCurrentUser = () => {
  const userJson = localStorage.getItem('jh_user');
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
};

const readJson = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const appShellService = {
  submitSupportTicket: async (input: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => {
    await delay(240);
    const tickets = readJson<SupportTicket[]>(keys.tickets, []);
    const nextTicket: SupportTicket = {
      ...input,
      id: `ticket_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'open'
    };
    tickets.unshift(nextTicket);
    writeJson(keys.tickets, tickets);
    await setIDBData(keys.tickets, tickets);
    return nextTicket;
  },
  getSupportTickets: async () => {
    await delay(120);
    return getIDBData<SupportTicket[]>(keys.tickets, readJson<SupportTicket[]>(keys.tickets, []));
  },
  saveUserNotes: async (notes: string) => {
    await delay(120);
    const user = getCurrentUser();
    if (!user?.id) throw new Error('Unauthorized');
    writeJson(keys.notes(user.id), notes);
    await setIDBData(keys.notes(user.id), notes);
    return { success: true };
  },
  getUserNotes: async () => {
    await delay(100);
    const user = getCurrentUser();
    if (!user?.id) return '';
    return getIDBData<string>(keys.notes(user.id), localStorage.getItem(keys.notes(user.id)) || '');
  },
  saveUserSettings: async (settings: UserSettings) => {
    await delay(180);
    const user = getCurrentUser();
    if (!user?.id) throw new Error('Unauthorized');
    const updated = { ...user, ...settings };
    localStorage.setItem('jh_user', JSON.stringify(updated));
    writeJson(keys.settings(user.id), settings);
    await setIDBData(keys.settings(user.id), settings);
    return updated;
  },
  getUserSettings: async () => {
    await delay(100);
    const user = getCurrentUser();
    if (!user?.id) return null;
    return getIDBData<UserSettings | null>(keys.settings(user.id), readJson<UserSettings | null>(keys.settings(user.id), null));
  },
  saveMessages: async (messages: any[]) => {
    await delay(80);
    const user = getCurrentUser();
    if (!user?.id) throw new Error('Unauthorized');
    writeJson(keys.messages(user.id), messages);
    await setIDBData(keys.messages(user.id), messages);
    return { success: true };
  },
  getMessages: async () => {
    await delay(80);
    const user = getCurrentUser();
    if (!user?.id) return [];
    return getIDBData<any[]>(keys.messages(user.id), readJson<any[]>(keys.messages(user.id), []));
  }
};
