import { memo } from 'react'

/**
 * NotificationBadge component props
 */
export interface NotificationBadgeProps {
  count: number
  className?: string
  maxCount?: number
}

/**
 * Reusable Notification Badge Component
 * Displays a red badge with notification count
 * Only renders when count > 0
 * Includes smooth transitions for show/hide
 * Matches the existing sidebar badge styling
 */
const NotificationBadge = memo(function NotificationBadge({
  count,
  className = '',
  maxCount = 99,
}: NotificationBadgeProps) {
  // Don't render if count is 0 or less
  if (count <= 0) {
    return null
  }

  // Format count display (e.g., 99+ for counts over maxCount)
  const displayCount = count > maxCount ? `${maxCount}+` : count

  return (
    <span
      className={`absolute -top-4 sm:-top-2 -right-1.5 z-10 flex h-6 w-7 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-red-500 sm:text-[8px] font-semibold leading-none text-white transition-all duration-300 ease-in-out ${className}`}
      role="status"
      aria-label={`${count} unread notifications`}
    >
      {displayCount}
    </span>
  )
})

export default NotificationBadge

