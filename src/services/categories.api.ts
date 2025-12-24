import api, { type ApiResponse, type PaginatedResponse } from '../utils/api';

export interface Category {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  langData: any;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  children?: Category[];
}

export interface CategoryListFilters {
  search?: string;
  parentId?: string | null;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CategoryFilterAssignment {
  categoryId: string;
  filterId: string;
  displayOrder: number;
  required: boolean;
  visibility: 'listing' | 'detail' | 'admin';
}

export const categoriesApi = {
  // Get paginated categories list
  getAll: async (filters: CategoryListFilters = {}): Promise<PaginatedResponse<Category>> => {
    const response = await api.get<ApiResponse<Category[]>>('/categories', {
      params: filters,
    });
    const apiResponse = response.data as any;
    return {
      data: apiResponse.data || [],
      pagination: apiResponse.pagination || {
        page: filters.page || 1,
        limit: filters.limit || 20,
        total: 0,
        totalPages: 1,
      },
    };
  },
  // Get category tree
  getTree: async (): Promise<Category[]> => {
    const response = await api.get<ApiResponse<{ categories: Category[] }>>('/categories/tree');
    return response.data.data.categories || [];
  },

  // Get category by ID
  getById: async (id: string): Promise<Category> => {
    const response = await api.get<ApiResponse<{ category: Category }>>(`/categories/${id}`);
    return response.data.data.category;
  },

  // Create category
  create: async (data: Partial<Category> & { name: string }): Promise<Category> => {
    const response = await api.post<ApiResponse<{ category: Category }>>('/categories', data);
    return response.data.data.category;
  },

  // Update category
  update: async (id: string, data: Partial<Category>): Promise<Category> => {
    const response = await api.patch<ApiResponse<{ category: Category }>>(`/categories/${id}`, data);
    return response.data.data.category;
  },

  // Delete category
  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },

  // Get filters assigned to a category
  getCategoryFilters: async (categoryId: string) => {
    const response = await api.get<ApiResponse<{ filters: any[] }>>(`/categories/${categoryId}/filters`);
    return response.data.data.filters;
  },

  // Assign filter to category
  assignFilterToCategory: async (
    categoryId: string,
    payload: { filterId: string; displayOrder?: number; required?: boolean; visibility?: 'listing' | 'detail' | 'admin' }
  ) => {
    const response = await api.post<ApiResponse<{ assignment: CategoryFilterAssignment }>>(
      `/categories/${categoryId}/filters`,
      payload,
    );
    return response.data.data.assignment;
  },

  // Remove filter from category
  removeFilterFromCategory: async (categoryId: string, filterId: string): Promise<void> => {
    await api.delete(`/categories/${categoryId}/filters/${filterId}`);
  },
};

