import StatCard from '../components/dashboard/StatCard'
import UserGrowthChart from '../components/dashboard/UserGrowthChart'
import RevenueChart from '../components/dashboard/RevenueChart'
import RecentActivityTable from '../components/dashboard/RecentActivityTable'
import MarketingPerformanceTable from '../components/dashboard/MarketingPerformanceTable'
import {
  mockStatCards,
  mockUserGrowthData,
  mockRevenueSegments,
  mockActivities,
  mockCampaigns,
} from '../data/mockData'

/**
 * Dashboard page component
 */
export default function Dashboard() {
  return (
    <div className="max-w-screen">
      {/* Welcome Section */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome</h1>
        <p className="text-base sm:text-lg text-gray-600">Abdulloh</p>
      </div>

      {/* Stat Cards Grid */}
      <div className="mb-6 sm:mb-8 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockStatCards.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-stretch">
        {/* Left side (60%) - User Growth */}
        <div className="flex-1 min-w-0 lg:flex-[0.6]">
          <div className="h-full min-w-0">
            <UserGrowthChart data={mockUserGrowthData} />
          </div>
        </div>
        {/* Right side (40%) - Revenue Overview */}
        <div className="flex-1 min-w-0 lg:flex-[0.4]">
          <div className="h-full min-w-0">
            <RevenueChart data={mockRevenueSegments} centerText="+42%" />
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="flex flex-col gap-6">
        <RecentActivityTable activities={mockActivities} />
        <MarketingPerformanceTable campaigns={mockCampaigns} />
      </div>
    </div>
  )
}
