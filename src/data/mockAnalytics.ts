import type {
  AnalyticsStatCard,
  BookingTrendData,
  UserVendorGrowthData,
  TopPerformingVendor,
  TopPerformerVendorDetail,
  MostOrderedProduct,
  TopBidder,
  TopOrderedUser,
  PlatformInsight,
  UserOrderDetail,
  OrderHistoryItem,
  FinancialTransaction,
} from '../types/analytics'

/**
 * Analytics summary cards data (8 cards matching reference)
 */
export const mockAnalyticsStatCards: AnalyticsStatCard[] = [
  {
    id: '1',
    title: 'Total Users',
    value: 1200,
    change: 2.6,
    changeLabel: 'last 7 days',
    trend: 'up',
    color: 'blue',
    icon: 'users',
    iconColor: 'blue',
  },
  {
    id: '2',
    title: 'Total Vendors',
    value: 36,
    change: 2.6,
    changeLabel: 'last 7 days',
    trend: 'up',
    color: 'blue',
    icon: 'vendors',
    iconColor: 'blue',
  },
  {
    id: '3',
    title: 'Active Booking',
    value: '$123,456',
    change: 2.6,
    changeLabel: 'last 7 days',
    trend: 'up',
    color: 'blue',
    icon: 'booking',
    iconColor: 'blue',
  },
  {
    id: '4',
    title: 'Total Revenue',
    value: '$56,000,980',
    change: 2.6,
    changeLabel: 'last 7 days',
    trend: 'up',
    color: 'blue',
    icon: 'revenue',
    iconColor: 'blue',
  },
  {
    id: '5',
    title: 'Commission Earned',
    value: 50,
    change: 2.6,
    changeLabel: 'last 7 days',
    trend: 'up',
    color: 'orange',
    trendColor: 'orange',
    icon: 'commission',
    iconColor: 'blue',
  },
  {
    id: '6',
    title: 'Pending Approvals',
    value: 300,
    change: 2.6,
    changeLabel: 'last 7 days',
    trend: 'up',
    color: 'blue',
    icon: 'approvals',
    iconColor: 'orange',
  },
  {
    id: '7',
    title: 'Dispute And Refund',
    value: '$123,456',
    change: 2.6,
    changeLabel: 'last 7 days',
    trend: 'up',
    color: 'red',
    icon: 'dispute',
    iconColor: 'red',
  },
  {
    id: '8',
    title: 'Platform Rating',
    value: '5.0',
    change: 2.6,
    changeLabel: 'last 7 days',
    trend: 'up',
    color: 'orange',
    trendColor: 'orange',
    icon: 'rating',
    iconColor: 'orange',
  },
]

/**
 * Booking trends chart data (monthly data for line chart)
 */
export const mockBookingTrendData: BookingTrendData[] = [
  { name: 'Jan', bookings: 120, trends: 100 },
  { name: 'Feb', bookings: 150, trends: 120 },
  { name: 'Mar', bookings: 180, trends: 140 },
  { name: 'Apr', bookings: 200, trends: 160 },
  { name: 'May', bookings: 220, trends: 180 },
  { name: 'Jun', bookings: 250, trends: 200 },
  { name: 'Jul', bookings: 280, trends: 220 },
  { name: 'Aug', bookings: 300, trends: 240 },
  { name: 'Sep', bookings: 320, trends: 260 },
  { name: 'Oct', bookings: 350, trends: 280 },
  { name: 'Nov', bookings: 380, trends: 300 },
  { name: 'Dec', bookings: 400, trends: 320 },
]

/**
 * User & vendor growth chart data (dual-line chart data)
 */
export const mockUserVendorGrowthData: UserVendorGrowthData[] = [
  { name: 'Jan', users: 200, vendors: 600 },
  { name: 'Feb', users: 400, vendors: 680 },
  { name: 'Mar', users: 200, vendors: 450 },
  { name: 'Apr', users: 300, vendors: 550 },
  { name: 'May', users: 580, vendors: 680 },
  { name: 'Jun', users: 550, vendors: 680 },
  { name: 'Jul', users: 820, vendors: 950 },
  { name: 'Aug', users: 750, vendors: 1100 },
  { name: 'Sep', users: 420, vendors: 850 },
  { name: 'Oct', users: 500, vendors: 900 },
  { name: 'Nov', users: 750, vendors: 950 },
  { name: 'Dec', users: 820, vendors: 950 },
]

/**
 * Top performing vendors data
 */
export const mockTopPerformingVendors: TopPerformingVendor[] = [
  { id: '1', vendorName: 'Vendor A', totalOrders: 120, revenue: '$12,000' },
  { id: '2', vendorName: 'Vendor B', totalOrders: 95, revenue: '$9,500' },
  { id: '3', vendorName: 'Vendor C', totalOrders: 80, revenue: '$8,000' },
  { id: '4', vendorName: 'Vendor D', totalOrders: 65, revenue: '$6,500' },
  { id: '5', vendorName: 'Vendor E', totalOrders: 50, revenue: '$5,000' },
]

/**
 * Top performer vendor detail data (for detail page)
 */
export const mockTopPerformerVendorDetails: TopPerformerVendorDetail[] = [
  {
    id: '1',
    vendorName: 'TechSolutions Inc',
    email: 'tech@solutions.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    totalSales: '$45,890',
    completedOrders: 127,
    bidsWon: 34,
    earnings: '$41,301',
    rating: 4.8,
  },
  {
    id: '2',
    vendorName: 'Creative Studio',
    email: 'hello@creative.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    totalSales: '$38,420',
    completedOrders: 98,
    bidsWon: 28,
    earnings: '$34,578',
    rating: 4.9,
  },
  {
    id: '3',
    vendorName: 'Digital Marketing Pro',
    email: 'contact@digitalmp.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    totalSales: '$32,150',
    completedOrders: 85,
    bidsWon: 22,
    earnings: '$28,935',
    rating: 4.6,
  },
  {
    id: '4',
    vendorName: 'Global Services Ltd',
    email: 'info@globalservices.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    totalSales: '$28,750',
    completedOrders: 72,
    bidsWon: 19,
    earnings: '$25,875',
    rating: 4.7,
  },
  {
    id: '5',
    vendorName: 'Innovation Hub',
    email: 'team@innovationhub.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    totalSales: '$25,300',
    completedOrders: 65,
    bidsWon: 17,
    earnings: '$22,770',
    rating: 4.5,
  },
  {
    id: '6',
    vendorName: 'Premium Solutions',
    email: 'sales@premiumsolutions.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    totalSales: '$22,180',
    completedOrders: 58,
    bidsWon: 15,
    earnings: '$19,962',
    rating: 4.4,
  },
]

/**
 * Most ordered products data
 */
export const mockMostOrderedProducts: MostOrderedProduct[] = [
  {
    id: '1',
    productName: 'Product 1',
    productImage: 'https://via.placeholder.com/40',
    vendor: 'Vendor A',
    category: 'Electronics',
    price: '$120',
    sales: 50,
  },
  {
    id: '2',
    productName: 'Product 2',
    productImage: 'https://via.placeholder.com/40',
    vendor: 'Vendor B',
    category: 'Clothing',
    price: '$80',
    sales: 45,
  },
  {
    id: '3',
    productName: 'Product 3',
    productImage: 'https://via.placeholder.com/40',
    vendor: 'Vendor C',
    category: 'Food',
    price: '$25',
    sales: 40,
  },
  {
    id: '4',
    productName: 'Product 4',
    productImage: 'https://via.placeholder.com/40',
    vendor: 'Vendor D',
    category: 'Electronics',
    price: '$150',
    sales: 35,
  },
  {
    id: '5',
    productName: 'Product 5',
    productImage: 'https://via.placeholder.com/40',
    vendor: 'Vendor E',
    category: 'Clothing',
    price: '$90',
    sales: 30,
  },
]

/**
 * Top bidders data
 */
export const mockTopBidders: TopBidder[] = [
  {
    id: '1',
    customerName: 'Customer 1',
    avatar: 'https://via.placeholder.com/40',
    rating: '5 stars',
    comment: 'Great service!',
    date: '2024-03-15',
  },
  {
    id: '2',
    customerName: 'Customer 2',
    avatar: 'https://via.placeholder.com/40',
    rating: '4 stars',
    comment: 'Very satisfied',
    date: '2024-03-14',
  },
  {
    id: '3',
    customerName: 'Customer 3',
    avatar: 'https://via.placeholder.com/40',
    rating: '5 stars',
    comment: 'Excellent quality',
    date: '2024-03-13',
  },
  {
    id: '4',
    customerName: 'Customer 4',
    avatar: 'https://via.placeholder.com/40',
    rating: '4 stars',
    comment: 'Good experience',
    date: '2024-03-12',
  },
  {
    id: '5',
    customerName: 'Customer 5',
    avatar: 'https://via.placeholder.com/40',
    rating: '5 stars',
    comment: 'Highly recommended',
    date: '2024-03-11',
  },
]

/**
 * Top ordered users data
 */
export const mockTopOrderedUsers: TopOrderedUser[] = [
  {
    id: '1',
    userId: '#USR-2024-001',
    customerName: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    totalOrders: 287,
    completedOrders: 276,
    totalSpending: '$125,450',
    rating: 4.9,
  },
  {
    id: '2',
    userId: '#USR-2024-045',
    customerName: 'Sarah Williams',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    totalOrders: 342,
    completedOrders: 318,
    totalSpending: '$98,720',
    rating: 4.7,
  },
  {
    id: '3',
    userId: '#USR-2024-023',
    customerName: 'David Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    totalOrders: 195,
    completedOrders: 189,
    totalSpending: '$87,350',
    rating: 4.8,
  },
  {
    id: '4',
    userId: '#USR-2024-067',
    customerName: 'Emma Thompson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    totalOrders: 234,
    completedOrders: 225,
    totalSpending: '$76,890',
    rating: 4.6,
  },
  {
    id: '5',
    userId: '#USR-2024-089',
    customerName: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    totalOrders: 178,
    completedOrders: 171,
    totalSpending: '$65,240',
    rating: 4.5,
  },
  {
    id: '6',
    userId: '#USR-2024-112',
    customerName: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    totalOrders: 156,
    completedOrders: 148,
    totalSpending: '$54,670',
    rating: 4.4,
  },
]

/**
 * Platform insights/alerts data (6 items with colored borders)
 */
export const mockPlatformInsights: PlatformInsight[] = [
  {
    id: '1',
    type: 'alert',
    borderColor: 'red',
    title: 'Refund Requests Alert',
    message: 'Refund requests increased by 20% this week',
    icon: 'warning',
  },
  {
    id: '2',
    type: 'info',
    borderColor: 'blue',
    title: 'Vendor Growth',
    message: 'New vendor signups dropped by 8% this month',
    icon: 'info',
  },
  {
    id: '3',
    type: 'success',
    borderColor: 'green',
    title: 'Revenue Milestone',
    message: 'Monthly revenue target exceeded by 15%',
    icon: 'check',
  },
  {
    id: '4',
    type: 'warning',
    borderColor: 'yellow',
    title: 'Pending Reviews',
    message: '127 vendor applications awaiting approval',
    icon: 'clock',
  },
  {
    id: '5',
    type: 'info',
    borderColor: 'purple',
    title: 'Peak Season',
    message: 'Bookings are 40% higher than last month',
    icon: 'signal',
  },
  {
    id: '6',
    type: 'success',
    borderColor: 'lightBlue',
    title: 'Customer Satisfaction',
    message: 'Platform rating improved to 4.8/5.0',
    icon: 'star',
  },
]

/**
 * Get user order detail by user ID
 */
export function getUserOrderDetail(userId: string): UserOrderDetail | null {
  const user = mockTopOrderedUsers.find((u) => u.id === userId)
  if (!user) return null

  // Generate email from customer name
  const emailMap: Record<string, string> = {
    'Michael Chen': 'michael.chen@email.com',
    'Sarah Williams': 'sarah.williams@email.com',
    'David Rodriguez': 'david.rodriguez@email.com',
    'Emma Thompson': 'emma.thompson@email.com',
    'James Wilson': 'james.wilson@email.com',
    'Alex Johnson': 'alex.johnson@email.com',
  }

  // Generate phone number (mock)
  const phoneMap: Record<string, string> = {
    'Michael Chen': '+1 (555) 123-4567',
    'Sarah Williams': '+1 (555) 234-5678',
    'David Rodriguez': '+1 (555) 345-6789',
    'Emma Thompson': '+1 (555) 456-7890',
    'James Wilson': '+1 (555) 567-8901',
    'Alex Johnson': '+1 (555) 678-9012',
  }

  // Generate join date (mock - 1 year ago)
  const joinDateMap: Record<string, string> = {
    'Michael Chen': 'March 15, 2023',
    'Sarah Williams': 'February 20, 2023',
    'David Rodriguez': 'April 10, 2023',
    'Emma Thompson': 'May 5, 2023',
    'James Wilson': 'June 18, 2023',
    'Alex Johnson': 'July 22, 2023',
  }

  return {
    id: user.id,
    customerId: user.userId,
    name: user.customerName,
    email: emailMap[user.customerName] || `${user.customerName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
    phone: phoneMap[user.customerName] || '+1 (555) 000-0000',
    avatar: user.avatar,
    status: 'active',
    joinDate: joinDateMap[user.customerName] || 'January 1, 2023',
  }
}

/**
 * Get order history for a user
 */
export function getOrderHistory(_userId: string): OrderHistoryItem[] {
  const now = new Date()
  const formatDate = (daysAgo: number): string => {
    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)
    return date.toISOString().split('T')[0]
  }

  return [
    {
      id: '#ORD-2024-4521',
      productService: 'Premium Service Plan',
      amount: '$299.00',
      status: 'completed',
      date: formatDate(5),
    },
    {
      id: '#ORD-2024-4498',
      productService: 'Digital Marketing Course',
      amount: '$149.00',
      status: 'pending',
      date: formatDate(8),
    },
    {
      id: '#ORD-2024-4445',
      productService: 'Consulting Session',
      amount: '$89.00',
      status: 'completed',
      date: formatDate(12),
    },
    {
      id: '#ORD-2024-4401',
      productService: 'Premium Service Package',
      amount: '$1,250.00',
      status: 'completed',
      date: formatDate(15),
    },
    {
      id: '#ORD-2024-4387',
      productService: 'Standard Service',
      amount: '$850.00',
      status: 'completed',
      date: formatDate(18),
    },
    {
      id: '#ORD-2024-4372',
      productService: 'Basic Service',
      amount: '$450.00',
      status: 'pending',
      date: formatDate(22),
    },
    {
      id: '#ORD-2024-4356',
      productService: 'Premium Service Package',
      amount: '$1,200.00',
      status: 'completed',
      date: formatDate(25),
    },
    {
      id: '#ORD-2024-4334',
      productService: 'Standard Service',
      amount: '$750.00',
      status: 'refunded',
      date: formatDate(30),
    },
    {
      id: '#ORD-2024-4321',
      productService: 'Basic Service',
      amount: '$400.00',
      status: 'completed',
      date: formatDate(35),
    },
    {
      id: '#ORD-2024-4305',
      productService: 'Premium Service Plan',
      amount: '$299.00',
      status: 'completed',
      date: formatDate(45),
    },
  ]
}

/**
 * Get financial transactions for a user
 */
export function getFinancialTransactions(_userId: string): FinancialTransaction[] {
  const now = new Date()
  const formatDate = (daysAgo: number): string => {
    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)
    return date.toISOString().split('T')[0]
  }

  return [
    {
      id: '1',
      transactionId: '#TXN-2024-7821',
      type: 'payment',
      amount: '$299.00',
      date: formatDate(5),
      status: 'completed',
    },
    {
      id: '2',
      transactionId: '#TXN-2024-7798',
      type: 'deposit',
      amount: '$500.00',
      date: formatDate(10),
      status: 'completed',
    },
    {
      id: '3',
      transactionId: '#TXN-2024-7745',
      type: 'refund',
      amount: '-$49.00',
      date: formatDate(15),
      status: 'completed',
    },
    {
      id: '4',
      transactionId: '#TXN-2024-7712',
      type: 'payment',
      amount: '$1,250.00',
      date: formatDate(18),
      status: 'completed',
    },
    {
      id: '5',
      transactionId: '#TXN-2024-7689',
      type: 'refund',
      amount: '-$750.00',
      date: formatDate(20),
      status: 'completed',
    },
    {
      id: '6',
      transactionId: '#TXN-2024-7654',
      type: 'payment',
      amount: '$850.00',
      date: formatDate(22),
      status: 'completed',
    },
    {
      id: '7',
      transactionId: '#TXN-2024-7621',
      type: 'withdrawal',
      amount: '$500.00',
      date: formatDate(25),
      status: 'pending',
    },
    {
      id: '8',
      transactionId: '#TXN-2024-7589',
      type: 'payment',
      amount: '$1,200.00',
      date: formatDate(28),
      status: 'completed',
    },
    {
      id: '9',
      transactionId: '#TXN-2024-7556',
      type: 'deposit',
      amount: '$2,000.00',
      date: formatDate(35),
      status: 'completed',
    },
    {
      id: '10',
      transactionId: '#TXN-2024-7523',
      type: 'refund',
      amount: '-$149.00',
      date: formatDate(40),
      status: 'completed',
    },
  ]
}

