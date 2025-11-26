import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarIcon, ClockIcon, LinkIcon, ChevronDownIcon } from '../components/icons/Icons'

interface PushNotificationFormData {
  title: string
  startDate: string
  endDate: string
  sendingTime: string
  audienceType: string // User/vendors...
  audienceScope: string // All/Separate Users/Vendors
  audienceTarget: string // All Users
  priority: string
  url: string
  message: string
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
    sendingTime: '10:00AM',
    audienceType: 'User/vendors...',
    audienceScope: 'All/Separate Users/Vendors',
    audienceTarget: 'All Users',
    priority: 'High / Medium',
    url: 'https://www.example-site123.com/deals/flash-sale',
    message: 'Flash Sale Alert! Get 50% off on all electronics for the next 24 hours. Don\'t miss out on this incredible deal - shop now before it\'s too late! Use code: FLASH50',
  })

  // Custom dropdown states
  const [isAudienceTypeDropdownOpen, setIsAudienceTypeDropdownOpen] = useState(false)
  const [isAudienceScopeDropdownOpen, setIsAudienceScopeDropdownOpen] = useState(false)
  const [isAudienceTargetDropdownOpen, setIsAudienceTargetDropdownOpen] = useState(false)
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false)
  
  // Refs for click-outside detection
  const audienceTypeDropdownRef = useRef<HTMLDivElement>(null)
  const audienceScopeDropdownRef = useRef<HTMLDivElement>(null)
  const audienceTargetDropdownRef = useRef<HTMLDivElement>(null)
  const priorityDropdownRef = useRef<HTMLDivElement>(null)

  // Click-outside detection for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (audienceTypeDropdownRef.current && !audienceTypeDropdownRef.current.contains(event.target as Node)) {
        setIsAudienceTypeDropdownOpen(false)
      }
      if (audienceScopeDropdownRef.current && !audienceScopeDropdownRef.current.contains(event.target as Node)) {
        setIsAudienceScopeDropdownOpen(false)
      }
      if (audienceTargetDropdownRef.current && !audienceTargetDropdownRef.current.contains(event.target as Node)) {
        setIsAudienceTargetDropdownOpen(false)
      }
      if (priorityDropdownRef.current && !priorityDropdownRef.current.contains(event.target as Node)) {
        setIsPriorityDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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

  const maxCharacters = 200

  return (
    <div className="space-y-6 px-4 md:px-0">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Marketing</h1>
        <p className="text-sm text-gray-600 mt-1">Dashboard - Finance</p>
      </div>

      {/* Section Title */}
      <h2 className="text-lg sm:text-xl font-bold text-gray-900">Add New Notification</h2>

      {/* Form Container */}
      <div className="rounded-xl bg-white shadow-sm p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Notification Title */}
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-normal text-gray-500">
              Notification Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter Notification Title Here"
              className="w-full rounded-lg bg-gray-100 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
            />
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start-date" className="mb-2 block text-sm font-normal text-gray-500">
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
                  className="w-full rounded-lg bg-gray-100 px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E] [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  style={{ WebkitAppearance: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => startDateInputRef.current?.showPicker?.()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label="Open calendar"
                >
                  <CalendarIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="end-date" className="mb-2 block text-sm font-normal text-gray-500">
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
                  className="w-full rounded-lg bg-gray-100 px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E] [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  style={{ WebkitAppearance: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => endDateInputRef.current?.showPicker?.()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label="Open calendar"
                >
                  <CalendarIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sending Time */}
          <div>
            <label htmlFor="sending-time" className="mb-2 block text-sm font-normal text-gray-500">
              Sending Time
            </label>
            <div className="relative">
              <input
                ref={sendingTimeInputRef}
                type="text"
                id="sending-time"
                value={formData.sendingTime}
                onChange={(e) => handleInputChange('sendingTime', e.target.value)}
                placeholder="10:00AM"
                className="w-full rounded-lg bg-gray-100 px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
              />
              <button
                type="button"
                onClick={() => sendingTimeInputRef.current?.focus()}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
                aria-label="Focus time input"
              >
                <ClockIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              </button>
            </div>
          </div>

          {/* Audience Section */}
          <div>
            <label className="mb-2 block text-sm font-normal text-gray-500">
              Audience
            </label>
            <div className="space-y-4">
              {/* Audience Type Dropdown */}
              <div className="relative" ref={audienceTypeDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsAudienceTypeDropdownOpen(!isAudienceTypeDropdownOpen)}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-100 text-left text-sm focus:outline-none focus:ring-1 focus:ring-[#F7931E] cursor-pointer flex items-center justify-between hover:bg-gray-200 transition-colors"
                >
                  <span className="text-gray-900">{formData.audienceType}</span>
                  <ChevronDownIcon
                    className={`h-5 w-5 text-gray-400 transition-transform ${isAudienceTypeDropdownOpen ? 'transform rotate-180' : ''}`}
                  />
                </button>
                {isAudienceTypeDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                    <button
                      type="button"
                      onClick={() => {
                        handleInputChange('audienceType', 'User/vendors...')
                        setIsAudienceTypeDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                        formData.audienceType === 'User/vendors...' ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      User/vendors...
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleInputChange('audienceType', 'Users')
                        setIsAudienceTypeDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                        formData.audienceType === 'Users' ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      Users
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleInputChange('audienceType', 'Vendors')
                        setIsAudienceTypeDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                        formData.audienceType === 'Vendors' ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      Vendors
                    </button>
                  </div>
                )}
              </div>

              {/* Audience Scope Dropdown */}
              <div className="relative" ref={audienceScopeDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsAudienceScopeDropdownOpen(!isAudienceScopeDropdownOpen)}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-100 text-left text-sm focus:outline-none focus:ring-1 focus:ring-[#F7931E] cursor-pointer flex items-center justify-between hover:bg-gray-200 transition-colors"
                >
                  <span className="text-gray-900">{formData.audienceScope}</span>
                  <ChevronDownIcon
                    className={`h-5 w-5 text-gray-400 transition-transform ${isAudienceScopeDropdownOpen ? 'transform rotate-180' : ''}`}
                  />
                </button>
                {isAudienceScopeDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                    <button
                      type="button"
                      onClick={() => {
                        handleInputChange('audienceScope', 'All/Separate Users/Vendors')
                        setIsAudienceScopeDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                        formData.audienceScope === 'All/Separate Users/Vendors' ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      All/Separate Users/Vendors
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleInputChange('audienceScope', 'All')
                        setIsAudienceScopeDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                        formData.audienceScope === 'All' ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleInputChange('audienceScope', 'Separate Users')
                        setIsAudienceScopeDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                        formData.audienceScope === 'Separate Users' ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      Separate Users
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleInputChange('audienceScope', 'Separate Vendors')
                        setIsAudienceScopeDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                        formData.audienceScope === 'Separate Vendors' ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      Separate Vendors
                    </button>
                  </div>
                )}
              </div>

              {/* Audience Target Dropdown */}
              <div className="relative" ref={audienceTargetDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsAudienceTargetDropdownOpen(!isAudienceTargetDropdownOpen)}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-100 text-left text-sm focus:outline-none focus:ring-1 focus:ring-[#F7931E] cursor-pointer flex items-center justify-between hover:bg-gray-200 transition-colors"
                >
                  <span className="text-gray-900">{formData.audienceTarget}</span>
                  <ChevronDownIcon
                    className={`h-5 w-5 text-gray-400 transition-transform ${isAudienceTargetDropdownOpen ? 'transform rotate-180' : ''}`}
                  />
                </button>
                {isAudienceTargetDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                    <button
                      type="button"
                      onClick={() => {
                        handleInputChange('audienceTarget', 'All Users')
                        setIsAudienceTargetDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                        formData.audienceTarget === 'All Users' ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      All Users
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleInputChange('audienceTarget', 'Selected Users')
                        setIsAudienceTargetDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                        formData.audienceTarget === 'Selected Users' ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      Selected Users
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleInputChange('audienceTarget', 'All Vendors')
                        setIsAudienceTargetDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                        formData.audienceTarget === 'All Vendors' ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      All Vendors
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleInputChange('audienceTarget', 'Selected Vendors')
                        setIsAudienceTargetDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                        formData.audienceTarget === 'Selected Vendors' ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      Selected Vendors
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Priority Dropdown */}
          <div>
            <label htmlFor="priority" className="mb-2 block text-sm font-normal text-gray-500">
              Priority
            </label>
            <div className="relative" ref={priorityDropdownRef}>
              <button
                type="button"
                onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-100 text-left text-sm focus:outline-none focus:ring-1 focus:ring-[#F7931E] cursor-pointer flex items-center justify-between hover:bg-gray-200 transition-colors"
              >
                <span className="text-gray-900">{formData.priority}</span>
                <ChevronDownIcon
                  className={`h-5 w-5 text-gray-400 transition-transform ${isPriorityDropdownOpen ? 'transform rotate-180' : ''}`}
                />
              </button>
              {isPriorityDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange('priority', 'High')
                      setIsPriorityDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                        formData.priority === 'High' ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                      }`}
                  >
                    High
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange('priority', 'High / Medium')
                      setIsPriorityDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                        formData.priority === 'High / Medium' ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                      }`}
                  >
                    High / Medium
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange('priority', 'Medium')
                      setIsPriorityDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                        formData.priority === 'Medium' ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                      }`}
                  >
                    Medium
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange('priority', 'Low')
                      setIsPriorityDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                        formData.priority === 'Low' ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                      }`}
                  >
                    Low
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* URL Input */}
          <div>
            <label htmlFor="url" className="mb-2 block text-sm font-normal text-gray-500">
              URL
            </label>
            <div className="relative">
              <input
                type="url"
                id="url"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                placeholder="https://www.example-site123.com/deals/flash-sale"
                className="w-full rounded-lg bg-gray-100 px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
              />
              <LinkIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Push Message */}
          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-normal text-gray-500">
              Push Message
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => {
                const value = e.target.value
                if (value.length <= maxCharacters) {
                  handleInputChange('message', value)
                }
              }}
              rows={4}
              className="w-full rounded-lg bg-gray-100 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E] resize-none"
              placeholder="Enter your push notification message here..."
            />
            <p className="mt-1 text-xs text-gray-500">Max {maxCharacters} character</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto rounded-lg bg-[#F7931E] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#E8840D] cursor-pointer"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
