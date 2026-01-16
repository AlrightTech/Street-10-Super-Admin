import api, { type ApiResponse, type PaginatedResponse } from '../utils/api';

export interface FeaturedProduct {
  id: string;
  productId: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'scheduled' | 'expired';
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    title: string;
    description: string | null;
    priceMinor: string;
    currency: string;
    status: string;
    media: Array<{
      id: string;
      url: string;
      type: string;
      displayOrder: number;
    }>;
    categories: Array<{
      categoryId: string;
      category: {
        id: string;
        name: string;
        slug: string;
      } | null;
    }>;
  };
}

export interface FeaturedProductFilters {
  search?: string;
  status?: 'active' | 'scheduled' | 'expired';
  priority?: 'high' | 'medium' | 'low';
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'oldest';
}

export interface CreateFeaturedProductData {
  productId: string;
  priority: 'high' | 'medium' | 'low';
  startDate: string;
  endDate: string;
}

export interface UpdateFeaturedProductData extends Partial<CreateFeaturedProductData> {}

export interface Product {
  id: string;
  title: string;
  description: string | null;
  priceMinor: string;
  currency: string;
  status: string;
  media: Array<{
    id: string;
    url: string;
    type: string;
    displayOrder: number;
  }>;
  categories: Array<{
    categoryId: string;
    category: {
      id: string;
      name: string;
      slug: string;
    } | null;
  }>;
}

export interface ProductFilters {
  search?: string;
  status?: string;
  superadminOnly?: boolean;
  page?: number;
  limit?: number;
}

export const featuredProductsApi = {
  /**
   * Get all featured products with filters and pagination
   */
  getAll: async (filters: FeaturedProductFilters = {}): Promise<PaginatedResponse<FeaturedProduct>> => {
    const response = await api.get<ApiResponse<FeaturedProduct[]>>('/admin/featured-products', {
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
   * Get featured product by ID
   */
  getById: async (id: string): Promise<FeaturedProduct> => {
    const response = await api.get<ApiResponse<FeaturedProduct>>(`/admin/featured-products/${id}`);
    return response.data.data;
  },

  /**
   * Create new featured product
   */
  create: async (data: CreateFeaturedProductData): Promise<FeaturedProduct> => {
    const response = await api.post<ApiResponse<FeaturedProduct>>('/admin/featured-products', data);
    return response.data.data;
  },

  /**
   * Update featured product
   */
  update: async (id: string, data: UpdateFeaturedProductData): Promise<FeaturedProduct> => {
    const response = await api.patch<ApiResponse<FeaturedProduct>>(`/admin/featured-products/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete featured product
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/featured-products/${id}`);
  },
};

/**
 * Get available products to feature (for dropdown/search)
 */
export const productsApi = {
  /**
   * Search products by title/description
   */
  search: async (filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<ApiResponse<Product[]>>('/products', {
      params: {
        ...filters,
        superadminOnly: true, // Only show superadmin products
        excludeBidding: true, // Exclude bidding products
      },
    });
    const apiResponse = response.data as any;
    return {
      data: (apiResponse.data || apiResponse.products || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description || null,
        priceMinor: p.priceMinor?.toString() || '0',
        currency: p.currency || 'QAR',
        status: p.status,
        media: p.media || [],
        categories: p.categories || [],
      })),
      pagination: apiResponse.pagination || {
        page: filters.page || 1,
        limit: filters.limit || 20,
        total: 0,
        totalPages: 1,
      },
    };
  },
};
