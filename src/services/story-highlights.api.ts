import api, { type ApiResponse, type PaginatedResponse } from '../utils/api';

export interface StoryHighlight {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  mediaUrls: string[] | null;
  type: 'image' | 'video';
  startDate: string;
  endDate: string;
  audience: 'user' | 'vendor';
  priority: 'high' | 'medium' | 'low';
  url: string | null;
  status: 'active' | 'scheduled' | 'expired';
  createdAt: string;
  updatedAt: string;
}

export interface StoryHighlightFilters {
  search?: string;
  status?: 'active' | 'scheduled' | 'expired';
  audience?: 'user' | 'vendor';
  priority?: 'high' | 'medium' | 'low';
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'oldest';
}

export interface CreateStoryHighlightData {
  title: string;
  thumbnailUrl?: string;
  mediaUrls?: string[];
  type: 'image' | 'video';
  startDate: string;
  endDate: string;
  audience: 'user' | 'vendor';
  priority: 'high' | 'medium' | 'low';
  url?: string;
}

export interface UpdateStoryHighlightData extends Partial<CreateStoryHighlightData> {}

/**
 * Upload file to S3 and get URL
 */
export const uploadFileToS3 = async (file: File, folder: 'banners' | 'products' | 'documents' = 'banners'): Promise<string> => {
  const { uploadFileToS3: uploadS3 } = await import('./upload.api');
  return await uploadS3(file, folder);
};

/**
 * Upload multiple files to S3 and get URLs
 */
export const uploadMultipleFilesToS3 = async (files: File[], folder: 'banners' | 'products' | 'documents' = 'banners'): Promise<string[]> => {
  const { uploadMultipleFilesToS3: uploadMultipleS3 } = await import('./upload.api');
  return await uploadMultipleS3(files, folder);
};

/**
 * Convert File to base64 data URL (for preview only - NOT sent to backend)
 * @deprecated Use uploadFileToS3 for new uploads. This is kept for backward compatibility and previews only.
 */
export const fileToDataUrl = async (file: File): Promise<string> => {
  const { fileToDataUrl: convertToDataUrl } = await import('./upload.api');
  return await convertToDataUrl(file);
};

/**
 * Convert multiple Files to base64 data URLs (for preview only)
 * @deprecated Use uploadMultipleFilesToS3 for new uploads. This is kept for backward compatibility and previews only.
 */
export const filesToDataUrls = async (files: File[]): Promise<string[]> => {
  const { fileToDataUrl } = await import('./upload.api');
  return Promise.all(files.map(fileToDataUrl));
};

export const storyHighlightsApi = {
  /**
   * Get all story highlights with filters and pagination
   */
  getAll: async (filters: StoryHighlightFilters = {}): Promise<PaginatedResponse<StoryHighlight>> => {
    const response = await api.get<ApiResponse<StoryHighlight[]>>('/admin/story-highlights', {
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
   * Get story highlight by ID
   */
  getById: async (id: string): Promise<StoryHighlight> => {
    const response = await api.get<ApiResponse<{ highlight: StoryHighlight }>>(`/admin/story-highlights/${id}`);
    return response.data.data.highlight;
  },

  /**
   * Create new story highlight
   */
  create: async (data: CreateStoryHighlightData): Promise<StoryHighlight> => {
    const response = await api.post<ApiResponse<{ highlight: StoryHighlight }>>('/admin/story-highlights', data);
    return response.data.data.highlight;
  },

  /**
   * Update story highlight
   */
  update: async (id: string, data: UpdateStoryHighlightData): Promise<StoryHighlight> => {
    const response = await api.patch<ApiResponse<{ highlight: StoryHighlight }>>(`/admin/story-highlights/${id}`, data);
    return response.data.data.highlight;
  },

  /**
   * Delete story highlight
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/story-highlights/${id}`);
  },
};

