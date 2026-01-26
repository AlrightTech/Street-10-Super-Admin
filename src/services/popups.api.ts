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
