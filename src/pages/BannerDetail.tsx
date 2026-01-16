import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CalendarIcon, ClockIcon, LinkIcon, UsersGroupIcon, EditIcon } from '../components/icons/Icons'
import { type Banner } from '../components/marketing/BannersTable'
import { bannersApi } from '../services/banners.api'

// Helper function to format date from ISO string to "DD MMM YYYY"
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

// Helper function to format time from ISO string to "HH:MM AM/PM"
const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  // Check if time component exists (not midnight UTC)
  if (date.getUTCHours() === 0 && date.getUTCMinutes() === 0 && date.getUTCSeconds() === 0) {
    // If it's midnight UTC, check local time
    const localHours = date.getHours()
    const localMinutes = date.getMinutes()
    if (localHours === 0 && localMinutes === 0) {
      return '12:00 AM' // Default to midnight
    }
    let hours = localHours
    const minutes = String(localMinutes).padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`
  }
  // Extract time from date
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
  // If it's already a full URL (http/https), return as is
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url
  }
  // If it's a relative path starting with /, try to use it as is
  if (url.startsWith('/')) {
    return url
  }
  // Otherwise, prepend / to make it a root-relative path
  return `/${url}`
}

// Helper function to convert API banner to UI banner
const convertApiBannerToUI = (apiBanner: any): Banner => {
  // Get thumbnail - prioritize thumbnailUrl, then first mediaUrl
  let thumbnail = ''
  if (apiBanner.thumbnailUrl) {
    thumbnail = normalizeImageUrl(apiBanner.thumbnailUrl)
  } else if (apiBanner.mediaUrls && Array.isArray(apiBanner.mediaUrls) && apiBanner.mediaUrls.length > 0) {
    thumbnail = normalizeImageUrl(apiBanner.mediaUrls[0])
  }
  
  return {
    id: apiBanner.id,
    thumbnail: thumbnail,
    title: apiBanner.title,
    type: apiBanner.type === 'image' ? 'Image' : 'Video',
    startDate: formatDate(apiBanner.startDate),
    endDate: formatDate(apiBanner.endDate),
    audience: apiBanner.audience === 'user' ? 'User' : 'Vendor',
    priority: apiBanner.priority === 'high' ? 'High' : apiBanner.priority === 'medium' ? 'Medium' : 'Low',
    status: apiBanner.status,
  }
}

export default function BannerDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [banner, setBanner] = useState<Banner | null>(null)
  const [apiBanner, setApiBanner] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBanner = async () => {
      if (!id) return

      setIsLoading(true)
      setError(null)

      try {
        const apiBannerData = await bannersApi.getById(id)
        setApiBanner(apiBannerData)
        const uiBanner = convertApiBannerToUI(apiBannerData)
        setBanner(uiBanner)
      } catch (err: any) {
        console.error('Error fetching banner:', err)
        setError(err.response?.data?.message || 'Failed to load banner')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBanner()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600 dark:text-gray-400">Loading banner details...</p>
      </div>
    )
  }

  if (error || !banner || !apiBanner) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-600 dark:text-red-400">{error || 'Banner not found'}</p>
      </div>
    )
  }

  // Format data for display using actual banner data
  const bannerData = {
    name: banner.title,
    status: banner.status === 'active' ? 'Active' : banner.status === 'scheduled' ? 'Scheduled' : 'Expired',
    startDate: formatDate(apiBanner.startDate),
    endDate: formatDate(apiBanner.endDate),
    startTime: formatTime(apiBanner.startDate),
    endTime: formatTime(apiBanner.endDate),
    audience: banner.audience === 'User' ? 'All Users' : banner.audience === 'Vendor' ? 'All Vendors' : 'All Users',
    url: apiBanner.url || '',
    imageUrl: normalizeImageUrl(apiBanner.thumbnailUrl) || (apiBanner.mediaUrls && apiBanner.mediaUrls.length > 0 ? normalizeImageUrl(apiBanner.mediaUrls[0]) : ''),
  }

  const handleEdit = () => {
    if (id) {
      navigate(`/marketing/edit-banner/${id}`)
    }
  }

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      {/* Page Header */}
      <div className="mb-3 md:mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Marketing</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Dashboard - Banners</p>
      </div>

      {/* Banner Preview Section */}
      <div className="space-y-3 md:space-y-4">
        <h2 className="text-base md:text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{bannerData.name} Banner</h2>
        
        {/* Banner Image Preview */}
        <div className="rounded-xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden transition-colors">
          {bannerData.imageUrl ? (
            <div className="relative w-full h-64 sm:h-80 md:h-96 bg-gray-100 dark:bg-gray-900">
              <img
                src={bannerData.imageUrl}
                alt={bannerData.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to placeholder div if image fails to load
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

      {/* Banner Detail Section */}
      <div className="space-y-3 md:space-y-4">
        <h3 className="text-base md:text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Banner Detail</h3>

        <div className="rounded-xl bg-white dark:bg-gray-800 shadow-sm p-4 md:p-6 transition-colors">
          <div className="space-y-4 md:space-y-5">
            {/* Status */}
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${
                bannerData.status === 'Active' ? 'bg-green-500' : 
                bannerData.status === 'Scheduled' ? 'bg-yellow-500' : 
                'bg-gray-500'
              }`}></span>
              <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100">{bannerData.status}</span>
            </div>

            {/* Banner Title */}
            <div className="flex items-start gap-2">
              <span className="text-sm md:text-base font-semibold text-gray-900 dark:text-gray-100 break-words">{bannerData.name}</span>
            </div>

            {/* Subtitle */}
            {apiBanner.subtitle && (
              <div className="flex items-start gap-2">
                <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">Subtitle:</span>
                <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100 break-words">{apiBanner.subtitle}</span>
              </div>
            )}

            {/* Description */}
            {apiBanner.description && (
              <div className="flex items-start gap-2">
                <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">Description:</span>
                <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100 break-words">{apiBanner.description}</span>
              </div>
            )}

            {/* Start Date */}
            <div className="flex items-center gap-2 flex-wrap">
              <CalendarIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
              <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">Start Date:</span>
              <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100">{bannerData.startDate}</span>
            </div>

            {/* End Date */}
            <div className="flex items-center gap-2 flex-wrap">
              <CalendarIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
              <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">End Date:</span>
              <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100">{bannerData.endDate}</span>
            </div>

            {/* Start Time */}
            <div className="flex items-center gap-2 flex-wrap">
              <ClockIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
              <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">Start Time:</span>
              <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100">{bannerData.startTime}</span>
            </div>

            {/* End Time */}
            <div className="flex items-center gap-2 flex-wrap">
              <ClockIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
              <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">End Time:</span>
              <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100">{bannerData.endTime}</span>
            </div>

            {/* Audience */}
            <div className="flex items-center gap-2 flex-wrap">
              <UsersGroupIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
              <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">Audience:</span>
              <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100">{bannerData.audience}</span>
            </div>

            {/* Banner Click URL */}
            {bannerData.url && (
              <div className="flex items-start gap-2 flex-wrap">
                <LinkIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300 block mb-1">Banner Click URL:</span>
                  <a 
                    href={bannerData.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs md:text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
                  >
                    {bannerData.url}
                  </a>
                </div>
              </div>
            )}

            {/* Button Text */}
            {apiBanner.buttonText && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">Button Text:</span>
                <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100">{apiBanner.buttonText}</span>
              </div>
            )}

            {/* Button Link */}
            {apiBanner.buttonLink && (
              <div className="flex items-start gap-2 flex-wrap">
                <LinkIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300 block mb-1">Button Link URL:</span>
                  <a 
                    href={apiBanner.buttonLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs md:text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
                  >
                    {apiBanner.buttonLink}
                  </a>
                </div>
              </div>
            )}

            {/* Edit Button */}
            <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D] cursor-pointer"
              >
                <EditIcon className="h-4 w-4" />
                Edit Banner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

