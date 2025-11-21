import { useNavigate, useParams } from 'react-router-dom'
import { CalendarIcon, ClockIcon, LinkIcon, UsersGroupIcon, EditIcon, PlusIcon } from '../components/icons/Icons'

export default function PushNotificationPendingDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Mock notification data - in a real app, fetch this based on id
  const notificationData = {
    id: id || '1',
    name: 'Touseef Ahmed',
    title: 'Flash Sale Alert',
    audience: 'All Users',
    category: 'Promo',
    priority: 'High',
    email: 'alice.johnson@example.com',
    phone: '+1 234 567 8900',
    fullMessage: 'Flash Sale Alert! Get 50% off on all electronics for the next 24 hours. Don\'t miss out on this incredible deal - shop now before it\'s too late! Use code: FLASH50.',
    startDate: 'Dec 22, 2024',
    endDate: 'Dec 22, 2024',
    sendTime: '10:00 AM',
    recipients: '12,450 recipients',
    url: 'https://www.example-site123.com/deals/flash-sale',
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
            {/* Vendor Information */}
            <div className="flex flex-col sm:flex-row items-start gap-4 pb-4 border-b border-gray-200">
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gray-200 text-sm sm:text-base font-medium text-gray-600 flex-shrink-0">
                {getAvatarInitials(notificationData.name)}
              </div>
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
              <span className="text-sm font-medium text-red-800">Notification Pending</span>
            </div>

            {/* Notification Title */}
            <div>
              <label className="text-sm font-medium text-gray-700">Title</label>
              <p className="text-base sm:text-lg font-semibold text-gray-900 mt-1">{notificationData.title}</p>
            </div>

            {/* Full Message */}
            <div>
              <label className="text-sm font-medium text-gray-700">Full Message</label>
              <div className="mt-2 rounded-lg bg-gray-50 border border-gray-200 p-3 sm:p-4">
                <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap break-words">{notificationData.fullMessage}</p>
              </div>
            </div>

            {/* Delivery Time */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ClockIcon className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
                <label className="text-sm font-medium text-gray-700">Delivery Time</label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-sm text-gray-600 sm:min-w-[100px]">Start Date:</span>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-900">{notificationData.startDate}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-sm text-gray-600 sm:min-w-[100px]">End Date:</span>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-900">{notificationData.endDate}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-sm text-gray-600 sm:min-w-[100px]">Send Time:</span>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-gray-400 flex-shrink-0 cursor-pointer hover:text-gray-600 transition-colors" />
                    <span className="text-sm text-gray-900">{notificationData.sendTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Category</label>
                <div className="mt-2">
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800">
                    {notificationData.category}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Priority</label>
                <div className="mt-2">
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-red-100 text-red-800">
                    {notificationData.priority}
                  </span>
                </div>
              </div>
            </div>

            {/* Audience */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <UsersGroupIcon className="h-4 w-4 text-gray-400" />
                <label className="text-sm font-medium text-gray-700">Audience</label>
              </div>
              <p className="text-sm text-gray-900">{notificationData.audience} ({notificationData.recipients})</p>
            </div>

            {/* URL */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <a
                    href={notificationData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                    aria-label="Open URL"
                  >
                    <LinkIcon className="h-4 w-4 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" />
                  </a>
                  <label className="text-sm font-medium text-gray-700 flex-shrink-0">URL:</label>
                  <a
                    href={notificationData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline break-all min-w-0"
                  >
                    {notificationData.url}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={handleCreateNew}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D] whitespace-nowrap w-full sm:w-auto"
          >
            <PlusIcon className="h-4 w-4" />
            Create New Notification
          </button>
          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D] whitespace-nowrap w-full sm:w-auto"
          >
            <EditIcon className="h-4 w-4" />
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}

