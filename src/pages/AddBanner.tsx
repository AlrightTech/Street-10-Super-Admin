import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CalendarIcon, CameraIcon, UploadIcon, PlusIcon, EditIcon, ClockIcon, ChevronDownIcon, XIcon } from '../components/icons/Icons'
import { type StoryHighlightFormData } from '../components/marketing/AddStoryHighlightModal'
import { bannersApi, filesToDataUrls } from '../services/banners.api'

interface BannerFormData extends StoryHighlightFormData {
  startTime: string
  endTime: string
  subtitle: string
  description: string
  buttonText: string
  buttonLink: string
}

export default function AddBanner() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEditMode = !!id
  const startDateInputRef = useRef<HTMLInputElement>(null)
  const endDateInputRef = useRef<HTMLInputElement>(null)
  const startTimeInputRef = useRef<HTMLInputElement>(null)
  const endTimeInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<BannerFormData>({
    title: '',
    subtitle: '',
    description: '',
    startDate: '',
    endDate: '',
    audience: '',
    startTime: '10:00AM',
    endTime: '10:00AM',
    type: 'Image',
    url: '',
    buttonText: '',
    buttonLink: '',
    priority: 'High',
    mediaFiles: [],
  })

  const [previewFiles, setPreviewFiles] = useState<Array<{ file: File | null; preview: string; type: 'image' | 'video' }>>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Custom dropdown states
  const [isAudienceDropdownOpen, setIsAudienceDropdownOpen] = useState(false)
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false)
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false)
  
  // Refs for click-outside detection
  const audienceDropdownRef = useRef<HTMLDivElement>(null)
  const typeDropdownRef = useRef<HTMLDivElement>(null)
  const priorityDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchBanner = async () => {
      if (isEditMode && id) {
        setIsLoadingData(true)
        setError(null)
        try {
          const banner = await bannersApi.getById(id)
          // Extract time from ISO date string
          const extractTime = (dateString: string): string => {
            const date = new Date(dateString)
            // Check if time component exists (not midnight UTC)
            if (date.getUTCHours() === 0 && date.getUTCMinutes() === 0 && date.getUTCSeconds() === 0) {
              // If it's midnight UTC, check local time
              const localHours = date.getHours()
              const localMinutes = date.getMinutes()
              if (localHours === 0 && localMinutes === 0) {
                return '12:00AM' // Default to midnight
              }
              let hours = localHours
              const minutes = String(localMinutes).padStart(2, '0')
              const ampm = hours >= 12 ? 'PM' : 'AM'
              hours = hours % 12
              hours = hours ? hours : 12
              return `${String(hours).padStart(2, '0')}:${minutes}${ampm}`
            }
            // Extract time from date
            let hours = date.getHours()
            const minutes = String(date.getMinutes()).padStart(2, '0')
            const ampm = hours >= 12 ? 'PM' : 'AM'
            hours = hours % 12
            hours = hours ? hours : 12
            return `${String(hours).padStart(2, '0')}:${minutes}${ampm}`
          }

          const bannerData = {
            title: banner.title,
            subtitle: banner.subtitle || '',
            description: banner.description || '',
            startDate: banner.startDate.split('T')[0], // Extract date part from ISO string
            endDate: banner.endDate.split('T')[0],
            audience: banner.audience === 'user' ? 'User' : 'Vendor',
            type: banner.type === 'image' ? 'Image' : 'Video',
            url: banner.url || '',
            buttonText: banner.buttonText || '',
            buttonLink: banner.buttonLink || '',
            priority: banner.priority === 'high' ? 'High' : banner.priority === 'medium' ? 'Medium' : 'Low',
            startTime: extractTime(banner.startDate),
            endTime: extractTime(banner.endDate),
            mediaFiles: [],
          }
          setFormData(bannerData)
          // Set preview files from media URLs
          if (banner.mediaUrls && banner.mediaUrls.length > 0) {
            const previews = banner.mediaUrls.map((url) => {
              const isVideo = banner.type === 'video' || url.includes('video') || url.match(/\.(mp4|webm|ogg)$/i)
              return {
                file: null as any,
                preview: url,
                type: (isVideo ? 'video' : 'image') as 'image' | 'video',
                isExisting: true,
              }
            })
            setPreviewFiles(previews as any)
          } else if (banner.thumbnailUrl) {
            setPreviewFiles([{
              file: null as any,
              preview: banner.thumbnailUrl,
              type: 'image' as const,
              isExisting: true,
            } as any])
          }
        } catch (err: any) {
          console.error('Error fetching banner:', err)
          setError(err.response?.data?.message || 'Failed to load banner')
        } finally {
          setIsLoadingData(false)
        }
      }
    }

    fetchBanner()
  }, [id, isEditMode])

  // Click-outside detection for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (audienceDropdownRef.current && !audienceDropdownRef.current.contains(event.target as Node)) {
        setIsAudienceDropdownOpen(false)
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false)
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

  const handleInputChange = (field: keyof BannerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileSelect = async (files: FileList | null) => {
    if (files && files.length > 0) {
      const fileArray = Array.from(files)
      
      // Create previews for all files
      const newPreviews = await Promise.all(
        fileArray.map((file) => {
          return new Promise<{ file: File; preview: string; type: 'image' | 'video' }>((resolve) => {
            const isVideo = file.type.startsWith('video/')
            if (isVideo) {
              // For videos, create object URL
              const videoUrl = URL.createObjectURL(file)
              resolve({
                file,
                preview: videoUrl,
                type: 'video',
              })
            } else {
              // For images, use FileReader
              const reader = new FileReader()
              reader.onloadend = () => {
                resolve({
                  file,
                  preview: reader.result as string,
                  type: 'image',
                })
              }
              reader.readAsDataURL(file)
            }
          })
        })
      )

      setPreviewFiles((prev) => [...prev, ...newPreviews])
      setFormData((prev) => ({
        ...prev,
        mediaFiles: [...prev.mediaFiles, ...fileArray],
      }))
    }
  }

  const handleRemoveFile = (index: number) => {
    const fileToRemove = previewFiles[index]
    
    // Revoke object URL if it's a video
    if (fileToRemove.type === 'video' && fileToRemove.preview.startsWith('blob:')) {
      URL.revokeObjectURL(fileToRemove.preview)
    }

    // Remove from preview files
    const newPreviewFiles = previewFiles.filter((_, i) => i !== index)
    setPreviewFiles(newPreviewFiles)

    // Remove corresponding file from mediaFiles
    const newFiles: File[] = []
    
    previewFiles.forEach((pf, i) => {
      if (i !== index && pf.file) {
        newFiles.push(pf.file)
      }
    })

    setFormData((prev) => ({
      ...prev,
      mediaFiles: newFiles,
    }))
  }

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      // Cleanup all video blob URLs when component unmounts
      previewFiles.forEach((pf) => {
        if (pf.type === 'video' && pf.preview.startsWith('blob:')) {
          URL.revokeObjectURL(pf.preview)
        }
      })
    }
  }, [previewFiles])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Title is required')
      }
      if (!formData.startDate) {
        throw new Error('Start date is required')
      }
      if (!formData.endDate) {
        throw new Error('End date is required')
      }
      if (!formData.audience) {
        throw new Error('Audience is required')
      }
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        throw new Error('End date must be after start date')
      }

      // Convert files to data URLs and combine with existing URLs
      let mediaUrls: string[] = []
      
      // Get existing media URLs from preview files that don't have a file (from edit mode)
      const existingUrls = previewFiles
        .filter((pf) => !pf.file && (pf as any).isExisting)
        .map((pf) => pf.preview)
      
      // Convert new files to data URLs
      if (formData.mediaFiles.length > 0) {
        const newUrls = await filesToDataUrls(formData.mediaFiles)
        mediaUrls = [...existingUrls, ...newUrls]
      } else {
        mediaUrls = existingUrls
      }

      // Determine type based on uploaded files if not explicitly set
      let bannerType = formData.type.toLowerCase() as 'image' | 'video'
      if (previewFiles.length > 0) {
        const hasVideo = previewFiles.some((pf) => pf.type === 'video')
        if (hasVideo) {
          bannerType = 'video'
        }
      }

      // Helper function to combine date and time string into a Date object
      const combineDateAndTime = (dateStr: string, timeStr: string): Date => {
        // Parse time string (e.g., "10:00AM" or "02:30PM")
        const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})(AM|PM)/i)
        if (!timeMatch) {
          // If time format is invalid, default to midnight
          return new Date(dateStr)
        }
        
        let hours = parseInt(timeMatch[1], 10)
        const minutes = parseInt(timeMatch[2], 10)
        const ampm = timeMatch[3].toUpperCase()
        
        // Convert to 24-hour format
        if (ampm === 'PM' && hours !== 12) {
          hours += 12
        } else if (ampm === 'AM' && hours === 12) {
          hours = 0
        }
        
        // Create date object with date and time
        const date = new Date(dateStr)
        date.setHours(hours, minutes, 0, 0)
        return date
      }

      // Prepare data for API
      const apiData = {
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim() || undefined,
        description: formData.description.trim() || undefined,
        startDate: combineDateAndTime(formData.startDate, formData.startTime).toISOString(),
        endDate: combineDateAndTime(formData.endDate, formData.endTime).toISOString(),
        audience: formData.audience.toLowerCase() as 'user' | 'vendor',
        type: bannerType,
        priority: (formData.priority === 'High' ? 'high' : formData.priority === 'Medium' ? 'medium' : 'low') as 'high' | 'medium' | 'low',
        url: formData.url.trim() || undefined,
        buttonText: formData.buttonText.trim() || undefined,
        buttonLink: formData.buttonLink.trim() || undefined,
        mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
        thumbnailUrl: mediaUrls.length > 0 ? mediaUrls[0] : undefined,
      }

      if (isEditMode && id) {
        await bannersApi.update(id, apiData)
        setSuccessMessage('Banner updated successfully!')
      } else {
        await bannersApi.create(apiData)
        setSuccessMessage('Banner created successfully!')
      }

      // Navigate back after a short delay to show success message
      setTimeout(() => {
        navigate('/marketing?tab=banners')
      }, 1500)
    } catch (err: any) {
      console.error('Error saving banner:', err)
      setError(err.response?.data?.message || err.message || 'Failed to save banner')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    // Navigate back to marketing page with banners tab active
    navigate('/marketing?tab=banners')
  }

  const handleAddAnother = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-6 px-4 md:px-0">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Marketing</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Dashboard - Banners</p>
      </div>

      {/* Section Title */}
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
        {isEditMode ? 'Edit Banner Detail' : 'Add New Banner'}
      </h2>

      {/* Loading State */}
      {isLoadingData && (
        <div className="rounded-xl bg-white dark:bg-gray-800 shadow-sm p-4 sm:p-6">
          <p className="text-gray-500 dark:text-gray-400">Loading banner...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-4">
          <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-4">
          <p className="text-green-800 dark:text-green-300 text-sm">{successMessage}</p>
        </div>
      )}

      {/* Form Container */}
      {!isLoadingData && (
        <div className="rounded-xl bg-white dark:bg-gray-800 shadow-sm p-4 sm:p-6 transition-colors">
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
              Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter Title Here"
                className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
              />
              <EditIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Subtitle */}
          <div>
            <label htmlFor="subtitle" className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
              Subtitle
            </label>
            <div className="relative">
              <input
                type="text"
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => handleInputChange('subtitle', e.target.value)}
                placeholder="e.g., Welcome to Street10 Mazad"
                className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
              />
              <EditIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter description text here..."
              rows={4}
              className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F7931E] resize-none"
            />
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start-date" className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
                Start Date
              </label>
              <div className="relative">
                <input
                  ref={startDateInputRef}
                  type="date"
                  id="start-date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#F7931E] [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  style={{ WebkitAppearance: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => startDateInputRef.current?.showPicker?.()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer"
                  aria-label="Open calendar"
                >
                  <CalendarIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="end-date" className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
                End Date
              </label>
              <div className="relative">
                <input
                  ref={endDateInputRef}
                  type="date"
                  id="end-date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#F7931E] [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  style={{ WebkitAppearance: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => endDateInputRef.current?.showPicker?.()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer"
                  aria-label="Open calendar"
                >
                  <CalendarIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Audience Dropdown */}
          <div>
            <label htmlFor="audience" className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
              Audience
            </label>
            <div className="relative" ref={audienceDropdownRef}>
              <button
                type="button"
                onClick={() => setIsAudienceDropdownOpen(!isAudienceDropdownOpen)}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-left text-sm focus:outline-none focus:ring-1 focus:ring-[#F7931E] cursor-pointer flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <span className={formData.audience ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}>
                  {formData.audience || 'Target Audience'}
                </span>
                <ChevronDownIcon
                  className={`h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform ${isAudienceDropdownOpen ? 'transform rotate-180' : ''}`}
                />
              </button>
              {isAudienceDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange('audience', '')
                      setIsAudienceDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                      !formData.audience ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    Target Audience
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange('audience', 'User')
                      setIsAudienceDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                      formData.audience === 'User' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    User
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange('audience', 'Vendor')
                      setIsAudienceDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                      formData.audience === 'Vendor' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    Vendor
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Start Time */}
          <div>
            <label htmlFor="start-time" className="mb-2 block text-sm font-normal text-gray-500">
              Start Time
            </label>
            <div className="relative">
              <input
                ref={startTimeInputRef}
                type="text"
                id="start-time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                placeholder="09:00AM"
                className="w-full rounded-lg bg-gray-100 px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
              />
              <button
                type="button"
                onClick={() => startTimeInputRef.current?.focus()}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
                aria-label="Focus time input"
              >
                <ClockIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              </button>
            </div>
          </div>

          {/* End Time */}
          <div>
            <label htmlFor="end-time" className="mb-2 block text-sm font-normal text-gray-500">
              End Time
            </label>
            <div className="relative">
              <input
                ref={endTimeInputRef}
                type="text"
                id="end-time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                placeholder="10:00AM"
                className="w-full rounded-lg bg-gray-100 px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
              />
              <button
                type="button"
                onClick={() => endTimeInputRef.current?.focus()}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
                aria-label="Focus time input"
              >
                <ClockIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              </button>
            </div>
          </div>

          {/* Type Dropdown */}
          <div>
            <label htmlFor="type" className="mb-2 block text-sm font-normal text-gray-500">
              Type
            </label>
            <div className="relative" ref={typeDropdownRef}>
              <button
                type="button"
                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-left text-sm focus:outline-none focus:ring-1 focus:ring-[#F7931E] cursor-pointer flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <span className={formData.type ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}>
                  {formData.type || 'E.g Image'}
                </span>
                <ChevronDownIcon
                  className={`h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform ${isTypeDropdownOpen ? 'transform rotate-180' : ''}`}
                />
              </button>
              {isTypeDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange('type', '')
                      setIsTypeDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                      !formData.type ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    E.g Image
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange('type', 'Image')
                      setIsTypeDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                      formData.type === 'Image' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    Image
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange('type', 'Video')
                      setIsTypeDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                      formData.type === 'Video' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    Video
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Redirect Action Input */}
          <div>
            <label htmlFor="url" className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
              Redirect Action URL (Banner Click)
            </label>
            <div className="relative">
              <input
                type="url"
                id="url"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                placeholder="Link to Product / Category / Vendor Page / Custom URL"
                className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
              />
              <EditIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Button Text and Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="buttonText" className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
                Button Text
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="buttonText"
                  value={formData.buttonText}
                  onChange={(e) => handleInputChange('buttonText', e.target.value)}
                  placeholder="e.g., Explore more"
                  className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                />
                <EditIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label htmlFor="buttonLink" className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
                Button Link URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="buttonLink"
                  value={formData.buttonLink}
                  onChange={(e) => handleInputChange('buttonLink', e.target.value)}
                  placeholder="e.g., /bidding or https://..."
                  className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                />
                <EditIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Priority Dropdown */}
          <div>
            <label htmlFor="priority" className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
              Priority
            </label>
            <div className="relative" ref={priorityDropdownRef}>
              <button
                type="button"
                onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-left text-sm focus:outline-none focus:ring-1 focus:ring-[#F7931E] cursor-pointer flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-gray-900 dark:text-gray-100">{formData.priority}</span>
                <ChevronDownIcon
                  className={`h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform ${isPriorityDropdownOpen ? 'transform rotate-180' : ''}`}
                />
              </button>
              {isPriorityDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange('priority', 'High')
                      setIsPriorityDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                      formData.priority === 'High' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
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
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                      formData.priority === 'High / Medium' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
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
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                      formData.priority === 'Medium' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
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
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                      formData.priority === 'Low' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    Low
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Upload Media Section */}
          <div>
            <label className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">Upload Media</label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed ${
                isDragging 
                  ? 'border-[#F7931E] bg-[#F7931E]/5 dark:bg-[#F7931E]/10' 
                  : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
              } p-8 transition-colors hover:border-[#F7931E] overflow-hidden`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
              />
              {previewFiles.length > 0 ? (
                <div className="w-full space-y-4">
                  {previewFiles.map((preview, index) => (
                    <div key={index} className="relative group">
                      {preview.type === 'video' ? (
                        <video
                          src={preview.preview}
                          className="w-full h-48 object-cover rounded-lg"
                          controls
                        />
                      ) : (
                        <img
                          src={preview.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveFile(index)
                        }}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Click to add more or drag & drop</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-4">
                    <CameraIcon className="h-8 w-8 text-[#EE8E32]" />
                    <UploadIcon className="h-8 w-8 text-[#EE8E32]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">(drag & drop for image/video)</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">Recommended size: 1920x650px for hero banners</p>
                  </div>
                </div>
              )}
            </div>
            {/* Add Another Picture/Video Link */}
            {previewFiles.length > 0 && (
              <button
                type="button"
                onClick={handleAddAnother}
                className="mt-2 flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 cursor-pointer transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                Add Another Picture/Video
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full sm:w-auto rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto rounded-lg bg-[#F7931E] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#E8840D] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Save')}
            </button>
          </div>
        </form>
        </div>
      )}
    </div>
  )
}


