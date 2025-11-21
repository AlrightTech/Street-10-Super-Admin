/**
 * User details type definitions
 */

/**
 * Bidding status type
 */
export type BiddingStatus = 'won-fully-paid' | 'won-payment-pending' | 'lost' | 'refunded'

/**
 * Bidding result type
 */
export type BiddingResult = 'won' | 'lost' | 'pending'

/**
 * Bidding item interface
 */
export interface BiddingItem {
  id: string
  productName: string
  productImage: string
  category: string
  bidId: string
  bidAmount: number
  currentPrice: number
  result: BiddingResult
  endDate: string
  status: BiddingStatus
}

/**
 * Order item interface
 */
export interface OrderItem {
  id: string
  productName: string
  productImage: string
  orderId: string
  amount: number
  date: string
  status: string
}

/**
 * User details interface
 */
export interface UserDetails {
  id: number
  name: string
  email: string
  phone: string
  avatar: string
  role: string
  accountStatus: 'verified' | 'unverified' | 'pending'
  status?: 'pending' | 'blocked' | 'active'
  ordersMade: number
  biddingWins: number
  totalSpent: number
  totalRefunds: number
  pendingRefunds: number
  netSpending: number
  walletBalance: number
  walletLimit: number
  interests: string[]
  interestsImage: string
  biddings: BiddingItem[]
  orders: OrderItem[]
}

