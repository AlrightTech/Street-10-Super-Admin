import api, { type ApiResponse, type PaginatedResponse } from '../utils/api';

export interface KYCSubmission {
  id: string;
  userId: string;
  status: string;
  docsUrls: any;
  reviewedBy: string | null;
  reason: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    phone: string | null;
    status: string;
    createdAt: string;
  };
}

export interface KYCDetailsResponse {
  kyc: KYCSubmission;
  auditLogs: any[];
}

export interface KYCFilters {
  status?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}

export const kycApi = {
  // Get all KYC submissions
  getAll: async (filters?: KYCFilters): Promise<PaginatedResponse<KYCSubmission>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<KYCSubmission>>>('/admin/kyc', {
      params: filters,
    });
    return response.data.data;
  },

  // Get KYC by user ID
  getByUserId: async (userId: string): Promise<KYCDetailsResponse> => {
    const response = await api.get<ApiResponse<KYCDetailsResponse>>(`/admin/kyc/${userId}`);
    return response.data.data;
  },

  // Approve KYC
  approve: async (userId: string): Promise<any> => {
    const response = await api.post<ApiResponse<any>>('/kyc/approve', { userId });
    return response.data.data;
  },

  // Reject KYC
  reject: async (userId: string, reason: string): Promise<any> => {
    const response = await api.post<ApiResponse<any>>('/kyc/reject', { userId, reason });
    return response.data.data;
  },
};

