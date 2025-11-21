import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CalendarIcon, CameraIcon, UploadIcon, PlusIcon, EditIcon, LinkIcon } from '../components/icons/Icons'
import { type StoryHighlightFormData } from '../components/marketing/AddStoryHighlightModal'

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

  useEffect(() => {
    if (isEditMode && id) {
      // Load existing story highlight data
      // In a real app, you would fetch this from an API
      // For now, we'll use placeholder data matching the reference
      const highlightData = {
        title: 'Mercedes',
        startDate: '2005-08-12', // Format: YYYY-MM-DD for date input
        endDate: '2005-08-15',
        audience: 'User',
        type: 'Image',
        url: '',
        priority: 'High',
        mediaFiles: [],
      }
      setFormData(highlightData)
      // Set preview image for edit mode
      setPreviewImage('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1000&h=1000&fit=crop')
    }
  }, [id, isEditMode])

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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Marketing</h1>
        <p className="text-sm text-gray-600 mt-1">Dashboard - Finance</p>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-4">
          {isEditMode ? 'Edit Story Highlight' : 'Add Story Highlight'}
        </h2>
      </div>

      {/* Form Container */}
      <div className="rounded-xl bg-white shadow-sm p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700">
              Title
            </label>
            <div className="relative">
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter Title Here"
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F7931E] focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
              />
              <EditIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
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

          {/* Audience Dropdown */}
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
                <option value="">Target Audience</option>
                <option value="User">User</option>
                <option value="Vendor">Vendor</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Type Dropdown */}
          <div>
            <label htmlFor="type" className="mb-2 block text-sm font-medium text-gray-700">
              Type
            </label>
            <div className="relative">
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 pr-10 text-sm text-gray-900 focus:border-[#F7931E] focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
              >
                <option value="Image">Image</option>
                <option value="Video">Video</option>
              </select>
              <EditIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
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
                placeholder="Link to Product / Category / Vendor Page / Custom URL..."
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
                <LinkIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
              )}
            </div>
          </div>

          {/* Upload Media Section */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Upload Media</label>
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
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-4">
                      <CameraIcon className="h-8 w-8 text-[#EE8E32]" />
                      <UploadIcon className="h-8 w-8 text-[#EE8E32]" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">Replace image / Video</p>
                      <p className="mt-1 text-sm text-gray-500">(Recommended size 1080x1080px, PNG)</p>
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
                    <p className="text-sm text-gray-600">(drag & drop for image/video)</p>
                    <p className="mt-1 text-sm text-gray-500">(Recommended size 1080x1080px, PNG)</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Add Another Picture/Video Link */}
          <button
            type="button"
            onClick={handleAddAnother}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <PlusIcon className="h-4 w-4" />
            Add Another Picture/Video
          </button>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-4 sm:px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto rounded-lg bg-[#F7931E] px-4 sm:px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#E8840D]"
            >
              {isEditMode ? 'Save Changes' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ChevronDownIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

