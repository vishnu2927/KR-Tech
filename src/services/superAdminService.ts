import { api } from "./api";

const devHeaders = {
  headers: {
    "x-admin-key": "krtech_admin_dev_bypass",
  },
};

export interface SuperAdminDashboardStats {
  totalStudents: number;
  activeStudents: number;
  courseRevenue: number;
  monthlyRevenue: number;
  newEnrollments: number;
  assignmentsPending: number;
  certificatesIssued: number;
  liveClassesToday: number;
  supportTickets: number;
  emailStatistics: {
    totalSent: number;
    deliveredRate: string;
    openRate: string;
    clickRate: string;
  };
}

export interface ActivityTimelineItem {
  _id: string;
  adminEmail: string;
  adminName: string;
  action: string;
  entityType: string;
  description: string;
  createdAt: string;
}

export interface StudentItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  enrolledCourses: string[];
  progress: number;
  streak: number;
  assignmentsSubmitted: number;
  certificatesEarned: number;
  totalPaid: number;
  joinedAt: string;
}

export interface LiveClassItem {
  _id: string;
  title: string;
  topic?: string;
  mentorName: string;
  scheduledAt: string;
  durationMinutes: number;
  meetingLink: string;
  attendanceCount?: number;
  status: "Upcoming" | "Live" | "Completed" | "Cancelled";
  recordingUrl?: string;
}

export interface SupportTicketItem {
  _id: string;
  ticketId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  subject: string;
  description: string;
  category: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Open" | "In-Progress" | "Resolved" | "Closed";
  assignedTo?: string;
  channel?: "Portal" | "WhatsApp" | "Live Chat" | "Email";
  createdAt: string;
}

export const superAdminService = {
  // 11.1 Dashboard
  async getDashboard() {
    const res = await api.get<{ success: boolean; stats: SuperAdminDashboardStats; recentActivityTimeline: ActivityTimelineItem[] }>(
      "/super-admin/dashboard",
      devHeaders
    );
    return res.data;
  },

  // 11.2 Student CRM
  async getStudents(params?: { search?: string; status?: string; page?: number; limit?: number }) {
    const res = await api.get<{ success: boolean; students: StudentItem[]; total: number; page: number; totalPages: number }>(
      "/super-admin/students",
      { ...devHeaders, params }
    );
    return res.data;
  },

  async updateStudentStatus(id: string, isActive: boolean) {
    const res = await api.patch<{ success: boolean; message: string; student: any }>(
      `/super-admin/students/${id}/status`,
      { isActive },
      devHeaders
    );
    return res.data;
  },

  async resetStudentPassword(id: string) {
    const res = await api.post<{ success: boolean; message: string; tempPassword?: string }>(
      `/super-admin/students/${id}/reset-password`,
      {},
      devHeaders
    );
    return res.data;
  },

  // 11.3 Course Management
  async getCourses() {
    const res = await api.get<{ success: boolean; courses: any[] }>("/super-admin/courses", devHeaders);
    return res.data;
  },

  async createCourse(data: any) {
    const res = await api.post<{ success: boolean; course: any }>("/super-admin/courses", data, devHeaders);
    return res.data;
  },

  async updateCourse(id: string, data: any) {
    const res = await api.put<{ success: boolean; course: any }>(`/super-admin/courses/${id}`, data, devHeaders);
    return res.data;
  },

  async deleteCourse(id: string) {
    const res = await api.delete<{ success: boolean; message: string }>(`/super-admin/courses/${id}`, devHeaders);
    return res.data;
  },

  async toggleCoursePublish(id: string) {
    const res = await api.patch<{ success: boolean; published: boolean; course: any }>(
      `/super-admin/courses/${id}/publish`,
      {},
      devHeaders
    );
    return res.data;
  },

  // 11.4 Lesson Management
  async getLessons(courseId: string) {
    const res = await api.get<{ success: boolean; lessons: any[] }>(`/super-admin/courses/${courseId}/lessons`, devHeaders);
    return res.data;
  },

  async createLesson(data: any) {
    const res = await api.post<{ success: boolean; lesson: any }>("/super-admin/lessons", data, devHeaders);
    return res.data;
  },

  async updateLesson(id: string, data: any) {
    const res = await api.put<{ success: boolean; lesson: any }>(`/super-admin/lessons/${id}`, data, devHeaders);
    return res.data;
  },

  async deleteLesson(id: string) {
    const res = await api.delete<{ success: boolean; message: string }>(`/super-admin/lessons/${id}`, devHeaders);
    return res.data;
  },

  // 11.5 Live Class Management
  async getLiveClasses() {
    const res = await api.get<{ success: boolean; classes: LiveClassItem[] }>("/super-admin/live-classes", devHeaders);
    return res.data;
  },

  async createLiveClass(data: any) {
    const res = await api.post<{ success: boolean; liveClass: LiveClassItem }>("/super-admin/live-classes", data, devHeaders);
    return res.data;
  },

  async updateLiveClass(id: string, data: any) {
    const res = await api.put<{ success: boolean; liveClass: LiveClassItem }>(`/super-admin/live-classes/${id}`, data, devHeaders);
    return res.data;
  },

  async triggerLiveReminder(id: string) {
    const res = await api.post<{ success: boolean; message: string }>(`/super-admin/live-classes/${id}/reminder`, {}, devHeaders);
    return res.data;
  },

  // 11.6 Assignment Management
  async getAssignments() {
    const res = await api.get<{ success: boolean; submissions: any[] }>("/super-admin/assignments", devHeaders);
    return res.data;
  },

  async gradeSubmission(id: string, score: number, status: string, mentorFeedback: string) {
    const res = await api.patch<{ success: boolean; message: string; submission: any }>(
      `/super-admin/assignments/${id}/grade`,
      { score, status, mentorFeedback },
      devHeaders
    );
    return res.data;
  },

  // 11.7 Certificate Management
  async getCertificates() {
    const res = await api.get<{ success: boolean; certificates: any[] }>("/super-admin/certificates", devHeaders);
    return res.data;
  },

  async generateCertificate(data: any) {
    const res = await api.post<{ success: boolean; certificate: any }>("/super-admin/certificates/generate", data, devHeaders);
    return res.data;
  },

  async bulkIssueCertificates(data: { batchId: string; courseTitle: string; studentIds?: string[] }) {
    const res = await api.post<{ success: boolean; message: string; issuedCount: number }>(
      "/super-admin/certificates/bulk-issue",
      data,
      devHeaders
    );
    return res.data;
  },

  // 11.8 Payment CRM
  async getPayments() {
    const res = await api.get<{ success: boolean; totalRevenue: number; payments: any[]; coupons: any[]; invoices: any[] }>(
      "/super-admin/payments",
      devHeaders
    );
    return res.data;
  },

  async processRefund(id: string, reason: string, amount: number) {
    const res = await api.post<{ success: boolean; message: string; payment: any }>(
      `/super-admin/payments/${id}/refund`,
      { reason, amount },
      devHeaders
    );
    return res.data;
  },

  // 11.9 Email CRM
  async getEmailCRM() {
    const res = await api.get<{ success: boolean; campaigns: any[]; recentLogs: any[] }>("/super-admin/email-crm", devHeaders);
    return res.data;
  },

  async sendBroadcastEmail(data: { subject: string; body: string; targetGroup: string }) {
    const res = await api.post<{ success: boolean; message: string }>("/super-admin/email-crm/broadcast", data, devHeaders);
    return res.data;
  },

  // 11.10 Support Center
  async getSupportTickets() {
    const res = await api.get<{ success: boolean; tickets: SupportTicketItem[] }>("/super-admin/support", devHeaders);
    return res.data;
  },

  async updateSupportTicket(id: string, data: Partial<SupportTicketItem>) {
    const res = await api.patch<{ success: boolean; ticket: SupportTicketItem }>(`/super-admin/support/${id}`, data, devHeaders);
    return res.data;
  },

  // 11.11 Content Library
  async getContentLibrary() {
    const res = await api.get<{ success: boolean; resources: any[] }>("/super-admin/content", devHeaders);
    return res.data;
  },

  async createContentResource(data: any) {
    const res = await api.post<{ success: boolean; resource: any }>("/super-admin/content", data, devHeaders);
    return res.data;
  },

  async deleteContentResource(id: string) {
    const res = await api.delete<{ success: boolean; message: string }>(`/super-admin/content/${id}`, devHeaders);
    return res.data;
  },

  // 11.12 Analytics Center
  async getAnalytics() {
    const res = await api.get<{ success: boolean; charts: any }>("/super-admin/analytics", devHeaders);
    return res.data;
  },

  // 11.13 Role Management
  async getRoles() {
    const res = await api.get<{ success: boolean; roles: any[]; teamMembers: any[] }>("/super-admin/roles", devHeaders);
    return res.data;
  },

  async assignRole(userId: string, role: string) {
    const res = await api.post<{ success: boolean; message: string; user: any }>("/super-admin/roles/assign", { userId, role }, devHeaders);
    return res.data;
  },

  // 11.14 Settings Center
  async getSettings() {
    const res = await api.get<{ success: boolean; settings: any }>("/super-admin/settings", devHeaders);
    return res.data;
  },

  async updateSettings(data: any) {
    const res = await api.put<{ success: boolean; message: string; settings: any }>("/super-admin/settings", data, devHeaders);
    return res.data;
  },

  // 11.15 Activity Logs
  async getActivityLogs(params?: { page?: number; limit?: number; action?: string; entityType?: string }) {
    const res = await api.get<{ success: boolean; logs: ActivityTimelineItem[]; total: number; page: number; totalPages: number }>(
      "/super-admin/activity-logs",
      { ...devHeaders, params }
    );
    return res.data;
  },
};
