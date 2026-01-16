import api, { type ApiResponse, type PaginatedResponse } from '../utils/api';

export interface Popup {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  redirectType: 'product' | 'category' | 'external';
  redirectTarget: string | null;
  ctaText: string | null;
  status: 'active' | 'scheduled' | 'expired';
  startDate: string;
  endDate: string;
  priority: 'high' | 'medium' | 'low';
  deviceTarget: 'desktop' | 'mobile' | 'both';
  createdAt: string;
  updatedAt: string;
}

export interface PopupFilters {
  search?: string;
  status?: 'active' | 'scheduled' | 'expired';
  redirectType?: 'product' | 'category' | 'external';
  priority?: 'high' | 'medium' | 'low';
  deviceTarget?: 'desktop' | 'mobile' | 'both';
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'oldest';
}

export interface CreatePopupData {
  title: string;
  description?: string;
  imageUrl?: string;
  redirectType: 'product' | 'category' | 'external';
  redirectTarget?: string;
  ctaText?: string;
  startDate: string;
  endDate: string;
  priority: 'high' | 'medium' | 'low';
  deviceTarget?: 'desktop' | 'mobile' | 'both';
  status?: 'active' | 'inactive';
}

export interface UpdatePopupData extends Partial<CreatePopupData> {}

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

export const popupsApi = {
  /**
   * Get all popups with filters and pagination
   */
  getAll: async (filters: PopupFilters = {}): Promise<PaginatedResponse<Popup>> => {
    const response = await api.get<ApiResponse<Popup[]>>('/admin/popups', {
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
   * Get popup by ID
   */
  getById: async (id: string): Promise<Popup> => {
    const response = await api.get<ApiResponse<Popup>>(`/admin/popups/${id}`);
    return response.data.data;
  },

  /**
   * Create new popup
   */
  create: async (data: CreatePopupData): Promise<Popup> => {
    const response = await api.post<ApiResponse<Popup>>('/admin/popups', data);
    return response.data.data;
  },

  /**
   * Update popup
   */
  update: async (id: string, data: UpdatePopupData): Promise<Popup> => {
    const response = await api.patch<ApiResponse<Popup>>(`/admin/popups/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete popup
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/popups/${id}`);
  },
};
