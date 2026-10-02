import { api } from './api';

export interface SupportTicketMessage {
  sender: string;
  senderRole: 'student' | 'admin' | 'system';
  message: string;
  timestamp: string;
}

export interface SupportTicket {
  _id: string;
  ticketId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  subject: string;
  description: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Waiting Customer' | 'Resolved' | 'Closed';
  assignedTo?: {
    name: string;
    email: string;
    role: string;
  };
  messages: SupportTicketMessage[];
  slaDeadline: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MentorCRMRecord {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  specialization: string;
  experience: string;
  rating: number;
  activeBatches: number;
  studentsEnrolled: number;
  hourlyRate: number;
  monthlyPayout: number;
  status: 'Active' | 'On Leave' | 'Pending';
  avatar: string;
}

export interface InvoiceRecord {
  _id: string;
  invoiceNumber: string;
  paymentId: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: {
    courseId: string;
    courseTitle: string;
    unitPrice: number;
    quantity: number;
    taxRate: number;
    taxAmount: number;
    total: number;
  }[];
  subtotal: number;
  taxTotal: number;
  totalAmount: number;
  status: 'Paid' | 'Pending' | 'Refunded' | 'Void';
  paymentMethod: string;
  issueDate: string;
}

export interface FinanceSummary {
  mrr: number;
  arr: number;
  totalRevenue: number;
  netRevenue: number;
  gstCollected: number;
  totalTransactions: number;
  avgOrderValue: number;
  refundsCount: number;
  refundsAmount: number;
  paymentMethodBreakdown: {
    method: string;
    share: number;
    revenue: number;
  }[];
  monthlyTrajectory: {
    month: string;
    revenue: number;
    expenses: number;
    net: number;
  }[];
}

export interface MarketingAnalytics {
  executiveSummary: {
    title: string;
    generatedAt: string;
    highlights: string[];
    criticalAlerts: string[];
    strategicPriorities: string[];
  };
  kpis: {
    cac: number;
    ltv: number;
    ltvToCacRatio: number;
    monthlyAdSpend: number;
    retentionRate: number;
    courseCompletionRate: number;
    certificationRate: number;
    npsScore: number;
  };
  conversionFunnel: {
    visitors: number;
    leadsGenerated: number;
    demosBooked: number;
    paidEnrollments: number;
    conversionRatePercent: number;
    stepConversion: {
      stage: string;
      count: number;
      percentage: number;
    }[];
  };
  channels: {
    name: string;
    spend: number;
    leads: number;
    conversions: number;
    roi: number;
  }[];
}

export const adminSuiteService = {
  // Support Desk APIs
  async getTickets(params?: { status?: string; priority?: string; category?: string; search?: string }) {
    const res = await api.get<{ success: boolean; count: number; stats: any; tickets: SupportTicket[] }>(
      '/support',
      { params }
    );
    return res.data;
  },

  async createTicket(payload: {
    studentName: string;
    studentEmail: string;
    studentPhone?: string;
    subject: string;
    description: string;
    category?: string;
    priority?: string;
  }) {
    const res = await api.post<{ success: boolean; ticket: SupportTicket }>('/support/create', payload);
    return res.data;
  },

  async updateTicket(
    id: string,
    payload: {
      status?: string;
      priority?: string;
      assignedTo?: { name: string; email: string; role: string };
      replyMessage?: string;
      tags?: string[];
    }
  ) {
    const res = await api.patch<{ success: boolean; ticket: SupportTicket }>(`/support/${id}`, payload);
    return res.data;
  },

  async getMyTickets() {
    const res = await api.get<{ success: boolean; count: number; tickets: SupportTicket[] }>('/support/me');
    return res.data;
  },

  // Mentor CRM APIs
  async getMentorCRM() {
    const res = await api.get<{
      success: boolean;
      count: number;
      summary: any;
      mentors: MentorCRMRecord[];
    }>('/admin/mentors');
    return res.data;
  },

  // Finance APIs
  async getFinanceDashboard() {
    const res = await api.get<{
      success: boolean;
      summary: FinanceSummary;
      invoices: InvoiceRecord[];
      recentPayments: any[];
    }>('/admin/finance');
    return res.data;
  },

  // Marketing & Growth Analytics APIs
  async getGrowthAnalytics() {
    const res = await api.get<{
      success: boolean;
      analytics: MarketingAnalytics;
    }>('/admin/analytics');
    return res.data;
  },
};
