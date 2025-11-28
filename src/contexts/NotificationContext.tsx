import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'
import type { Notification, NotificationModule, NotificationCounts } from '../types/notifications'
import { mockNotifications } from '../data/mockNotifications'

/**
 * Notification context interface
 */
interface NotificationContextType {
  notifications: Notification[]
  counts: NotificationCounts
  markAsRead: (module: NotificationModule) => void
  markAllAsRead: () => void
  getUnreadCount: (module: NotificationModule) => number
  refreshNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

interface NotificationProviderProps {
  children: ReactNode
}

/**
 * Notification Provider Component
 * Manages global notification state using Context API
 */
export function NotificationProvider({ children }: NotificationProviderProps) {
  // Initialize notifications from mock data
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Load from localStorage if available, otherwise use mock data
    const saved = localStorage.getItem('notifications')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return [...mockNotifications]
      }
    }
    return [...mockNotifications]
  })

  /**
   * Calculate unread counts for each module
   * Memoized to prevent unnecessary recalculations
   */
  const counts = useMemo<NotificationCounts>(() => {
    const orders = notifications.filter((n) => n.module === 'orders' && !n.isRead).length
    const finance = notifications.filter((n) => n.module === 'finance' && !n.isRead).length
    return { orders, finance }
  }, [notifications])

  /**
   * Save notifications to localStorage
   */
  const saveToStorage = useCallback((updatedNotifications: Notification[]) => {
    try {
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications))
    } catch (error) {
      console.error('Failed to save notifications to localStorage:', error)
    }
  }, [])

  /**
   * Mark all notifications for a specific module as read
   * This is called when user clicks on Orders or Finance menu items
   */
  const markAsRead = useCallback(
    (module: NotificationModule) => {
      setNotifications((prev) => {
        const updated = prev.map((notification) =>
          notification.module === module && !notification.isRead
            ? { ...notification, isRead: true }
            : notification
        )
        saveToStorage(updated)
        return updated
      })
    },
    [saveToStorage]
  )

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((notification) => ({ ...notification, isRead: true }))
      saveToStorage(updated)
      return updated
    })
  }, [saveToStorage])

  /**
   * Get unread count for a specific module
   */
  const getUnreadCount = useCallback(
    (module: NotificationModule): number => {
      return notifications.filter((n) => n.module === module && !n.isRead).length
    },
    [notifications]
  )

  /**
   * Refresh notifications (useful for polling or manual refresh)
   * In production, this would fetch from API
   */
  const refreshNotifications = useCallback(() => {
    // For now, just reset to initial mock data
    // In production, this would be an API call
    const refreshed = [...mockNotifications]
    setNotifications(refreshed)
    saveToStorage(refreshed)
  }, [saveToStorage])

  const value = useMemo(
    () => ({
      notifications,
      counts,
      markAsRead,
      markAllAsRead,
      getUnreadCount,
      refreshNotifications,
    }),
    [notifications, counts, markAsRead, markAllAsRead, getUnreadCount, refreshNotifications]
  )

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

/**
 * Hook to use notification context
 * Throws error if used outside NotificationProvider
 */
export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

