import StatCard from '../components/dashboard/StatCard'
import RevenueChart from '../components/dashboard/RevenueChart'
import BookingTrendChart from '../components/analytics/BookingTrendChart'
import UserVendorGrowthChart from '../components/analytics/UserVendorGrowthChart'
import TopPerformingVendorsTable from '../components/analytics/TopPerformingVendorsTable'
import MostOrderedProductsSection from '../components/analytics/MostOrderedProductsSection'
import TopBiddersList from '../components/analytics/TopBiddersList'
import TopOrderedUsersList from '../components/analytics/TopOrderedUsersList'
import PlatformInsights from '../components/analytics/PlatformInsights'
import {
  mockAnalyticsStatCards,
  mockBookingTrendData,
  mockUserVendorGrowthData,
  mockTopPerformingVendors,
  mockMostOrderedProducts,
  mockTopBidders,
  mockTopOrderedUsers,
  mockPlatformInsights,
} from '../data/mockAnalytics'
import { mockRevenueSegments } from '../data/mockData'
import type { StatCard as StatCardType } from '../types/dashboard'

/**
 * Analytics page component
 */
export default function Analytics() {
  // Convert AnalyticsStatCard to StatCard format for StatCard component
  const statCards: StatCardType[] = mockAnalyticsStatCards.map((card) => ({
    id: card.id,
    title: card.title,
    value: card.value,
    change: card.change,
    changeLabel: card.changeLabel,
    trend: card.trend,
    color: card.color,
    trendColor: card.trendColor,
    barChartData: card.barChartData,
    icon: card.icon as StatCardType['icon'],
    iconColor: card.iconColor as StatCardType['iconColor'],
  }))

  return (
    <div className="max-w-screen w-full overflow-x-hidden">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Analytics</h1>
      </div>

      {/* Analytics Summary Cards Section */}
      <div className="mb-6 sm:mb-8 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-stretch">
        {/* Left side (40%) - Revenue Distribution */}
        <div className="flex-1 min-w-0 lg:flex-[0.4]">
          <div className="h-full min-w-0">
            <RevenueChart data={mockRevenueSegments} centerText="+42%" />
          </div>
        </div>
        {/* Right side (60%) - Booking Trends */}
        <div className="flex-1 min-w-0 lg:flex-[0.6]">
          <div className="h-full min-w-0">
            <BookingTrendChart data={mockBookingTrendData} />
          </div>
        </div>
      </div>

      {/* User & Vendor Growth Chart - Full Width */}
      <div className="mb-6 sm:mb-8">
        <UserVendorGrowthChart data={mockUserVendorGrowthData} />
      </div>

      {/* Tables Section */}
      <div className="mb-6 sm:mb-8 flex flex-col gap-6">
        <TopPerformingVendorsTable vendors={mockTopPerformingVendors} />
        <MostOrderedProductsSection products={mockMostOrderedProducts} />
        <TopBiddersList bidders={mockTopBidders} />
        <TopOrderedUsersList users={mockTopOrderedUsers} />
      </div>

      {/* Platform Insights Section */}
      <div className="mb-6 sm:mb-8">
        <PlatformInsights insights={mockPlatformInsights} />
      </div>
    </div>
  )
}
