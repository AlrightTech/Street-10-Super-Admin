import axios, { type AxiosInstance, type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

// API base URL - adjust based on your environment
// In development, use relative path to work with Vite proxy
// In production, use full URL or environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '/api/v1' : 'http://localhost:3000/api/v1');

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Track if we're currently refreshing token to avoid multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor for error handling with token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Don't intercept errors on auth endpoints or if already retried
    if (
      originalRequest?.url?.includes('/auth/') ||
      originalRequest?._retry
    ) {
      // Let auth endpoints handle their own errors
      if (error.response?.status === 401) {
        // On auth endpoints, just redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // Handle 401 - Token expired or invalid
    if (error.response?.status === 401) {
      // Check if we're on login page - don't try to refresh
      if (typeof window !== 'undefined' && window.location.pathname === '/login') {
        return Promise.reject(error);
      }

      // If we're already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest && token && originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Try to refresh token if we have one
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken && !originalRequest._retry) {
        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Call refresh token endpoint using a separate axios instance to avoid circular dependency
          const refreshAxios = axios.create({
            baseURL: API_BASE_URL,
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const response = await refreshAxios.post<ApiResponse<{ token: string; refreshToken: string }>>(
            '/auth/refresh',
            { refreshToken }
          );
          
          if (response.data.success && response.data.data) {
            // Update tokens
            localStorage.setItem('authToken', response.data.data.token);
            if (response.data.data.refreshToken) {
              localStorage.setItem('refreshToken', response.data.data.refreshToken);
            }

            // Process queued requests
            processQueue(null, response.data.data.token);

            // Update the original request with new token
            if (originalRequest && originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${response.data.data.token}`;
            }

            // Retry the original request
            return api(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed - logout user
          processQueue(refreshError, null);
          
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          
          if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // No refresh token - logout user
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default api;

