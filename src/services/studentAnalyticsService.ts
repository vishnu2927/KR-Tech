import api from "./api";

export interface BadgeItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  unlocked: boolean;
  unlockedAt?: string | null;
  progressPercent: number;
  criteria?: string;
}

export interface AttendanceHistoryItem {
  sessionId?: string;
  topic: string;
  mentorName: string;
  date: string;
  status: "Present" | "Absent" | "Excused";
  sessionType: string;
}

export interface XPActivityItem {
  title: string;
  xp: number;
  type: "lecture" | "assignment" | "streak" | "attendance" | "badge" | "bonus";
  timestamp: string;
}

export interface ModuleProgress {
  name: string;
  progress: number;
}

export interface CourseProgressDetail {
  courseId: string;
  courseTitle: string;
  category: string;
  mentor?: string;
  progressPercent: number;
  completedLectures: number;
  totalLectures: number;
  watchHours: number;
  modules: ModuleProgress[];
}

export interface StudentAnalyticsData {
  userEmail: string;
  userName: string;
  xp: number;
  level: number;
  levelTitle: string;
  xpProgress: {
    currentLevelXP: number;
    xpPerLevel: number;
    xpToNextLevel: number;
    progressPercent: number;
  };
  streak: {
    current: number;
    longest: number;
    lastActiveDate: string;
    weeklyDays: string[];
  };
  attendance: {
    attendedSessions: number;
    totalSessions: number;
    attendanceRate: number;
    history: AttendanceHistoryItem[];
  };
  badges: BadgeItem[];
  xpActivities: XPActivityItem[];
  courses: CourseProgressDetail[];
  overallCurriculumCompletion: number;
}

export const studentAnalyticsService = {
  // Fetch full student progress & learning analytics
  async getAnalytics(email?: string): Promise<StudentAnalyticsData> {
    try {
      const response = await api.get("/student/analytics", {
        params: email ? { email } : undefined,
      });
      return response.data?.analytics;
    } catch (error) {
      console.error("Failed to fetch student learning analytics:", error);
      throw error;
    }
  },

  // Award XP for learning activity
  async awardXP(activity: {
    xp?: number;
    title?: string;
    type?: "lecture" | "assignment" | "streak" | "attendance" | "badge";
  }): Promise<{ xp: number; level: number; levelTitle: string; newActivity: XPActivityItem }> {
    try {
      const response = await api.post("/student/analytics/xp", activity);
      return response.data;
    } catch (error) {
      console.error("Failed to award XP:", error);
      throw error;
    }
  },

  // Daily Streak check-in
  async checkInStreak(): Promise<{ streak: StudentAnalyticsData["streak"]; xp: number; message: string }> {
    try {
      const response = await api.post("/student/analytics/check-in");
      return response.data;
    } catch (error) {
      console.error("Failed to check-in streak:", error);
      throw error;
    }
  },

  // Fetch all badges
  async getBadges(): Promise<{ badges: BadgeItem[]; unlockedCount: number; count: number }> {
    try {
      const response = await api.get("/student/analytics/badges");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch badges:", error);
      throw error;
    }
  },
};

export default studentAnalyticsService;
