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
  refreshToken?: string;
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

export interface DeviceSession {
  id: string;
  deviceInfo: string;
  browser: string;
  os: string;
  ipAddress: string;
  location?: string;
  lastActive: string;
  expiresAt: string;
  isCurrent: boolean;
}

const TOKEN_KEY = "krtech_token";
const REFRESH_TOKEN_KEY = "krtech_refresh_token";
const USER_KEY = "krtech_user";
const REMEMBER_KEY = "krtech_remember_me";

export const authService = {
  /**
   * Register a new user in MongoDB Atlas
   */
  async register(data: RegisterPayload): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/register", data);
      if (response.data?.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
        }
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Registration failed";
      throw new Error(msg);
    }
  },

  /**
   * Login user with external/OAuth tokens (e.g., Google OAuth callback)
   */
  async loginWithToken(token: string, refreshToken?: string): Promise<User> {
    localStorage.setItem(TOKEN_KEY, token);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    const profile = await this.getProfile();
    if (!profile) {
      throw new Error("Failed to load user profile with session token");
    }
    return profile;
  },

  /**
   * Login user with email and password in MongoDB Atlas (supports rememberMe)
   */
  async login(email: string, password?: string, rememberMe: boolean = true): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/login", {
        email,
        password,
        rememberMe,
      });
      if (response.data?.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
        }
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        localStorage.setItem(REMEMBER_KEY, JSON.stringify(rememberMe));
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
   * Log out user & invalidate refresh token
   */
  logout(): void {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      api.post("/auth/logout", { refreshToken }).catch(() => {});
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Refresh access token using stored refresh token
   */
  async refreshAccessToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) return null;

    try {
      const response = await api.post<{ success: boolean; token: string; refreshToken?: string; user?: any }>(
        "/auth/refresh-token",
        { refreshToken }
      );
      if (response.data?.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
        }
        if (response.data.user) {
          localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        }
        return response.data.token;
      }
    } catch {
      this.logout();
    }
    return null;
  },

  /**
   * Get active sessions for current user (Security Page)
   */
  async getSessions(): Promise<DeviceSession[]> {
    try {
      const response = await api.get<{ success: boolean; sessions: DeviceSession[] }>("/auth/sessions");
      return response.data?.sessions || [];
    } catch {
      return [];
    }
  },

  /**
   * Revoke specific device session
   */
  async revokeSession(sessionId: string): Promise<boolean> {
    try {
      const response = await api.delete<{ success: boolean; message: string }>(`/auth/sessions/${sessionId}`);
      return !!response.data?.success;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || "Failed to revoke device session");
    }
  },

  /**
   * Terminate all device sessions (Logout All)
   */
  async logoutAll(): Promise<string> {
    try {
      const response = await api.post<{ success: boolean; message: string }>("/auth/logout-all");
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return response.data?.message || "Successfully logged out from all devices";
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || "Failed to log out all devices");
    }
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
   * Ensure admin JWT token is present
   */
  async ensureAdminToken(): Promise<string | null> {
    const token = localStorage.getItem(TOKEN_KEY);
    return token;
  },

  /**
   * Request 6-digit OTP code for password reset
   */
  async forgotPassword(email: string): Promise<{ success: boolean; message: string; expiresIn?: string }> {
    try {
      const response = await api.post<{ success: boolean; message: string; expiresIn?: string }>("/auth/forgot-password", { email });
      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to dispatch password reset OTP";
      throw new Error(msg);
    }
  },

  /**
   * Verify 6-digit OTP code to receive Reset Authorization Token
   */
  async verifyOtp(email: string, otp: string): Promise<{ success: boolean; message: string; resetToken?: string; remainingAttempts?: number }> {
    try {
      const response = await api.post<{ success: boolean; message: string; resetToken?: string; remainingAttempts?: number }>("/auth/verify-otp", { email, otp });
      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Invalid or expired OTP code";
      throw new Error(msg);
    }
  },

  /**
   * Reset password using verified Reset Authorization Token
   */
  async resetPassword(email: string, resetToken: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post<{ success: boolean; message: string }>("/auth/reset-password", {
        email,
        resetToken,
        newPassword,
      });
      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to reset password";
      throw new Error(msg);
    }
  },
};

