// IndexedDB Offline Storage Manager for KR Global Learning PWA
const DB_NAME = 'krtech_offline_db';
const DB_VERSION = 1;

export interface OfflineLessonRecord {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  module: string;
  durationMinutes: number;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  thumbnail: string;
  videoUrl: string;
  notesPdfUrl?: string;
  mentor: string;
  downloadedAt: string;
}

export interface OfflineProgressItem {
  id?: string;
  courseId: string;
  lessonId: string;
  moduleNumber?: number;
  durationWatchedSeconds: number;
  completed: boolean;
  quizScore?: number | null;
  offlineTimestamp: string;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('lessons')) {
        db.createObjectStore('lessons', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('progress')) {
        const progressStore = db.createObjectStore('progress', { keyPath: 'id', autoIncrement: true });
        progressStore.createIndex('courseLesson', ['courseId', 'lessonId'], { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const offlineStorage = {
  // Save downloaded lesson to IndexedDB
  async saveOfflineLesson(lesson: OfflineLessonRecord): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('lessons', 'readwrite');
      const store = tx.objectStore('lessons');
      store.put(lesson);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  // Get all offline lessons
  async getOfflineLessons(): Promise<OfflineLessonRecord[]> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('lessons', 'readonly');
        const store = tx.objectStore('lessons');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch {
      return [];
    }
  },

  // Delete downloaded lesson
  async removeOfflineLesson(id: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('lessons', 'readwrite');
      const store = tx.objectStore('lessons');
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  // Record watch progress offline
  async recordOfflineProgress(item: OfflineProgressItem): Promise<void> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('progress', 'readwrite');
        const store = tx.objectStore('progress');
        store.add({
          ...item,
          offlineTimestamp: new Date().toISOString(),
        });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      console.warn('Failed to record offline progress:', e);
    }
  },

  // Get pending offline progress records
  async getPendingProgress(): Promise<OfflineProgressItem[]> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('progress', 'readonly');
        const store = tx.objectStore('progress');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch {
      return [];
    }
  },

  // Clear pending progress after successful MongoDB sync
  async clearPendingProgress(): Promise<void> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('progress', 'readwrite');
        const store = tx.objectStore('progress');
        store.clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      console.warn('Failed to clear progress store:', e);
    }
  },

  // Estimate browser storage usage
  async getStorageQuota(): Promise<{ usedMB: number; totalMB: number; percentage: number }> {
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        const usedMB = Math.round((estimate.usage || 0) / (1024 * 1024));
        const totalMB = Math.round((estimate.quota || 1024 * 1024 * 1024 * 10) / (1024 * 1024));
        const percentage = totalMB > 0 ? Math.round((usedMB / totalMB) * 100) : 0;
        return { usedMB, totalMB, percentage };
      } catch {
        return { usedMB: 480, totalMB: 50000, percentage: 1 };
      }
    }
    return { usedMB: 480, totalMB: 50000, percentage: 1 };
  },
};
