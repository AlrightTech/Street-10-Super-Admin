import { useState, useRef, useEffect } from 'react'
import Modal from '../ui/Modal'
import { CalendarIcon, CameraIcon, UploadIcon, PlusIcon } from '../icons/Icons'

export interface StoryHighlightFormData {
  title: string
  startDate: string
  endDate: string
  audience: string
  type: string
  url: string
  priority: string
  mediaFiles: File[]
}

interface AddStoryHighlightModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: StoryHighlightFormData) => void
  initialData?: Partial<StoryHighlightFormData>
  isEditMode?: boolean
}

export default function AddStoryHighlightModal({ isOpen, onClose, onSubmit, initialData, isEditMode = false }: AddStoryHighlightModalProps) {
  const startDateInputRef = useRef<HTMLInputElement>(null)
  const endDateInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState<StoryHighlightFormData>({
    title: initialData?.title || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    audience: initialData?.audience || '',
    type: initialData?.type || 'Image',
    url: initialData?.url || '',
    priority: initialData?.priority || 'High / Medium',
    mediaFiles: initialData?.mediaFiles || [],
  })

  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: initialData?.title || '',
        startDate: initialData?.startDate || '',
        endDate: initialData?.endDate || '',
        audience: initialData?.audience || '',
        type: initialData?.type || 'Image',
        url: initialData?.url || '',
        priority: initialData?.priority || 'High / Medium',
        mediaFiles: initialData?.mediaFiles || [],
      })
    }
  }, [isOpen, initialData])

  const handleInputChange = (field: keyof StoryHighlightFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files)
      setFormData((prev) => ({
        ...prev,
        mediaFiles: [...prev.mediaFiles, ...fileArray],
      }))
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
    onSubmit?.(formData)
    onClose()
  }

  const handleAddAnother = () => {
    fileInputRef.current?.click()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Edit Story Highlight" : "Add Story Highlight"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter Title Here"
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F7931E] focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
          />
        </div>

        {/* Date Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="start-date" className="mb-2 block text-sm font-medium text-gray-700">
              Date
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
              Date
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
            <ChevronDownIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* URL Input */}
        <div>
          <label htmlFor="url" className="mb-2 block text-sm font-medium text-gray-700">
            Url
          </label>
          <input
            type="url"
            id="url"
            value={formData.url}
            onChange={(e) => handleInputChange('url', e.target.value)}
            placeholder="E.g http123423.com"
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F7931E] focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
          />
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

        {/* Upload Media Section */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Upload Media</label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed ${
              isDragging ? 'border-[#F7931E] bg-[#F7931E]/5' : 'border-gray-300 bg-gray-50'
            } p-8 transition-colors hover:border-[#F7931E]`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4">
                <CameraIcon className="h-8 w-8 text-gray-400" />
                <UploadIcon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">(drag & drop for image/video)</p>
                <p className="mt-1 text-sm text-gray-500">(Recommended size 1080x1080px, PNG)</p>
              </div>
            </div>
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
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-[#F7931E] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#E8840D]"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  )
}

function ChevronDownIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

