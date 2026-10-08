import axios from "axios";

// Centralized API configuration
const envApiUrl = import.meta.env.VITE_API_URL;

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "0.0.0.0");

// Production backend base URL (e.g. https://kr-tech.onrender.com)
export const BACKEND_URL =
  envApiUrl && envApiUrl.startsWith("http")
    ? envApiUrl.replace(/\/api\/?$/, "")
    : !isLocalhost &&
      (import.meta.env.PROD ||
        (typeof window !== "undefined" && window.location.hostname.includes("krgloballearning")))
    ? "https://kr-tech.onrender.com"
    : "";

// Axios baseURL: https://kr-tech.onrender.com/api in production, /api in local development
export const API_BASE_URL = BACKEND_URL ? `${BACKEND_URL}/api` : (envApiUrl || "/api");

/**
 * Returns the Google OAuth 2.0 authorization start URL.
 * In production: https://kr-tech.onrender.com/api/auth/google
 * In local development: /api/auth/google (handled by Vite proxy)
 */
export const getGoogleAuthUrl = (): string => {
  return BACKEND_URL ? `${BACKEND_URL}/api/auth/google` : "/api/auth/google";
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 8000,
});

// Request Interceptor: Attach JWT Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("krtech_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors & auto-refresh token if expired
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do not attempt refresh on auth login/register/refresh-token endpoints
    const isAuthRoute =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/register") ||
      originalRequest?.url?.includes("/auth/refresh-token");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      const refreshToken = localStorage.getItem("krtech_refresh_token");

      if (refreshToken) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
          if (res.data?.token) {
            const newToken = res.data.token;
            localStorage.setItem("krtech_token", newToken);
            if (res.data.refreshToken) {
              localStorage.setItem("krtech_refresh_token", res.data.refreshToken);
            }
            api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            processQueue(null, newToken);
            return api(originalRequest);
          }
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          localStorage.removeItem("krtech_token");
          localStorage.removeItem("krtech_refresh_token");
          localStorage.removeItem("krtech_user");
        } finally {
          isRefreshing = false;
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
