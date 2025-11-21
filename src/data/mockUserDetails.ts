import type { UserDetails } from '../types/userDetails'
import { mockUsers } from './mockUsers'

/**
 * Mock user details data matching the image
 */
export const mockUserDetails: Record<number, UserDetails> = {
  1: {
    id: 1,
    name: 'Touseef Ahmed',
    email: 'alice.johnson@example.com',
    phone: '+1 234 567 8900',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    role: 'Touseeef',
    accountStatus: 'verified',
    status: 'active',
    ordersMade: 2,
    biddingWins: 22,
    totalSpent: 2149.96,
    totalRefunds: 199.99,
    pendingRefunds: 0.0,
    netSpending: 1949.97,
    walletBalance: 3200,
    walletLimit: 2000,
    interests: ['Cars'],
    interestsImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=200&h=150&fit=crop',
    biddings: [
      {
        id: '1',
        productName: 'Vintage Leather Jacket',
        productImage: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=100&h=100&fit=crop',
        category: 'Electronic',
        bidId: 'BID-2024-001',
        bidAmount: 8750,
        currentPrice: 8750,
        result: 'won',
        endDate: '15/01/2024',
        status: 'won-fully-paid',
      },
      {
        id: '2',
        productName: 'Smart Watch Pro',
        productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
        category: 'Collectibles',
        bidId: 'BID-2024-001',
        bidAmount: 299.99,
        currentPrice: 299.99,
        result: 'pending',
        endDate: '15/01/2024',
        status: 'won-payment-pending',
      },
      {
        id: '3',
        productName: 'Designer Handbag',
        productImage: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=100&h=100&fit=crop',
        category: 'Art',
        bidId: 'BID-2024-001',
        bidAmount: 299.99,
        currentPrice: 299.99,
        result: 'lost',
        endDate: '15/01/2024',
        status: 'lost',
      },
      {
        id: '4',
        productName: 'Wireless Headphones',
        productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
        category: 'Home Decor',
        bidId: 'BID-2024-001',
        bidAmount: 299.99,
        currentPrice: 299.99,
        result: 'pending',
        endDate: '15/01/2024',
        status: 'refunded',
      },
    ],
    orders: [
      {
        id: '1',
        productName: 'Apple AirPods Pro (3rd Generation)',
        productImage: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=100&h=100&fit=crop',
        orderId: 'ORD-2024-001',
        amount: 453.96,
        date: '15/01/2024',
        status: 'completed',
      },
      {
        id: '2',
        productName: 'Product 2',
        productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
        orderId: 'ORD-2024-002',
        amount: 200.0,
        date: '15/01/2024',
        status: 'completed',
      },
      {
        id: '3',
        productName: 'Product 3',
        productImage: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=100&h=100&fit=crop',
        orderId: 'ORD-2024-003',
        amount: 250.0,
        date: '15/01/2024',
        status: 'completed',
      },
      {
        id: '4',
        productName: 'Product 4',
        productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
        orderId: 'ORD-2024-004',
        amount: 300.0,
        date: '15/01/2024',
        status: 'completed',
      },
    ],
  },
}

/**
 * Generate default user details from User data
 */
function generateUserDetails(userId: number): UserDetails | null {
  const user = mockUsers.find((u) => u.id === userId)
  if (!user) return null

  // Generate avatar URL based on user ID
  const avatarNumber = (userId % 10) + 1
  const interestsImages = [
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=200&h=150&fit=crop',
    'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=200&h=150&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=150&fit=crop',
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=200&h=150&fit=crop',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=150&fit=crop',
  ]

  const totalSpent = user.totalPurchase * 10 + Math.random() * 1000
  const totalRefunds = Math.floor(Math.random() * 200)
  const pendingRefunds = Math.floor(Math.random() * 100)
  const netSpending = totalSpent - totalRefunds - pendingRefunds

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: `+1 ${String(Math.floor(Math.random() * 900) + 100)} ${String(Math.floor(Math.random() * 900) + 100)} ${String(Math.floor(Math.random() * 9000) + 1000)}`,
    avatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&sig=${userId}`,
    role: user.role,
    accountStatus: user.status === 'active' ? 'verified' : user.status === 'blocked' ? 'unverified' : 'pending',
    status: user.status,
    ordersMade: Math.floor(Math.random() * 10) + 1,
    biddingWins: Math.floor(Math.random() * 30) + 1,
    totalSpent,
    totalRefunds,
    pendingRefunds,
    netSpending,
    walletBalance: Math.floor(Math.random() * 5000) + 1000,
    walletLimit: 2000,
    interests: ['Cars', 'Electronics', 'Collectibles'],
    interestsImage: interestsImages[avatarNumber % interestsImages.length],
    biddings: [],
    orders: [],
  }
}

/**
 * Get user details by ID
 */
export function getUserDetails(userId: number): UserDetails | null {
  // First try to get from mockUserDetails
  if (mockUserDetails[userId]) {
    return mockUserDetails[userId]
  }
  
  // If not found, generate from User data
  return generateUserDetails(userId)
}

/**
 * Update user details
 */
export function updateUserDetails(userId: number, updates: Partial<UserDetails>): void {
  // If user exists in mockUserDetails, update it
  if (mockUserDetails[userId]) {
    mockUserDetails[userId] = {
      ...mockUserDetails[userId],
      ...updates,
    }
  } else {
    // If user doesn't exist, generate it first, then update
    const generatedUser = generateUserDetails(userId)
    if (generatedUser) {
      mockUserDetails[userId] = {
        ...generatedUser,
        ...updates,
      }
    }
  }
}

