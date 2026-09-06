export type LeadStatus = "New" | "Contacted" | "Scheduled" | "Completed";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  timeSlot: string;
  timezone: string;
  message?: string;
  status: LeadStatus;
  createdAt: string;
}

export interface LeadStats {
  totalLeads: number;
  todayLeads: number;
  demoScheduled: number;
  followUpsPending: number;
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

// Helper to load leads from LocalStorage or default initial dataset
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

// Helper to save leads to LocalStorage
function saveLeadsToStorage(leads: Lead[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch (e) {
    console.error("Failed to save leads to storage", e);
  }
}

/**
 * Lead Service API Layer
 */
export const leadService = {
  /**
   * Fetch all leads
   */
  async getAllLeads(): Promise<Lead[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(loadLeadsFromStorage());
      }, 150);
    });
  },

  /**
   * Create a new lead from booking forms
   */
  async createLead(data: Omit<Lead, "id" | "status" | "createdAt">): Promise<Lead> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const leads = loadLeadsFromStorage();
        const newLead: Lead = {
          ...data,
          id: `lead-${Date.now()}`,
          status: "New",
          createdAt: new Date().toISOString(),
        };
        const updated = [newLead, ...leads];
        saveLeadsToStorage(updated);
        resolve(newLead);
      }, 200);
    });
  },

  /**
   * Update lead status (New, Contacted, Scheduled, Completed)
   */
  async updateLeadStatus(id: string, status: LeadStatus): Promise<Lead | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const leads = loadLeadsFromStorage();
        const index = leads.findIndex((l) => l.id === id);
        if (index === -1) {
          resolve(null);
          return;
        }
        leads[index] = { ...leads[index], status };
        saveLeadsToStorage(leads);
        resolve(leads[index]);
      }, 150);
    });
  },

  /**
   * Get lead statistics for Admin Dashboard metrics
   */
  async getLeadStats(): Promise<LeadStats> {
    const leads = await this.getAllLeads();
    const today = new Date().toDateString();

    const todayLeads = leads.filter((l) => new Date(l.createdAt).toDateString() === today).length;
    const demoScheduled = leads.filter((l) => l.status === "Scheduled").length;
    const followUpsPending = leads.filter((l) => l.status === "New" || l.status === "Contacted").length;

    return {
      totalLeads: leads.length,
      todayLeads,
      demoScheduled,
      followUpsPending,
    };
  },
};
