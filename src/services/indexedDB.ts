import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { SyncItem } from '../types';

interface JifunzeHubDB extends DBSchema {
  cache: {
    key: string;
    value: any;
  };
  media: {
    key: string;
    value: { id: string; blob: Blob; mimeType: string };
  };
  syncQueue: {
    key: string;
    value: SyncItem;
  };
}

let dbPromise: Promise<IDBPDatabase<JifunzeHubDB>> | null = null;

export const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<JifunzeHubDB>('jifunzehub-store', 1, {
      upgrade(db) {
        db.createObjectStore('cache');
        db.createObjectStore('media', { keyPath: 'id' });
        db.createObjectStore('syncQueue', { keyPath: 'id' });
      },
    });
  }
  return dbPromise;
};

// Unified async cache handler
export const setIDBData = async (key: string, data: any) => {
  const db = await initDB();
  await db.put('cache', data, key);
};

export const getIDBData = async <T>(key: string, defaultValue: T): Promise<T> => {
  try {
    const db = await initDB();
    const val = await db.get('cache', key);
    return val !== undefined ? val : defaultValue;
  } catch (error) {
    console.error("IndexedDB error:", error);
    return defaultValue;
  }
};

// Specialized Sync Engine Queue Operations
export const addToSyncQueue = async (item: SyncItem) => {
  const db = await initDB();
  await db.put('syncQueue', item);
};

export const getFullSyncQueue = async (): Promise<SyncItem[]> => {
  const db = await initDB();
  return db.getAll('syncQueue');
};

export const clearSyncQueue = async () => {
  const db = await initDB();
  await db.clear('syncQueue');
};

// Offline Media Playback Manager (Video/Audio/PDF Downloader)
export const storeMediaOffline = async (id: string, url: string) => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const db = await initDB();
    await db.put('media', { id, blob, mimeType: blob.type });
    return true;
  } catch (err) {
    console.error(`Failed to download media ${id}:`, err);
    return false;
  }
};

export const getOfflineMediaUrl = async (id: string): Promise<string | null> => {
  const db = await initDB();
  const media = await db.get('media', id);
  if (media && media.blob) {
    return URL.createObjectURL(media.blob);
  }
  return null;
};
