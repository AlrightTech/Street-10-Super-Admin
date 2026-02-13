import api, { type ApiResponse, type PaginatedResponse } from '../utils/api';

export type LoginScreenTargetApi = 'vendor' | 'admin' | 'website_login' | 'registration';

export interface LoginScreen {
  id: string;
  title: string;
  backgroundUrl: string;
  target: LoginScreenTargetApi;
  status: 'active' | 'scheduled' | 'expired';
  priority: 'high' | 'medium' | 'low';
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginScreenFilters {
  search?: string;
  status?: 'active' | 'scheduled' | 'expired';
  target?: LoginScreenTargetApi;
  priority?: 'high' | 'medium' | 'low';
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'oldest';
}

export interface CreateLoginScreenData {
  title: string;
  backgroundUrl: string;
  target: LoginScreenTargetApi;
  priority: 'high' | 'medium' | 'low';
  startDate: string;
  endDate: string;
  // Status is calculated automatically based on dates
}

export interface UpdateLoginScreenData extends Partial<CreateLoginScreenData> {}

/**
 * Upload file to S3 and get URL
 */
export const uploadFileToS3 = async (file: File, folder: 'banners' | 'products' | 'documents' = 'banners'): Promise<string> => {
  const { uploadFileToS3: uploadS3 } = await import('./upload.api');
  return await uploadS3(file, folder);
};

/**
 * Convert File to base64 data URL (for preview only - NOT sent to backend)
 * @deprecated Use uploadFileToS3 for new uploads. This is kept for backward compatibility and previews only.
 */
export const fileToDataUrl = async (file: File): Promise<string> => {
  const { fileToDataUrl: convertToDataUrl } = await import('./upload.api');
  return await convertToDataUrl(file);
};

export const loginScreensApi = {
  /**
   * Get all login screens with filters and pagination
   */
  getAll: async (filters: LoginScreenFilters = {}): Promise<PaginatedResponse<LoginScreen>> => {
    const response = await api.get<ApiResponse<LoginScreen[]>>('/admin/login-screens', {
      params: filters,
    });
    const apiResponse = response.data as any;
    return {
      data: apiResponse.data || [],
      pagination: apiResponse.pagination || {
        page: filters.page || 1,
        limit: filters.limit || 10,
        total: 0,
        totalPages: 1,
      },
    };
  },

  /**
   * Get login screen by ID
   */
  getById: async (id: string): Promise<LoginScreen> => {
    const response = await api.get<ApiResponse<{ loginScreen: LoginScreen }>>(`/admin/login-screens/${id}`);
    return response.data.data.loginScreen;
  },

  /**
   * Create new login screen
   */
  create: async (data: CreateLoginScreenData): Promise<LoginScreen> => {
    const response = await api.post<ApiResponse<{ loginScreen: LoginScreen }>>('/admin/login-screens', data);
    return response.data.data.loginScreen;
  },

  /**
   * Update login screen
   */
  update: async (id: string, data: UpdateLoginScreenData): Promise<LoginScreen> => {
    const response = await api.patch<ApiResponse<{ loginScreen: LoginScreen }>>(`/admin/login-screens/${id}`, data);
    return response.data.data.loginScreen;
  },

  /**
   * Delete login screen
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/login-screens/${id}`);
  },

  /**
   * Get active login screen for a specific target (public endpoint - no auth required)
   */
  getActive: async (target: LoginScreenTargetApi): Promise<LoginScreen | null> => {
    try {
      // Use axios directly for public endpoint (bypass auth)
      const axios = (await import('axios')).default;
      // API base URL MUST come from environment variable
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      if (!API_BASE_URL) {
        throw new Error('Missing VITE_API_BASE_URL. Set it in your Super Admin .env (e.g. https://api.st10.info/api/v1).');
      }
      const response = await axios.get<ApiResponse<LoginScreen>>(
        `${API_BASE_URL}/public/login-screen/active`,
        {
          params: { target },
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      // If no active login screen found, return null (not an error)
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Failed to fetch active login screen:', error);
      return null;
    }
  },
};
