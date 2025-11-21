import api, { type ApiResponse, type PaginatedResponse } from '../utils/api';

export interface User {
  id: string;
  email: string;
  phone: string | null;
  status: string;
  role: string;
  lang: string;
  createdAt: string;
  updatedAt: string;
  wallet?: {
    availableMinor: string;
    onHoldMinor: string;
    lockedMinor: string;
    currency: string;
  };
  kycSubmission?: {
    status: string;
  };
  stats?: {
    ordersCount: number;
    bidsWon: number;
    totalSpent: string;
  };
}

export interface UserDetailsResponse {
  user: User & {
    wallet?: {
      availableMinor: string;
      onHoldMinor: string;
      lockedMinor: string;
      currency: string;
    };
    kycSubmission?: {
      status: string;
    };
  };
  stats: {
    ordersCount: number;
    bidsWon: number;
    totalSpent: bigint | string;
  };
  recentOrders: any[];
  recentBids: any[];
}

export interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}

export interface UpdateUserData {
  email?: string;
  phone?: string;
  status?: string;
  role?: string;
  lang?: string;
}

export const usersApi = {
  // Get all users with filters
  getAll: async (filters?: UserFilters): Promise<PaginatedResponse<User>> => {
    const response = await api.get<ApiResponse<User[]>>('/admin/users', {
      params: filters,
    });
    // Backend uses sendPaginated which returns data as array with pagination in response
    // So response.data.data is the array, and response.data.pagination is the pagination
    // Type assertion needed because ApiResponse<T[]> doesn't include pagination in type but backend sends it
    return {
      data: Array.isArray(response.data.data) ? response.data.data : [],
      pagination: (response.data as any).pagination || { page: 1, limit: 20, total: 0, totalPages: 0 },
    };
  },

  // Get user by ID
  getById: async (id: string): Promise<UserDetailsResponse> => {
    const response = await api.get<ApiResponse<UserDetailsResponse>>(`/admin/users/${id}`);
    return response.data.data;
  },

  // Update user
  update: async (id: string, data: UpdateUserData): Promise<User> => {
    const response = await api.patch<ApiResponse<{ user: User }>>(`/admin/users/${id}`, data);
    return response.data.data.user;
  },

  // Block/unblock user
  toggleBlock: async (id: string, blocked: boolean): Promise<User> => {
    const response = await api.patch<ApiResponse<{ user: User }>>(
      `/admin/users/${id}/block`,
      { blocked }
    );
    return response.data.data.user;
  },

  // Get user activity
  getActivity: async (id: string, page = 1, limit = 50) => {
    const response = await api.get(`/admin/users/${id}/activity`, {
      params: { page, limit },
    });
    return response.data.data;
  },

  // Get user orders
  getOrders: async (id: string, page = 1, limit = 20) => {
    const response = await api.get(`/admin/users/${id}/orders`, {
      params: { page, limit },
    });
    return response.data.data;
  },

  // Get user bids
  getBids: async (id: string, page = 1, limit = 20) => {
    const response = await api.get(`/admin/users/${id}/bids`, {
      params: { page, limit },
    });
    return response.data.data;
  },

  // Get user wallet
  getWallet: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`/admin/users/${id}/wallet`);
    return response.data.data;
  },
};

