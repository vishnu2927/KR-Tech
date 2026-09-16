import api from "./api";

export interface Mentor {
  id: string;
  _id?: string;
  name: string;
  role: string;
  company: string;
  specialization: string;
  domain: string;
  exp: string;
  rating: number;
  reviewsCount: number;
  studentsCount: string;
  image: string;
  skills: string[];
  languages: string[];
  linkedin: string;
  bio: string;
  coursesTaught: string[];
}

export interface MentorPayload {
  name: string;
  role: string;
  company?: string;
  specialization?: string;
  domain?: string;
  exp?: string;
  rating?: number;
  reviewsCount?: number;
  studentsCount?: string;
  skills?: string[];
  languages?: string[];
  bio?: string;
  image?: string;
  linkedin?: string;
  coursesTaught?: string[];
}

function normalizeMentor(raw: any): Mentor {
  const skills = Array.isArray(raw.skills) && raw.skills.length > 0
    ? raw.skills
    : ["Software Architecture", "System Design", "1:1 Live Coding"];
  const languages = Array.isArray(raw.languages) && raw.languages.length > 0
    ? raw.languages
    : ["English", "Hindi"];

  return {
    id: raw.id || raw._id || raw.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    _id: raw._id,
    name: raw.name,
    role: raw.role,
    company: raw.company || "Top Tech MNC",
    specialization: raw.specialization || (skills.length > 0 ? skills.slice(0, 3).join(", ") : "System Architecture & 1:1 Live Mentorship"),
    domain: raw.domain || (skills[0] || "Java Backend"),
    exp: raw.exp || raw.experience || "10+ Years",
    rating: typeof raw.rating === "number" ? raw.rating : 4.95,
    reviewsCount: raw.reviewsCount || 150,
    studentsCount: raw.studentsCount || (raw.studentsMentored ? `${raw.studentsMentored}+` : "850+"),
    image: raw.image || raw.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces&auto=format",
    skills,
    languages,
    linkedin: raw.linkedin || "https://linkedin.com",
    bio: raw.bio || "Senior industry practitioner training software engineers with 10+ years of enterprise experience.",
    coursesTaught: Array.isArray(raw.coursesTaught) && raw.coursesTaught.length > 0
      ? raw.coursesTaught
      : [raw.role, "1:1 System Design Capstone"],
  };
}

export const mentorService = {
  /**
   * Get all mentors from MongoDB Atlas
   */
  async getAllMentors(): Promise<Mentor[]> {
    return this.getMentors();
  },

  /**
   * Get mentors with optional skill and search query
   */
  async getMentors(params?: { skill?: string; search?: string }): Promise<Mentor[]> {
    try {
      const res = await api.get<{ success: boolean; mentors: any[]; count?: number }>("/mentors", { params });
      if (res.data?.mentors && Array.isArray(res.data.mentors)) {
        return res.data.mentors.map(normalizeMentor);
      }
    } catch (err) {
      console.warn("API GET /mentors notice:", err);
    }
    return [];
  },

  /**
   * Get mentor by ID
   */
  async getMentorById(id: string): Promise<Mentor | null> {
    try {
      const res = await api.get<{ success: boolean; mentor: any }>(`/mentors/${id}`);
      if (res.data?.mentor) {
        return normalizeMentor(res.data.mentor);
      }
    } catch {
      const all = await this.getMentors();
      const found = all.find((m) => m.id === id || m._id === id);
      return found || null;
    }
    return null;
  },

  /**
   * Create a new mentor in MongoDB Atlas
   */
  async createMentor(mentorData: MentorPayload): Promise<Mentor | null> {
    try {
      const res = await api.post<{ success: boolean; mentor: any }>("/mentors", mentorData);
      if (res.data?.mentor) {
        return normalizeMentor(res.data.mentor);
      }
    } catch (err) {
      console.error("Error creating mentor in Atlas:", err);
    }
    return null;
  },

  /**
   * Update mentor in MongoDB Atlas
   */
  async updateMentor(id: string, mentorData: Partial<MentorPayload>): Promise<Mentor | null> {
    try {
      const res = await api.put<{ success: boolean; mentor: any }>(`/mentors/${id}`, mentorData);
      if (res.data?.mentor) {
        return normalizeMentor(res.data.mentor);
      }
    } catch (err) {
      console.error("Error updating mentor in Atlas:", err);
    }
    return null;
  },

  /**
   * Delete mentor from MongoDB Atlas
   */
  async deleteMentor(id: string): Promise<boolean> {
    try {
      await api.delete(`/mentors/${id}`);
      return true;
    } catch (err) {
      console.error("Error deleting mentor in Atlas:", err);
      return false;
    }
  },
};

export default mentorService;
