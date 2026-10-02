import api from "./api";

export interface LectureChapter {
  id?: string;
  title: string;
  timestamp: string; // e.g., "08:30"
  seconds: number;   // e.g., 510
  summary?: string;
}

export interface LectureAttachment {
  id?: string;
  _id?: string;
  name: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  downloadCount?: number;
}

export interface LectureResource {
  title: string;
  url: string;
  type: string;
}

export interface UserLectureProgress {
  watchedSeconds: number;
  durationSeconds: number;
  progressPercent: number;
  completed: boolean;
  lastWatchedAt?: string | null;
  personalNotes?: string;
}

export interface LectureDetail {
  _id: string;
  courseId: string;
  moduleNumber: number;
  moduleTitle: string;
  lectureNumber: number;
  title: string;
  description: string;
  duration: string;
  durationMinutes: number;
  videoUrl: string;
  thumbnail: string;
  notesUrl: string;
  notesFileName: string;
  recordedDate: string;
  instructor: string;
  tags: string[];
  chapters?: LectureChapter[];
  notes?: string;
  attachments?: LectureAttachment[];
  resources?: LectureResource[];
  userProgress?: UserLectureProgress;
}

export interface ContinueWatchingItem {
  lectureId: string;
  courseId: string;
  title: string;
  courseTitle: string;
  thumbnail: string;
  instructor: string;
  watchedSeconds: number;
  durationSeconds: number;
  progressPercent: number;
  resumeTimestamp: string;
  lastWatchedAt: string;
  videoUrl: string;
  chapters?: LectureChapter[];
}

export interface WatchHistoryItem {
  _id: string;
  userEmail: string;
  lectureId: string;
  courseId: string;
  lectureTitle: string;
  courseTitle: string;
  thumbnail: string;
  instructor: string;
  watchedSeconds: number;
  durationSeconds: number;
  progressPercent: number;
  completed: boolean;
  lastWatchedAt: string;
  personalNotes?: string;
}

export const lecturePortalService = {
  // 1. Get lectures with filters & student watch state
  async getLectures(params?: {
    courseId?: string;
    search?: string;
    moduleNumber?: number;
    email?: string;
  }): Promise<LectureDetail[]> {
    try {
      const response = await api.get("/portal/lectures", { params });
      return response.data?.lectures || [];
    } catch (error) {
      console.error("Failed to fetch lectures:", error);
      throw error;
    }
  },

  // 2. Get single lecture details (chapters, notes, attachments, user progress)
  async getLectureById(id: string, email?: string): Promise<LectureDetail> {
    try {
      const response = await api.get(`/portal/lectures/${id}`, {
        params: email ? { email } : undefined,
      });
      return response.data?.lecture;
    } catch (error) {
      console.error(`Failed to fetch lecture ${id}:`, error);
      throw error;
    }
  },

  // 3. Get in-progress lectures for Continue Watching shelf
  async getContinueWatching(email?: string): Promise<ContinueWatchingItem[]> {
    try {
      const response = await api.get("/portal/lectures/continue-watching", {
        params: email ? { email } : undefined,
      });
      return response.data?.items || [];
    } catch (error) {
      console.error("Failed to fetch continue watching items:", error);
      throw error;
    }
  },

  // 4. Update playback progress
  async updateWatchProgress(
    lectureId: string,
    payload: {
      email?: string;
      watchedSeconds: number;
      durationSeconds?: number;
      completed?: boolean;
    }
  ): Promise<{ success: boolean; progress: UserLectureProgress }> {
    try {
      const response = await api.post(`/portal/lectures/${lectureId}/progress`, payload);
      return response.data;
    } catch (error) {
      console.error("Failed to update watch progress:", error);
      throw error;
    }
  },

  // 5. Save student personal lecture notes
  async saveStudentNotes(
    lectureId: string,
    notes: string,
    email?: string
  ): Promise<{ success: boolean; message: string; notes: string }> {
    try {
      const response = await api.post(`/portal/lectures/${lectureId}/notes`, {
        notes,
        email,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to save student notes:", error);
      throw error;
    }
  },

  // 6. Download attachment & increment counter
  async downloadAttachment(
    lectureId: string,
    attachmentId: string
  ): Promise<{ success: boolean; downloadCount: number; fileUrl: string; fileName: string }> {
    try {
      const response = await api.post(
        `/portal/lectures/${lectureId}/attachments/${attachmentId}/download`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to download attachment:", error);
      throw error;
    }
  },

  // 7. Get user watch history
  async getWatchHistory(email?: string): Promise<WatchHistoryItem[]> {
    try {
      const response = await api.get("/portal/lectures/history", {
        params: email ? { email } : undefined,
      });
      return response.data?.history || [];
    } catch (error) {
      console.error("Failed to fetch watch history:", error);
      throw error;
    }
  },
};

export default lecturePortalService;
