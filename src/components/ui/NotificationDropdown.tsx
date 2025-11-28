import { memo, useEffect, useRef } from 'react'
import { useNotifications } from '../../contexts/NotificationContext'
import type { Notification } from '../../types/notifications'

/**
 * X icon component
 */
const XIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

/**
 * NotificationDropdown component props
 */
export interface NotificationDropdownProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Format time ago helper function
 * Converts date to human-readable time ago string
 * Matches reference format: "10 mins ago", "1 hour ago", "2 mins ago"
 */
const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} ${minutes === 1 ? 'min' : 'mins'} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  const days = Math.floor(hours / 24)
  return `${days} ${days === 1 ? 'day' : 'days'} ago`
}

/**
 * Get notification type color for visual indicator
 */
const getTypeColor = (type?: string): string => {
  switch (type) {
    case 'success':
      return 'bg-green-500'
    case 'warning':
      return 'bg-yellow-500'
    case 'error':
      return 'bg-red-500'
    default:
      return 'bg-blue-500'
  }
}

/**
 * NotificationDropdown Component
 * Displays all notifications in a dropdown panel
 * Marks all notifications as read when opened (via useEffect in parent)
 * Uses NotificationContext for state management
 * Includes smooth transitions and optimized rendering
 */
const NotificationDropdown = memo(function NotificationDropdown({
  isOpen,
  onClose,
}: NotificationDropdownProps) {
  const { notifications } = useNotifications()
  const dropdownRef = useRef<HTMLDivElement>(null)

  /**
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  /**
   * Close dropdown on Escape key
   */
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // Don't render if not open
  if (!isOpen) {
    return null
  }

  // Sort notifications by date (newest first)
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/20 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dropdown Panel */}
      <div
        ref={dropdownRef}
        className="fixed right-2 sm:right-4 md:right-6 top-14 sm:top-16 z-50 w-[calc(100vw-1rem)] sm:w-96 max-w-[calc(100vw-1rem)] sm:max-w-none rounded-lg bg-white shadow-xl transform transition-all duration-300 ease-out origin-top-right"
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
      >
        {/* Header - Dark Purple */}
        <div className="flex items-center justify-between border-b border-white/20 px-4 py-3 bg-[#5C54A4] rounded-t-lg">
          <h3 className="text-lg font-semibold text-white">Notifications</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors rounded-lg p-1 cursor-pointer"
            aria-label="Close notifications"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {sortedNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-500">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {sortedNotifications.map((notification: Notification) => (
                <div
                  key={notification.id}
                  className="px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-700">{notification.title}</h4>
                          <p className="mt-1 text-xs text-gray-500">{notification.message}</p>
                        </div>
                        {/* Dismiss Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Optional: Handle individual notification dismissal
                          }}
                          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1"
                          aria-label="Dismiss notification"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      </div>
                      {/* Timestamp - Right aligned */}
                      <div className="mt-2 flex justify-end">
                        <span className="text-xs text-gray-400">
                          {formatTimeAgo(new Date(notification.createdAt))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Clear All Button */}
        {sortedNotifications.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-3 bg-white rounded-b-lg">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  // Clear all notifications - handled by parent marking all as read
                  onClose()
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors cursor-pointer"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
})

export default NotificationDropdown

