import api, { type ApiResponse } from "../utils/api";
import { authApiService } from "./auth.api";

export interface DashboardStats {
  users: {
    total: number;
  };
  vendors: {
    total: number;
    pending: number;
  };
  products: {
    total: number;
  };
  orders: {
    total: number;
    uncompleted?: number;
  };
  revenue: {
    totalMinor: bigint | string;
    currency: string;
  };
  kyc: {
    pending: number;
  };
  bidding?: {
    pendingPayment: number;
  };
  refunds?: {
    pending: number;
  };
}

export interface UserStats {
  total: number;
  byStatus: Record<string, number>;
  byRole: Record<string, number>;
}

export interface SalesStats {
  revenue: {
    totalMinor: bigint | string;
    currency: string;
  };
  orders: {
    total: number;
  };
  byStatus: Array<{
    status: string;
    revenueMinor: bigint | string;
    count: number;
  }>;
  byVendor: Array<{
    vendorId: string;
    revenueMinor: bigint | string;
    count: number;
  }>;
}

export interface AuditLog {
  id: string;
  userId: string | null;
  resourceType: string;
  resourceId: string;
  action: string;
  details: any;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user?: {
    id: string;
    email: string;
  } | null;
}

export const dashboardApi = {
  // Get dashboard statistics
  getDashboard: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<{ stats: DashboardStats }>>(
      "/admin/dashboard"
    );
    return response.data.data.stats;
  },

  // Get user statistics with filters
  getUserStats: async (filters?: {
    role?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<UserStats> => {
    const response = await api.get<ApiResponse<{ stats: UserStats }>>(
      "/admin/stats/users",
      {
        params: filters,
      }
    );
    return response.data.data.stats;
  },

  // Get sales statistics with filters
  getSalesStats: async (filters?: {
    vendor_id?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<SalesStats> => {
    const response = await api.get<ApiResponse<{ stats: SalesStats }>>(
      "/admin/stats/sales",
      {
        params: filters,
      }
    );
    return response.data.data.stats;
  },

  // Get audit logs (recent activities)
  getAuditLogs: async (params?: {
    page?: number;
    limit?: number;
    user_id?: string;
    resource_type?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<{ logs: AuditLog[]; pagination: any }> => {
    const response = await api.get<ApiResponse<AuditLog[]>>(
      "/admin/audit-logs",
      {
        params,
      }
    );
    // Backend uses sendPaginated which returns data as an array with pagination in the response
    // So response.data.data is the array of logs, and response.data.pagination is the pagination
    return {
      logs: Array.isArray(response.data.data) ? response.data.data : [],
      pagination: response.data.pagination || {},
    };
  },

  // Get current user info for welcome message
  getCurrentUser: () => {
    return authApiService.getStoredUser();
  },
};
