import { api } from "./api";

export interface EmailLogItem {
  _id: string;
  recipient: string;
  subject: string;
  template: "welcome" | "demo_booking" | "payment_success" | "certificate_delivery" | "otp_reset" | "general";
  status: "sent" | "simulated" | "failed";
  messageId?: string;
  previewUrl?: string;
  error?: string;
  retryCount?: number;
  attempts?: number;
  lastAttemptAt?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface EmailQueueStatus {
  status: string;
  driver: string;
  concurrency: number;
  activeWorkers: number;
  waitingJobs: number;
  activeJobs: number;
  failedJobs: number;
  stats: {
    completed: number;
    failed: number;
    retried: number;
    totalAdded: number;
  };
}

export interface EmailStats {
  totalDispatched: number;
  sentCount: number;
  failedCount: number;
  retriedCount?: number;
  deliveryRate: number;
  byTemplate: Array<{ _id: string; count: number }>;
  recentLogs: EmailLogItem[];
  queue?: EmailQueueStatus;
}

export const emailService = {
  // 1. Get Dispatched Email Logs (Admin)
  async getEmailLogs(params?: { page?: number; limit?: number; template?: string; status?: string; search?: string }): Promise<{
    logs: EmailLogItem[];
    total: number;
    pages: number;
  }> {
    try {
      const response = await api.get("/emails/logs", { params });
      return {
        logs: response.data?.logs || [],
        total: response.data?.total || 0,
        pages: response.data?.pages || 1,
      };
    } catch (err) {
      console.warn("Failed to fetch email logs:", err);
      return { logs: [], total: 0, pages: 1 };
    }
  },

  // 2. Get Email Statistics & Delivery Rate (Admin)
  async getEmailStats(): Promise<EmailStats> {
    try {
      const response = await api.get("/emails/stats");
      return response.data?.stats || {
        totalDispatched: 0,
        sentCount: 0,
        failedCount: 0,
        retriedCount: 0,
        deliveryRate: 100,
        byTemplate: [],
        recentLogs: [],
      };
    } catch (err) {
      console.warn("Failed to fetch email stats:", err);
      return {
        totalDispatched: 0,
        sentCount: 0,
        failedCount: 0,
        retriedCount: 0,
        deliveryRate: 100,
        byTemplate: [],
        recentLogs: [],
      };
    }
  },

  // 3. Dispatch Test Email
  async sendTestEmail(payload: { to: string; template: string; data?: any }) {
    const response = await api.post("/emails/send-test", payload);
    return response.data;
  },

  // 4. Resend / Retry Failed Email
  async resendEmail(logId: string) {
    const response = await api.post(`/emails/resend/${logId}`);
    return response.data;
  },

  // 5. Get Real-Time Queue Status
  async getQueueStatus(): Promise<EmailQueueStatus | null> {
    try {
      const response = await api.get("/emails/queue-status");
      return response.data?.queue || null;
    } catch (err) {
      console.warn("Failed to fetch queue status:", err);
      return null;
    }
  },

  // 6. Verify SMTP Transport Connection
  async verifySmtp(): Promise<any> {
    try {
      const response = await api.get("/emails/verify-smtp");
      return response.data?.smtp || null;
    } catch (err) {
      console.warn("Failed to verify SMTP:", err);
      return null;
    }
  },

  // 7. Send Official Certificate to Student via Email
  async emailCertificate(payload: { email: string; credentialId: string }) {
    const response = await api.post("/certificates/send-email", payload);
    return response.data;
  },

  // 8. Request Forgot Password OTP
  async requestForgotPasswordOtp(email: string) {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },
};

export default emailService;
