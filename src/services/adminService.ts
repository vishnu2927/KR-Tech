import { api } from "./api";

export interface AdminMetrics {
  totalStudents: number;
  activeStudents: number;
  totalCourses: number;
  totalMentors: number;
  totalRevenue: number;
  totalTransactions: number;
  demoLeads: number;
  totalLeads: number;
  conversionRate: string;
  growthPercent: string;
}

export interface WeeklyGrowthItem {
  week: string;
  students: number;
  revenue: number;
  leads: number;
}

export interface MonthlyRevenueItem {
  month: string;
  revenue: number;
  target: number;
  students?: number;
}

export interface LeadConversionItem {
  stage: string;
  count: number;
  fill?: string;
}

export interface AdminActivityItem {
  id: string;
  category?: string;
  title: string;
  subtitle?: string;
  detail?: string;
  timestamp: string;
  status?: string;
  icon?: string;
  badgeColor?: string;
}

export interface AdminStudentItem {
  id: string;
  _id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  progress: number;
  status: "Active" | "Completed" | "Pending";
  batch?: string;
  mentor?: string;
  joinedDate: string;
  createdAt?: string;
}

export interface AdminLeadItem {
  id: string;
  _id: string;
  name: string;
  phone: string;
  email?: string;
  course: string;
  status: string;
  source: string;
  preferredTime?: string;
  message?: string;
  createdDate: string;
  createdAt?: string;
}

export const adminService = {
  async getDashboard(): Promise<{
    metrics: AdminMetrics;
    weeklyGrowth: WeeklyGrowthItem[];
    monthlyRevenue: MonthlyRevenueItem[];
    leadConversion: LeadConversionItem[];
    recentActivity: AdminActivityItem[];
  }> {
    const res = await api.get("/admin/dashboard");
    return res.data.data;
  },

  async getStudents(params?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    count: number;
    total: number;
    students: AdminStudentItem[];
  }> {
    const res = await api.get("/admin/students", { params });
    return res.data;
  },

  async getLeads(params?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    count: number;
    total: number;
    leads: AdminLeadItem[];
  }> {
    const res = await api.get("/admin/leads", { params });
    return res.data;
  },

  async getRevenue(): Promise<{
    totalRevenue: number;
    totalTransactions: number;
    avgTicket: number;
    monthlyRevenue: MonthlyRevenueItem[];
    revenueByCourse: { courseTitle: string; totalRevenue: number; students: number }[];
    recentTransactions: any[];
  }> {
    const res = await api.get("/admin/revenue");
    return res.data.data;
  },

  async getActivity(): Promise<{
    count: number;
    activities: AdminActivityItem[];
  }> {
    const res = await api.get("/admin/activity");
    return res.data;
  },

  // Sprint 7.6: Batch Management
  async getBatches(params?: { search?: string; status?: string; page?: number; limit?: number }) {
    const res = await api.get("/batches", { params });
    return res.data;
  },

  async createBatch(batchData: any) {
    const res = await api.post("/batches", batchData);
    return res.data;
  },

  async updateBatch(id: string, batchData: any) {
    const res = await api.put(`/batches/${id}`, batchData);
    return res.data;
  },

  async deleteBatch(id: string) {
    const res = await api.delete(`/batches/${id}`);
    return res.data;
  },

  async addStudentToBatch(id: string, studentData: { name: string; email: string; phone?: string }) {
    const res = await api.post(`/batches/${id}/students`, studentData);
    return res.data;
  },

  // Sprint 7.8: Assignment Review Panel
  async getSubmissions(params?: { status?: string; courseId?: string; search?: string }) {
    const res = await api.get("/admin/submissions", { params });
    return res.data;
  },

  async reviewSubmission(id: string, reviewData: { score: number; grade: string; feedback: string; status?: string }) {
    const res = await api.patch(`/admin/submissions/${id}/review`, reviewData);
    return res.data;
  },

  // Learning Certifications & Credentials
  async getCertificationsSummary() {
    const res = await api.get("/admin/certifications");
    return res.data;
  },

  // Sprint 7.9: Certificate Generator
  async generateCertificate(data: { studentName: string; studentEmail?: string; courseTitle: string; grade?: string; completionDate?: string }) {
    const res = await api.post("/certificates/generate", data);
    return res.data;
  },
};

export default adminService;
