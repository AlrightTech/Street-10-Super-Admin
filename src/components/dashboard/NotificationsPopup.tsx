import { useState, useEffect } from 'react'
import { notificationsApi, type Notification as ApiNotification } from '../../services/notifications.api'
import type { Notification } from '../../types/dashboard'

/**
 * X icon component
 */
const XIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

/**
 * NotificationsPopup component props
 */
export interface NotificationsPopupProps {
  onClose: () => void
}

/**
 * Notifications popup component
 */
export default function NotificationsPopup({ onClose }: NotificationsPopupProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const result = await notificationsApi.getAll({ 
          is_read: false, // Changed from 'read' to 'is_read' to match backend API
          page: 1,
          limit: 20 
        })
        
        // Transform API notifications to frontend format
        const transformedNotifications: Notification[] = result.data.map((notif: ApiNotification) => ({
          id: notif.id,
          title: notif.title,
          user: notif.user?.email || 'System',
          userId: notif.userId || '',
          timestamp: notif.createdAt,
          timeAgo: formatTimeAgo(new Date(notif.createdAt)),
        }))
        
        setNotifications(transformedNotifications)
      } catch (error) {
        console.error('Error fetching notifications:', error)
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const handleDismiss = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id) // Mark as read instead of delete
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    } catch (error) {
      console.error('Error dismissing notification:', error)
    }
  }

  const handleClearAll = async () => {
    try {
      await notificationsApi.clearAll() // Clear all notifications for current admin user
      setNotifications([])
    } catch (error) {
      console.error('Error clearing notifications:', error)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />

      {/* Popup */}
      <div className="fixed right-2 sm:right-4 md:right-6 top-14 sm:top-16 z-50 w-[calc(100vw-1rem)] sm:w-80 max-w-[calc(100vw-1rem)] sm:max-w-none rounded-lg bg-[#5C54A4] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/20 px-4 py-3">
          <h3 className="text-lg font-semibold text-white">Notifications</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Close notifications"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-white/70">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-white/70">No notifications</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="border-b border-white/20 px-4 py-3 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white">{notification.title}</h4>
                    <p className="mt-1 text-xs text-white/70">
                      User: {notification.user} {notification.userId}
                    </p>
                    <p className="mt-1 text-xs text-white/60">{notification.timeAgo}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDismiss(notification.id)}
                    className="text-white/70 hover:text-white transition-colors"
                    aria-label="Dismiss notification"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-white/20 px-4 py-3">
            <button
              type="button"
              onClick={handleClearAll}
              className="w-full rounded-lg bg-[#FF8C00] px-4 py-2 text-sm font-medium text-white hover:bg-[#E6851A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/50"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </>
  )
}

