import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CalendarIcon, CameraIcon, UploadIcon, ChevronDownIcon, EditIcon, LinkIcon, XIcon } from '../components/icons/Icons'
import { type StoryHighlightFormData } from '../components/marketing/AddStoryHighlightModal'
import { storyHighlightsApi, filesToDataUrls } from '../services/story-highlights.api'

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

  const [previewFiles, setPreviewFiles] = useState<Array<{ file: File; preview: string; type: 'image' | 'video' }>>([])
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
    const fetchHighlight = async () => {
      if (isEditMode && id) {
        setIsLoadingData(true)
        setError(null)
        try {
          const highlight = await storyHighlightsApi.getById(id)
          const highlightData = {
            title: highlight.title,
            startDate: highlight.startDate.split('T')[0], // Extract date part from ISO string
            endDate: highlight.endDate.split('T')[0],
            audience: highlight.audience === 'user' ? 'User' : 'Vendor',
            type: highlight.type === 'image' ? 'Image' : 'Video',
            url: highlight.url || '',
            priority: highlight.priority === 'high' ? 'High' : highlight.priority === 'medium' ? 'Medium' : 'Low',
            mediaFiles: [],
          }
          setFormData(highlightData)
          // Set preview files from media URLs (for display only, not actual File objects)
          if (highlight.mediaUrls && highlight.mediaUrls.length > 0) {
            const previews = highlight.mediaUrls.map((url) => {
              const isVideo = highlight.type === 'video' || url.includes('video') || url.match(/\.(mp4|webm|ogg)$/i)
              return {
                file: null as any, // We don't have the actual File object in edit mode
                preview: url,
                type: (isVideo ? 'video' : 'image') as 'image' | 'video',
                isExisting: true, // Flag to indicate this is from existing data
              }
            })
            setPreviewFiles(previews as any)
          } else if (highlight.thumbnailUrl) {
            setPreviewFiles([{
              file: null as any,
              preview: highlight.thumbnailUrl,
              type: 'image' as const,
              isExisting: true,
            } as any])
          }
        } catch (err: any) {
          console.error('Error fetching story highlight:', err)
          setError(err.response?.data?.message || 'Failed to load story highlight')
        } finally {
          setIsLoadingData(false)
        }
      }
    }

    fetchHighlight()
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
    // We need to track which files are new vs existing
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
      let highlightType = formData.type.toLowerCase() as 'image' | 'video'
      if (previewFiles.length > 0) {
        const hasVideo = previewFiles.some((pf) => pf.type === 'video')
        if (hasVideo) {
          highlightType = 'video'
        }
      }

      // Prepare data for API
      const apiData = {
        title: formData.title.trim(),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        audience: formData.audience.toLowerCase() as 'user' | 'vendor',
        type: highlightType,
        priority: (formData.priority === 'High' ? 'high' : formData.priority === 'Medium' ? 'medium' : 'low') as 'high' | 'medium' | 'low',
        url: formData.url.trim() || undefined,
        mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
        thumbnailUrl: mediaUrls.length > 0 ? mediaUrls[0] : undefined,
      }

      if (isEditMode && id) {
        await storyHighlightsApi.update(id, apiData)
        setSuccessMessage('Story highlight updated successfully!')
      } else {
        await storyHighlightsApi.create(apiData)
        setSuccessMessage('Story highlight created successfully!')
      }

      // Navigate back after a short delay to show success message
      setTimeout(() => {
        navigate('/marketing')
      }, 1500)
    } catch (err: any) {
      console.error('Error saving story highlight:', err)
      setError(err.response?.data?.message || err.message || 'Failed to save story highlight')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/marketing')
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

      {/* Loading State */}
      {isLoadingData && (
        <div className="rounded-xl bg-white shadow-sm p-4 sm:p-6">
          <p className="text-gray-500">Loading story highlight...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="rounded-xl bg-green-50 border border-green-200 p-4">
          <p className="text-green-800 text-sm">{successMessage}</p>
        </div>
      )}

      {/* Form Container */}
      {!isLoadingData && (
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
            <label className="mb-2 block text-sm font-normal text-gray-500">Upload Media (Images or Videos)</label>
            
            {/* Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed ${
                isDragging ? 'border-[#F7931E] bg-[#F7931E]/5' : 'border-gray-300 bg-gray-50'
              } p-6 transition-colors hover:border-[#F7931E]`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-4">
                  <CameraIcon className="h-8 w-8 text-[#EE8E32]" />
                  <UploadIcon className="h-8 w-8 text-[#EE8E32]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700">Click or drag & drop to upload</p>
                  <p className="mt-1 text-xs text-gray-500">Supports multiple images and videos</p>
                  <p className="mt-1 text-xs text-gray-500">Recommended: 1080x1080px for images</p>
                </div>
              </div>
            </div>

            {/* Preview Grid */}
            {previewFiles.length > 0 && (
              <div className="mt-4">
                <p className="mb-3 text-sm font-medium text-gray-700">
                  Uploaded Media ({previewFiles.length})
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {previewFiles.map((previewFile, index) => (
                    <div key={index} className="relative group">
                      <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100">
                        {previewFile.type === 'video' ? (
                          <video
                            src={previewFile.preview}
                            className="w-full h-full object-cover"
                            controls={false}
                            muted
                          />
                        ) : (
                          <img
                            src={previewFile.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveFile(index)
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          title="Remove"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                        {/* Type Badge */}
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          {previewFile.type === 'video' ? 'Video' : 'Image'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              disabled={isLoading}
              className="w-full sm:w-auto rounded-lg bg-[#F7931E] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#E8840D] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Save'}
            </button>
          </div>
        </form>
        </div>
      )}
    </div>
  )
}


