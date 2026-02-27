import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from 'react'
import type { Notification, NotificationModule, NotificationCounts } from '../types/notifications'
import { mockNotifications } from '../data/mockNotifications'
import { dashboardApi } from '../services/dashboard.api'

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

const initialCounts: NotificationCounts = { users: 0, vendors: 0, orders: 0, finance: 0, wallet: 0 }

/**
 * Notification Provider Component
 * Manages global notification state and sidebar badge counts from dashboard API
 */
export function NotificationProvider({ children }: NotificationProviderProps) {
  // Sidebar badge counts from dashboard API (users=KYC pending, vendors=pending, orders=uncompleted, finance=refunds pending)
  const [sidebarCounts, setSidebarCounts] = useState<NotificationCounts>(initialCounts)

  // Initialize notifications from mock data (for notification popup if used)
  const [notifications, setNotifications] = useState<Notification[]>(() => {
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

  // Fetch dashboard stats for sidebar badge counts
  const fetchSidebarCounts = useCallback(async () => {
    try {
      const stats = await dashboardApi.getDashboard()
      setSidebarCounts({
        users: stats.kyc?.pending ?? 0,
        vendors: stats.vendors?.pending ?? 0,
        orders: stats.orders?.uncompleted ?? 0,
        finance: stats.refunds?.pending ?? 0,
        wallet: stats.withdrawals?.pending ?? 0,
      })
    } catch (error) {
      console.error('Failed to fetch sidebar badge counts:', error)
    }
  }, [])

  useEffect(() => {
    fetchSidebarCounts()
    const interval = setInterval(fetchSidebarCounts, 60000) // refresh every 60s
    return () => clearInterval(interval)
  }, [fetchSidebarCounts])

  /**
   * Badge counts: use dashboard-based counts for sidebar (users, vendors, orders, finance)
   */
  const counts = useMemo<NotificationCounts>(() => ({ ...sidebarCounts }), [sidebarCounts])

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
   * Get unread count for a specific module (sidebar badges use API counts)
   */
  const getUnreadCount = useCallback(
    (module: NotificationModule): number => {
      return counts[module] ?? 0
    },
    [counts]
  )

  /**
   * Refresh notifications and sidebar badge counts
   */
  const refreshNotifications = useCallback(() => {
    const refreshed = [...mockNotifications]
    setNotifications(refreshed)
    saveToStorage(refreshed)
    fetchSidebarCounts()
  }, [saveToStorage, fetchSidebarCounts])

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

