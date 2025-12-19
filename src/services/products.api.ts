import api, { type ApiResponse, type PaginatedResponse } from '../utils/api';

export interface Product {
  id: string;
  vendorId: string;
  title: string;
  description: string | null;
  priceMinor: string;
  currency: string;
  stock: number;
  sku: string | null;
  status: string; // draft, active, inactive
  attributes: any;
  langData: any;
  createdAt: string;
  updatedAt: string;
  media: Array<{
    id: string;
    url: string;
    type: string;
    displayOrder: number;
  }>;
  categories: Array<{
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
}

export interface CreateProductData {
  title: string;
  description?: string;
  priceMinor: number;
  currency?: string;
  stock?: number;
  sku?: string;
  status?: string;
  categoryIds?: string[];
  attributes?: any;
  langData?: any;
  mediaUrls?: string[];
}

export interface UpdateProductData {
  title?: string;
  description?: string;
  priceMinor?: number;
  stock?: number;
  status?: string;
  categoryIds?: string[];
  attributes?: any;
  langData?: any;
  mediaUrls?: string[];
}

export interface ProductFilters {
  category_id?: string;
  vendor_id?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const productsApi = {
  // Get all products
  getAll: async (filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<ApiResponse<Product[]>>('/products', {
      params: filters,
    });
    // Backend returns: { success: true, data: [...products], pagination: {...} }
    // Frontend expects: { data: [...products], pagination: {...} }
    return {
      data: response.data.data || [],
      pagination: response.data.pagination || {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
      },
    };
  },

  // Get product by ID
  getById: async (id: string): Promise<Product> => {
    const response = await api.get<ApiResponse<{ product: Product }>>(`/products/${id}`);
    return response.data.data.product;
  },

  // Create product
  create: async (data: CreateProductData): Promise<Product> => {
    const response = await api.post<ApiResponse<{ product: Product }>>('/products', data);
    return response.data.data.product;
  },

  // Update product
  update: async (id: string, data: UpdateProductData): Promise<Product> => {
    const response = await api.patch<ApiResponse<{ product: Product }>>(`/products/${id}`, data);
    return response.data.data.product;
  },

  // Delete product
  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

