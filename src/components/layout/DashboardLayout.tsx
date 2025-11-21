import { type ReactNode, useState } from 'react'
import NotificationsPopup from '../dashboard/NotificationsPopup'

/**
 * DashboardLayout component props
 */
export interface DashboardLayoutProps {
  children: ReactNode
}

/**
 * Dashboard layout component combining sidebar and header
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  return (
    <div className="flex min-h-screen w-full bg-[#F5F5F5]">
      {/* Sidebar */}
      {/* <Sidebar /> */}

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:ml-64">
        {/* Header */}
        {/* <Header
          onNotificationClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          notificationCount={3}
        /> */}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#F5F5F5] sm:p-4 md:p-6">
          <div className="mx-auto w-full max-w-7xl rounded-2xl">
            {children}
          </div>
        </main>
      </div>

      {/* Notifications Popup */}
      {isNotificationsOpen && (
        <NotificationsPopup onClose={() => setIsNotificationsOpen(false)} />
      )}
    </div>
  )
}

