import api, { type ApiResponse, type PaginatedResponse } from "../utils/api";

export interface WalletTransaction {
  id: string;
  userId: string;
  type: string;
  amountMinor: string;
  currency: string;
  status: string;
  refId: string | null;
  meta: any;
  createdAt: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
  };
}

export interface UserWallet {
  userId: string;
  availableMinor: string;
  onHoldMinor: string;
  lockedMinor: string;
  currency: string;
  frozen: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
  };
}

export interface WalletMetrics {
  totalWallets: number;
  totalBalance: string;
  totalOnHold: string;
  totalLocked: string;
  frozenWallets: number;
  pendingWithdrawals: number;
  totalTransactions: number;
}

export interface WithdrawRequest {
  id: string;
  userId: string;
  amountMinor: string;
  currency: string;
  bankName: string;
  iban: string;
  accountNumber: string;
  country: string;
  swiftCode: string;
  status: string;
  processedBy: string | null;
  processedAt: string | null;
  rejectionReason: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
  };
}

export interface CreditWalletData {
  amountMinor: number;
  description: string;
}

export interface DebitWalletData {
  amountMinor: number;
  reason: string;
}

export interface ApproveWithdrawData {
  adminNotes?: string;
  documentUrl?: string;
}

export interface RejectWithdrawData {
  rejectionReason: string;
  adminNotes?: string;
}

export interface WalletFilters {
  page?: number;
  limit?: number;
  userId?: string;
  type?: string;
  status?: string;
  frozen?: boolean;
}

export const walletApi = {
  /**
   * Get all wallet transactions (admin)
   */
  getTransactions: async (filters?: WalletFilters): Promise<PaginatedResponse<WalletTransaction>> => {
    const response = await api.get<ApiResponse<WalletTransaction[]>>("/admin/wallet/transactions", {
      params: filters,
    });
    return {
      data: Array.isArray(response.data.data) ? response.data.data : [],
      pagination: (response.data as any).pagination || {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
    };
  },

  /**
   * Get all user wallets (admin)
   */
  getUserWallets: async (filters?: WalletFilters): Promise<PaginatedResponse<UserWallet>> => {
    const response = await api.get<ApiResponse<UserWallet[]>>("/admin/wallet/users", {
      params: filters,
    });
    return {
      data: Array.isArray(response.data.data) ? response.data.data : [],
      pagination: (response.data as any).pagination || {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
    };
  },

  /**
   * Get user wallet details (admin)
   */
  getUserWallet: async (userId: string): Promise<{ wallet: UserWallet; recentTransactions: WalletTransaction[] }> => {
    const response = await api.get<ApiResponse<{ wallet: UserWallet; recentTransactions: WalletTransaction[] }>>(
      `/admin/wallet/users/${userId}`
    );
    return response.data.data;
  },

  /**
   * Get wallet metrics (admin)
   */
  getMetrics: async (): Promise<WalletMetrics> => {
    const response = await api.get<ApiResponse<WalletMetrics>>("/admin/wallet/metrics");
    return response.data.data;
  },

  /**
   * Credit wallet (admin)
   */
  creditWallet: async (userId: string, data: CreditWalletData): Promise<{ wallet: UserWallet; transaction: WalletTransaction }> => {
    const response = await api.post<ApiResponse<{ wallet: UserWallet; transaction: WalletTransaction }>>(
      `/admin/wallet/users/${userId}/credit`,
      data
    );
    return response.data.data;
  },

  /**
   * Debit wallet (admin)
   */
  debitWallet: async (userId: string, data: DebitWalletData): Promise<{ wallet: UserWallet; transaction: WalletTransaction }> => {
    const response = await api.post<ApiResponse<{ wallet: UserWallet; transaction: WalletTransaction }>>(
      `/admin/wallet/users/${userId}/debit`,
      data
    );
    return response.data.data;
  },

  /**
   * Freeze wallet (admin)
   */
  freezeWallet: async (userId: string): Promise<UserWallet> => {
    const response = await api.post<ApiResponse<UserWallet>>(
      `/admin/wallet/users/${userId}/freeze`
    );
    return response.data.data;
  },

  /**
   * Unfreeze wallet (admin)
   */
  unfreezeWallet: async (userId: string): Promise<UserWallet> => {
    const response = await api.post<ApiResponse<UserWallet>>(
      `/admin/wallet/users/${userId}/unfreeze`
    );
    return response.data.data;
  },

  /**
   * Get all withdraw requests (admin)
   */
  getWithdrawRequests: async (filters?: { page?: number; limit?: number; status?: string; userId?: string }): Promise<PaginatedResponse<WithdrawRequest>> => {
    const response = await api.get<ApiResponse<WithdrawRequest[]>>("/admin/wallet/withdraw-requests", {
      params: filters,
    });
    return {
      data: Array.isArray(response.data.data) ? response.data.data : [],
      pagination: (response.data as any).pagination || {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
    };
  },

  /**
   * Get single withdraw request (admin)
   */
  getWithdrawRequest: async (id: string): Promise<WithdrawRequest> => {
    const response = await api.get<ApiResponse<WithdrawRequest>>(
      `/admin/wallet/withdraw-requests/${id}`
    );
    return response.data.data;
  },

  /**
   * Approve withdraw request (admin)
   */
  approveWithdrawRequest: async (id: string, data?: ApproveWithdrawData): Promise<WithdrawRequest> => {
    const response = await api.post<ApiResponse<WithdrawRequest>>(
      `/admin/wallet/withdraw-requests/${id}/approve`,
      data || {}
    );
    return response.data.data;
  },

  /**
   * Reject withdraw request (admin)
   */
  rejectWithdrawRequest: async (id: string, data: RejectWithdrawData): Promise<WithdrawRequest> => {
    const response = await api.post<ApiResponse<WithdrawRequest>>(
      `/admin/wallet/withdraw-requests/${id}/reject`,
      data
    );
    return response.data.data;
  },

  /**
   * Get single transaction by ID (admin)
   */
  getTransactionById: async (id: string): Promise<WalletTransaction> => {
    const response = await api.get<ApiResponse<WalletTransaction>>(
      `/admin/wallet/transactions/${id}`
    );
    return response.data.data;
  },
};

export interface WalletSettings {
  minimumWalletBalance: number;
  transactionFee: number;
  maximumWithdrawalAmount: number;
  minimumWithdrawalAmount: number;
  dailyWithdrawalLimit: number;
  withdrawalProcessingDays: number;
  autoApproveWithdrawals: boolean;
  requireKYCForWithdrawals: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export const walletSettingsApi = {
  /**
   * Get wallet settings (admin)
   */
  getSettings: async (): Promise<WalletSettings> => {
    const response = await api.get<ApiResponse<WalletSettings>>(
      `/admin/wallet/settings`
    );
    return response.data.data;
  },

  /**
   * Update wallet settings (admin)
   */
  updateSettings: async (settings: Partial<WalletSettings>): Promise<WalletSettings> => {
    const response = await api.put<ApiResponse<WalletSettings>>(
      `/admin/wallet/settings`,
      settings
    );
    return response.data.data;
  },

  /**
   * Export transactions (admin)
   */
  exportTransactions: async (params: {
    startDate?: string;
    endDate?: string;
    userId?: string;
    includeUserDetails?: boolean;
    includeFeeBreakdown?: boolean;
    format?: 'csv' | 'json';
  }): Promise<void> => {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.includeUserDetails) queryParams.append('includeUserDetails', 'true');
    if (params.format) queryParams.append('format', params.format);

    const response = await api.get(
      `/admin/wallet/transactions/export?${queryParams.toString()}`,
      { responseType: 'blob' }
    );

    // Create download link
    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wallet-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

export interface UserSpendingSummary {
  totalOrdersSpent: string;
  totalBiddingSpent: string;
  totalOrderRefunds: string;
  totalWalletRefunds: string;
  pendingOrderRefunds: string;
  pendingWalletRefunds: string;
  netSpending: string;
  totalOrders: number;
  completedOrders: number;
  refundedOrders: number;
  totalBiddingWon: number;
  currentWalletBalance: string;
}

export interface UserOrder {
  id: string;
  orderNumber: string;
  totalMinor: string;
  currency: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
  vendor?: {
    id: string;
    name: string | null;
  };
}

export interface UserBid {
  id: string;
  amountMinor: string;
  currency: string;
  placedAt: string;
  isWinning: boolean;
  auction?: {
    id: string;
    endAt: string;
    state: string;
    product?: {
      id: string;
      title: string;
      media?: Array<{ url: string }>;
    };
  };
}

export const userApi = {
  /**
   * Get user spending summary (admin)
   */
  getSpendingSummary: async (userId: string): Promise<UserSpendingSummary> => {
    const response = await api.get<ApiResponse<UserSpendingSummary>>(
      `/admin/users/${userId}/spending-summary`
    );
    return response.data.data;
  },

  /**
   * Get user orders (admin)
   */
  getOrders: async (userId: string, filters?: { page?: number; limit?: number; status?: string }): Promise<PaginatedResponse<UserOrder>> => {
    const response = await api.get<ApiResponse<UserOrder[]>>(
      `/admin/users/${userId}/orders`,
      { params: filters }
    );
    return {
      data: Array.isArray(response.data.data) ? response.data.data : [],
      pagination: (response.data as any).pagination || {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
    };
  },

  /**
   * Get user bids (admin)
   */
  getBids: async (userId: string, filters?: { page?: number; limit?: number }): Promise<PaginatedResponse<UserBid>> => {
    const response = await api.get<ApiResponse<UserBid[]>>(
      `/admin/users/${userId}/bids`,
      { params: filters }
    );
    return {
      data: Array.isArray(response.data.data) ? response.data.data : [],
      pagination: (response.data as any).pagination || {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
    };
  },
};
