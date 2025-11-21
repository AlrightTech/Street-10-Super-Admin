import { useState, useMemo, useEffect, useRef } from 'react'
import SearchBar from '../components/ui/SearchBar'
import { StarIcon, UsersIcon, DollarSignIcon } from '../components/icons/Icons'
import { mockTopPerformerVendorDetails } from '../data/mockAnalytics'
import type { TopPerformerVendorDetail } from '../types/analytics'

/**
 * Trophy icon component
 */
const TrophyIcon = ({ className = 'h-4 w-4', color = '#10B981' }: { className?: string; color?: string }) => (
  <svg className={className} fill={color} viewBox="0 0 24 24">
    <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2m6 0h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2m-6 0v6a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V9m-6 0h6M9 19v2m6-2v2" stroke="none" />
  </svg>
)

/**
 * Custom Dropdown Component for time range
 */
interface TimeRangeDropdownProps {
  value: string
  options: { label: string; value: string }[]
  onChange: (value: string) => void
  className?: string
}

function TimeRangeDropdown({ value, options, onChange, className = '' }: TimeRangeDropdownProps) {
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
 * Top Performer Detail page component
 */
export default function TopPerformerDetail() {
  const [vendors] = useState<TopPerformerVendorDetail[]>(mockTopPerformerVendorDetails)
  const [timeRange, setTimeRange] = useState('last7days')
  const [searchQuery, setSearchQuery] = useState('')

  // Time range options
  const timeRangeOptions = [
    { label: 'Last 7 days', value: 'last7days' },
    { label: 'Last 30 days', value: 'last30days' },
    { label: 'Last 3 months', value: 'last3months' },
    { label: 'Last 6 months', value: 'last6months' },
    { label: 'Last year', value: 'lastyear' },
    { label: 'All time', value: 'alltime' },
  ]

  // Calculate KPI metrics
  const kpiMetrics = useMemo(() => {
    const totalVendors = vendors.length
    const topEarningVendor = vendors.reduce((prev, current) => {
      const prevEarnings = parseFloat(prev.earnings.replace(/[^0-9.]/g, ''))
      const currentEarnings = parseFloat(current.earnings.replace(/[^0-9.]/g, ''))
      return currentEarnings > prevEarnings ? current : prev
    }, vendors[0])
    const highestRatedVendor = vendors.reduce((prev, current) => 
      current.rating > prev.rating ? current : prev
    , vendors[0])
    const totalSales = vendors.reduce((sum, vendor) => {
      const sales = parseFloat(vendor.totalSales.replace(/[^0-9.]/g, ''))
      return sum + sales
    }, 0)

    return {
      totalVendors,
      topEarningVendor,
      highestRatedVendor,
      totalSales: `$${(totalSales / 1000).toFixed(1)}M`,
    }
  }, [vendors])

  // Filter vendors based on search
  const filteredVendors = useMemo(() => {
    if (!searchQuery.trim()) return vendors
    
    const query = searchQuery.toLowerCase()
    return vendors.filter(
      (v) =>
        v.vendorName.toLowerCase().includes(query) ||
        v.email.toLowerCase().includes(query)
    )
  }, [vendors, searchQuery])

  // Render star rating
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: fullStars }).map((_, i) => (
          <StarIcon key={`full-${i}`} className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
        ))}
        {hasHalfStar && (
          <div className="relative h-4 w-4">
            <StarIcon className="h-4 w-4 text-gray-300" fill="#E5E7EB" />
            <div className="absolute left-0 top-0 h-4 w-2 overflow-hidden">
              <StarIcon className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
            </div>
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <StarIcon key={`empty-${i}`} className="h-4 w-4 text-gray-300" fill="#E5E7EB" />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    )
  }

  return (
    <div className="max-w-screen w-full overflow-x-hidden">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-600 mt-1">Dashboard • Top Performer Vendor Detail</p>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 sm:mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Vendors Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Total Vendors</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{kpiMetrics.totalVendors}</p>
              <p className="text-xs sm:text-sm text-green-600 mt-2 flex items-center gap-1">
                <span>↑</span>
                <span>12% vs last month</span>
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 p-2">
              <UsersIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Top Earnings Vendor Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Top Earnings Vendor</p>
              <p className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{kpiMetrics.topEarningVendor.vendorName}</p>
              <p className="text-sm text-gray-600">{kpiMetrics.topEarningVendor.earnings} this month</p>
            </div>
            <div className="rounded-lg bg-green-50 p-2">
              <TrophyIcon className="h-4 w-4 sm:h-5 sm:w-5" color="#10B981" />
            </div>
          </div>
        </div>

        {/* Highest Rated Vendor Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Highest Rated Vendor</p>
              <p className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{kpiMetrics.highestRatedVendor.vendorName}</p>
              <div className="flex items-center gap-1">
                {renderRating(kpiMetrics.highestRatedVendor.rating)}
              </div>
            </div>
            <div className="rounded-lg bg-yellow-50 p-2">
              <StarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" fill="#FBBF24" />
            </div>
          </div>
        </div>

        {/* Total Sales Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Total Sales</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{kpiMetrics.totalSales}</p>
              <p className="text-xs sm:text-sm text-green-600 mt-2 flex items-center gap-1">
                <span>↑</span>
                <span>8% vs last month</span>
              </p>
            </div>
            <div className="rounded-lg bg-purple-50 p-2">
              <DollarSignIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Area */}
      <div className="mb-4 sm:mb-6">
        <div className="bg-white rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-end w-full">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Time Range:</label>
            <div className="w-full sm:w-[180px]">
              <TimeRangeDropdown
                value={timeRange}
                options={timeRangeOptions}
                onChange={setTimeRange}
                className="w-full"
              />
            </div>
          </div>
          <div className="w-full sm:w-auto sm:min-w-[250px]">
            <SearchBar
              placeholder="Search vendor names..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Vendor Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Vendor Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Total Sales</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Completed Orders</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Bids Won</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Earnings</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Rating</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {vendor.avatar && (
                        <img
                          src={vendor.avatar}
                          alt={vendor.vendorName}
                          className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{vendor.vendorName}</p>
                        <p className="text-xs text-gray-500">{vendor.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{vendor.totalSales}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{vendor.completedOrders}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{vendor.bidsWon}</td>
                  <td className="px-4 py-3 text-sm font-medium text-green-600">{vendor.earnings}</td>
                  <td className="px-4 py-3">{renderRating(vendor.rating)}</td>
                  <td className="px-4 py-3">
                    <button className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

