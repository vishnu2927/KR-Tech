import api from "./api";

export interface EnrolledCourse {
  courseId: string;
  title: string;
  progress: number;
  enrolledAt: string;
}

export interface DemoBooking {
  id: string;
  bookingId: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  timeSlot?: string;
  timeZone?: string;
  status: string;
  createdAt: string;
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role: "student" | "admin";
  avatar?: string;
  enrolledCourses?: EnrolledCourse[];
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
  message?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  course?: string;
  role?: "student" | "admin";
}

const TOKEN_KEY = "krtech_token";
const USER_KEY = "krtech_user";

export const authService = {
  /**
   * Register a new user in MongoDB Atlas
   */
  async register(data: RegisterPayload): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/register", data);
      if (response.data?.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Registration failed";
      throw new Error(msg);
    }
  },

  /**
   * Login user with email and password in MongoDB Atlas
   */
  async login(email: string, password?: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/login", { email, password });
      if (response.data?.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Invalid email or password";
      throw new Error(msg);
    }
  },

  /**
   * Get current authenticated user profile from MongoDB Atlas
   */
  async getProfile(): Promise<User | null> {
    try {
      const response = await api.get<{ success: boolean; user: any }>("/auth/profile");
      if (response.data?.user) {
        const u = response.data.user;
        const normalized: User = {
          ...u,
          id: u._id || u.id,
        };
        localStorage.setItem(USER_KEY, JSON.stringify(normalized));
        return normalized;
      }
    } catch {
      // If token is invalid or expired
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) return null;
    }
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  /**
   * Update student profile details in MongoDB Atlas
   */
  async updateProfile(data: { name?: string; phone?: string; avatar?: string; password?: string }): Promise<User> {
    try {
      const response = await api.put<{ success: boolean; user: any; message: string }>("/auth/profile", data);
      if (response.data?.user) {
        const u = response.data.user;
        const normalized: User = {
          ...u,
          id: u._id || u.id,
        };
        localStorage.setItem(USER_KEY, JSON.stringify(normalized));
        return normalized;
      }
      throw new Error("Update failed");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to update profile";
      throw new Error(msg);
    }
  },

  /**
   * Fetch demo bookings made by this student from MongoDB Atlas
   */
  async getMyBookings(): Promise<DemoBooking[]> {
    try {
      const response = await api.get<{ success: boolean; bookings: DemoBooking[] }>("/auth/my-bookings");
      if (response.data?.bookings) {
        return response.data.bookings;
      }
    } catch (err) {
      console.warn("Failed to fetch student demo bookings:", err);
    }
    return [];
  },

  /**
   * Fetch enrolled courses from student profile in MongoDB Atlas
   */
  async getMyCourses(): Promise<EnrolledCourse[]> {
    try {
      const response = await api.get<{ success: boolean; courses: EnrolledCourse[] }>("/auth/my-courses");
      if (response.data?.courses) {
        return response.data.courses;
      }
    } catch (err) {
      console.warn("Failed to fetch student enrolled courses:", err);
    }
    const user = this.getCurrentUser();
    return user?.enrolledCourses || [];
  },

  /**
   * Enroll in a course directly into MongoDB Atlas
   */
  async enrollCourse(courseId: string, title: string): Promise<EnrolledCourse[]> {
    try {
      const response = await api.post<{ success: boolean; enrolledCourses: EnrolledCourse[]; message: string }>("/auth/enroll", {
        courseId,
        title,
      });
      if (response.data?.enrolledCourses) {
        const current = this.getCurrentUser();
        if (current) {
          current.enrolledCourses = response.data.enrolledCourses;
          localStorage.setItem(USER_KEY, JSON.stringify(current));
        }
        return response.data.enrolledCourses;
      }
      throw new Error("Enrollment failed");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to enroll in course";
      throw new Error(msg);
    }
  },

  /**
   * Get all students for admin view
   */
  async getStudents(): Promise<User[]> {
    try {
      const response = await api.get<{ success: boolean; students: User[] }>("/auth/students");
      if (response.data?.students) {
        return response.data.students;
      }
    } catch {
      // Fallback
    }
    return [];
  },

  /**
   * Log out user
   */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Get current cached user
   */
  getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  /**
   * Check if token is present
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token;
  },

  /**
   * Ensure admin JWT token is present for protected Atlas APIs
   */
  async ensureAdminToken(): Promise<string | null> {
    let token = localStorage.getItem(TOKEN_KEY);
    if (!token || token.startsWith("mock-")) {
      try {
        const response = await api.post<AuthResponse>("/auth/login", {
          email: "admin@krtech.com",
          password: "admin123",
        });
        if (response.data?.token) {
          localStorage.setItem(TOKEN_KEY, response.data.token);
          localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
          return response.data.token;
        }
      } catch (err) {
        console.warn("Auto admin session notice:", err);
      }
    }
    return token;
  },
};
