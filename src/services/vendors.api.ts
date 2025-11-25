import api, { type ApiResponse, type PaginatedResponse } from '../utils/api';

export interface Vendor {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  accountManagerId: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    phone: string | null;
    status: string;
  };
  accountManager: {
    id: string;
    email: string;
  } | null;
}

export interface VendorFilters {
  status?: string;
  account_manager_id?: string;
  page?: number;
  limit?: number;
}

export const vendorsApi = {
  // Get all vendors
  getAll: async (filters?: VendorFilters): Promise<PaginatedResponse<Vendor>> => {
    const response = await api.get<ApiResponse<Vendor[]>>('/vendors', {
      params: filters,
    });
    // Backend sendPaginated returns { success: true, data: [...], pagination: {...} }
    // We need to return { data: [...], pagination: {...} }
    return {
      data: response.data.data || [],
      pagination: (response.data as any).pagination || {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
    };
  },

  // Get vendor by ID
  getById: async (id: string): Promise<Vendor> => {
    const response = await api.get<ApiResponse<{ vendor: Vendor }>>(`/vendors/${id}`);
    return response.data.data.vendor;
  },

  // Create vendor
  create: async (data: {
    userId: string;
    name: string;
    email: string;
    phone?: string;
    companyDocs?: any;
    ownerIdUrl?: string;
  }): Promise<Vendor> => {
    const response = await api.post<ApiResponse<{ vendor: Vendor }>>('/vendors', data);
    return response.data.data.vendor;
  },
};

