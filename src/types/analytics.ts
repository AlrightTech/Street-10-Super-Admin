/**
 * Analytics page type definitions
 */

/**
 * Analytics summary card type
 */
export interface AnalyticsStatCard {
  id: string
  title: string
  value: string | number
  change: number
  changeLabel: string
  trend: 'up' | 'down'
  color: 'blue' | 'cyan' | 'red' | 'lightGreen' | 'orange' | 'purple' | 'green'
  trendColor?: 'orange' | 'purple' | 'green'
  barChartData?: number[]
  icon?: 'users' | 'vendors' | 'booking' | 'revenue' | 'commission' | 'approvals' | 'dispute' | 'rating'
  iconColor?: 'blue' | 'orange' | 'red'
}

/**
 * Booking trend chart data point
 */
export interface BookingTrendData {
  name: string
  bookings: number
  trends: number
}

/**
 * User and vendor growth chart data point
 */
export interface UserVendorGrowthData {
  name: string
  users: number
  vendors: number
}

/**
 * Top performing vendor
 */
export interface TopPerformingVendor {
  id: string
  vendorName: string
  totalOrders: number
  revenue: string
}

/**
 * Top performer vendor detail (extended version for detail page)
 */
export interface TopPerformerVendorDetail {
  id: string
  vendorName: string
  email: string
  avatar?: string
  totalSales: string
  completedOrders: number
  bidsWon: number
  earnings: string
  rating: number
}

/**
 * Most ordered product
 */
export interface MostOrderedProduct {
  id: string
  productName: string
  productImage: string
  vendor: string
  category: string
  price: string
  sales: number
}

/**
 * Top bidder
 */
export interface TopBidder {
  id: string
  customerName: string
  avatar: string
  rating: string
  comment: string
  date: string
}

/**
 * Top ordered user
 */
export interface TopOrderedUser {
  id: string
  userId: string
  customerName: string
  avatar: string
  totalOrders: number
  completedOrders: number
  totalSpending: string
  rating: number
}

/**
 * Platform insight/alert
 */
export interface PlatformInsight {
  id: string
  type: 'alert' | 'warning' | 'success' | 'info'
  borderColor: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'lightBlue'
  title: string
  message: string
  icon: 'warning' | 'info' | 'check' | 'clock' | 'signal' | 'star'
}

/**
 * User order detail information
 */
export interface UserOrderDetail {
  id: string
  customerId: string
  name: string
  email: string
  phone: string
  avatar: string
  status: 'active' | 'inactive' | 'suspended'
  joinDate: string
}

/**
 * Order history item
 */
export interface OrderHistoryItem {
  id: string
  productService: string
  amount: string
  status: 'completed' | 'pending' | 'cancelled' | 'refunded'
  date: string
}

/**
 * Financial transaction item
 */
export interface FinancialTransaction {
  id: string
  transactionId: string
  type: 'payment' | 'refund' | 'withdrawal' | 'deposit'
  amount: string
  date: string
  status: 'completed' | 'pending' | 'failed'
}

