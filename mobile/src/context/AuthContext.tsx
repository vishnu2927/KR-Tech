import React, { createContext, useContext, useState, useEffect } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import * as Haptics from "expo-haptics";
import { apiClient, getStoredToken, storeToken, clearToken, USER_KEY } from "../services/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
  streakDays?: number;
  studyHours?: number;
  enrolledCourses?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isBiometricSupported: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (email: string, otp: string, newPass: string) => Promise<boolean>;
  loginWithBiometrics: () => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updated: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  useEffect(() => {
    bootstrapAuth();
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricSupported(compatible && enrolled);
    } catch (e) {
      setIsBiometricSupported(false);
    }
  };

  const bootstrapAuth = async () => {
    try {
      const savedToken = await getStoredToken();
      const savedUserStr = await AsyncStorage.getItem(USER_KEY);
      if (savedToken && savedUserStr) {
        setToken(savedToken);
        setUser(JSON.parse(savedUserStr));
        // Verify with /api/auth/me in background
        apiClient.get("/auth/me").then((res) => {
          if (res.data?.user) {
            setUser(res.data.user);
            AsyncStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
          }
        }).catch(() => {
          // Keep offline cached user
        });
      }
    } catch (e) {
      console.warn("Bootstrap auth error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const res = await apiClient.post("/auth/login", { email, password: pass });
      if (res.data?.token) {
        const receivedToken = res.data.token;
        const loggedUser: User = res.data.user || {
          id: res.data.userId || "usr_student",
          name: res.data.name || email.split("@")[0],
          email,
          role: "student",
          streakDays: 7,
          studyHours: 24,
          enrolledCourses: ["MERN-FULLSTACK", "AWS-SOLUTIONS"],
        };

        await storeToken(receivedToken);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(loggedUser));
        setToken(receivedToken);
        setUser(loggedUser);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return true;
      }
      return false;
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      throw new Error(error.response?.data?.message || "Invalid credentials. Please try again.");
    }
  };

  const register = async (name: string, email: string, pass: string, phone?: string): Promise<boolean> => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const res = await apiClient.post("/auth/register", { name, email, password: pass, phone });
      if (res.data?.token) {
        const receivedToken = res.data.token;
        const newUser: User = res.data.user || {
          id: "usr_" + Date.now(),
          name,
          email,
          phone,
          role: "student",
          streakDays: 1,
          studyHours: 0,
        };
        await storeToken(receivedToken);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));
        setToken(receivedToken);
        setUser(newUser);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return true;
      }
      return true; // Sent OTP
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      throw new Error(error.response?.data?.message || "Registration failed. Try again.");
    }
  };

  const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    try {
      const res = await apiClient.post("/auth/verify-otp", { email, otp });
      if (res.data?.token) {
        await storeToken(res.data.token);
        setToken(res.data.token);
        if (res.data.user) {
          setUser(res.data.user);
          await AsyncStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
        }
      }
      return true;
    } catch (e: any) {
      throw new Error(e.response?.data?.message || "Invalid OTP code.");
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    const res = await apiClient.post("/auth/forgot-password", { email });
    return res.data?.success ?? true;
  };

  const resetPassword = async (email: string, otp: string, newPass: string): Promise<boolean> => {
    const res = await apiClient.post("/auth/reset-password", { email, otp, newPassword: newPass });
    return res.data?.success ?? true;
  };

  const loginWithBiometrics = async (): Promise<boolean> => {
    try {
      const res = await LocalAuthentication.authenticateAsync({
        promptMessage: "Sign in to KR Global Learning with Biometrics",
        fallbackLabel: "Use Password",
        disableDeviceFallback: false,
      });

      if (res.success) {
        const savedToken = await getStoredToken();
        const savedUserStr = await AsyncStorage.getItem(USER_KEY);
        if (savedToken && savedUserStr) {
          setToken(savedToken);
          setUser(JSON.parse(savedUserStr));
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          return true;
        } else {
          throw new Error("No previous session found. Please sign in with email first.");
        }
      }
      return false;
    } catch (e: any) {
      throw new Error(e.message || "Biometric authentication failed");
    }
  };

  const logout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await clearToken();
    setToken(null);
    setUser(null);
  };

  const updateUser = async (updated: Partial<User>) => {
    if (!user) return;
    const nextUser = { ...user, ...updated };
    setUser(nextUser);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isBiometricSupported,
        login,
        register,
        verifyOtp,
        forgotPassword,
        resetPassword,
        loginWithBiometrics,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
