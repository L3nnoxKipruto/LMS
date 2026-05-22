// Local Storage wrapper with safety constraints
export const storage = {
  get: <T>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') return fallback;
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch (err) {
      console.warn(`Error reading localStorage key "${key}":`, err);
      return fallback;
    }
  },

  set: (key: string, data: any): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.error(`Error writing localStorage key "${key}":`, err);
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error(`Error deleting localStorage key "${key}":`, err);
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.clear();
    } catch (err) {
      console.error('Error clearing localStorage:', err);
    }
  }
};
