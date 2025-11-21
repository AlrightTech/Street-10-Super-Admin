import api, { type ApiResponse, type PaginatedResponse } from '../utils/api';

export interface Bid {
  id: string;
  auctionId: string;
  userId: string;
  amountMinor: string;
  placedAt: string;
  isWinning: boolean;
  user: {
    id: string;
    email: string;
    phone: string | null;
    status: string;
  };
  auction: {
    id: string;
    productId: string;
    state: string;
    startAt: string;
    endAt: string;
    product: {
      id: string;
      title: string;
      media: Array<{
        id: string;
        url: string;
        type: string;
      }>;
    };
  };
}

export interface BidDetails {
  bid: Bid & {
    auction: {
      id: string;
      product: {
        id: string;
        title: string;
        description: string | null;
        vendor: {
          id: string;
          email: string;
        };
        categories: Array<{
          category: {
            id: string;
            name: string;
          };
        }>;
        media: Array<{
          id: string;
          url: string;
          type: string;
        }>;
      };
    };
  };
  timeline: Array<{
    id: string;
    auctionId: string;
    userId: string;
    amountMinor: string;
    placedAt: string;
    isWinning: boolean;
  }>;
  allBids: Array<{
    id: string;
    amountMinor: string;
    placedAt: string;
    isWinning: boolean;
    user: {
      id: string;
      email: string;
    };
  }>;
}

export interface BidFilters {
  user_id?: string;
  auction_id?: string;
  is_winning?: boolean;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}

export const bidsApi = {
  // Get all bids with filters
  getAll: async (filters?: BidFilters): Promise<PaginatedResponse<Bid>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Bid>>>('/admin/bids', {
      params: filters,
    });
    return response.data.data;
  },

  // Get bid by ID
  getById: async (id: string): Promise<BidDetails> => {
    const response = await api.get<ApiResponse<BidDetails>>(`/admin/bids/${id}`);
    return response.data.data;
  },

  // Get bids for an auction
  getByAuction: async (auctionId: string, page = 1, limit = 50) => {
    const response = await api.get(`/admin/auctions/${auctionId}/bids`, {
      params: { page, limit },
    });
    return response.data.data;
  },
};

