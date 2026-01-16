import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { popupsApi, type Popup } from '../services/popups.api'
import MarketingStatusBadge, { type MarketingStatus } from '../components/marketing/MarketingStatusBadge'

// Helper function to format date from ISO string to "MMM DD, YYYY"
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Helper function to format time from ISO string to "HH:MM AM/PM"
const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12
  return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`
}

// Helper function to normalize image URL (handle relative paths)
const normalizeImageUrl = (url: string | null | undefined): string => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url
  }
  // If relative path, prepend API base URL or return as is
  return url.startsWith('/') ? `${import.meta.env.VITE_API_URL || ''}${url}` : url
}

export default function PopupDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [popup, setPopup] = useState<Popup | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPopup = async () => {
      if (!id) {
        setError('Popup ID is required')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const popupData = await popupsApi.getById(id)
        setPopup(popupData)
      } catch (err: any) {
        console.error('Error fetching popup:', err)
        setError(err.response?.data?.message || 'Failed to load popup')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPopup()
  }, [id])

  if (isLoading) {
    return (
      <div className="space-y-6 px-4 md:px-0">
        <div className="rounded-xl bg-white dark:bg-gray-800 shadow-sm p-6">
          <p className="text-gray-500 dark:text-gray-400">Loading popup details...</p>
        </div>
      </div>
    )
  }

  if (error || !popup) {
    return (
      <div className="space-y-6 px-4 md:px-0">
        <div className="rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-6">
          <p className="text-red-800 dark:text-red-300">{error || 'Popup not found'}</p>
        </div>
      </div>
    )
  }

  // Calculate status based on dates
  const now = new Date()
  const startDate = new Date(popup.startDate)
  const endDate = new Date(popup.endDate)
  let status: MarketingStatus = 'scheduled'
  if (popup.status === 'expired') {
    status = 'expired'
  } else if (now >= startDate && now <= endDate) {
    status = 'active'
  } else if (now > endDate) {
    status = 'expired'
  }

  // Format data for display
  const popupData = {
    name: popup.title,
    status: status,
    startDate: formatDate(popup.startDate),
    endDate: formatDate(popup.endDate),
    startTime: formatTime(popup.startDate),
    endTime: formatTime(popup.endDate),
    redirectType: popup.redirectType === 'product' ? 'Product' : popup.redirectType === 'category' ? 'Category' : 'External URL',
    redirectTarget: popup.redirectTarget || 'N/A',
    deviceTarget: popup.deviceTarget === 'desktop' ? 'Desktop' : popup.deviceTarget === 'mobile' ? 'Mobile' : 'Both',
    imageUrl: normalizeImageUrl(popup.imageUrl),
  }

  const handleEdit = () => {
    if (id) {
      navigate(`/marketing/edit-popup/${id}`)
    }
  }

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Marketing</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Dashboard - Pop-Up</p>
      </div>

      {/* Popup Preview Section */}
      <div className="space-y-3 md:space-y-4">
        <h2 className="text-base md:text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{popupData.name} Popup</h2>
        {/* Popup Image Preview */}
        <div className="rounded-xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden transition-colors">
          {popupData.imageUrl ? (
            <div className="relative w-full h-64 sm:h-80 md:h-96 bg-gray-100 dark:bg-gray-900">
              <img
                src={popupData.imageUrl}
                alt={popupData.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  const parent = target.parentElement
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <p class="text-gray-500 dark:text-gray-400">Image not available</p>
                      </div>
                    `
                  }
                }}
              />
            </div>
          ) : (
            <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">No image available</p>
            </div>
          )}
        </div>
      </div>

      {/* Popup Detail Section */}
      <div className="space-y-3 md:space-y-4">
        <h3 className="text-base md:text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Popup Detail</h3>
        <div className="rounded-xl bg-white dark:bg-gray-800 shadow-sm p-4 md:p-6 transition-colors">
          <div className="space-y-4 md:space-y-5">
            {/* Status */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">Status:</span>
              <MarketingStatusBadge status={popupData.status} />
            </div>

            {/* Title */}
            <div className="flex items-start gap-2">
              <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">Title:</span>
              <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100 break-words">{popup.title}</span>
            </div>

            {/* Description */}
            {popup.description && (
              <div className="flex items-start gap-2">
                <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">Description:</span>
                <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100 break-words">{popup.description}</span>
              </div>
            )}

            {/* Start Date */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">Start Date:</span>
              <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100">{popupData.startDate}</span>
            </div>

            {/* End Date */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">End Date:</span>
              <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100">{popupData.endDate}</span>
            </div>

            {/* Start Time */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">Start Time:</span>
              <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100">{popupData.startTime}</span>
            </div>

            {/* End Time */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">End Time:</span>
              <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100">{popupData.endTime}</span>
            </div>

            {/* Redirect Type */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">Redirect Type:</span>
              <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100">{popupData.redirectType}</span>
            </div>

            {/* Redirect Target */}
            <div className="flex items-start gap-2">
              <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">Redirect Target:</span>
              <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100 break-words">{popupData.redirectTarget}</span>
            </div>

            {/* CTA Text */}
            {popup.ctaText && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">Button Text:</span>
                <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100">{popup.ctaText}</span>
              </div>
            )}

            {/* Device Target */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">Device Target:</span>
              <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100">{popupData.deviceTarget}</span>
            </div>

            {/* Priority */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">Priority:</span>
              <span className={`text-xs md:text-sm font-medium ${
                popup.priority === 'high' ? 'text-red-600 dark:text-red-400' : 
                popup.priority === 'medium' ? 'text-yellow-600 dark:text-yellow-400' : 
                'text-gray-600 dark:text-gray-300'
              }`}>
                {popup.priority.charAt(0).toUpperCase() + popup.priority.slice(1)}
              </span>
            </div>

            {/* Edit Button */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleEdit}
                className="rounded-lg bg-[#F7931E] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#E8840D] cursor-pointer"
              >
                Edit Popup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
