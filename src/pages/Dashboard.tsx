import { useState, useEffect } from "react";
import StatCard from "../components/dashboard/StatCard";
import UserGrowthChart from "../components/dashboard/UserGrowthChart";
import RevenueChart from "../components/dashboard/RevenueChart";
import RecentActivityTable from "../components/dashboard/RecentActivityTable";
import MarketingPerformanceTable from "../components/dashboard/MarketingPerformanceTable";
import { dashboardApi } from "../services/dashboard.api";
import type {
  StatCard as StatCardType,
  ActivityItem,
  UserGrowthData,
  RevenueSegment,
} from "../types/dashboard";
import {
  mockUserGrowthData,
  mockRevenueSegments,
  mockCampaigns,
  mockActivities,
} from "../data/mockData";

/**
 * Dashboard page component
 */
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [statCards, setStatCards] = useState<StatCardType[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([]);
  const [revenueSegments, setRevenueSegments] = useState<RevenueSegment[]>([]);
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Get current user for welcome message
        const currentUser = dashboardApi.getCurrentUser();
        if (currentUser?.email) {
          setUserName(currentUser.email.split("@")[0]);
        }

        // Fetch dashboard stats and audit logs in parallel
        const [dashboardStats, auditLogs] = await Promise.all([
          dashboardApi.getDashboard(),
          dashboardApi.getAuditLogs({ page: 1, limit: 10 }),
        ]);

        // Debug: Log the dashboard stats to see what we're receiving
        console.log("Dashboard Stats from API:", JSON.stringify(dashboardStats, null, 2));
        console.log("Users total:", dashboardStats?.users?.total);
        console.log("Orders total:", dashboardStats?.orders?.total);
        console.log("Vendors total:", dashboardStats?.vendors?.total);
        console.log("KYC pending:", dashboardStats?.kyc?.pending);

        // Transform dashboard stats to stat cards
        // Handle revenue - it should be a string from the API (already converted from BigInt)
        const revenueTotal = typeof dashboardStats.revenue.totalMinor === "string"
          ? parseFloat(dashboardStats.revenue.totalMinor) / 100
          : typeof dashboardStats.revenue.totalMinor === "bigint"
          ? Number(dashboardStats.revenue.totalMinor) / 100
          : 0;

        const cards: StatCardType[] = [
          {
            id: "1",
            title: "Total Users",
            value: dashboardStats.users?.total ?? 0,
            change: 2.6, // TODO: Calculate from historical data
            changeLabel: "last 7 days",
            trend: "up",
            color: "blue",
            icon: "users",
            iconColor: "blue",
            barChartData: [45, 52, 48, 61, 55, 67], // TODO: Get from historical data
          },
          {
            id: "2",
            title: "Total Orders",
            value: dashboardStats.orders?.total ?? 0,
            change: 2.6, // TODO: Calculate from historical data
            changeLabel: "last 7 days",
            trend: "up",
            color: "cyan",
            icon: "booking",
            iconColor: "blue",
            barChartData: [12, 15, 18, 14, 20, 16], // TODO: Get from historical data
          },
          {
            id: "3",
            title: "Total Revenue (This Month)",
            value: `${
              dashboardStats.revenue?.currency || "QAR"
            } ${revenueTotal.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            change: 2.6, // TODO: Calculate from historical data
            changeLabel: "last 7 days",
            trend: "up",
            color: "red",
            icon: "revenue",
            iconColor: "blue",
            barChartData: [35, 42, 38, 48, 45, 52], // TODO: Get from historical data
          },
          {
            id: "4",
            title: "User Verification Requests",
            value: dashboardStats.kyc?.pending ?? 0,
            change: 2.6, // TODO: Calculate from historical data
            changeLabel: "last 7 days",
            trend: "up",
            color: "lightGreen",
            icon: "approvals",
            iconColor: "orange",
            barChartData: [20, 25, 22, 28, 24, 30], // TODO: Get from historical data
          },
          {
            id: "5",
            title: "Bidding Pending Payment",
            value: dashboardStats.bidding?.pendingPayment || 0,
            change: 2.6, // TODO: Calculate from historical data
            changeLabel: "last 7 days",
            trend: "up",
            color: "orange",
            trendColor: "orange",
            icon: "booking",
            iconColor: "orange",
            barChartData: [30, 35, 32, 40, 38, 45], // TODO: Get from historical data
          },
          {
            id: "6",
            title: "User Refund Request",
            value: dashboardStats.refunds?.pending || 0,
            change: 2.6, // TODO: Calculate from historical data
            changeLabel: "last 7 days",
            trend: "up",
            color: "purple",
            icon: "dispute",
            iconColor: "blue",
            barChartData: [55, 62, 58, 68, 65, 72], // TODO: Get from historical data
          },
          {
            id: "7",
            title: "Total Vendors",
            value: dashboardStats.vendors?.total ?? 0,
            change: 2.6, // TODO: Calculate from historical data
            changeLabel: "last 7 days",
            trend: "up",
            color: "red",
            icon: "vendors",
            iconColor: "blue",
            barChartData: [8, 10, 12, 9, 14, 11], // TODO: Get from historical data
          },
          {
            id: "8",
            title: "Uncompleted Orders",
            value: dashboardStats.orders.uncompleted || 0,
            change: 2.6, // TODO: Calculate from historical data
            changeLabel: "last 7 days",
            trend: "up",
            color: "lightGreen",
            icon: "booking",
            iconColor: "blue",
            barChartData: [18, 22, 20, 25, 23, 28], // TODO: Get from historical data
          },
        ];

        setStatCards(cards);

        // Transform audit logs to activities
        const transformedActivities: ActivityItem[] = auditLogs.logs.map(
          (log) => ({
            id: log.id,
            activity: `${log.action} ${log.resourceType}`,
            user: log.user?.email || "System",
            date: new Date(log.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          })
        );

        setActivities(
          transformedActivities.length > 0 ? transformedActivities : []
        );

        // For now, use mock data for charts (will be replaced with real time-series data later)
        setUserGrowthData(mockUserGrowthData);
        setRevenueSegments(mockRevenueSegments);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // On error, still show stat cards with zero values so UI doesn't break
        const fallbackCards: StatCardType[] = [
          {
            id: "1",
            title: "Total Users",
            value: 0,
            change: 0,
            changeLabel: "last 7 days",
            trend: "neutral",
            color: "blue",
            icon: "users",
            iconColor: "blue",
            barChartData: [],
          },
          {
            id: "2",
            title: "Total Orders",
            value: 0,
            change: 0,
            changeLabel: "last 7 days",
            trend: "neutral",
            color: "cyan",
            icon: "booking",
            iconColor: "blue",
            barChartData: [],
          },
          {
            id: "3",
            title: "Total Revenue (This Month)",
            value: "QAR 0.00",
            change: 0,
            changeLabel: "last 7 days",
            trend: "neutral",
            color: "red",
            icon: "revenue",
            iconColor: "blue",
            barChartData: [],
          },
          {
            id: "4",
            title: "User Verification Requests",
            value: 0,
            change: 0,
            changeLabel: "last 7 days",
            trend: "neutral",
            color: "lightGreen",
            icon: "approvals",
            iconColor: "orange",
            barChartData: [],
          },
          {
            id: "5",
            title: "Bidding Pending Payment",
            value: 0,
            change: 0,
            changeLabel: "last 7 days",
            trend: "neutral",
            color: "orange",
            icon: "booking",
            iconColor: "orange",
            barChartData: [],
          },
          {
            id: "6",
            title: "User Refund Request",
            value: 0,
            change: 0,
            changeLabel: "last 7 days",
            trend: "neutral",
            color: "purple",
            icon: "dispute",
            iconColor: "blue",
            barChartData: [],
          },
          {
            id: "7",
            title: "Total Vendors",
            value: 0,
            change: 0,
            changeLabel: "last 7 days",
            trend: "neutral",
            color: "red",
            icon: "vendors",
            iconColor: "blue",
            barChartData: [],
          },
          {
            id: "8",
            title: "Uncompleted Orders",
            value: 0,
            change: 0,
            changeLabel: "last 7 days",
            trend: "neutral",
            color: "lightGreen",
            icon: "booking",
            iconColor: "blue",
            barChartData: [],
          },
        ];
        setStatCards(fallbackCards);
        // Use mock activities as fallback if API fails
        setActivities(mockActivities);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#F7941D] border-r-transparent"></div>
          <p className="mt-4 text-sm text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen">
      {/* Welcome Section */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome</h1>
        <p className="text-base sm:text-lg text-gray-600">{userName}</p>
      </div>

      {/* Stat Cards Grid */}
      <div className="mb-6 sm:mb-8 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-stretch">
        {/* Left side (60%) - User Growth */}
        <div className="flex-1 min-w-0 lg:flex-[0.6]">
          <div className="h-full min-w-0">
            <UserGrowthChart data={userGrowthData} />
          </div>
        </div>
        {/* Right side (40%) - Revenue Overview */}
        <div className="flex-1 min-w-0 lg:flex-[0.4]">
          <div className="h-full min-w-0">
            <RevenueChart data={revenueSegments} centerText="+42%" />
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="flex flex-col gap-6">
        <RecentActivityTable activities={activities} />
        <MarketingPerformanceTable campaigns={mockCampaigns} />
      </div>
    </div>
  );
}
