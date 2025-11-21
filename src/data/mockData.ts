import type { StatCard, ActivityItem, MarketingCampaign, Notification, UserGrowthData, RevenueSegment } from '../types/dashboard'

/**
 * Mock stat cards data
 */
export const mockStatCards: StatCard[] = [
  {
    id: '1',
    title: 'Total Users',
    value: 1200,
    change: 2.6,
    changeLabel: 'last 7 days',
    trend: 'up',
    color: 'blue',
    barChartData: [45, 52, 48, 61, 55, 67],
  },
  {
    id: '2',
    title: 'Total Orders',
    value: 36,
    change: 2.6,
    changeLabel: 'last 7 days',
    trend: 'up',
    color: 'cyan',
    barChartData: [12, 15, 18, 14, 20, 16],
  },
  {
    id: '3',
    title: 'Total Revenue (This Month)',
    value: '$123,456',
    change: 2.6,
    changeLabel: 'last 7 days',
    trend: 'up',
    color: 'red',
    barChartData: [35, 42, 38, 48, 45, 52],
  },
  {
    id: '4',
    title: 'User Verification Requests',
    value: 34,
    change: 2.6,
    changeLabel: 'last 7 days',
    trend: 'up',
    color: 'lightGreen',
    barChartData: [20, 25, 22, 28, 24, 30],
  },
  {
    id: '5',
    title: 'Bidding Pending Payment',
    value: 50,
    change: 2.6,
    changeLabel: 'last 7 days',
    trend: 'up',
    color: 'orange',
    trendColor: 'orange',
    barChartData: [30, 35, 32, 40, 38, 45],
  },
  {
    id: '6',
    title: 'User Refund Request',
    value: 300,
    change: 2.6,
    changeLabel: 'last 7 days',
    trend: 'up',
    color: 'purple',
    barChartData: [55, 62, 58, 68, 65, 72],
  },
  {
    id: '7',
    title: 'Total Vendors',
    value: 17,
    change: 2.6,
    changeLabel: 'last 7 days',
    trend: 'up',
    color: 'red',
    barChartData: [8, 10, 12, 9, 14, 11],
  },
  {
    id: '8',
    title: 'Uncompleted Orders',
    value: 34,
    change: 2.6,
    changeLabel: 'last 7 days',
    trend: 'up',
    color: 'lightGreen',
    barChartData: [18, 22, 20, 25, 23, 28],
  },
]

/**
 * Mock user growth chart data
 */
export const mockUserGrowthData: UserGrowthData[] = [
  { name: 'Jan', value: 150, users: 150, growth: 5 },
  { name: 'Feb', value: 180, users: 180, growth: 8 },
  { name: 'Mar', value: 200, users: 200, growth: 10 },
  { name: 'Apr', value: 220, users: 220, growth: 12 },
  { name: 'May', value: 250, users: 250, growth: 15 },
  { name: 'Jun', value: 280, users: 280, growth: 18 },
  { name: 'Jul', value: 300, users: 300, growth: 20 },
  { name: 'Aug', value: 320, users: 320, growth: 22 },
  { name: 'Sep', value: 350, users: 350, growth: 25 },
  { name: 'Oct', value: 380, users: 380, growth: 28 },
  { name: 'Nov', value: 400, users: 400, growth: 30 },
  { name: 'Dec', value: 420, users: 420, growth: 32 },
]

/**
 * Mock revenue chart segments
 */
export const mockRevenueSegments: RevenueSegment[] = [
  { name: 'This week', value: 35, color: '#3B82F6' },
  { name: 'This month', value: 45, color: '#10B981' },
  { name: 'Recent month', value: 20, color: '#A7F3D0' },
]

/**
 * Mock recent activities
 */
export const mockActivities: ActivityItem[] = [
  {
    id: '1',
    activity: 'New user registered',
    user: 'Liam Harper',
    date: '15 May 2020 9:30 am',
  },
  {
    id: '2',
    activity: 'Order Created',
    user: 'Ava Morgan',
    date: '15 May 2020 9:00 am',
  },
  {
    id: '3',
    activity: 'Payment received',
    user: 'Noah Foster',
    date: '15 May 2020 8:00 am',
  },
  {
    id: '4',
    activity: 'User updated profile',
    user: 'Isabella Reed',
    date: '15 May 2020 8:30 am',
  },
  {
    id: '5',
    activity: 'Service created',
    user: 'Liam Harper',
    date: '15 May 2020 8:00 am',
  },
]

/**
 * Mock marketing campaigns
 */
export const mockCampaigns: MarketingCampaign[] = [
  {
    id: '1',
    campaign: 'Summer Sale',
    engagement: '2.5k Clicks',
    conversion: '12.5%',
    status: 'active',
  },
  {
    id: '2',
    campaign: 'Winter Promotion',
    engagement: '1.8k Clicks',
    conversion: '8.3%',
    status: 'inactive',
  },
  {
    id: '3',
    campaign: 'Spring Launch',
    engagement: '3.2k Clicks',
    conversion: '15.2%',
    status: 'active',
  },
]

/**
 * Mock notifications
 */
export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New ID Verification Request',
    user: 'Goldy Brar',
    userId: 'ID #200-1550',
    timestamp: '2024-01-15 10:28 AM',
    timeAgo: '2 minutes ago',
  },
  {
    id: '2',
    title: 'Payment Received',
    user: 'John Doe',
    userId: 'Order #12345',
    timestamp: '2024-01-15 10:15 AM',
    timeAgo: '15 minutes ago',
  },
  {
    id: '3',
    title: 'New Order Created',
    user: 'Jane Smith',
    userId: 'Order #12346',
    timestamp: '2024-01-15 09:30 AM',
    timeAgo: '1 hour ago',
  },
]

