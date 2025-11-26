import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CalendarIcon, ClockIcon, LinkIcon, UsersGroupIcon, EditIcon } from '../components/icons/Icons'
import { type PushNotification } from '../components/marketing/PushNotificationsTable'

// Mock data - in a real app, this would come from an API
const MOCK_PUSH_NOTIFICATIONS: (PushNotification & {
  email?: string
  phone?: string
  fullMessage?: string
  startDate?: string
  endDate?: string
  sendTime?: string
  recipients?: string
  url?: string
  avatar?: string
})[] = [
  {
    id: '1',
    name: 'Touseef Ahmed',
    title: 'Flash Sale Alert',
    audience: 'All Users',
    category: 'Promo',
    deliveryTime: 'Immediate',
    priority: 'High',
    status: 'sent',
    email: 'alice.johnson@example.com',
    phone: '+1 234 567 8900',
    fullMessage: 'Flash Sale Alert! Get 50% off an all electronics for the next 24 hours. Don\'t miss out on this incredible deal - shop now before it\'s too late! Use code: FLASH50',
    startDate: 'Dec 22, 2024',
    endDate: 'Dec 22, 2024',
    sendTime: '10:00 AM',
    recipients: '12,450 recipients',
    url: 'https://www.example-site123.com/deals/flash-sole',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  },
  {
    id: '2',
    name: 'Touseef Ahmed',
    title: 'Flash Sale Alert',
    audience: 'All Users',
    category: 'Promo',
    deliveryTime: 'Dec 22, 2024 at...',
    priority: 'High',
    status: 'pending',
    email: 'alice.johnson@example.com',
    phone: '+1234 567 8900',
    fullMessage: 'Flash Sale Alert! Get 50% off on all electronics for the next 24 hours. Don\'t miss out on this incredible deal - shop now before it\'s too late! Use code: FLASH50',
    startDate: 'Dec 22, 2024',
    endDate: 'Dec 22, 2024',
    sendTime: '10:00 AM',
    recipients: '12,450 recipients',
    url: 'https://www.example-site123.com/deals/flash-sale',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  },
]

export default function PushNotificationPendingDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [notification, setNotification] = useState<(typeof MOCK_PUSH_NOTIFICATIONS)[0] | null>(null)

  useEffect(() => {
    if (id) {
      const found = MOCK_PUSH_NOTIFICATIONS.find((n) => n.id === id && n.status === 'pending')
      if (found) {
        setNotification(found)
      } else {
        // Fallback to default pending data
        setNotification(MOCK_PUSH_NOTIFICATIONS[1])
      }
    }
  }, [id])

  if (!notification) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Loading notification details...</p>
      </div>
    )
  }

  const notificationData = {
    id: notification.id,
    name: notification.name,
    title: notification.title || 'Flash Sale Alert',
    audience: notification.audience || 'All Users',
    category: notification.category || 'Promo',
    priority: notification.priority || 'High',
    email: notification.email || 'alice.johnson@example.com',
    phone: notification.phone || '+1234 567 8900',
    fullMessage: notification.fullMessage || 'Flash Sale Alert! Get 50% off on all electronics for the next 24 hours. Don\'t miss out on this incredible deal - shop now before it\'s too late! Use code: FLASH50',
    startDate: notification.startDate || 'Dec 22, 2024',
    endDate: notification.endDate || 'Dec 22, 2024',
    sendTime: notification.sendTime || '10:00 AM',
    recipients: notification.recipients || '12,450 recipients',
    url: notification.url || 'https://www.example-site123.com/deals/flash-sale',
    avatar: notification.avatar,
  }

  const getAvatarInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleEdit = () => {
    // Handle edit - navigate to edit page
    console.log('Edit notification:', id)
  }

  const handleCreateNew = () => {
    navigate('/marketing/add-push-notification')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Marketing</h1>
        <p className="text-sm text-gray-600 mt-1">Dashboard - Finance</p>
      </div>

      {/* Main Navigation Bar */}
      <nav className="flex flex-wrap items-center gap-1 sm:gap-2 md:gap-4 border-b border-gray-200 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => navigate('/marketing')}
          className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap text-gray-600 hover:text-gray-900"
        >
          Story Highlight
        </button>
        <button
          type="button"
          onClick={() => navigate('/marketing')}
          className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap text-gray-600 hover:text-gray-900"
        >
          Banners
        </button>
        <button
          type="button"
          onClick={() => navigate('/marketing')}
          className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap text-gray-600 hover:text-gray-900"
        >
          Pop-Up
        </button>
        <button
          type="button"
          onClick={() => navigate('/marketing')}
          className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap text-[#F7931E] border-b-2 border-[#F7931E]"
        >
          Push Notifications
        </button>
        <button
          type="button"
          onClick={() => navigate('/marketing')}
          className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap text-gray-600 hover:text-gray-900"
        >
          Product
        </button>
      </nav>

      {/* Notification Detail Section */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Notification Detail</h2>

        <div className="rounded-xl bg-white shadow-sm p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Sender Information */}
            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
              {notificationData.avatar ? (
                <img
                  src={notificationData.avatar}
                  alt={notificationData.name}
                  className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gray-200 text-sm sm:text-base font-medium text-gray-600 flex-shrink-0">
                  {getAvatarInitials(notificationData.name)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">{notificationData.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Vendor</p>
                <p className="text-sm text-gray-600 mt-1">{notificationData.email}</p>
                <p className="text-sm text-gray-600 mt-1">{notificationData.phone}</p>
              </div>
            </div>

            {/* Notification Status - Pending */}
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500"></span>
              <span className="text-sm text-gray-900">Notification Pending</span>
            </div>

            {/* Notification Title */}
            <div>
              <p className="text-base sm:text-lg font-bold text-gray-900">{notificationData.title}</p>
            </div>

            {/* Full Message */}
            <div>
              <p className="text-sm text-gray-700">{notificationData.fullMessage}</p>
            </div>

            {/* Delivery Details - Two Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Delivery Time */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-900">Delivery Time</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-900">Start Date, {notificationData.startDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-900">End Date, {notificationData.endDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-900">Send Time</span>
                </div>
                <div className="pl-6">
                  <span className="text-sm text-gray-900">{notificationData.sendTime}</span>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <UsersGroupIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-900">Audience</span>
                </div>
                <div className="pl-6">
                  <span className="text-sm text-gray-900">{notificationData.audience} ({notificationData.recipients})</span>
                </div>
              </div>

              {/* Right Column - Category & Priority */}
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-900">Category</span>
                  <div className="mt-2">
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-600 text-white">
                      {notificationData.category}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-900">Priority</span>
                  <div className="mt-2">
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-red-100 text-red-600">
                      {notificationData.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* URL */}
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-900">URL</span>
              <span className="text-sm text-gray-900 break-all">{notificationData.url}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={handleCreateNew}
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D] whitespace-nowrap w-full sm:w-auto cursor-pointer"
          >
            Create New Notification
          </button>
          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D] whitespace-nowrap w-full sm:w-auto cursor-pointer"
          >
            <EditIcon className="h-4 w-4" />
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}

