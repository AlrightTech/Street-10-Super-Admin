import type { BidDetails } from '../types/bidDetails'

/**
 * Mock bid details data matching the image
 */
export const mockBidDetails: Record<string, BidDetails> = {
  'BID-2024-001': {
    id: '1',
    bidId: 'BID-2024-001',
    auctionId: 'AUC-2024-RSW-001',
    auctionName: 'Rolex Submariner Watch Auction',
    categoryName: 'Luxury Watches',
    startingPrice: 5000,
    finalBidAmount: 8750,
    status: 'winning',
    bidDate: '10/02/2024',
    bidTime: '19:30:00',
    bidder: {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      address: 'New York, NY',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    },
    product: {
      id: '1',
      name: 'Rolex Submariner Watch',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
      category: 'Luxury Watches',
      condition: 'Excellent',
      description: 'Authentic Rolex Submariner, fully serviced',
      startingPrice: 5000,
      reservePrice: 7000,
      currentHighestBid: 8750,
      auctionStatus: 'ongoing',
    },
    timeline: [
      {
        id: '1',
        amount: 7500,
        status: 'outbid',
        date: '2024-03-15',
        time: '14:30:00a',
      },
      {
        id: '2',
        amount: 8200,
        status: 'outbid',
        date: '2024-03-15',
        time: '14:35:00',
      },
      {
        id: '3',
        amount: 8750,
        status: 'winning',
        date: '2024-03-15',
        time: '16:20:00',
      },
    ],
  },
}

/**
 * Get bid details by ID
 */
export function getBidDetails(bidId: string): BidDetails | null {
  return mockBidDetails[bidId] || null
}

