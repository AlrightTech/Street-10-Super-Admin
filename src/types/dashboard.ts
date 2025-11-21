/**
 * Dashboard type definitions
 */

/**
 * Stat card data type
 */
export interface StatCard {
  id: string
  title: string
  value: string | number
  change: number
  changeLabel: string
  trend: 'up' | 'down' | 'neutral'
  color: 'green' | 'red' | 'orange' | 'blue' | 'cyan' | 'lightGreen' | 'purple'
  barChartData?: number[] // Array of 6-7 values for mini bar chart
  trendColor?: 'green' | 'orange' | 'purple' // Override trend color for special cases
  icon?: 'users' | 'vendors' | 'booking' | 'revenue' | 'commission' | 'approvals' | 'dispute' | 'rating' // Icon type for the card
  iconColor?: 'blue' | 'orange' | 'red' // Icon color
}

/**
 * Navigation item type
 */
export interface NavigationItem {
  id: string
  label: string
  icon: string
  path: string
  active?: boolean
}

/**
 * Chart data point type
 */
export interface ChartDataPoint {
  name: string
  value: number
  label?: string
}

/**
 * User growth chart data
 */
export interface UserGrowthData extends ChartDataPoint {
  users: number
  growth: number
}

/**
 * Activity feed item
 */
export interface ActivityItem {
  id: string
  activity: string
  user: string
  date: string
}

/**
 * Marketing campaign type
 */
export interface MarketingCampaign {
  id: string
  campaign: string
  engagement: string
  conversion: string
  status: 'active' | 'inactive' | 'blocked'
}

/**
 * Notification type
 */
export interface Notification {
  id: string
  title: string
  user: string
  userId: string
  timestamp: string
  timeAgo: string
}

/**
 * Revenue chart segment
 */
export interface RevenueSegment {
  name: string
  value: number
  color: string
}

