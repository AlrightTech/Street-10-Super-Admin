import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CalendarIcon, ClockIcon, LinkIcon, UsersGroupIcon, EditIcon } from '../components/icons/Icons'
import { type Banner } from '../components/marketing/BannersTable'

// Mock data - in a real app, this would come from an API
const MOCK_BANNERS: Banner[] = [
  {
    id: '1',
    thumbnail: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=100&h=100&fit=crop',
    title: 'Explore Our New Offers',
    type: 'Image',
    startDate: '12 Aug 2025',
    endDate: '12 Aug 2025',
    audience: 'User',
    priority: 'High',
    status: 'active',
  },
  {
    id: '2',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop',
    title: 'Explore Our New Offers',
    type: 'Video',
    startDate: '12 Aug 2025',
    endDate: '12 Aug 2025',
    audience: 'Vendor',
    priority: 'High',
    status: 'active',
  },
]

export default function BannerDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [banner, setBanner] = useState<Banner | null>(null)

  useEffect(() => {
    if (id) {
      const foundBanner = MOCK_BANNERS.find((b) => b.id === id)
      if (foundBanner) {
        setBanner(foundBanner)
      } else {
        // Fallback to default data matching reference
        setBanner({
          id: id,
          thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=100&h=100&fit=crop',
          title: 'Explore Our New Offers',
          type: 'Image',
          startDate: '22 Dec 2024',
          endDate: '22 Dec 2024',
          audience: 'User',
          priority: 'High',
          status: 'active',
        })
      }
    }
  }, [id])

  if (!banner) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Loading banner details...</p>
      </div>
    )
  }

  // Format data for display - use reference format
  const bannerData = {
    name: banner.title,
    status: banner.status === 'active' ? 'Active' : banner.status === 'scheduled' ? 'Scheduled' : 'Expired',
    startDate: 'Dec 22, 2024', // Format matching reference
    endDate: 'Dec 22, 2024', // Format matching reference
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    audience: banner.audience === 'User' ? 'All Users' : banner.audience === 'Vendor' ? 'All Vendors' : 'All Users',
    url: 'https://www.example-site123.com/deals/flash-sale',
    imageUrl: banner.thumbnail.replace('w=100&h=100', 'w=1200&h=600'),
  }

  const handleEdit = () => {
    navigate(`/marketing/edit-banner/${id}`)
  }

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      {/* Page Header */}
      <div className="mb-3 md:mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Marketing</h1>
        <p className="text-sm text-gray-600 mt-1">Dashboard - Finance</p>
      </div>

      {/* Banner Preview Section */}
      <div className="space-y-3 md:space-y-4">
        <h2 className="text-base md:text-lg sm:text-xl font-bold text-gray-900">{bannerData.name} Banner</h2>
        
        {/* Banner Image Preview */}
        <div className="rounded-xl bg-white shadow-sm overflow-hidden">
          <img
            src={bannerData.imageUrl}
            alt={bannerData.name}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      {/* Banner Detail Section */}
      <div className="space-y-3 md:space-y-4">
        <h3 className="text-base md:text-lg sm:text-xl font-bold text-gray-900">Banner Detail</h3>

        <div className="rounded-xl bg-white shadow-sm p-4 md:p-6">
          <div className="space-y-3 md:space-y-4">
            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-xs md:text-sm text-gray-900">{bannerData.status}</span>
            </div>

            {/* Banner Title */}
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm text-gray-900 break-words">{bannerData.name}</span>
            </div>

            {/* Start Date */}
            <div className="flex items-center gap-2 flex-wrap">
              <CalendarIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-xs md:text-sm text-gray-900">Start Date, {bannerData.startDate}</span>
            </div>

            {/* End Date */}
            <div className="flex items-center gap-2 flex-wrap">
              <CalendarIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-xs md:text-sm text-gray-900">End Date, {bannerData.endDate}</span>
            </div>

            {/* Start Time */}
            <div className="flex items-center gap-2 flex-wrap">
              <ClockIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-xs md:text-sm text-gray-900">Start Time</span>
              <span className="text-xs md:text-sm text-gray-900">{bannerData.startTime}</span>
            </div>

            {/* End Time */}
            <div className="flex items-center gap-2 flex-wrap">
              <ClockIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-xs md:text-sm text-gray-900">End Time</span>
              <span className="text-xs md:text-sm text-gray-900">{bannerData.endTime}</span>
            </div>

            {/* Audience */}
            <div className="flex items-center gap-2 flex-wrap">
              <UsersGroupIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-xs md:text-sm text-gray-900">Audience</span>
              <span className="text-xs md:text-sm text-gray-900">{bannerData.audience}</span>
            </div>

            {/* URL */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
              <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap">
                <LinkIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-xs md:text-sm text-gray-900 whitespace-nowrap">URL</span>
                <span className="text-xs md:text-sm text-gray-900 break-all min-w-0">{bannerData.url}</span>
              </div>
              {/* Edit Button - Bottom right */}
              <button
                type="button"
                onClick={handleEdit}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D] flex-shrink-0 cursor-pointer"
              >
                <EditIcon className="h-4 w-4" />
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

