/**
 * Bid details type definitions
 */

/**
 * Bid status type
 */
export type BidStatus = 'winning' | 'outbid' | 'pending' | 'lost'

/**
 * Bid timeline event
 */
export interface BidTimelineEvent {
  id: string
  amount: number
  status: BidStatus
  date: string
  time: string
}

/**
 * Bidder information
 */
export interface BidderInfo {
  id: number
  name: string
  email: string
  phone?: string
  address?: string
  avatar: string
}

/**
 * Product information
 */
export interface ProductInfo {
  id: string
  name: string
  image: string
  category: string
  condition?: string
  description?: string
  startingPrice: number
  reservePrice?: number
  currentHighestBid: number
  auctionStatus: 'ongoing' | 'completed' | 'cancelled'
}

/**
 * Bid details interface
 */
export interface BidDetails {
  id: string
  bidId: string
  auctionId: string
  auctionName: string
  categoryName: string
  startingPrice: number
  finalBidAmount: number
  status: BidStatus
  bidDate: string
  bidTime: string
  bidder: BidderInfo
  product: ProductInfo
  timeline: BidTimelineEvent[]
}

