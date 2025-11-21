import { useNavigate, useParams } from 'react-router-dom'
import { CalendarIcon, ClockIcon, LinkIcon, UsersGroupIcon, EditIcon } from '../components/icons/Icons'

export default function BannerDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Mock banner data - in a real app, fetch this based on id
  const bannerData = {
    id: id || '1',
    name: 'Explore Our New Offers',
    status: 'Active',
    startDate: 'Dec 22, 2024',
    endDate: 'Dec 22, 2024',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    audience: 'All Users',
    url: 'https://www.example-site123.com/deals/flash-sale',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=600&fit=crop',
  }

  const handleEdit = () => {
    navigate(`/marketing/edit-banner/${id}`)
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
          className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
            false
              ? 'text-[#F7931E] border-b-2 border-[#F7931E]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Story Highlight
        </button>
        <button
          type="button"
          onClick={() => navigate('/marketing')}
          className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
            true
              ? 'text-[#F7931E] border-b-2 border-[#F7931E]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Banners
        </button>
        <button
          type="button"
          onClick={() => navigate('/marketing')}
          className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
            false
              ? 'text-[#F7931E] border-b-2 border-[#F7931E]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pop-Up
        </button>
        <button
          type="button"
          onClick={() => navigate('/marketing')}
          className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
            false
              ? 'text-[#F7931E] border-b-2 border-[#F7931E]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Push Notifications
        </button>
        <button
          type="button"
          onClick={() => navigate('/marketing')}
          className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
            false
              ? 'text-[#F7931E] border-b-2 border-[#F7931E]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Product
        </button>
      </nav>

      {/* Banner Preview Section */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">{bannerData.name} Banner</h2>
        
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Banner Detail</h3>
        </div>

        <div className="rounded-xl bg-white shadow-sm p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
          {/* Status */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-sm text-gray-900">{bannerData.status}</span>
            </div>
          </div>

          {/* Banner Name */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
            <span className="text-sm font-medium text-gray-700 sm:min-w-[120px]">Banner Name:</span>
            <span className="text-sm text-gray-900 break-words">{bannerData.name}</span>
          </div>

          {/* Start Date */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
            <span className="text-sm font-medium text-gray-700 sm:min-w-[120px]">Start Date:</span>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-900">{bannerData.startDate}</span>
            </div>
          </div>

          {/* End Date */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
            <span className="text-sm font-medium text-gray-700 sm:min-w-[120px]">End Date:</span>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-900">{bannerData.endDate}</span>
            </div>
          </div>

          {/* Start Time */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
            <span className="text-sm font-medium text-gray-700 sm:min-w-[120px]">Start Time:</span>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-gray-400 flex-shrink-0 cursor-pointer hover:text-gray-600 transition-colors" />
              <span className="text-sm text-gray-900">{bannerData.startTime}</span>
            </div>
          </div>

          {/* End Time */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
            <span className="text-sm font-medium text-gray-700 sm:min-w-[120px]">End Time:</span>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-gray-400 flex-shrink-0 cursor-pointer hover:text-gray-600 transition-colors" />
              <span className="text-sm text-gray-900">{bannerData.endTime}</span>
            </div>
          </div>

          {/* Audience */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
            <span className="text-sm font-medium text-gray-700 sm:min-w-[120px]">Audience:</span>
            <div className="flex items-center gap-2">
              <UsersGroupIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-900">{bannerData.audience}</span>
            </div>
          </div>

          {/* URL */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-700 sm:min-w-[120px] flex-shrink-0">URL:</span>
              <div className="flex items-center gap-2 min-w-0">
                <a
                  href={bannerData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0"
                  aria-label="Open URL"
                >
                  <LinkIcon className="h-4 w-4 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" />
                </a>
                <a
                  href={bannerData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline break-all min-w-0"
                >
                  {bannerData.url}
                </a>
              </div>
            </div>
            {/* Edit Button - Right side of URL */}
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-3 sm:px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D] flex-shrink-0 w-full sm:w-auto"
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

