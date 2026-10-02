import { api } from "./api";

export interface WhatsAppLogItem {
  _id: string;
  recipient: string;
  template:
    | "demo_confirmation"
    | "payment_success"
    | "upcoming_batch_reminder"
    | "live_class_reminder"
    | "certificate_ready"
    | "general";
  status: "queued" | "sent" | "delivered" | "read" | "simulated" | "failed" | "retrying";
  waMessageId?: string;
  messagePreview?: string;
  parameters?: Record<string, any>;
  retryCount?: number;
  lastRetryAt?: string;
  error?: string;
  createdAt: string;
}

export interface WhatsAppStats {
  totalDispatched: number;
  sentCount: number;
  failedCount: number;
  retriedCount: number;
  deliveryRate: number;
  byTemplate: Array<{ _id: string; count: number }>;
  recentLogs: WhatsAppLogItem[];
}

export const whatsappService = {
  // 1. Get Dispatched WhatsApp Logs (Admin)
  async getWhatsAppLogs(params?: {
    page?: number;
    limit?: number;
    template?: string;
    status?: string;
    search?: string;
  }): Promise<{
    logs: WhatsAppLogItem[];
    total: number;
    pages: number;
  }> {
    try {
      const response = await api.get("/whatsapp/logs", { params });
      return {
        logs: response.data?.logs || [],
        total: response.data?.total || 0,
        pages: response.data?.pages || 1,
      };
    } catch (err) {
      console.warn("Failed to fetch WhatsApp logs:", err);
      return { logs: [], total: 0, pages: 1 };
    }
  },

  // 2. Get WhatsApp Analytics & Delivery Rate (Admin)
  async getWhatsAppStats(): Promise<WhatsAppStats> {
    try {
      const response = await api.get("/whatsapp/stats");
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
      console.warn("Failed to fetch WhatsApp stats:", err);
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

  // 3. Dispatch Test WhatsApp Message
  async sendTestWhatsApp(payload: { to: string; template: string; data?: any }) {
    const response = await api.post("/whatsapp/send-test", payload);
    return response.data;
  },

  // 4. Retry Failed WhatsApp Message
  async retryMessage(id: string) {
    const response = await api.post(`/whatsapp/retry/${id}`);
    return response.data;
  },

  // 5. Preview Template Text
  async previewTemplate(template: string): Promise<{ text: string; templateName: string }> {
    try {
      const response = await api.get(`/whatsapp/preview/${template}`);
      return {
        text: response.data?.text || "",
        templateName: response.data?.templateName || template,
      };
    } catch (err) {
      console.warn("Failed to preview WhatsApp template:", err);
      return { text: "", templateName: template };
    }
  },

  // 6. Send Certificate WhatsApp Notification
  async sendCertificateWhatsApp(payload: { phone: string; credentialId: string }) {
    const response = await api.post("/certificates/send-whatsapp", payload);
    return response.data;
  },
};

export default whatsappService;
