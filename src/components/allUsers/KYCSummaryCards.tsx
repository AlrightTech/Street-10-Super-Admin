import type { KYCSummaryCard } from '../../types/allUsers'

/**
 * KYC Summary Cards component props
 */
export interface KYCSummaryCardsProps {
  cards: KYCSummaryCard[]
  onCardClick?: (type: 'pending' | 'approved' | 'rejected' | 'total') => void
}

/**
 * KYC Summary Cards component
 */
export default function KYCSummaryCards({ cards, onCardClick }: KYCSummaryCardsProps) {

  const handleCardClick = (type: 'pending' | 'approved' | 'rejected' | 'total') => {
    if (onCardClick) {
      onCardClick(type)
    }
  }

  const getIconComponent = (icon: string, bgColor: string, iconColor: string) => {
    const iconSize = 'h-6 w-6'
    
    switch (icon) {
      case 'people':
        // Three stylized human figures on light blue background
        return (
          <div className={`flex items-center justify-center h-10 w-10 rounded ${bgColor}`}>
            <svg className={iconSize} fill={iconColor} viewBox="0 0 24 24">
              <circle cx="6" cy="5.5" r="2" />
              <path d="M6 10c-1.5 0-3.5.8-3.5 2v1.5h7V12c0-1.2-2-2-3.5-2z" />
              <circle cx="12" cy="5.5" r="2" />
              <path d="M12 10c-1.5 0-3.5.8-3.5 2v1.5h7V12c0-1.2-2-2-3.5-2z" />
              <circle cx="18" cy="5.5" r="2" />
              <path d="M18 10c-1.5 0-3.5.8-3.5 2v1.5h7V12c0-1.2-2-2-3.5-2z" />
            </svg>
          </div>
        )
      case 'trophy':
        // Green trophy icon
        return (
          <div className={`flex items-center justify-center h-10 w-10 rounded ${bgColor}`}>
            <svg className={iconSize} fill={iconColor} viewBox="0 0 24 24">
              <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C6.34 11.4 5.5 10.28 5 8zm14 0c-.5 2.28-1.34 3.4-2 3.82V7h2v1z" />
            </svg>
          </div>
        )
      case 'document':
        // Yellow list/document with three horizontal lines and two small circles
        return (
          <div className={`flex items-center justify-center h-10 w-10 rounded ${bgColor}`}>
            <svg className={iconSize} fill="none" stroke={iconColor} strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="5" y="4" width="14" height="16" rx="1.5" />
              <line x1="8" y1="8" x2="16" y2="8" strokeLinecap="round" />
              <line x1="8" y1="11" x2="16" y2="11" strokeLinecap="round" />
              <line x1="8" y1="14" x2="16" y2="14" strokeLinecap="round" />
              <circle cx="10" cy="17.5" r="1" fill={iconColor} />
              <circle cx="14" cy="17.5" r="1" fill={iconColor} />
            </svg>
          </div>
        )
      case 'square':
        // Purple document/card with small square and three horizontal dotted lines
        return (
          <div className={`flex items-center justify-center h-10 w-10 rounded ${bgColor}`}>
            <svg className={iconSize} fill={iconColor} viewBox="0 0 24 24">
              <rect x="5" y="4" width="14" height="16" rx="1.5" />
              <rect x="7.5" y="6.5" width="4" height="4" rx="0.5" />
              <circle cx="9.5" cy="12" r="0.8" />
              <circle cx="11.5" cy="12" r="0.8" />
              <circle cx="13.5" cy="12" r="0.8" />
              <circle cx="9.5" cy="14.5" r="0.8" />
              <circle cx="11.5" cy="14.5" r="0.8" />
              <circle cx="13.5" cy="14.5" r="0.8" />
              <circle cx="9.5" cy="17" r="0.8" />
              <circle cx="11.5" cy="17" r="0.8" />
              <circle cx="13.5" cy="17" r="0.8" />
            </svg>
          </div>
        )
      default:
        return null
    }
  }

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'pending':
        return 'bg-blue-50'
      case 'approved':
        return 'bg-green-50'
      case 'rejected':
        return 'bg-yellow-50'
      case 'total':
        return 'bg-purple-50'
      default:
        return 'bg-gray-50'
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.type}
          onClick={() => handleCardClick(card.type)}
          className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600 mb-1">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900">{card.count}</p>
              {card.trend && (
                <div className="flex items-center gap-1 mt-1">
                  <svg
                    className="h-3 w-3 text-green-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 14l5-5 5 5z" />
                  </svg>
                  <span className="text-xs text-green-500 whitespace-nowrap">
                    {card.trend.label}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-shrink-0 ml-2">
              {getIconComponent(card.icon, getBackgroundColor(card.type), card.iconColor)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

