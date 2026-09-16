import api from "./api";

export interface Course {
  id: string;
  _id?: string;
  title: string;
  category: string;
  categoryGroup: string;
  duration: string;
  students: string;
  rating: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  mentor: string;
  mentorCompany: string;
  mentorExp: string;
  language: string;
  price: string;
  originalPrice: string;
  badge?: string;
  image: string;
  description?: string;
  features: string[];
  highlights?: string[];
  roadmap?: {
    week: string;
    title: string;
    topics: string[];
    milestone: string;
  }[];
}

export interface CoursePayload {
  title: string;
  category: string;
  categoryGroup?: string;
  duration?: string;
  level?: Course["level"];
  mentor?: string;
  mentorCompany?: string;
  mentorExp?: string;
  language?: string;
  rating?: string | number;
  students?: string;
  features?: string[];
  highlights?: string[];
  price?: string | number;
  originalPrice?: string | number;
  badge?: string;
  image?: string;
  description?: string;
}

function mapCategoryToGroup(cat: string = ""): string {
  const c = cat.toLowerCase();
  if (c.includes("cloud") || c.includes("aws") || c.includes("azure") || c.includes("gcp")) return "Cloud Computing";
  if (c.includes("security") || c.includes("cyber") || c.includes("ceh") || c.includes("soc") || c.includes("firewall")) return "Cyber Security";
  if (c.includes("network") || c.includes("cisco") || c.includes("ccna") || c.includes("juniper") || c.includes("fortinet")) return "Networking";
  if (c.includes("data") || c.includes("power bi") || c.includes("tableau") || c.includes("sql") || c.includes("analytics")) return "Data & Analytics";
  if (c.includes("sap") || c.includes("salesforce") || c.includes("servicenow")) return "Enterprise Technologies";
  if (c.includes("pmp") || c.includes("scrum") || c.includes("togaf") || c.includes("itil") || c.includes("project")) return "Project Management";
  if (c.includes("microsoft") || c.includes("windows") || c.includes("active directory")) return "Microsoft & IT";
  return "Software Development";
}

function normalizeCourse(raw: any): Course {
  const priceStr = typeof raw.price === "number"
    ? `₹${raw.price.toLocaleString("en-IN")}`
    : (raw.price || "₹14,999");
  const origPriceStr = typeof raw.originalPrice === "number"
    ? `₹${raw.originalPrice.toLocaleString("en-IN")}`
    : (raw.originalPrice || "₹24,999");
  const ratingStr = typeof raw.rating === "number"
    ? raw.rating.toFixed(1)
    : (raw.rating || "4.9");
  const studentsStr = typeof raw.studentsCount === "number"
    ? `${(raw.studentsCount / 1000).toFixed(1)}K`
    : (raw.students || "1.2K");
  const feats = Array.isArray(raw.features) && raw.features.length > 0
    ? raw.features
    : (Array.isArray(raw.highlights) && raw.highlights.length > 0
      ? raw.highlights
      : ["1:1 Live Mentorship", "Real-World Projects", "Official Certification Prep"]);

  return {
    id: raw.id || raw._id || `course-${Date.now()}`,
    _id: raw._id,
    title: raw.title,
    category: raw.category,
    categoryGroup: raw.categoryGroup || mapCategoryToGroup(raw.category),
    duration: raw.duration || "6 Months",
    students: studentsStr,
    rating: ratingStr,
    level: raw.level || "Intermediate",
    mentor: raw.mentor || "Rajesh Kumar",
    mentorCompany: raw.mentorCompany || "Ex-Amazon",
    mentorExp: raw.mentorExp || "10+ Years",
    language: raw.language || "English & Hindi",
    price: priceStr,
    originalPrice: origPriceStr,
    badge: raw.badge || (raw.isPopular ? "Bestseller" : "Live Track"),
    image: raw.image || "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=340&fit=crop&auto=format",
    description: raw.description || "",
    features: feats,
    highlights: feats,
    roadmap: Array.isArray(raw.roadmap) && raw.roadmap.length > 0
      ? raw.roadmap
      : [
          { week: "Week 1-2", title: "Core Fundamentals & Architecture", topics: ["Syntax & Structure", "Design Patterns"], milestone: "Foundation Build" },
          { week: "Week 3-4", title: "Hands-on Implementation & Deployment", topics: ["APIs & Microservices", "Cloud Integration"], milestone: "Production Capstone" },
        ],
  };
}

export const courseService = {
  /**
   * Get all courses from MongoDB Atlas
   */
  async getAllCourses(): Promise<Course[]> {
    return this.getCourses();
  },

  /**
   * Get courses with optional category and search filters
   */
  async getCourses(params?: { category?: string; search?: string }): Promise<Course[]> {
    try {
      const res = await api.get<{ success: boolean; courses: any[]; count?: number }>("/courses", { params });
      if (res.data?.courses && Array.isArray(res.data.courses)) {
        return res.data.courses.map(normalizeCourse);
      }
    } catch (err) {
      console.warn("API GET /courses notice:", err);
    }
    return [];
  },

  /**
   * Get top popular courses for Home page (top 6)
   */
  async getPopularCourses(limit: number = 6): Promise<Course[]> {
    const all = await this.getCourses();
    const popular = all.filter((c) => c.badge === "Bestseller" || c.badge === "Hot" || c.rating >= "4.9");
    return popular.slice(0, limit);
  },

  /**
   * Get single course by ID or slug
   */
  async getCourseById(id: string): Promise<Course | null> {
    try {
      const res = await api.get<{ success: boolean; course: any }>(`/courses/${id}`);
      if (res.data?.course) {
        return normalizeCourse(res.data.course);
      }
    } catch {
      // Direct query fallback
      const all = await this.getCourses();
      const found = all.find((c) => c.id === id || c._id === id);
      return found || null;
    }
    return null;
  },

  /**
   * Create a new course in MongoDB Atlas
   */
  async createCourse(courseData: CoursePayload): Promise<Course | null> {
    try {
      const res = await api.post<{ success: boolean; course: any }>("/courses", courseData);
      if (res.data?.course) {
        return normalizeCourse(res.data.course);
      }
    } catch (err) {
      console.error("Error creating course in Atlas:", err);
    }
    return null;
  },

  /**
   * Update an existing course in MongoDB Atlas
   */
  async updateCourse(id: string, courseData: Partial<CoursePayload>): Promise<Course | null> {
    try {
      const res = await api.put<{ success: boolean; course: any }>(`/courses/${id}`, courseData);
      if (res.data?.course) {
        return normalizeCourse(res.data.course);
      }
    } catch (err) {
      console.error("Error updating course in Atlas:", err);
    }
    return null;
  },

  /**
   * Delete a course from MongoDB Atlas
   */
  async deleteCourse(id: string): Promise<boolean> {
    try {
      await api.delete(`/courses/${id}`);
      return true;
    } catch (err) {
      console.error("Error deleting course in Atlas:", err);
      return false;
    }
  },
};

export default courseService;
