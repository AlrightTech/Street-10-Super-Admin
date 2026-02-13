import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CalendarIcon, UploadIcon, ChevronDownIcon, XIcon } from '../components/icons/Icons'
import { loginScreensApi, uploadFileToS3 } from '../services/login-screens.api'

type TargetDisplay = 'Vendor' | 'Admin' | 'Website Login' | 'Registration'

interface LoginScreenFormData {
  title: string
  backgroundUrl: string
  target: TargetDisplay
  priority: 'High' | 'Medium' | 'Low'
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  backgroundFile: File | null
}

function targetApiToDisplay(api: string): TargetDisplay {
  if (api === 'vendor') return 'Vendor'
  if (api === 'admin') return 'Admin'
  if (api === 'website_login') return 'Website Login'
  if (api === 'registration') return 'Registration'
  return 'Vendor'
}

function targetDisplayToApi(display: TargetDisplay): 'vendor' | 'admin' | 'website_login' | 'registration' {
  if (display === 'Vendor') return 'vendor'
  if (display === 'Admin') return 'admin'
  if (display === 'Website Login') return 'website_login'
  if (display === 'Registration') return 'registration'
  return 'vendor'
}

export default function AddLoginScreen() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEditMode = !!id
  const startDateInputRef = useRef<HTMLInputElement>(null)
  const endDateInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<LoginScreenFormData>({
    title: '',
    backgroundUrl: '',
    target: 'Vendor',
    priority: 'Medium',
    startDate: '',
    endDate: '',
    startTime: '10:00AM',
    endTime: '10:00AM',
    backgroundFile: null,
  })

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Custom dropdown states
  const [isTargetDropdownOpen, setIsTargetDropdownOpen] = useState(false)
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false)
  
  // Refs for click-outside detection
  const targetDropdownRef = useRef<HTMLDivElement>(null)
  const priorityDropdownRef = useRef<HTMLDivElement>(null)
  const startTimeInputRef = useRef<HTMLInputElement>(null)
  const endTimeInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchLoginScreen = async () => {
      if (isEditMode && id) {
        setIsLoadingData(true)
        setError(null)
        try {
          const loginScreen = await loginScreensApi.getById(id)
          
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
          
          setFormData({
            title: loginScreen.title,
            backgroundUrl: loginScreen.backgroundUrl,
            target: targetApiToDisplay(loginScreen.target),
            priority: loginScreen.priority === 'high' ? 'High' : loginScreen.priority === 'medium' ? 'Medium' : 'Low',
            startDate: loginScreen.startDate ? loginScreen.startDate.split('T')[0] : '',
            endDate: loginScreen.endDate ? loginScreen.endDate.split('T')[0] : '',
            startTime: loginScreen.startDate ? extractTime(loginScreen.startDate) : '10:00AM',
            endTime: loginScreen.endDate ? extractTime(loginScreen.endDate) : '10:00AM',
            backgroundFile: null,
          })
          setPreviewUrl(loginScreen.backgroundUrl)
        } catch (err: any) {
          console.error('Error fetching login screen:', err)
          setError(err.response?.data?.message || 'Failed to load login screen')
        } finally {
          setIsLoadingData(false)
        }
      }
    }

    fetchLoginScreen()
  }, [isEditMode, id])

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (targetDropdownRef.current && !targetDropdownRef.current.contains(event.target as Node)) {
        setIsTargetDropdownOpen(false)
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

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB')
      return
    }

    setFormData((prev) => ({
      ...prev,
      backgroundFile: file,
    }))

    // Create preview (Base64 for UI only)
    const { fileToDataUrl } = await import('../services/upload.api')
    const dataUrl = await fileToDataUrl(file)
    setPreviewUrl(dataUrl)
    setError(null)
  }

  const handleRemoveFile = () => {
    setFormData((prev) => ({
      ...prev,
      backgroundFile: null,
    }))
    setPreviewUrl(null)
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
      if (!formData.backgroundUrl && !formData.backgroundFile) {
        throw new Error('Background image is required')
      }
      if (!formData.startDate) {
        throw new Error('Start date is required')
      }
      if (!formData.endDate) {
        throw new Error('End date is required')
      }
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        throw new Error('End date must be after start date')
      }

      // Upload background file to S3 if new file uploaded
      let backgroundUrl = formData.backgroundUrl
      if (formData.backgroundFile) {
        try {
          backgroundUrl = await uploadFileToS3(formData.backgroundFile, 'banners')
          console.log('Uploaded background image to S3:', backgroundUrl)
        } catch (uploadErr: any) {
          console.error('Failed to upload background image:', uploadErr)
          throw new Error('Failed to upload background image. Please try again.')
        }
      }

      // Ensure we have a valid backgroundUrl
      if (!backgroundUrl || backgroundUrl.trim() === '') {
        throw new Error('Background image is required')
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
        backgroundUrl: backgroundUrl, // S3 URL (not Base64)
        target: targetDisplayToApi(formData.target),
        priority: (formData.priority === 'High' ? 'high' : formData.priority === 'Medium' ? 'medium' : 'low') as 'high' | 'medium' | 'low',
        startDate: combineDateAndTime(formData.startDate, formData.startTime).toISOString(),
        endDate: combineDateAndTime(formData.endDate, formData.endTime).toISOString(),
        // Status will be calculated automatically in the backend based on dates
      }
      
      console.log('Submitting login screen with backgroundUrl:', apiData.backgroundUrl)

      if (isEditMode && id) {
        await loginScreensApi.update(id, apiData)
        setSuccessMessage('Login screen updated successfully!')
      } else {
        await loginScreensApi.create(apiData)
        setSuccessMessage('Login screen created successfully!')
      }

      // Navigate back after a short delay to show success message
      setTimeout(() => {
        navigate('/marketing?tab=login-screens')
      }, 1500)
    } catch (err: any) {
      console.error('Error saving login screen:', err)
      setError(err.response?.data?.message || err.message || 'Failed to save login screen')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/marketing?tab=login-screens')
  }

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4 md:px-0">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Marketing</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Dashboard - Login Screens</p>
      </div>

      {/* Section Title */}
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
        {isEditMode ? 'Edit Login Screen' : 'Add New Login Screen'}
      </h2>

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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-[#F7931E] focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
            placeholder="Enter login screen title"
            required
          />
        </div>

        {/* Background Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Background Image <span className="text-red-500">*</span>
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging
                ? 'border-[#F7931E] bg-[#F7931E]/10'
                : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
            }`}
          >
            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Background preview"
                  className="max-h-64 mx-auto rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <UploadIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Drag and drop an image here, or click to select
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 px-4 py-2 bg-[#F7931E] text-white rounded-lg hover:bg-[#E67E22] transition-colors"
                >
                  Select Image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </>
            )}
          </div>
        </div>

        {/* Target Dropdown */}
        <div className="relative" ref={targetDropdownRef}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Target <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => setIsTargetDropdownOpen(!isTargetDropdownOpen)}
            className="w-full flex items-center justify-between rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-[#F7931E] focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
          >
            <span>{formData.target}</span>
            <ChevronDownIcon className={`h-5 w-5 transition-transform ${isTargetDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {isTargetDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
              {(['Vendor', 'Admin', 'Website Login', 'Registration'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, target: option }))
                    setIsTargetDropdownOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Priority Dropdown */}
        <div className="relative" ref={priorityDropdownRef}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Priority <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
            className="w-full flex items-center justify-between rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-[#F7931E] focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
          >
            <span>{formData.priority}</span>
            <ChevronDownIcon className={`h-5 w-5 transition-transform ${isPriorityDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {isPriorityDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
              {['High', 'Medium', 'Low'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, priority: option as 'High' | 'Medium' | 'Low' }))
                    setIsPriorityDropdownOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Start Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                ref={startDateInputRef}
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-[#F7931E] focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                required
              />
              <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Time <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                ref={startTimeInputRef}
                type="text"
                value={formData.startTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                placeholder="10:00AM"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-[#F7931E] focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                required
              />
            </div>
          </div>
        </div>

        {/* End Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                ref={endDateInputRef}
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-[#F7931E] focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                required
              />
              <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Time <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                ref={endTimeInputRef}
                type="text"
                value={formData.endTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                placeholder="10:00AM"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-[#F7931E] focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                required
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-[#F7931E] text-white rounded-lg text-sm font-medium hover:bg-[#E67E22] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : isEditMode ? 'Update Login Screen' : 'Create Login Screen'}
          </button>
        </div>
      </form>
    </div>
  )
}
