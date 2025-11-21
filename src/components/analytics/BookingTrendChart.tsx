import { useState, useRef, useEffect } from 'react'
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { ChevronDownIcon } from '../icons/Icons'
import { mockVendors } from '../../data/mockVendors'
import type { BookingTrendData } from '../../types/analytics'

/**
 * BookingTrendChart component props
 */
export interface BookingTrendChartProps {
  data: BookingTrendData[]
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
 * Booking trends line chart component
 */
export default function BookingTrendChart({ data }: BookingTrendChartProps) {
  const [selectedVendor, setSelectedVendor] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())

  // Get unique vendor business names
  const uniqueVendorNames = Array.from(new Set(mockVendors.map(v => v.businessName)))
  const vendorOptions = [
    { label: 'All Vendors', value: 'all' },
    ...uniqueVendorNames.map(vendor => ({ label: vendor, value: vendor }))
  ]

  // Generate year options (current year and previous 4 years)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    label: (currentYear - i).toString(),
    value: (currentYear - i).toString(),
  }))

  return (
    <div className="flex h-full min-h-[280px] w-full min-w-0 sm:min-h-[350px] md:min-h-[400px] flex-col rounded-lg border border-gray-200 bg-white p-4 sm:p-5 md:p-6 shadow-sm">
      <div className="mb-3 sm:mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900 sm:text-lg">Booking Trends</h3>
          <p className="text-xs sm:text-sm text-gray-600">Last 30 Days +5%</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-auto">
            <CustomDropdown
              value={selectedVendor}
              options={vendorOptions}
              onChange={setSelectedVendor}
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
      <div className="flex-1 min-h-[180px] w-full min-w-0 sm:min-h-[250px] md:min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
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
            <Area 
              type="monotone" 
              dataKey="bookings" 
              stroke="#3B82F6" 
              strokeWidth={2.5} 
              fill="url(#colorBookings)"
              name="Bookings"
            />
            <Line 
              type="monotone" 
              dataKey="trends" 
              stroke="#FF8C00" 
              strokeWidth={2.5} 
              name="Trends"
              dot={{ fill: '#FF8C00', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

