import { api } from "./api";

export interface EnrollmentItem {
  _id: string;
  courseId: string;
  courseTitle: string;
  category: string;
  thumbnail: string;
  mentor: string;
  mentorCompany?: string;
  batch: string;
  status: "active" | "completed" | "paused";
  enrolledAt: string;
}

export interface CourseProgress {
  courseId: string;
  completedLectures: string[];
  completedAssignments: string[];
  progressPercent: number;
  currentLectureId?: string;
  totalTimeSpentMinutes: number;
  lastActiveAt?: string;
}

export interface RecordedLecture {
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
}

export interface AssignmentSubmission {
  studentEmail: string;
  studentName: string;
  githubUrl: string;
  liveDemoUrl?: string;
  notes?: string;
  submittedAt: string;
  grade?: string;
  score?: number;
  feedback?: string;
  status: "submitted" | "under_review" | "evaluated" | "resubmission_required";
}

export interface AssignmentItem {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  moduleTitle: string;
  deadline: string;
  maxScore: number;
  requirements: string[];
  starterRepoUrl?: string;
  submissions?: AssignmentSubmission[];
  studentSubmission?: AssignmentSubmission | null;
}

export interface CertificateItem {
  _id?: string;
  id: string;
  certificateId: string;
  courseName: string;
  issueDate: string;
  grade: string;
  credentialUrl: string;
  downloadUrl: string;
  skills: string[];
}

export interface UpcomingClassItem {
  id: string;
  title: string;
  date: string;
  time: string;
  course: string;
  instructor: string;
  meetLink: string;
}

export interface DashboardSummary {
  student: {
    name: string;
    email: string;
    avatar: string;
    headline: string;
    enrolledSince: string;
  };
  metrics: {
    activeCoursesCount: number;
    completedCourses: number;
    overallProgress: number;
    totalWatchTimeHours: number;
    activeCertificates: number;
    pendingAssignments: number;
  };
  enrollments: EnrollmentItem[];
  progress: CourseProgress[];
  recentLectures: RecordedLecture[];
  assignments: AssignmentItem[];
  certificates: CertificateItem[];
  upcomingClasses: UpcomingClassItem[];
}

export const studentDashboardService = {
  async getDashboardSummary(email?: string): Promise<any> {
    const params = email ? { email } : {};
    const res = await api.get("/student/dashboard", { params });
    return res.data.data || res.data;
  },

  async getCourses(): Promise<any[]> {
    const res = await api.get("/student/courses");
    return res.data.courses || res.data.enrollments || [];
  },

  async getStudentCourses(): Promise<{ success: boolean; count: number; courses: any[] }> {
    const res = await api.get("/student/courses");
    return {
      success: true,
      count: (res.data.courses || res.data.enrollments || []).length,
      courses: res.data.courses || res.data.enrollments || [],
    };
  },

  async getStudentProgress(): Promise<any> {
    const res = await api.get("/student/progress");
    return res.data;
  },

  async getEnrollments(): Promise<EnrollmentItem[]> {
    const res = await api.get("/student/enrollments");
    return res.data.enrollments || [];
  },

  async createEnrollment(data: {
    courseId: string;
    courseTitle: string;
    category?: string;
    mentor?: string;
    thumbnail?: string;
  }): Promise<EnrollmentItem> {
    const res = await api.post("/student/enrollments", data);
    return res.data.enrollment;
  },

  async getProgress(courseId: string): Promise<CourseProgress> {
    const res = await api.get(`/student/progress/${courseId}`);
    return res.data.progress;
  },

  async markLectureCompleted(
    courseId: string,
    lectureId: string,
    completed: boolean = true
  ): Promise<CourseProgress> {
    const res = await api.post("/student/progress/mark-lecture", {
      courseId,
      lectureId,
      completed,
    });
    return res.data.progress;
  },

  async getLectures(params?: {
    courseId?: string;
    moduleNumber?: number;
    search?: string;
  }): Promise<RecordedLecture[]> {
    const res = await api.get("/student/lectures", { params });
    return res.data.lectures || res.data.data || [];
  },

  async getLectureById(id: string): Promise<RecordedLecture> {
    const res = await api.get(`/student/lectures/${id}`);
    return res.data.lecture || res.data.data;
  },

  async getAssignments(courseId?: string): Promise<AssignmentItem[]> {
    const params = courseId ? { courseId } : {};
    const res = await api.get("/student/assignments", { params });
    return res.data.assignments || res.data.data || [];
  },

  async submitAssignment(
    assignmentId: string,
    payload: { githubUrl: string; liveDemoUrl?: string; notes?: string }
  ): Promise<{ success: boolean; message: string; assignment: AssignmentItem }> {
    const res = await api.post(`/student/assignments/${assignmentId}/submit`, payload);
    return res.data;
  },

  // ================= Sprint 4.2 Video LMS APIs =================
  async getCourseDetails(courseId: string): Promise<{
    success: boolean;
    course: any;
    progress: {
      progressPercent: number;
      completedLessons: string[];
      completedCount: number;
      totalLessons: number;
      currentLesson: string;
      lastAccessed: string;
    };
    modulesCount: number;
    enrolled: boolean;
  }> {
    const res = await api.get(`/student/course/${courseId}`);
    return res.data;
  },

  async getCourseModules(courseId: string): Promise<{
    success: boolean;
    courseId: string;
    modulesCount: number;
    modules: any[];
  }> {
    const res = await api.get(`/student/course/${courseId}/modules`);
    return res.data;
  },

  async getCourseLessons(courseId: string): Promise<{
    success: boolean;
    courseId: string;
    count: number;
    lessons: any[];
  }> {
    const res = await api.get(`/student/course/${courseId}/lessons`);
    return res.data;
  },

  async updateCourseProgress(
    courseId: string,
    payload: {
      lessonId?: string;
      completed?: boolean;
      currentLessonTitle?: string;
      watchTimeSeconds?: number;
    }
  ): Promise<{
    success: boolean;
    message: string;
    progress: {
      progressPercent: number;
      completedLessons: string[];
      completedCount: number;
      totalLessons: number;
      currentLesson: string;
      learningHours: number;
      lastAccessed: string;
    };
  }> {
    const res = await api.patch(`/student/course/${courseId}/progress`, payload);
    return res.data;
  },

  async submitCourseAssignment(
    courseId: string,
    payload: {
      assignmentId: string;
      githubUrl?: string;
      liveDemoUrl?: string;
      notes?: string;
      fileUrl?: string;
      fileName?: string;
    }
  ): Promise<{
    success: boolean;
    message: string;
    submission: any;
  }> {
    const res = await api.post(`/student/course/${courseId}/assignment`, payload);
    return res.data;
  },

  async uploadAssignment(payload: {
    courseId?: string;
    assignmentId?: string;
    githubUrl?: string;
    liveDemoUrl?: string;
    notes?: string;
    fileUrl?: string;
    fileName?: string;
  }): Promise<{ success: boolean; message: string; submission: any }> {
    const res = await api.post("/assignment/upload", payload);
    return res.data;
  },

  async getNotifications(): Promise<any[]> {
    try {
      const res = await api.get("/student/notifications");
      return res.data.notifications || res.data.data || [];
    } catch {
      const fallback = await api.get("/notifications");
      return fallback.data.notifications || fallback.data.data || [];
    }
  },

  async getCertificates(): Promise<any[]> {
    const res = await api.get("/certificates");
    return res.data.certificates || res.data.data || [];
  },
};

export default studentDashboardService;
