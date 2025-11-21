import { useState, useRef, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ChevronDownIcon, CalendarIcon } from '../icons/Icons'
import type { UserVendorGrowthData } from '../../types/analytics'

/**
 * UserVendorGrowthChart component props
 */
export interface UserVendorGrowthChartProps {
  data: UserVendorGrowthData[]
}

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

  // Close dropdown when clicking outside
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
        className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-1.5 pr-7 text-xs text-gray-700 hover:bg-gray-50 focus:border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/20 sm:px-4 sm:py-2 sm:pr-8 sm:text-sm"
      >
        <span className="block truncate text-left">{selectedLabel}</span>
        <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400 sm:h-4 sm:w-4" />
      </button>

      {isOpen && (
        <div className="absolute left-0 z-50 mt-1 w-full min-w-[120px] origin-top-left rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="py-1 max-h-60 overflow-auto" role="menu">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`block w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 transition-colors sm:text-sm ${
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
 * User and vendor growth dual-line chart component
 */
export default function UserVendorGrowthChart({ data }: UserVendorGrowthChartProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Month name to number mapping for sorting
  const monthMap: Record<string, number> = {
    'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
    'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
  }

  // Sort data by date
  const sortedData = [...data].sort((a, b) => {
    const monthA = monthMap[a.name] || 0
    const monthB = monthMap[b.name] || 0
    return sortOrder === 'asc' ? monthA - monthB : monthB - monthA
  })

  const handleSortByDate = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
  }

  // Month options
  const monthOptions = [
    { label: 'All Months', value: 'all' },
    { label: 'January', value: 'January' },
    { label: 'February', value: 'February' },
    { label: 'March', value: 'March' },
    { label: 'April', value: 'April' },
    { label: 'May', value: 'May' },
    { label: 'June', value: 'June' },
    { label: 'July', value: 'July' },
    { label: 'August', value: 'August' },
    { label: 'September', value: 'September' },
    { label: 'October', value: 'October' },
    { label: 'November', value: 'November' },
    { label: 'December', value: 'December' },
  ]

  // Generate year options (current year and previous 4 years)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    label: (currentYear - i).toString(),
    value: (currentYear - i).toString(),
  }))

  return (
    <div className="w-full min-w-0 flex flex-col rounded-lg border border-gray-200 bg-white p-4 sm:p-5 md:p-6 shadow-sm">
      <div className="mb-3 sm:mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900 sm:text-lg">User And Vendor Growth</h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Last 30 Days <span className="text-[#FF8C00]">+66%</span>
          </p>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-1">50%</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto items-start sm:items-center">
          <button 
            onClick={handleSortByDate}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 focus:border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/20 sm:px-4 sm:py-2 sm:text-sm transition-colors"
          >
            <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Sort By Date {sortOrder === 'asc' ? '↑' : '↓'}</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#3B82F6]"></div>
              <span className="text-xs text-gray-600">Users</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#FF8C00]"></div>
              <span className="text-xs text-gray-600">Vendors</span>
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <CustomDropdown
              value={selectedMonth}
              options={monthOptions}
              onChange={setSelectedMonth}
              className="w-full sm:w-auto"
            />
          </div>
          <div className="w-full sm:w-auto">
            <CustomDropdown
              value={selectedYear}
              options={yearOptions}
              onChange={setSelectedYear}
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>
      <div className="w-full min-w-0 h-[250px] sm:h-[300px] md:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sortedData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              stroke="#6b7280" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              stroke="#6b7280" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              domain={[0, 1200]}
              ticks={[0, 200, 400, 600, 800, 1000, 1200]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '10px' }}
              iconType="line"
            />
            <Line 
              type="monotone" 
              dataKey="users" 
              stroke="#3B82F6" 
              strokeWidth={2.5} 
              name="Users"
              dot={{ fill: '#3B82F6', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="vendors" 
              stroke="#FF8C00" 
              strokeWidth={2.5} 
              name="Vendors"
              dot={{ fill: '#FF8C00', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

