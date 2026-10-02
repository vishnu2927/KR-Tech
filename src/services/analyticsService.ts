import api from "./api";

export interface RevenueWidget {
  totalRevenue: number;
  currency: string;
  totalTransactions: number;
  avgOrderValue: number;
  growthPercent: string;
  recentPayments: Array<{
    _id: string;
    userName: string;
    userEmail: string;
    courseTitle: string;
    amount: number;
    method: string;
    createdAt: string;
    status: string;
    paymentId: string;
  }>;
}

export interface LeadsWidget {
  totalLeads: number;
  todayLeads: number;
  scheduledDemos: number;
  conversionRate: string;
  statusBreakdown: Array<{ _id: string; count: number }>;
}

export interface StudentsWidget {
  totalStudents: number;
  activeEnrollments: number;
  completionRate: string;
  certificationRate: string;
}

export interface PaymentsWidget {
  totalCaptured: number;
  totalFailed: number;
  totalAttempts: number;
  successRate: string;
  currency: string;
}

export interface PopularCourseWidget {
  _id: string;
  courseTitle?: string;
  courseId?: string;
  category?: string;
  studentsCount: number;
  mentor?: string;
  rating?: number;
  price?: string;
}

export interface DailySignupsWidget {
  todaySignups: number;
  sevenDayAvg: string;
  totalUsers: number;
  growthPercent: string;
}

export interface AnalyticsWidgetsData {
  revenue: RevenueWidget;
  leads: LeadsWidget;
  students: StudentsWidget;
  payments: PaymentsWidget;
  popularCourses: PopularCourseWidget[];
  dailySignups: DailySignupsWidget;
}

export interface RevenueTrendItem {
  date: string;
  revenue: number;
  orders: number;
  avgOrder?: number;
}

export interface SignupsTrendItem {
  date: string;
  signups: number;
}

export interface CategoryDistributionItem {
  name: string;
  value: number;
  students: number;
  color: string;
}

export interface PopularCourseBarItem {
  name: string;
  fullName: string;
  category: string;
  students: number;
  revenue: number;
  rating: number;
}

export interface PaymentMethodItem {
  name: string;
  rawMethod: string;
  count: number;
  totalAmount: number;
  color: string;
}

export const analyticsService = {
  // Fetch all 6 overview KPI widgets
  async getWidgets(): Promise<AnalyticsWidgetsData> {
    try {
      const response = await api.get("/analytics/widgets");
      return response.data?.widgets;
    } catch (error) {
      console.error("Failed to fetch analytics widgets:", error);
      throw error;
    }
  },

  // Fetch Revenue & Orders timeline for Line Chart
  async getRevenueTrend(days: number = 30): Promise<RevenueTrendItem[]> {
    try {
      const response = await api.get("/analytics/revenue-trend", { params: { days } });
      return response.data?.trend || [];
    } catch (error) {
      console.error("Failed to fetch revenue trend:", error);
      throw error;
    }
  },

  // Fetch Daily Signups timeline for Line Chart
  async getSignupsTrend(days: number = 30): Promise<SignupsTrendItem[]> {
    try {
      const response = await api.get("/analytics/signups-trend", { params: { days } });
      return response.data?.trend || [];
    } catch (error) {
      console.error("Failed to fetch signups trend:", error);
      throw error;
    }
  },

  // Fetch Category Distribution for Pie / Donut Chart
  async getCategoryDistribution(): Promise<CategoryDistributionItem[]> {
    try {
      const response = await api.get("/analytics/category-distribution");
      return response.data?.distribution || [];
    } catch (error) {
      console.error("Failed to fetch category distribution:", error);
      throw error;
    }
  },

  // Fetch Popular Courses for Bar Chart
  async getPopularCourses(limit: number = 7): Promise<PopularCourseBarItem[]> {
    try {
      const response = await api.get("/analytics/popular-courses", { params: { limit } });
      return response.data?.courses || [];
    } catch (error) {
      console.error("Failed to fetch popular courses:", error);
      throw error;
    }
  },

  // Fetch Payment Methods distribution for Pie Chart
  async getPaymentMethods(): Promise<PaymentMethodItem[]> {
    try {
      const response = await api.get("/analytics/payment-methods");
      return response.data?.methods || [];
    } catch (error) {
      console.error("Failed to fetch payment methods:", error);
      throw error;
    }
  },
};

export default analyticsService;
