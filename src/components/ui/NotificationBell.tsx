/**
 * NotificationBell component props
 */
export interface NotificationBellProps {
  count?: number
  onClick?: () => void
  className?: string
}

/**
 * Bell icon component
 */
const BellIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
)

/**
 * Notification bell component with badge
 */
export default function NotificationBell({
  count = 0,
  onClick,
  className = '',
}: NotificationBellProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative  p-2 text-gray-600 cursor-pointer
          ${className}`}
      aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ''}`}
    >
      <BellIcon className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  )
}

