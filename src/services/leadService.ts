import api from "./api";

export type LeadStatus = "New" | "Contacted" | "Scheduled" | "Completed";

export interface Lead {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  preferredTime?: string;
  timeSlot?: string;
  timezone?: string;
  timeZone?: string;
  message?: string;
  status: LeadStatus;
  notes?: string;
  bookingId?: string;
  createdAt: string;
}

export interface CreateLeadResult {
  success: boolean;
  lead: Lead;
  bookingId: string;
  message: string;
  isDuplicate?: boolean;
}

export interface LeadStats {
  totalLeads: number;
  todayLeads: number;
  demoScheduled: number;
  followUpsPending: number;
  totalCourses?: number;
  totalMentors?: number;
  totalStudents?: number;
}

const STORAGE_KEY = "kr_tech_leads_v1";

const INITIAL_MOCK_LEADS: Lead[] = [
  {
    id: "lead-101",
    name: "Aakash Sharma",
    email: "aakash.s@gmail.com",
    phone: "+91 98765 43210",
    course: "Complete Java Backend (Spring Boot 3.x)",
    timeSlot: "Evening (7:00 PM - 9:00 PM IST)",
    timezone: "IST (India · UTC+5:30)",
    message: "Interested in 1:1 mentorship for microservices architecture.",
    status: "New",
    createdAt: new Date().toISOString(),
  },
  {
    id: "lead-102",
    name: "Sneha Reddy",
    email: "sneha.reddy@outlook.com",
    phone: "+91 98123 45678",
    course: "MERN Stack Bootcamp (React 19, Next.js)",
    timeSlot: "Morning (10:00 AM - 12:00 PM IST)",
    timezone: "IST (India · UTC+5:30)",
    message: "Want to transition from frontend to full stack development.",
    status: "Scheduled",
    createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
  },
  {
    id: "lead-103",
    name: "Rohan Varma",
    email: "rohan.varma@techmail.com",
    phone: "+91 99887 66554",
    course: "AI & Machine Learning with Python (LLMs & PyTorch)",
    timeSlot: "Night (8:30 PM - 10:30 PM IST)",
    timezone: "EST (USA East · UTC-5)",
    message: "Looking for real-world project mentorship on fine-tuning LLMs.",
    status: "Contacted",
    createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
  },
  {
    id: "lead-104",
    name: "Pooja Hegde",
    email: "pooja.h@yahoo.com",
    phone: "+91 91234 56789",
    course: "DSA & Problem Solving (Java/C++)",
    timeSlot: "Weekend Special Slot",
    timezone: "IST (India · UTC+5:30)",
    message: "Need 1:1 doubt solving for Dynamic Programming and Graphs.",
    status: "Completed",
    createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
  },
  {
    id: "lead-105",
    name: "Amitabh Sen",
    email: "amitabh.sen@corp.com",
    phone: "+91 97654 32109",
    course: "Data Science & Business Analytics",
    timeSlot: "Evening (6:00 PM - 8:00 PM IST)",
    timezone: "GMT / BST (UK & Europe)",
    message: "Need guidance on PowerBI DAX and SQL statistical analysis.",
    status: "New",
    createdAt: new Date().toISOString(),
  },
];

// LocalStorage helpers for seamless offline/dev resiliency
function loadLeadsFromStorage(): Lead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_LEADS));
      return INITIAL_MOCK_LEADS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_LEADS;
  }
}

function saveLeadsToStorage(leads: Lead[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch (e) {
    console.error("Failed to save leads to storage", e);
  }
}

/**
 * Lead Service API Layer with Axios and backend integration
 */
export const leadService = {
  /**
   * Fetch all leads
   */
  async getAllLeads(params?: { status?: string; search?: string }): Promise<Lead[]> {
    try {
      const res = await api.get<{ success: boolean; leads: any[] }>("/leads", { params });
      if (res.data?.leads) {
        return res.data.leads.map((l) => ({
          ...l,
          id: l._id || l.id,
          timeSlot: l.preferredTime || l.timeSlot || "Evening Slot",
          timezone: l.timeZone || l.timezone || "IST (UTC+5:30)",
        }));
      }
    } catch {
      // Fallback to local storage
    }
    const local = loadLeadsFromStorage();
    if (params?.status && params.status !== "All") {
      return local.filter((l) => l.status === params.status);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      return local.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.phone.toLowerCase().includes(q) ||
          l.course.toLowerCase().includes(q)
      );
    }
    return local;
  },

  /**
   * Create a new lead from booking forms with validation, duplicate check, and bookingId
   */
  async createLead(data: {
    name: string;
    email: string;
    phone: string;
    course: string;
    timeSlot?: string;
    preferredTime?: string;
    timezone?: string;
    timeZone?: string;
    message?: string;
  }): Promise<CreateLeadResult> {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      course: data.course,
      preferredTime: data.timeSlot || data.preferredTime || "Evening (6:00 PM - 9:00 PM)",
      timeZone: data.timezone || data.timeZone || "IST (UTC+5:30)",
      message: data.message || "",
    };

    try {
      const res = await api.post<{ success: boolean; lead: any; bookingId: string; message: string; isDuplicate?: boolean }>("/leads", payload);
      if (res.data?.lead) {
        const lead: Lead = {
          ...res.data.lead,
          id: res.data.lead._id || res.data.lead.id,
          bookingId: res.data.bookingId || res.data.lead.bookingId,
          timeSlot: res.data.lead.preferredTime,
          timezone: res.data.lead.timeZone,
        };
        // Update local cache
        const local = loadLeadsFromStorage();
        saveLeadsToStorage([lead, ...local.filter((l) => l.email !== lead.email)]);
        return {
          success: true,
          lead,
          bookingId: res.data.bookingId || lead.bookingId || `KRDEMO-${Math.floor(100000 + Math.random() * 900000)}`,
          message: res.data.message || "1:1 Live Demo booked successfully!",
        };
      }
    } catch (err: any) {
      if (err.response?.status === 409 && err.response?.data?.isDuplicate) {
        const dupData = err.response.data;
        return {
          success: false,
          isDuplicate: true,
          bookingId: dupData.bookingId || "KRDEMO-EXISTING",
          message: dupData.message,
          lead: dupData.lead,
        };
      }
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
    }

    const leads = loadLeadsFromStorage();
    const existing = leads.find((l) => l.email.toLowerCase() === payload.email.toLowerCase());
    if (existing) {
      return {
        success: false,
        isDuplicate: true,
        bookingId: existing.bookingId || `KRDEMO-${existing.id.slice(-6).toUpperCase()}`,
        message: `A 1:1 Live Demo is already booked for ${payload.email}. Your active Booking ID is #${existing.bookingId || 'KRDEMO-EXISTING'}.`,
        lead: existing,
      };
    }

    const bookingId = `KRDEMO-${Math.floor(100000 + Math.random() * 900000)}`;
    const newLead: Lead = {
      ...payload,
      id: `lead-${Date.now()}`,
      status: "New",
      bookingId,
      timeSlot: payload.preferredTime,
      timezone: payload.timeZone,
      createdAt: new Date().toISOString(),
    };
    saveLeadsToStorage([newLead, ...leads]);
    return {
      success: true,
      lead: newLead,
      bookingId,
      message: "1:1 Live Demo booked successfully with your mentor!",
    };
  },

  /**
   * Update lead status (New, Contacted, Scheduled, Completed)
   */
  async updateLeadStatus(id: string, status: LeadStatus, notes?: string): Promise<Lead | null> {
    try {
      const res = await api.patch<{ success: boolean; lead: any }>(`/leads/${id}`, { status, notes });
      if (res.data?.lead) {
        const lead: Lead = {
          ...res.data.lead,
          id: res.data.lead._id || res.data.lead.id,
          timeSlot: res.data.lead.preferredTime || "Evening Slot",
          timezone: res.data.lead.timeZone || "IST",
        };
        return lead;
      }
    } catch {
      // Fallback
    }

    const leads = loadLeadsFromStorage();
    const index = leads.findIndex((l) => l.id === id || l._id === id);
    if (index === -1) return null;
    leads[index] = { ...leads[index], status, ...(notes !== undefined ? { notes } : {}) };
    saveLeadsToStorage(leads);
    return leads[index];
  },

  /**
   * Delete lead
   */
  async deleteLead(id: string): Promise<boolean> {
    try {
      await api.delete(`/leads/${id}`);
    } catch {
      // Ignore
    }
    const leads = loadLeadsFromStorage().filter((l) => l.id !== id && l._id !== id);
    saveLeadsToStorage(leads);
    return true;
  },

  /**
   * Get lead statistics for Admin Dashboard metrics
   */
  async getLeadStats(): Promise<LeadStats> {
    try {
      const res = await api.get<{ success: boolean; stats: any }>("/leads/stats");
      if (res.data?.stats) {
        return {
          totalLeads: res.data.stats.totalLeads,
          todayLeads: res.data.stats.todayLeads,
          demoScheduled: res.data.stats.scheduledDemos,
          followUpsPending: res.data.stats.pendingFollowUps,
          totalCourses: res.data.stats.totalCourses,
          totalMentors: res.data.stats.totalMentors,
          totalStudents: res.data.stats.totalStudents,
        };
      }
    } catch {
      // Fallback
    }

    const leads = loadLeadsFromStorage();
    const today = new Date().toDateString();
    const todayLeads = leads.filter((l) => new Date(l.createdAt).toDateString() === today).length;
    const demoScheduled = leads.filter((l) => l.status === "Scheduled").length;
    const followUpsPending = leads.filter((l) => l.status === "New" || l.status === "Contacted").length;

    return {
      totalLeads: leads.length,
      todayLeads,
      demoScheduled,
      followUpsPending,
      totalCourses: 55,
      totalMentors: 10,
      totalStudents: 248,
    };
  },
};
