import { StarIcon } from '../icons/Icons'
import type { PlatformInsight } from '../../types/analytics'

/**
 * PlatformInsights component props
 */
export interface PlatformInsightsProps {
  insights: PlatformInsight[]
}

/**
 * Get color classes based on borderColor type
 */
const getColorClasses = (borderColor: PlatformInsight['borderColor']) => {
  switch (borderColor) {
    case 'red':
      return {
        border: 'border-l-red-500',
        bg: 'bg-red-50',
        text: 'text-red-600',
        icon: 'text-red-600',
      }
    case 'blue':
      return {
        border: 'border-l-blue-500',
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        icon: 'text-blue-600',
      }
    case 'green':
      return {
        border: 'border-l-green-500',
        bg: 'bg-green-50',
        text: 'text-green-600',
        icon: 'text-green-600',
      }
    case 'yellow':
      return {
        border: 'border-l-yellow-500',
        bg: 'bg-yellow-50',
        text: 'text-yellow-600',
        icon: 'text-yellow-600',
      }
    case 'purple':
      return {
        border: 'border-l-purple-500',
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        icon: 'text-purple-600',
      }
    case 'lightBlue':
      return {
        border: 'border-l-blue-500',
        bg: 'bg-cyan-50',
        text: 'text-blue-600',
        icon: 'text-blue-600',
      }
    default:
      return {
        border: 'border-l-gray-500',
        bg: 'bg-gray-50',
        text: 'text-gray-600',
        icon: 'text-gray-600',
      }
  }
}

/**
 * Get icon component based on icon type
 */
const getIcon = (icon: PlatformInsight['icon'], colorClass: string) => {
  const iconClass = `h-5 w-5 ${colorClass}`
  
  switch (icon) {
    case 'warning':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      )
    case 'info':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
      )
    case 'check':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      )
    case 'clock':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
        </svg>
      )
    case 'signal':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M1 9h2v7H1zm4 2h2v5H5zm4-4h2v9H9zm4-2h2v11h-2zm4-4h2v15h-2z" />
        </svg>
      )
    case 'star':
      return <StarIcon className={iconClass} fill="currentColor" />
    default:
      return null
  }
}

/**
 * Platform insights component with colored border cards
 */
export default function PlatformInsights({ insights }: PlatformInsightsProps) {
  return (
    <div>
      <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-bold text-gray-900">Analytical Insights</h3>
      <div className="bg-white rounded-lg p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {insights.map((insight) => {
            const colors = getColorClasses(insight.borderColor)
            return (
              <div
                key={insight.id}
                className={`rounded-lg border-l-4 ${colors.border} border-t border-r border-b border-gray-200 ${colors.bg} p-4 sm:p-5 shadow-sm relative`}
              >
                <div className="absolute top-4 right-4">
                  {getIcon(insight.icon, colors.icon)}
                </div>
                <h4 className={`text-sm sm:text-base font-bold ${colors.text} mb-2 pr-8`}>
                  {insight.title}
                </h4>
                <p className={`text-sm sm:text-base ${colors.text}`}>
                  {insight.message}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

