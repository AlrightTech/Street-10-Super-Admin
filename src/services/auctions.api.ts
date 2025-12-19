import api, { type ApiResponse, type PaginatedResponse } from '../utils/api';

export interface Auction {
  id: string;
  productId: string;
  type: string; // english, dutch, sealed, buy_now
  state: string; // draft, scheduled, live, ended, settled
  startAt: string;
  endAt: string;
  minIncrement: string;
  reservePrice: string | null;
  depositAmount: string;
  buyNowPrice: string | null;
  autoExtendSeconds: number;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    title: string;
    description: string | null;
    priceMinor: string;
    currency: string;
    status: string;
    vendorId: string;
    media: Array<{
      id: string;
      url: string;
      type: string;
      displayOrder: number;
    }>;
    vendor: {
      id: string;
      email: string;
    };
  };
  bids: Array<{
    id: string;
    amountMinor: string;
    userId: string;
    placedAt: string;
    isWinning: boolean;
    user: {
      id: string;
      email: string;
    };
  }>;
}

export interface AuctionFilters {
  state?: string;
  type?: string;
  vendor_id?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}

export interface CreateAuctionData {
  productId: string;
  type: string;
  startAt: string; // ISO 8601
  endAt: string; // ISO 8601
  minIncrement: number;
  reservePrice?: number;
  depositAmount: number;
  buyNowPrice?: number;
  autoExtendSeconds?: number;
}

export interface UpdateAuctionData {
  state?: string;
  startAt?: string;
  endAt?: string;
  minIncrement?: number;
  reservePrice?: number;
  depositAmount?: number;
  buyNowPrice?: number;
}

export const auctionsApi = {
  // Get all auctions with filters
  getAll: async (filters?: AuctionFilters): Promise<PaginatedResponse<Auction>> => {
    const response = await api.get<ApiResponse<Auction[]>>('/auctions', {
      params: filters,
    });
    // Backend sends { success: true, data: [...], pagination: {...} }
    // Frontend expects { data: [...], pagination: {...} }
    const apiResponse = response.data as any;
    return {
      data: apiResponse.data || [],
      pagination: apiResponse.pagination || {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
    };
  },

  // Get active auctions only
  getActive: async (filters?: Omit<AuctionFilters, 'state'>): Promise<PaginatedResponse<Auction>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Auction>>>('/auctions/active', {
      params: { ...filters, state: 'live' },
    });
    return response.data.data;
  },

  // Get auction by ID
  getById: async (id: string): Promise<Auction> => {
    const response = await api.get<ApiResponse<{ auction: Auction }>>(`/auctions/${id}`);
    return response.data.data.auction;
  },

  // Create auction
  create: async (data: CreateAuctionData): Promise<Auction> => {
    const response = await api.post<ApiResponse<{ auction: Auction }>>('/auctions', data);
    return response.data.data.auction;
  },

  // Update auction state
  updateState: async (id: string, state: string): Promise<Auction> => {
    const response = await api.patch<ApiResponse<{ auction: Auction }>>(`/auctions/${id}/state`, { state });
    return response.data.data.auction;
  },

  // Note: Backend doesn't currently support full auction updates
  // Only state can be updated via updateState

  // Get bids for an auction
  getBids: async (auctionId: string, page = 1, limit = 50) => {
    const response = await api.get(`/auctions/${auctionId}/bids`, {
      params: { page, limit },
    });
    return response.data.data;
  },
};

