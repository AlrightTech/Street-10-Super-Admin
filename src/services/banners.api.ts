import api, { type ApiResponse, type PaginatedResponse } from '../utils/api';

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  thumbnailUrl: string | null;
  mediaUrls: string[] | null;
  type: 'image' | 'video';
  startDate: string;
  endDate: string;
  audience: 'user' | 'vendor';
  priority: 'high' | 'medium' | 'low';
  url: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  status: 'active' | 'scheduled' | 'expired';
  createdAt: string;
  updatedAt: string;
}

export interface BannerFilters {
  search?: string;
  status?: 'active' | 'scheduled' | 'expired';
  audience?: 'user' | 'vendor';
  priority?: 'high' | 'medium' | 'low';
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'oldest';
}

export interface CreateBannerData {
  title: string;
  subtitle?: string;
  description?: string;
  thumbnailUrl?: string;
  mediaUrls?: string[];
  type: 'image' | 'video';
  startDate: string;
  endDate: string;
  audience: 'user' | 'vendor';
  priority: 'high' | 'medium' | 'low';
  url?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface UpdateBannerData extends Partial<CreateBannerData> {}

/**
 * Convert File to base64 data URL
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Convert multiple Files to base64 data URLs
 */
export const filesToDataUrls = async (files: File[]): Promise<string[]> => {
  return Promise.all(files.map(fileToDataUrl));
};

export const bannersApi = {
  /**
   * Get all banners with filters and pagination
   */
  getAll: async (filters: BannerFilters = {}): Promise<PaginatedResponse<Banner>> => {
    const response = await api.get<ApiResponse<Banner[]>>('/admin/banners', {
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
   * Get banner by ID
   */
  getById: async (id: string): Promise<Banner> => {
    const response = await api.get<ApiResponse<{ banner: Banner }>>(`/admin/banners/${id}`);
    return response.data.data.banner;
  },

  /**
   * Create new banner
   */
  create: async (data: CreateBannerData): Promise<Banner> => {
    const response = await api.post<ApiResponse<{ banner: Banner }>>('/admin/banners', data);
    return response.data.data.banner;
  },

  /**
   * Update banner
   */
  update: async (id: string, data: UpdateBannerData): Promise<Banner> => {
    const response = await api.patch<ApiResponse<{ banner: Banner }>>(`/admin/banners/${id}`, data);
    return response.data.data.banner;
  },

  /**
   * Delete banner
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/banners/${id}`);
  },
};
