import { useState, useMemo, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getUserOrderDetail, getOrderHistory, getFinancialTransactions } from '../data/mockAnalytics'
import { mockTopOrderedUsers } from '../data/mockAnalytics'
import { ShoppingBagIcon, DollarSignIcon, WalletIcon, RefreshCwIcon } from '../components/icons/Icons'

/**
 * Custom Dropdown Component
 */
interface CustomDropdownProps {
  value: string
  options: { label: string; value: string }[]
  onChange: (value: string) => void
  className?: string
}

function CustomDropdown({ value, options, onChange, className = '' }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const selectedLabel = options.find(opt => opt.value === value)?.label || value

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 text-sm text-gray-700 hover:bg-gray-50 focus:border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/20"
      >
        <span className="block truncate text-left">{selectedLabel}</span>
        <svg className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 z-50 mt-1 w-full min-w-[160px] origin-top-left rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="py-1 max-h-60 overflow-auto" role="menu">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors ${
                  value === option.value ? 'bg-gray-50 font-medium' : ''
                }`}
                role="menuitem"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Get status badge color
 */
const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'active':
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'cancelled':
    case 'failed':
      return 'bg-red-100 text-red-800'
    case 'refunded':
      return 'bg-blue-100 text-blue-800'
    case 'inactive':
    case 'suspended':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

/**
 * Analytics Order Detail page component
 */
export default function AnalyticsOrderDetail() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState('last30days')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery] = useState('')

  // Get user data
  const userDetail = userId ? getUserOrderDetail(userId) : null
  const user = userId ? mockTopOrderedUsers.find((u) => u.id === userId) : null

  // Get order history and transactions
  const orderHistory = userId ? getOrderHistory(userId) : []
  const transactions = userId ? getFinancialTransactions(userId) : []

  // Time range options
  const timeRangeOptions = [
    { label: 'Last 7 days', value: 'last7days' },
    { label: 'Last 30 days', value: 'last30days' },
    { label: 'Last 3 months', value: 'last3months' },
    { label: 'Last 6 months', value: 'last6months' },
    { label: 'Last year', value: 'lastyear' },
    { label: 'All time', value: 'alltime' },
  ]

  // Status filter options
  const statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Completed', value: 'completed' },
    { label: 'Pending', value: 'pending' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Refunded', value: 'refunded' },
  ]

  // Helper function to filter by date range
  const filterByDateRange = (dateString: string, range: string): boolean => {
    const orderDate = new Date(dateString)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    switch (range) {
      case 'last7days':
        const sevenDaysAgo = new Date(today)
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        return orderDate >= sevenDaysAgo
      case 'last30days':
        const thirtyDaysAgo = new Date(today)
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return orderDate >= thirtyDaysAgo
      case 'last3months':
        const threeMonthsAgo = new Date(today)
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
        return orderDate >= threeMonthsAgo
      case 'last6months':
        const sixMonthsAgo = new Date(today)
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
        return orderDate >= sixMonthsAgo
      case 'lastyear':
        const oneYearAgo = new Date(today)
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
        return orderDate >= oneYearAgo
      case 'alltime':
      default:
        return true
    }
  }

  // Filter order history by time range and status
  const filteredOrderHistory = useMemo(() => {
    let filtered = orderHistory

    // Filter by time range
    if (timeRange !== 'alltime') {
      filtered = filtered.filter((o) => filterByDateRange(o.date, timeRange))
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((o) => o.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (o) =>
          o.productService.toLowerCase().includes(query) ||
          o.id.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [orderHistory, timeRange, statusFilter, searchQuery])

  // Filter transactions by time range
  const filteredTransactions = useMemo(() => {
    let filtered = transactions

    // Filter by time range
    if (timeRange !== 'alltime') {
      filtered = filtered.filter((t) => filterByDateRange(t.date, timeRange))
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.transactionId.toLowerCase().includes(query) ||
          t.type.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [transactions, timeRange, searchQuery])

  // Calculate performance metrics based on filtered data
  const performanceMetrics = useMemo(() => {
    if (!user) return null

    // Use filtered order history for metrics
    const completedOrders = filteredOrderHistory.filter((o) => o.status === 'completed').length
    const totalOrdersInRange = filteredOrderHistory.length
    
    // Calculate total spending from filtered orders
    const totalSpending = filteredOrderHistory.reduce((sum, o) => {
      const amount = parseFloat(o.amount.replace(/[^0-9.]/g, ''))
      return sum + amount
    }, 0)

    // Use filtered transactions for refunds
    const refundsCount = filteredTransactions.filter((t) => t.type === 'refund').length
    
    // Calculate wallet balance (mock, but could be dynamic)
    const walletBalance = 2340.00

    return {
      totalOrders: totalOrdersInRange,
      completedOrders,
      totalSpending: `$${totalSpending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      refunds: refundsCount,
      walletBalance: `$${walletBalance.toFixed(2)}`,
    }
  }, [user, filteredOrderHistory, filteredTransactions])

  if (!userDetail || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">User not found</p>
          <button
            onClick={() => navigate('/analytics')}
            className="mt-4 text-[#FF8C00] hover:underline"
          >
            Back to Analytics
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-screen w-full overflow-x-hidden">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <button
          onClick={() => navigate('/analytics')}
          className="mb-3 sm:mb-4 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Analytics</span>
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Order Detail</h1>
      </div>

      {/* User Card */}
      <div className="mb-4 sm:mb-6 rounded-lg border border-gray-200 bg-white p-3 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
          {/* Left: Profile Picture */}
          <img
            src={userDetail.avatar}
            alt={userDetail.name}
            className="h-16 w-16 sm:h-24 sm:w-24 rounded-full object-cover flex-shrink-0 mx-auto sm:mx-0"
          />
          
          {/* Middle: Name, Email, Phone */}
          <div className="flex-1 min-w-0 w-full sm:w-auto text-center sm:text-left">
            <h2 className="text-base sm:text-xl font-bold text-gray-900 mb-1">{userDetail.name}</h2>
            <p className="text-xs sm:text-sm text-gray-900 mb-1 break-all">{userDetail.email}</p>
            <p className="text-xs sm:text-sm text-gray-900 break-all">{userDetail.phone}</p>
          </div>

          {/* Middle-Right: Customer ID and Join Date (Centered) */}
          <div className="flex flex-col gap-2 sm:gap-4 items-center w-full sm:w-auto">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-0.5 sm:mb-1">Customer ID</p>
              <p className="text-xs sm:text-sm text-gray-900 font-mono break-all">{userDetail.customerId}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-0.5 sm:mb-1">Join Date</p>
              <p className="text-xs sm:text-sm text-gray-900 break-words">{userDetail.joinDate}</p>
            </div>
          </div>

          {/* Right: Status Badge (Vertically Aligned) */}
          <div className="flex items-center w-full sm:w-auto justify-center sm:justify-start">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-medium ${getStatusBadgeColor(userDetail.status)}`}>
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-current opacity-75"></span>
              {userDetail.status.charAt(0).toUpperCase() + userDetail.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="mb-4 sm:mb-6 rounded-lg border border-gray-200 bg-white p-3 sm:p-6 shadow-sm">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Performance Summary</h3>
        {performanceMetrics && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
            {/* Total Orders */}
            <div className="rounded-lg border border-gray-200 bg-white p-2.5 sm:p-4 shadow-sm">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <p className="text-xs sm:text-sm text-gray-600">Total Orders</p>
                <div className="rounded-lg bg-blue-50 p-1.5 sm:p-2">
                  <ShoppingBagIcon className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                </div>
              </div>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{performanceMetrics.totalOrders}</p>
            </div>

            {/* Completed */}
            <div className="rounded-lg border border-gray-200 bg-white p-2.5 sm:p-4 shadow-sm">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <p className="text-xs sm:text-sm text-gray-600">Completed</p>
                <div className="rounded-lg bg-green-50 p-1.5 sm:p-2">
                  <svg className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{performanceMetrics.completedOrders}</p>
            </div>

            {/* Total Spending */}
            <div className="rounded-lg border border-gray-200 bg-white p-2.5 sm:p-4 shadow-sm">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <p className="text-xs sm:text-sm text-gray-600">Total Spending</p>
                <div className="rounded-lg bg-purple-50 p-1.5 sm:p-2">
                  <DollarSignIcon className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                </div>
              </div>
              <p className="text-lg sm:text-xl font-bold text-gray-900 break-words">{performanceMetrics.totalSpending}</p>
            </div>

            {/* Refunds */}
            <div className="rounded-lg border border-gray-200 bg-white p-2.5 sm:p-4 shadow-sm">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <p className="text-xs sm:text-sm text-gray-600">Refunds</p>
                <div className="rounded-lg bg-red-50 p-1.5 sm:p-2">
                  <RefreshCwIcon className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                </div>
              </div>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{performanceMetrics.refunds}</p>
            </div>

            {/* Wallet Balance */}
            <div className="rounded-lg border border-gray-200 bg-white p-2.5 sm:p-4 shadow-sm">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <p className="text-xs sm:text-sm text-gray-600">Wallet Balance</p>
                <div className="rounded-lg bg-orange-50 p-1.5 sm:p-2">
                  <WalletIcon className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                </div>
              </div>
              <p className="text-lg sm:text-xl font-bold text-gray-900 break-words">{performanceMetrics.walletBalance}</p>
            </div>
          </div>
        )}
      </div>

      {/* Order History Table */}
      <div className="mb-4 sm:mb-6">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="p-3 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Order History</h3>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center w-full sm:w-auto">
                <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
                  <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Time Range:</label>
                  <CustomDropdown
                    value={timeRange}
                    options={timeRangeOptions}
                    onChange={setTimeRange}
                    className="flex-1 sm:flex-none w-full sm:w-[180px]"
                  />
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
                  <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Status:</label>
                  <CustomDropdown
                    value={statusFilter}
                    options={statusOptions}
                    onChange={setStatusFilter}
                    className="flex-1 sm:flex-none w-full sm:w-[160px]"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600">ID</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Product/Service</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Amount</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Status</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrderHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-2 sm:px-4 py-6 sm:py-8 text-center text-xs sm:text-sm text-gray-500">
                    No orders found for the selected filters.
                  </td>
                </tr>
              ) : (
                filteredOrderHistory.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 font-mono break-all">{order.id}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 break-words">{order.productService}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900">{order.amount}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <span className={`inline-flex items-center rounded-full px-2 sm:px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 whitespace-nowrap">{order.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* Financial Transactions Table */}
      <div className="mb-4 sm:mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-3 sm:p-6 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">Financial Transactions</h3>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Transaction ID</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Type</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Amount</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Date</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-2 sm:px-4 py-6 sm:py-8 text-center text-xs sm:text-sm text-gray-500">
                    No transactions found for the selected filters.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 font-mono break-all">{transaction.transactionId}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 capitalize">{transaction.type}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900">{transaction.amount}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 whitespace-nowrap">{transaction.date}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <span className={`inline-flex items-center rounded-full px-2 sm:px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(transaction.status)}`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

