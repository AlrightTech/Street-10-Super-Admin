import { useState } from 'react'
import { mockNotifications } from '../../data/mockData'
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
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleClearAll = () => {
    setNotifications([])
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
          {notifications.length === 0 ? (
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

