import axios, { type AxiosError } from "axios";
import type { ApiResponse } from "../utils/api";

// API base URL MUST come from environment.
// Do not hardcode defaults here (local/prod/proxy) — configure in `.env`.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error(
    "Missing VITE_API_BASE_URL. Set it in Super-Admin .env (e.g. https://api.st10.info/api/v1)."
  );
}

// Debug: Log the API base URL in development
if (import.meta.env.DEV) {
  console.log("🔧 API Base URL (Auth):", API_BASE_URL);
  console.log("🔧 VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
  console.log("🔧 Is Dev Mode:", import.meta.env.DEV);
}

// Create a separate axios instance for auth (without token interceptor)
const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface LoginData {
  email?: string;
  phone?: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    phone: string | null;
    status: string;
    role: string;
    lang: string;
  };
  token: string;
  refreshToken: string;
}

export const authApiService = {
  // Login user
  login: async (data: LoginData): Promise<LoginResponse> => {
    try {
      const response = await authApi.post<ApiResponse<LoginResponse>>(
        "/auth/login",
        data
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      }
      throw new Error("Login failed. Please check your credentials.");
    }
  },

  // Logout (clear token from localStorage)
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("authToken");
  },

  // Check if user has admin role (for backward compatibility, but use isSuperAdmin)
  isAdmin: (): boolean => {
    return authApiService.isSuperAdmin();
  },

  // Get stored user
  getStoredUser: () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  // Check if user is super-admin
  isSuperAdmin: (): boolean => {
    const user = authApiService.getStoredUser();
    return user?.role === "super-admin";
  },
};
