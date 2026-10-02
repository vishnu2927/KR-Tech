import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Local development host mapping:
// Android Emulator uses 10.0.2.2 to access host machine's localhost:5000
// iOS Simulator uses localhost:5000
const DEFAULT_URL = Platform.select({
  android: "http://10.0.2.2:5000/api",
  ios: "http://localhost:5000/api",
  default: "https://api.krtech.in/api",
});

export const API_BASE_URL = DEFAULT_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Secure Store keys
export const TOKEN_KEY = "kr_jwt_token";
export const USER_KEY = "kr_user_profile";
export const REFRESH_TOKEN_KEY = "kr_refresh_token";

// Retrieve token helper with fallback
export async function getStoredToken(): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      return await AsyncStorage.getItem(TOKEN_KEY);
    }
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (err) {
    return await AsyncStorage.getItem(TOKEN_KEY);
  }
}

// Save token helper
export async function storeToken(token: string): Promise<void> {
  try {
    if (Platform.OS !== "web") {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (err) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }
}

// Remove token helper
export async function clearToken(): Promise<void> {
  try {
    if (Platform.OS !== "web") {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  } catch (err) {
    await AsyncStorage.removeItem(TOKEN_KEY);
  }
}

// Request interceptor: attach bearer token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getStoredToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 and cache responses for offline usage
apiClient.interceptors.response.use(
  async (response) => {
    // Cache successful GET requests for offline browsing
    if (response.config.method?.toLowerCase() === "get" && response.data) {
      const cacheKey = `cache_${response.config.url}`;
      try {
        await AsyncStorage.setItem(cacheKey, JSON.stringify(response.data));
      } catch (e) {
        // ignore cache write failures
      }
    }
    return response;
  },
  async (error: AxiosError) => {
    // Check if network failed and fallback to cached data for GET requests
    if (
      (!error.response || error.code === "ECONNABORTED" || error.message.includes("Network Error")) &&
      error.config?.method?.toLowerCase() === "get" &&
      error.config?.url
    ) {
      const cacheKey = `cache_${error.config.url}`;
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        try {
          return {
            data: JSON.parse(cached),
            status: 200,
            statusText: "OK (Cached Offline)",
            headers: {},
            config: error.config,
          } as any;
        } catch (e) {
          // parse error
        }
      }
    }

    return Promise.reject(error);
  }
);
