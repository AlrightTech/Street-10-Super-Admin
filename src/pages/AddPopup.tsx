import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CalendarIcon, CameraIcon, UploadIcon, ChevronDownIcon, XIcon } from '../components/icons/Icons'
import { popupsApi, fileToDataUrl } from '../services/popups.api'

interface PopupFormData {
  title: string
  description: string
  imageUrl: string
  redirectType: 'Product' | 'Category' | 'External'
  redirectTarget: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  priority: 'High' | 'Medium' | 'Low'
  deviceTarget: 'Desktop' | 'Mobile' | 'Both'
  imageFile: File | null
}

export default function AddPopup() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEditMode = !!id
  const startDateInputRef = useRef<HTMLInputElement>(null)
  const endDateInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<PopupFormData>({
    title: '',
    description: '',
    imageUrl: '',
    redirectType: 'Product',
    redirectTarget: '',
    startDate: '',
    endDate: '',
    startTime: '10:00AM',
    endTime: '10:00AM',
    priority: 'Medium',
    deviceTarget: 'Both',
    imageFile: null,
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Custom dropdown states
  const [isRedirectTypeDropdownOpen, setIsRedirectTypeDropdownOpen] = useState(false)
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false)
  const [isDeviceTargetDropdownOpen, setIsDeviceTargetDropdownOpen] = useState(false)
  
  // Refs for click-outside detection
  const redirectTypeDropdownRef = useRef<HTMLDivElement>(null)
  const priorityDropdownRef = useRef<HTMLDivElement>(null)
  const deviceTargetDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchPopup = async () => {
      if (isEditMode && id) {
        setIsLoadingData(true)
        setError(null)
        try {
          const popup = await popupsApi.getById(id)
          
          // Extract time from ISO date string
          const extractTime = (dateString: string): string => {
            const date = new Date(dateString)
            let hours = date.getHours()
            const minutes = String(date.getMinutes()).padStart(2, '0')
            const ampm = hours >= 12 ? 'PM' : 'AM'
            hours = hours % 12
            hours = hours ? hours : 12
            return `${String(hours).padStart(2, '0')}:${minutes}${ampm}`
          }

          const popupData: PopupFormData = {
            title: popup.title,
            description: popup.description || '',
            imageUrl: popup.imageUrl || '',
            redirectType: (popup.redirectType === 'product' ? 'Product' : popup.redirectType === 'category' ? 'Category' : 'External') as 'Product' | 'Category' | 'External',
            redirectTarget: popup.redirectTarget || '',
            startDate: popup.startDate.split('T')[0],
            endDate: popup.endDate.split('T')[0],
            startTime: extractTime(popup.startDate),
            endTime: extractTime(popup.endDate),
            priority: (popup.priority === 'high' ? 'High' : popup.priority === 'medium' ? 'Medium' : 'Low') as 'High' | 'Medium' | 'Low',
            deviceTarget: (popup.deviceTarget === 'desktop' ? 'Desktop' : popup.deviceTarget === 'mobile' ? 'Mobile' : 'Both') as 'Desktop' | 'Mobile' | 'Both',
            imageFile: null,
          }
          setFormData(popupData)
          if (popup.imageUrl) {
            setImagePreview(popup.imageUrl)
          }
        } catch (err: any) {
          console.error('Error fetching popup:', err)
          setError(err.response?.data?.message || 'Failed to load popup')
        } finally {
          setIsLoadingData(false)
        }
      }
    }
    fetchPopup()
  }, [id, isEditMode])

  // Click outside handlers for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (redirectTypeDropdownRef.current && !redirectTypeDropdownRef.current.contains(event.target as Node)) {
        setIsRedirectTypeDropdownOpen(false)
      }
      if (priorityDropdownRef.current && !priorityDropdownRef.current.contains(event.target as Node)) {
        setIsPriorityDropdownOpen(false)
      }
      if (deviceTargetDropdownRef.current && !deviceTargetDropdownRef.current.contains(event.target as Node)) {
        setIsDeviceTargetDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (field: keyof PopupFormData, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    handleInputChange('imageFile', file)
    const dataUrl = await fileToDataUrl(file)
    setImagePreview(dataUrl)
  }

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
      if (!formData.redirectType) {
        throw new Error('Redirect type is required')
      }
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        throw new Error('End date must be after start date')
      }

      // Convert image file to data URL if new file uploaded
      let imageUrl = formData.imageUrl
      if (formData.imageFile) {
        imageUrl = await fileToDataUrl(formData.imageFile)
      }

      // Helper function to combine date and time string into a Date object
      const combineDateAndTime = (dateStr: string, timeStr: string): Date => {
        const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})(AM|PM)/i)
        if (!timeMatch) {
          return new Date(dateStr)
        }
        
        let hours = parseInt(timeMatch[1], 10)
        const minutes = parseInt(timeMatch[2], 10)
        const ampm = timeMatch[3].toUpperCase()
        
        if (ampm === 'PM' && hours !== 12) {
          hours += 12
        } else if (ampm === 'AM' && hours === 12) {
          hours = 0
        }
        
        const date = new Date(dateStr)
        date.setHours(hours, minutes, 0, 0)
        return date
      }

      // Prepare data for API
      const apiData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        imageUrl: imageUrl || undefined,
        redirectType: formData.redirectType.toLowerCase() as 'product' | 'category' | 'external',
        redirectTarget: formData.redirectTarget.trim() || undefined,
        startDate: combineDateAndTime(formData.startDate, formData.startTime).toISOString(),
        endDate: combineDateAndTime(formData.endDate, formData.endTime).toISOString(),
        priority: (formData.priority === 'High' ? 'high' : formData.priority === 'Medium' ? 'medium' : 'low') as 'high' | 'medium' | 'low',
        deviceTarget: (formData.deviceTarget === 'Desktop' ? 'desktop' : formData.deviceTarget === 'Mobile' ? 'mobile' : 'both') as 'desktop' | 'mobile' | 'both',
        // Status will be calculated automatically in the backend based on dates
      }

      if (isEditMode && id) {
        await popupsApi.update(id, apiData)
        setSuccessMessage('Popup updated successfully!')
      } else {
        await popupsApi.create(apiData)
        setSuccessMessage('Popup created successfully!')
      }

      // Navigate back after a short delay to show success message
      setTimeout(() => {
        navigate('/marketing?tab=pop-up')
      }, 1500)
    } catch (err: any) {
      console.error('Error saving popup:', err)
      setError(err.response?.data?.message || err.message || 'Failed to save popup')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/marketing?tab=pop-up')
  }

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-400">Loading popup data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
          {isEditMode ? 'Edit Popup' : 'Add New Popup'}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Dashboard - Pop-Up</p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
          <p className="text-sm text-green-800 dark:text-green-200">{successMessage}</p>
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div className="rounded-xl bg-white dark:bg-gray-800 shadow-sm p-4 md:p-6 transition-colors">
          {/* Title */}
          <div className="mb-4 md:mb-6">
            <label htmlFor="title" className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
              Title *
            </label>
            <div className="relative">
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Special Offer - 50% Off"
                className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-4 md:mb-6">
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

          {/* Image Upload */}
          <div className="mb-4 md:mb-6">
            <label className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
              Popup Image
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 transition-colors ${
                isDragging
                  ? 'border-[#F7931E] bg-[#F7931E]/5'
                  : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50'
              }`}
            >
              {imagePreview ? (
                <div className="space-y-4">
                  <div className="relative w-full max-w-md mx-auto">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-auto rounded-lg object-cover max-h-64"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null)
                        handleInputChange('imageFile', null)
                        handleInputChange('imageUrl', '')
                        if (fileInputRef.current) {
                          fileInputRef.current.value = ''
                        }
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm text-[#F7931E] hover:text-[#E8840D] transition-colors"
                    >
                      Change Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-4">
                    <CameraIcon className="h-8 w-8 text-[#F7931E]" />
                    <UploadIcon className="h-8 w-8 text-[#F7931E]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">(drag & drop for image)</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">Recommended size: 600x400px</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-3 text-sm text-[#F7931E] hover:text-[#E8840D] transition-colors"
                    >
                      Browse Files
                    </button>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Redirect Type and Target */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 md:mb-6">
            <div className="relative" ref={redirectTypeDropdownRef}>
              <label className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
                Redirect Type *
              </label>
              <button
                type="button"
                onClick={() => setIsRedirectTypeDropdownOpen(!isRedirectTypeDropdownOpen)}
                className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#F7931E] flex items-center justify-between"
              >
                <span>{formData.redirectType}</span>
                <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isRedirectTypeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isRedirectTypeDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
                  {['Product', 'Category', 'External'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        handleInputChange('redirectType', type as 'Product' | 'Category' | 'External')
                        setIsRedirectTypeDropdownOpen(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="redirectTarget" className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
                URL *
              </label>
              <input
                type="text"
                id="redirectTarget"
                value={formData.redirectTarget}
                onChange={(e) => handleInputChange('redirectTarget', e.target.value)}
                placeholder="Enter URL (e.g., https://example.com or /products/123)"
                className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                required
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 md:mb-6">
            <div>
              <label htmlFor="start-date" className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
                Start Date *
              </label>
              <div className="relative">
                <input
                  ref={startDateInputRef}
                  type="date"
                  id="start-date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                  required
                />
                <button
                  type="button"
                  onClick={() => startDateInputRef.current?.showPicker?.()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer"
                >
                  <CalendarIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="end-date" className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
                End Date *
              </label>
              <div className="relative">
                <input
                  ref={endDateInputRef}
                  type="date"
                  id="end-date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                  required
                />
                <button
                  type="button"
                  onClick={() => endDateInputRef.current?.showPicker?.()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer"
                >
                  <CalendarIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 md:mb-6">
            <div>
              <label htmlFor="start-time" className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
                Start Time
              </label>
              <input
                type="text"
                id="start-time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                placeholder="10:00AM"
                className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>
            <div>
              <label htmlFor="end-time" className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
                End Time
              </label>
              <input
                type="text"
                id="end-time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                placeholder="10:00AM"
                className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>
          </div>

          {/* Priority, Device Target, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative" ref={priorityDropdownRef}>
              <label className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
                Priority
              </label>
              <button
                type="button"
                onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
                className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#F7931E] flex items-center justify-between"
              >
                <span>{formData.priority}</span>
                <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isPriorityDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isPriorityDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
                  {['High', 'Medium', 'Low'].map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => {
                        handleInputChange('priority', priority as 'High' | 'Medium' | 'Low')
                        setIsPriorityDropdownOpen(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative" ref={deviceTargetDropdownRef}>
              <label className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
                Device Target
              </label>
              <button
                type="button"
                onClick={() => setIsDeviceTargetDropdownOpen(!isDeviceTargetDropdownOpen)}
                className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#F7931E] flex items-center justify-between"
              >
                <span>{formData.deviceTarget}</span>
                <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isDeviceTargetDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDeviceTargetDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
                  {['Desktop', 'Mobile', 'Both'].map((device) => (
                    <button
                      key={device}
                      type="button"
                      onClick={() => {
                        handleInputChange('deviceTarget', device as 'Desktop' | 'Mobile' | 'Both')
                        setIsDeviceTargetDropdownOpen(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {device}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
        </div>
      </form>
    </div>
  )
}
