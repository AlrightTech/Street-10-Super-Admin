import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CalendarIcon, CameraIcon, UploadIcon, PlusIcon, ChevronDownIcon, EditIcon, LinkIcon } from '../components/icons/Icons'
import { type StoryHighlightFormData } from '../components/marketing/AddStoryHighlightModal'
import { type StoryHighlight } from '../components/marketing/StoryHighlightTable'

// Mock data - in a real app, this would come from an API
const MOCK_HIGHLIGHTS: StoryHighlight[] = [
  {
    id: '1',
    thumbnail: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=100&h=100&fit=crop',
    title: 'BMW',
    type: 'Story',
    startDate: '12 Aug 2025',
    endDate: '12 Aug 2025',
    audience: 'User',
    priority: 'High',
    status: 'active',
  },
  {
    id: '2',
    thumbnail: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=100&h=100&fit=crop',
    title: 'Mercedes',
    type: 'Story',
    startDate: '12 Aug 2025',
    endDate: '15 Aug 2025',
    audience: 'User',
    priority: 'High',
    status: 'active',
  },
  {
    id: '3',
    thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=100&h=100&fit=crop',
    title: 'Panches',
    type: 'Story',
    startDate: '12 Aug 2025',
    endDate: '12 Aug 2025',
    audience: 'User',
    priority: 'Medium',
    status: 'active',
  },
]

// Helper function to convert date from "12 Aug 2025" to "2025-08-12"
const parseDateString = (dateStr: string): string => {
  const months: { [key: string]: string } = {
    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
    'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
    'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
  }
  const parts = dateStr.split(' ')
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0')
    const month = months[parts[1]] || '01'
    const year = parts[2]
    return `${year}-${month}-${day}`
  }
  return ''
}

export default function AddStoryHighlight() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEditMode = !!id
  const startDateInputRef = useRef<HTMLInputElement>(null)
  const endDateInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<StoryHighlightFormData>({
    title: '',
    startDate: '',
    endDate: '',
    audience: '',
    type: 'Image',
    url: '',
    priority: 'High / Medium',
    mediaFiles: [],
  })

  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Custom dropdown states
  const [isAudienceDropdownOpen, setIsAudienceDropdownOpen] = useState(false)
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false)
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false)
  
  // Refs for click-outside detection
  const audienceDropdownRef = useRef<HTMLDivElement>(null)
  const typeDropdownRef = useRef<HTMLDivElement>(null)
  const priorityDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isEditMode && id) {
      // Load existing story highlight data from mock data
      // In a real app, you would fetch this from an API
      const highlight = MOCK_HIGHLIGHTS.find((h) => h.id === id)
      if (highlight) {
        const highlightData = {
          title: highlight.title,
          startDate: parseDateString(highlight.startDate),
          endDate: parseDateString(highlight.endDate),
          audience: highlight.audience,
          type: highlight.type === 'Story' ? 'Image' : highlight.type, // Map Story to Image for form
          url: '',
          priority: highlight.priority === 'High' ? 'High' : highlight.priority === 'Medium' ? 'Medium' : 'Low',
          mediaFiles: [],
        }
        setFormData(highlightData)
        // Set preview image from thumbnail
        setPreviewImage(highlight.thumbnail.replace('w=100&h=100', 'w=1000&h=1000'))
      } else {
        // Fallback to default data if not found
        const highlightData = {
          title: 'Mercedes',
          startDate: '2025-08-12',
          endDate: '2025-08-15',
          audience: 'User',
          type: 'Image',
          url: '',
          priority: 'High',
          mediaFiles: [],
        }
        setFormData(highlightData)
        setPreviewImage('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1000&h=1000&fit=crop')
      }
    }
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

  const handleInputChange = (field: keyof StoryHighlightFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0]
      const fileArray = Array.from(files)
      setFormData((prev) => ({
        ...prev,
        mediaFiles: [...prev.mediaFiles, ...fileArray],
      }))
      // Create preview for image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewImage(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
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

  const handleAddAnother = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-6 px-4 md:px-0">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Marketing</h1>
        <p className="text-sm text-gray-600 mt-1">Dashboard - Finance</p>
      </div>

      {/* Section Title */}
      <h2 className="text-lg sm:text-xl font-bold text-gray-900">
        {isEditMode ? 'Edit Story Highlight' : 'Add Story Highlight'}
      </h2>

      {/* Form Container */}
      <div className="rounded-xl bg-white shadow-sm p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-normal text-gray-500">
              Title
            </label>
            <div className="relative">
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter Title Here"
                className="w-full rounded-lg bg-gray-100 px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
              />
              <EditIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
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
                  className="w-full rounded-lg bg-gray-100 px-4 py-2.5 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#F7931E] [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
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
                  className="w-full rounded-lg bg-gray-100 px-4 py-2.5 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#F7931E] [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
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

          {/* Audience Dropdown */}
          <div>
            <label htmlFor="audience" className="mb-2 block text-sm font-normal text-gray-500">
              Audience
            </label>
            <div className="relative" ref={audienceDropdownRef}>
              <button
                type="button"
                onClick={() => setIsAudienceDropdownOpen(!isAudienceDropdownOpen)}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-100 text-left text-sm focus:outline-none focus:ring-1 focus:ring-[#F7931E] cursor-pointer flex items-center justify-between hover:bg-gray-200 transition-colors"
              >
                <span className={formData.audience ? 'text-gray-900' : 'text-gray-400'}>
                  {formData.audience || 'Target Audience'}
                </span>
                <ChevronDownIcon
                  className={`h-5 w-5 text-gray-400 transition-transform ${isAudienceDropdownOpen ? 'transform rotate-180' : ''}`}
                />
              </button>
              {isAudienceDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange('audience', '')
                      setIsAudienceDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                      !formData.audience ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
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
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                      formData.audience === 'User' ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
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
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                      formData.audience === 'Vendor' ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                    }`}
                  >
                    Vendor
                  </button>
                </div>
              )}
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
                className="w-full px-4 py-2.5 rounded-lg bg-gray-100 text-left text-sm focus:outline-none focus:ring-1 focus:ring-[#F7931E] cursor-pointer flex items-center justify-between hover:bg-gray-200 transition-colors"
              >
                <span className="text-gray-900">{formData.type}</span>
                <div className="flex items-center gap-2">
                  <EditIcon className="h-5 w-5 text-gray-400" />
                  <ChevronDownIcon
                    className={`h-5 w-5 text-gray-400 transition-transform ${isTypeDropdownOpen ? 'transform rotate-180' : ''}`}
                  />
                </div>
              </button>
              {isTypeDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange('type', 'Image')
                      setIsTypeDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                      formData.type === 'Image' ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
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
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                      formData.type === 'Video' ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                    }`}
                  >
                    Video
                  </button>
                </div>
              )}
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
              Url
            </label>
            <div className="relative">
              <input
                type="url"
                id="url"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                placeholder="link to Product / Category / Vendor Page / Custom URL."
                className="w-full rounded-lg bg-gray-100 px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
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
                <LinkIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
              )}
            </div>
          </div>

          {/* Upload Media Section */}
          <div>
            <label className="mb-2 block text-sm font-normal text-gray-500">Upload Media</label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed ${
                isDragging ? 'border-[#F7931E] bg-[#F7931E]/5' : 'border-gray-300 bg-gray-50'
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
              {previewImage ? (
                <>
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="relative z-10 flex flex-col items-center gap-4 pointer-events-none">
                    <div className="flex items-center gap-4">
                      <CameraIcon className="h-8 w-8 text-[#EE8E32]" />
                      <UploadIcon className="h-8 w-8 text-[#EE8E32]" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">Replace image/ Video</p>
                      <p className="mt-1 text-xs text-gray-500">Recommended size: 1080x1080px, PNG</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-4">
                    <CameraIcon className="h-8 w-8 text-[#EE8E32]" />
                    <UploadIcon className="h-8 w-8 text-[#EE8E32]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">(drag & drop for image/video). (Recommended size 1080x1080px, PNG)</p>
                  </div>
                </div>
              )}
            </div>
            {/* Add Another Picture/Video Link */}
            <button
              type="button"
              onClick={handleAddAnother}
              className="mt-2 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              Add Another Picture/Video
            </button>
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
              {isEditMode ? 'Save Changes' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


