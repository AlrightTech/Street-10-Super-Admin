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
  companyDocs?: any;
  ownerIdUrl?: string | null;
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

  // Update vendor
  update: async (
    id: string,
    data: {
      name?: string;
      email?: string;
      phone?: string | null;
      status?: string;
      companyDocs?: any;
      ownerIdUrl?: string | null;
      accountManagerId?: string | null;
      commissionType?: string;
      commissionValue?: number;
    }
  ): Promise<Vendor> => {
    const response = await api.patch<ApiResponse<{ vendor: Vendor }>>(
      `/vendors/${id}`,
      data
    );
    return response.data.data.vendor;
  },

  // Approve vendor
  approve: async (id: string, data?: { accountManagerId?: string; email?: string; password?: string; commissionRate?: string }): Promise<Vendor> => {
    const response = await api.post<ApiResponse<{ vendor: Vendor }>>(`/vendors/${id}/approve`, data || {});
    return response.data.data.vendor;
  },

  // Reject vendor
  reject: async (id: string, reason?: string): Promise<Vendor> => {
    const response = await api.post<ApiResponse<{ vendor: Vendor }>>(`/vendors/${id}/reject`, { reason });
    return response.data.data.vendor;
  },

  // Delete vendor
  delete: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<{ message: string }>>(`/vendors/${id}`);
  },
};

