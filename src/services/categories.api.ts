import api, { type ApiResponse } from '../utils/api';

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

export const categoriesApi = {
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
};

