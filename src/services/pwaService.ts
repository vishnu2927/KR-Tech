import { api } from './api';
import { offlineStorage, OfflineProgressItem } from '../utils/offlineStorage';

export interface CalendarEventItem {
  id: string;
  title: string;
  type: 'live_class' | 'assignment_due' | 'contest' | 'mentorship_1on1';
  startTime: string;
  endTime: string;
  mentor: string;
  course: string;
  meetingLink?: string;
  status: string;
  color: string;
}

export interface AttendanceHeatmapDay {
  day: number;
  date: string;
  status: 'present' | 'late' | 'absent' | 'future' | 'weekend' | 'none';
  durationMinutes: number;
  sessionTitle?: string | null;
}

export interface AttendanceSummaryData {
  overallPercentage: number;
  totalClasses: number;
  attendedClasses: number;
  lateCount: number;
  absentCount: number;
  currentStreakDays: number;
  longestStreakDays: number;
  tier: string;
  badge: string;
  heatmap: AttendanceHeatmapDay[];
  recentLogs: {
    id: string;
    sessionTitle: string;
    mentor: string;
    date: string;
    joinTime: string;
    leaveTime: string;
    durationMinutes: number;
    status: string;
  }[];
}

export interface StudyReminderItem {
  _id: string;
  reminderType: string;
  time: string;
  days: string[];
  channel: string;
  isActive: boolean;
  customMessage: string;
}

export const pwaService = {
  // 1. Device Token Registration
  async registerDevice(payload: {
    endpoint: string;
    keys?: { p256dh?: string; auth?: string };
    deviceType?: string;
    browser?: string;
    os?: string;
  }) {
    const res = await api.post<{ success: boolean; message: string; device: any }>(
      '/pwa/register-device',
      payload
    );
    return res.data;
  },

  // 2. Sync Offline Progress
  async syncProgress(progressBatch: OfflineProgressItem[]) {
    const res = await api.post<{ success: boolean; message: string; count: number }>(
      '/pwa/sync-progress',
      { progressBatch }
    );
    return res.data;
  },

  // 3. Offline Lessons Manifest
  async getOfflineLessons() {
    const res = await api.get<{ success: boolean; count: number; lessons: any[] }>(
      '/pwa/offline-lessons'
    );
    return res.data;
  },

  // 4. Academic Calendar Schedule
  async getCalendar() {
    const res = await api.get<{ success: boolean; count: number; events: CalendarEventItem[] }>(
      '/calendar'
    );
    return res.data;
  },

  // 5. Attendance Summary & Streaks
  async getAttendance() {
    const res = await api.get<{ success: boolean; attendance: AttendanceSummaryData }>(
      '/attendance'
    );
    return res.data;
  },

  // 6. Study Reminders
  async getReminders() {
    const res = await api.get<{ success: boolean; count: number; reminders: StudyReminderItem[] }>(
      '/reminders'
    );
    return res.data;
  },

  async saveReminder(payload: Partial<StudyReminderItem>) {
    const res = await api.post<{ success: boolean; reminder: StudyReminderItem }>(
      '/reminders',
      payload
    );
    return res.data;
  },

  // Automated background sync trigger when device goes online
  async syncPendingProgress() {
    const pending = await offlineStorage.getPendingProgress();
    if (pending.length > 0) {
      try {
        console.log(`[PWA Service] Syncing ${pending.length} pending offline records...`);
        await pwaService.syncProgress(pending);
        await offlineStorage.clearPendingProgress();
        console.log('[PWA Service] Offline progress synchronized successfully to MongoDB Atlas');
        return true;
      } catch (err) {
        console.warn('[PWA Service] Background sync failed, will retry on next online event:', err);
        return false;
      }
    }
    return true;
  },
};

// Wire online event listener for automated background synchronization
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    pwaService.syncPendingProgress();
  });
}
