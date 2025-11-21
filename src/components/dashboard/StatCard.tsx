import { useNavigate } from 'react-router-dom'
import type { StatCard as StatCardType } from '../../types/dashboard'

/**
 * StatCard component props
 */
export interface StatCardProps {
  stat: StatCardType
}

/**
 * Trend icon components
 */
const TrendingUpIcon = ({ className = 'h-3 w-3', color = '#4CAF50' }: { className?: string; color?: string }) => (
  <svg className={className} fill={color} viewBox="0 0 24 24">
    <path d="M7 14l5-5 5 5z" />
  </svg>
)

/**
 * Card icon components
 */
const UsersIcon = ({ className = 'h-8 w-8', color = '#3B82F6' }: { className?: string; color?: string }) => (
  <svg className={className} fill={color} viewBox="0 0 24 24">
    <circle cx="9" cy="7" r="3" />
    <path d="M9 12c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    <circle cx="20" cy="7" r="2" />
    <path d="M20 12c-1.1 0-3 .9-3 2v2h6v-2c0-1.1-1.9-2-3-2z" />
  </svg>
)

const VendorsIcon = ({ className = 'h-8 w-8', color = '#3B82F6' }: { className?: string; color?: string }) => (
  <svg className={className} fill={color} viewBox="0 0 24 24">
    <circle cx="9" cy="7" r="2.5" />
    <path d="M9 12c-2.21 0-4 1.79-4 4v2h8v-2c0-2.21-1.79-4-4-4z" />
    <circle cx="20" cy="7" r="2" />
    <path d="M20 12c-1.1 0-2 .9-2 2v2h4v-2c0-1.1-.9-2-2-2z" />
  </svg>
)

const BookingIcon = ({ className = 'h-8 w-8', color = '#3B82F6' }: { className?: string; color?: string }) => (
  <svg className={className} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill={color}>B</text>
    <circle cx="18" cy="6" r="1.5" fill={color} />
  </svg>
)

const RevenueIcon = ({ className = 'h-8 w-8', color = '#3B82F6' }: { className?: string; color?: string }) => (
  <svg className={className} fill={color} viewBox="0 0 24 24">
    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
  </svg>
)

const CommissionIcon = ({ className = 'h-8 w-8', color = '#3B82F6' }: { className?: string; color?: string }) => (
  <svg className={className} fill={color} viewBox="0 0 24 24">
    <circle cx="12" cy="6" r="2.5" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="18" r="1.5" />
  </svg>
)

const ApprovalsIcon = ({ className = 'h-8 w-8', color = '#FF8C00' }: { className?: string; color?: string }) => (
  <svg className={className} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    <circle cx="19" cy="5" r="1.5" fill={color} />
  </svg>
)

const DisputeIcon = ({ className = 'h-8 w-8', color = '#EF4444' }: { className?: string; color?: string }) => (
  <svg className={className} fill={color} viewBox="0 0 24 24">
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
  </svg>
)

const RatingIcon = ({ className = 'h-8 w-8', color = '#FF8C00' }: { className?: string; color?: string }) => (
  <svg className={className} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

/**
 * Mini bar chart component
 */
const MiniBarChart = ({ data, color }: { data: number[]; color: string }) => {
  const maxValue = Math.max(...data)
  const chartHeight =40

  return (
    <div className="flex items-end gap-1" style={{ height: `${chartHeight}px` }}>
      {data.map((value, index) => {
        const height = (value / maxValue) * chartHeight
        return (
          <div
            key={index}
            className="w-1.5 rounded-t"
            style={{
              height: `${height}px`,
              backgroundColor: color,
              minHeight: '2px',
            }}
          />
        )
      })}
    </div>
  )
}

/**
 * Reusable stat card component
 */
export default function StatCard({ stat }: StatCardProps) {
  const navigate = useNavigate()

  const handleCardClick = () => {
    // Navigate to All Users page when "Total Users" card is clicked
    if (stat.title === 'Total Users') {
      navigate('/all-users')
    }
  }
  // Get bar chart color based on card color
  const getBarChartColor = () => {
    switch (stat.color) {
      case 'blue':
        return '#4169E1'
      case 'cyan':
        return '#40E0D0'
      case 'red':
        return '#FF6347'
      case 'lightGreen':
        return '#9ACD32'
      case 'orange':
        return '#FFA500'
      case 'purple':
        return '#9370DB'
      case 'green':
        return '#4CAF50'
      default:
        return '#6B7280'
    }
  }

  // Get trend color
  const getTrendColor = () => {
    if (stat.trendColor === 'orange') {
      return '#FFA500'
    }
    if (stat.trendColor === 'purple') {
      return '#9370DB'
    }
    return '#4CAF50' // Default green
  }

  const trendColor = getTrendColor()

  // Get icon component and color
  const getIcon = () => {
    const iconColor = stat.iconColor === 'orange' ? '#FF8C00' : stat.iconColor === 'red' ? '#EF4444' : '#3B82F6'
    const iconClass = 'h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0'
    
    switch (stat.icon) {
      case 'users':
        return <UsersIcon className={iconClass} color={iconColor} />
      case 'vendors':
        return <VendorsIcon className={iconClass} color={iconColor} />
      case 'booking':
        return <BookingIcon className={iconClass} color={iconColor} />
      case 'revenue':
        return <RevenueIcon className={iconClass} color={iconColor} />
      case 'commission':
        return <CommissionIcon className={iconClass} color={iconColor} />
      case 'approvals':
        return <ApprovalsIcon className={iconClass} color={iconColor} />
      case 'dispute':
        return <DisputeIcon className={iconClass} color={iconColor} />
      case 'rating':
        return <RatingIcon className={iconClass} color={iconColor} />
      default:
        return null
    }
  }

  const isClickable = stat.title === 'Total Users'

  return (
    <div
      className={`w-full min-w-0 rounded-2xl border border-gray-200 bg-white p-4 transition-colors ${
        isClickable ? 'cursor-pointer hover:bg-gray-100' : ''
      }`}
      onClick={isClickable ? handleCardClick : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-xs sm:text-sm font-normal text-[#555555]">{stat.title}</h3>
          
          {/* Value and Chart Row */}
          <div className="mt-2 sm:mt-3 flex flex-wrap items-center justify-between gap-2">
            {/* Value */}
            <p className="flex-1 min-w-[160px] sm:min-w-[120px] text-xl sm:text-2xl font-bold text-[#333333] break-words">
              {stat.value}
            </p>
            
            {/* Mini Bar Chart - aligned with value */}
            {stat.barChartData && (
              <div className="flex flex-shrink-0 items-end sm:w-auto">
                <MiniBarChart data={stat.barChartData} color={getBarChartColor()} />
              </div>
            )}
          </div>
        </div>
        
        {/* Icon */}
        {stat.icon && (
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
        )}
      </div>

      {/* Trend Indicator */}
      <div className="mt-2 sm:mt-3 flex items-center gap-1 text-xs sm:text-sm font-normal">
        <TrendingUpIcon className="h-3 w-3 flex-shrink-0" color={trendColor} />
        <span className="text-[10px] sm:text-xs break-words" style={{ color: trendColor }}>
          +{stat.change}% {stat.changeLabel}
        </span>
      </div>
    </div>
  )
}

