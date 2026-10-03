import api from "./api";
import { ALL_COURSES } from "../data/coursesData";

export interface Course {
  id: string;
  _id?: string;
  title: string;
  category: string;
  categoryGroup: string;
  duration: string;
  durationHours?: number;
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
  durationHours?: number;
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
  if (c.includes("ai") || c.includes("machine learning") || c.includes("genai") || c.includes("databricks")) return "AI, Machine Learning & GenAI";
  if (c.includes("cloud & cloud architecture")) return "Cloud & Cloud Architecture";
  if (c.includes("cloud") || c.includes("aws") || c.includes("azure") || c.includes("gcp")) return "Cloud & Cloud Architecture";
  if (c.includes("cybersecurity") || c.includes("cyber security") || c.includes("security") || c.includes("ceh") || c.includes("soc") || c.includes("firewall") || c.includes("comptia") || c.includes("cissp")) return "Cybersecurity";
  if (c.includes("networking") || c.includes("network") || c.includes("cisco") || c.includes("ccna") || c.includes("ccnp") || c.includes("ccie") || c.includes("fortinet")) return "Networking";
  if (c.includes("data") || c.includes("power bi") || c.includes("tableau") || c.includes("sql") || c.includes("analytics")) return "Data & Analytics";
  if (c.includes("sap") || c.includes("salesforce") || c.includes("servicenow")) return "Enterprise Technologies";
  if (c.includes("pmp") || c.includes("scrum") || c.includes("togaf") || c.includes("itil") || c.includes("project")) return "Project Management";
  if (c.includes("microsoft") || c.includes("windows") || c.includes("active directory")) return "Microsoft & IT";
  return "Software Development";
}

function normalizeCourse(raw: any): Course {
  let priceStr = "";
  if (typeof raw.price === "string") {
    if (raw.price.startsWith("$")) {
      priceStr = raw.price;
    } else {
      const num = parseInt(raw.price.replace(/[^0-9]/g, "")) || 499;
      priceStr = num > 1000 ? (num >= 16000 ? "$599" : num >= 14000 ? "$549" : num >= 12000 ? "$499" : num >= 9000 ? "$399" : num >= 6000 ? "$299" : "$199") : `$${num}`;
    }
  } else if (typeof raw.price === "number") {
    priceStr = raw.price > 1000 ? (raw.price >= 16000 ? "$599" : raw.price >= 14000 ? "$549" : raw.price >= 12000 ? "$499" : raw.price >= 9000 ? "$399" : raw.price >= 6000 ? "$299" : "$199") : `$${raw.price}`;
  } else {
    priceStr = "$599";
  }

  // All courses strictly use actual USD pricing without fake crossed-out original prices
  const origPriceStr = "";

  // Duration in Hours
  let durationHours = typeof raw.durationHours === "number" ? raw.durationHours : undefined;
  let durationStr = raw.duration || "80 Hours";

  if (durationHours) {
    durationStr = `${durationHours} Hours`;
  } else if (durationStr.toLowerCase().includes("week")) {
    const num = parseInt(durationStr.replace(/[^0-9]/g, "")) || 8;
    durationHours = num <= 6 ? 40 : num <= 8 ? 80 : num <= 10 ? 100 : 120;
    durationStr = `${durationHours} Hours`;
  } else if (durationStr.toLowerCase().includes("month")) {
    const num = parseFloat(durationStr.replace(/[^0-9.]/g, "")) || 3;
    durationHours = Math.round(num * 30);
    durationStr = `${durationHours} Hours`;
  } else if (!durationStr.toLowerCase().includes("hour")) {
    durationHours = 80;
    durationStr = "80 Hours";
  } else {
    durationHours = parseInt(durationStr.replace(/[^0-9]/g, "")) || 80;
  }

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
      : ["One-on-One Live Mentorship", "Real-World Projects", "Official Certification Prep"]);

  return {
    id: raw.id || raw._id || `course-${Date.now()}`,
    _id: raw._id,
    title: raw.title,
    category: raw.category,
    categoryGroup: raw.categoryGroup || mapCategoryToGroup(raw.category),
    duration: durationStr,
    durationHours,
    students: studentsStr,
    rating: ratingStr,
    level: raw.level || "Intermediate",
    mentor: raw.mentor || "Technical Architect",
    mentorCompany: raw.mentorCompany || "Senior Architect",
    mentorExp: raw.mentorExp || "10+ Years",
    language: raw.language || "English",
    price: priceStr,
    originalPrice: origPriceStr,
    badge: raw.badge || (raw.isPopular ? "Bestseller" : "Verified Program"),
    image: raw.image || "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=340&fit=crop&auto=format",
    description: raw.description || "",
    features: feats,
    highlights: feats,
    roadmap: Array.isArray(raw.roadmap) && raw.roadmap.length > 0
      ? raw.roadmap
      : [
          { week: "Phase 1", title: "Core Fundamentals & Architecture", topics: ["Syntax & Structure", "Design Patterns"], milestone: "Foundation Build" },
          { week: "Phase 2", title: "Hands-on Implementation & Deployment", topics: ["APIs & Microservices", "Cloud Integration"], milestone: "Production Capstone" },
        ],
  };
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL_MS = 60000; // 60 seconds
const memoryCache = new Map<string, CacheEntry<any>>();
const inFlightRequests = new Map<string, Promise<any>>();

function getFromCache<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) {
    return entry.data;
  }
  memoryCache.delete(key);
  return null;
}

function setToCache<T>(key: string, data: T): void {
  memoryCache.set(key, { data, timestamp: Date.now() });
}

export function invalidateCourseCache(): void {
  memoryCache.clear();
  inFlightRequests.clear();
}

export const courseService = {
  /**
   * Get all courses from MongoDB Atlas (cached)
   */
  async getAllCourses(): Promise<Course[]> {
    return this.getCourses();
  },

  /**
   * Get courses with optional category and search filters (with in-flight deduplication & caching)
   */
  async getCourses(params?: { category?: string; search?: string }): Promise<Course[]> {
    const cacheKey = `courses_${params?.category || "all"}_${params?.search || ""}`;
    const cached = getFromCache<Course[]>(cacheKey);
    if (cached) return cached;

    if (inFlightRequests.has(cacheKey)) {
      return inFlightRequests.get(cacheKey)!;
    }

    const fetchPromise = (async () => {
      try {
        const res = await api.get<{ success: boolean; courses: any[]; count?: number }>("/courses", { params });
        if (res.data?.courses && Array.isArray(res.data.courses) && res.data.courses.length > 0) {
          const normalized = res.data.courses.map(normalizeCourse);
          setToCache(cacheKey, normalized);
          return normalized;
        }
      } catch (err) {
        console.warn("API GET /courses notice:", err);
      }
      // Reliable static catalog fallback
      let list = ALL_COURSES;
      if (params?.category && params.category !== "All") {
        const catLower = params.category.toLowerCase();
        list = list.filter(
          (c) =>
            c.category.toLowerCase().includes(catLower) ||
            c.categoryGroup.toLowerCase().includes(catLower)
        );
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q) ||
            c.categoryGroup.toLowerCase().includes(q)
        );
      }
      setToCache(cacheKey, list);
      return list;
    })().finally(() => {
      inFlightRequests.delete(cacheKey);
    });

    inFlightRequests.set(cacheKey, fetchPromise);
    return fetchPromise;
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
   * Get single course by ID or slug (resolves immediately if catalog in memory)
   */
  async getCourseById(id: string): Promise<Course | null> {
    const cacheKey = `course_${id}`;
    const cached = getFromCache<Course>(cacheKey);
    if (cached) return cached;

    // Fast resolution: Check if catalog already loaded in memory
    const allCached = getFromCache<Course[]>("courses_all_");
    if (allCached) {
      const found = allCached.find((c) => c.id === id || c._id === id);
      if (found) {
        setToCache(cacheKey, found);
        return found;
      }
    }

    try {
      const res = await api.get<{ success: boolean; course: any }>(`/courses/${id}`);
      if (res.data?.course) {
        const normalized = normalizeCourse(res.data.course);
        setToCache(cacheKey, normalized);
        return normalized;
      }
    } catch {
      // Direct query fallback
      const all = await this.getCourses();
      const found = all.find((c) => c.id === id || c._id === id);
      if (found) setToCache(cacheKey, found);
      return found || null;
    }
    return null;
  },

  /**
   * Create a new course in MongoDB Atlas
   */
  async createCourse(courseData: CoursePayload): Promise<Course | null> {
    invalidateCourseCache();
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
    invalidateCourseCache();
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
    invalidateCourseCache();
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
