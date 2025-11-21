import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarIcon, ClockIcon, EditIcon, LinkIcon, ChevronDownIcon } from '../components/icons/Icons'

interface PushNotificationFormData {
  title: string
  startDate: string
  endDate: string
  sendingTime: string
  audience: string
  audienceSubOption: string
  priority: string
  url: string
  fullMessage: string
}

export default function AddPushNotification() {
  const navigate = useNavigate()
  const startDateInputRef = useRef<HTMLInputElement>(null)
  const endDateInputRef = useRef<HTMLInputElement>(null)
  const sendingTimeInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<PushNotificationFormData>({
    title: '',
    startDate: '',
    endDate: '',
    sendingTime: '10:00 AM',
    audience: 'Users / Vendors',
    audienceSubOption: 'All (Separate Users / Vendors)',
    priority: 'High / Medium',
    url: 'https://www.example-site123.com/deals/flash-sale',
    fullMessage: '',
  })

  const handleInputChange = (field: keyof PushNotificationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    // eslint-disable-next-line no-console
    console.log('Form submitted:', formData)
    // Add your save logic here
    // After saving, navigate back to marketing page
    navigate('/marketing')
  }

  const handleCancel = () => {
    navigate('/marketing')
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

      {/* Page Title */}
      <h2 className="text-lg sm:text-xl font-bold text-gray-900">Add New Notification</h2>

      {/* Form Section */}
      <div className="rounded-xl bg-white shadow-sm p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Notification Title */}
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700">
              Notification Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter Notification Title Here"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F7931E] focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
            />
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start-date" className="mb-2 block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <div className="relative">
                <input
                  ref={startDateInputRef}
                  type="date"
                  id="start-date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  placeholder="Start Date"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F7931E] focus:outline-none focus:ring-1 focus:ring-[#F7931E] [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  style={{ WebkitAppearance: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => startDateInputRef.current?.showPicker?.()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label="Open calendar"
                >
                  <CalendarIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="end-date" className="mb-2 block text-sm font-medium text-gray-700">
                End Date
              </label>
              <div className="relative">
                <input
                  ref={endDateInputRef}
                  type="date"
                  id="end-date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  placeholder="End Date"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F7931E] focus:outline-none focus:ring-1 focus:ring-[#F7931E] [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  style={{ WebkitAppearance: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => endDateInputRef.current?.showPicker?.()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label="Open calendar"
                >
                  <CalendarIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sending Time */}
          <div>
            <label htmlFor="sending-time" className="mb-2 block text-sm font-medium text-gray-700">
              Sending Time
            </label>
            <div className="relative">
              <input
                ref={sendingTimeInputRef}
                type="text"
                id="sending-time"
                value={formData.sendingTime}
                onChange={(e) => handleInputChange('sendingTime', e.target.value)}
                placeholder="10:00 AM"
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F7931E] focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
              />
              <button
                type="button"
                onClick={() => sendingTimeInputRef.current?.focus()}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label="Focus time input"
              >
                <ClockIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" />
              </button>
            </div>
          </div>

          {/* Audience Dropdowns */}
          <div className="space-y-4">
            <div>
              <label htmlFor="audience" className="mb-2 block text-sm font-medium text-gray-700">
                Audience
              </label>
              <div className="relative">
                <select
                  id="audience"
                  value={formData.audience}
                  onChange={(e) => handleInputChange('audience', e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 pr-10 text-sm text-gray-900 focus:border-[#F7931E] focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                >
                  <option value="Users / Vendors">Users / Vendors</option>
                  <option value="Users">Users</option>
                  <option value="Vendors">Vendors</option>
                  <option value="All">All</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label htmlFor="audience-sub-option" className="mb-2 block text-sm font-medium text-gray-700">
                All / Separate Users / Vendors
              </label>
              <div className="relative">
                <select
                  id="audience-sub-option"
                  value={formData.audienceSubOption}
                  onChange={(e) => handleInputChange('audienceSubOption', e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 pr-10 text-sm text-gray-900 focus:border-[#F7931E] focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                >
                  <option value="All (Separate Users / Vendors)">All (Separate Users / Vendors)</option>
                  <option value="Users Only">Users Only</option>
                  <option value="Vendors Only">Vendors Only</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Priority Dropdown */}
          <div>
            <label htmlFor="priority" className="mb-2 block text-sm font-medium text-gray-700">
              Priority
            </label>
            <div className="relative">
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 pr-10 text-sm text-gray-900 focus:border-[#F7931E] focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
              >
                <option value="High">High</option>
                <option value="High / Medium">High / Medium</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* URL Input */}
          <div>
            <label htmlFor="url" className="mb-2 block text-sm font-medium text-gray-700">
              URL
            </label>
            <div className="relative">
              <input
                type="url"
                id="url"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                placeholder="https://www.example-site123.com/deals/flash-sale"
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F7931E] focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
              />
              {formData.url ? (
                <a
                  href={formData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  aria-label="Open URL"
                  onClick={(e) => e.stopPropagation()}
                >
                  <LinkIcon className="h-5 w-5 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" />
                </a>
              ) : (
                <EditIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
              )}
            </div>
          </div>

          {/* Full Message */}
          <div>
            <label htmlFor="full-message" className="mb-2 block text-sm font-medium text-gray-700">
              Full Message
            </label>
            <textarea
              id="full-message"
              value={formData.fullMessage}
              onChange={(e) => {
                const value = e.target.value
                if (value.length <= 200) {
                  handleInputChange('fullMessage', value)
                }
              }}
              placeholder="Flash Sale Alert! Get 50% off on all electronics for the next 24 hours. Don't miss out on this incredible deal - shop now before it's too late! Use code: FLASH50."
              rows={6}
              maxLength={200}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F7931E] focus:outline-none focus:ring-1 focus:ring-[#F7931E] resize-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              Max 200 Character {formData.fullMessage.length > 0 && `(${formData.fullMessage.length}/200)`}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 whitespace-nowrap w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-[#F7931E] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#E8840D] whitespace-nowrap w-full sm:w-auto"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

