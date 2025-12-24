import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CategoriesFilterTabs from '../components/categories/CategoriesFilterTabs'
import { PlusIcon, UploadIcon } from '../components/icons/Icons'
import { categoriesApi } from '../services/categories.api'
import { filtersApi, type Filter as BackendFilter } from '../services/filters.api'

const TAB_OPTIONS: { key: string; label: string }[] = [
  { key: 'categories', label: 'Categories' },
  { key: 'sub-category', label: 'Sub Category' },
  { key: 'filter', label: 'Filter' },
]

// Filter icon component
const FilterIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
)

export interface FilterOption {
  id: string
  label: string
}

export default function AddCategory() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEditMode = !!id
  const [activeTab, setActiveTab] = useState<string>('categories')
  const [categoryName, setCategoryName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set())
  const [initialAssignedFilters, setInitialAssignedFilters] = useState<Set<string>>(new Set())
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [iconDataUrl, setIconDataUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load filters from backend
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const backendFilters = await filtersApi.getAll()
        const options: FilterOption[] = backendFilters.map((f: BackendFilter) => ({
          id: f.id,
          label: f.i18n?.en?.label || f.key,
        }))
        setFilterOptions(options)
      } catch (err: any) {
        console.error('Failed to load filters:', err)
      }
    }

    void loadFilters()
  }, [])

  // Load category data in edit mode
  useEffect(() => {
    const loadCategory = async () => {
      if (isEditMode && id) {
        try {
          const category = await categoriesApi.getById(id)
          setCategoryName(category.name)
          const desc = (category.langData as any)?.en?.description || ''
          setDescription(desc)
          const icon = (category.langData as any)?.en?.iconUrl || null
          if (icon) setIconDataUrl(icon)

          const assignments = await categoriesApi.getCategoryFilters(id)
          const assignedIds = new Set<string>(assignments.map((a: any) => a.filterId))
          setSelectedFilters(new Set(assignedIds))
          setInitialAssignedFilters(new Set(assignedIds))
        } catch (err: any) {
          console.error('Failed to load category:', err)
          setError(err.response?.data?.message || 'Failed to load category')
        }
      }
    }

    void loadCategory()
  }, [id, isEditMode])

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey)
  }

  const handleFilterToggle = (filterId: string) => {
    setSelectedFilters((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(filterId)) {
        newSet.delete(filterId)
      } else {
        newSet.add(filterId)
      }
      return newSet
    })
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setIconDataUrl(reader.result)
          }
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setIconDataUrl(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCancel = () => {
    navigate('/categories')
  }

  const handleAddCategory = () => {
    if (!categoryName.trim()) {
      setError('Category name is required')
      return
    }

    const save = async () => {
      try {
        setIsSubmitting(true)
        setError(null)

        const langData = {
          en: {
            name: categoryName.trim(),
            description: description.trim() || undefined,
            iconUrl: iconDataUrl || undefined,
          },
        }

        let categoryId = id || ''

        if (isEditMode && id) {
          const updated = await categoriesApi.update(id, {
            name: categoryName.trim(),
            langData,
          })
          categoryId = updated.id
        } else {
          const created = await categoriesApi.create({
            name: categoryName.trim(),
            langData,
          } as any)
          categoryId = created.id
        }

        // Sync filters assignments
        const added = Array.from(selectedFilters).filter((fid) => !initialAssignedFilters.has(fid))
        const removed = Array.from(initialAssignedFilters).filter((fid) => !selectedFilters.has(fid))

        await Promise.all([
          ...added.map((filterId, index) =>
            categoriesApi.assignFilterToCategory(categoryId, {
              filterId,
              displayOrder: index,
              required: false,
              visibility: 'detail',
            }),
          ),
          ...removed.map((filterId) => categoriesApi.removeFilterFromCategory(categoryId, filterId)),
        ])

        navigate('/categories')
      } catch (err: any) {
        console.error('Failed to save category:', err)
        setError(err.response?.data?.message || 'Failed to save category')
      } finally {
        setIsSubmitting(false)
      }
    }

    void save()
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <p className="text-xs sm:text-sm text-gray-600 mb-1">
          <span>Dashboard</span>
          <span className="mx-1">•</span>
          <span>{isEditMode ? 'Edit Category' : 'Add Categories'}</span>
        </p>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Categories</h1>
      </div>

      {/* Tabs Section - Separate White Card */}
      <section className="rounded-xl bg-white shadow-sm">
        <div className="px-4 sm:px-6">
          <CategoriesFilterTabs tabs={TAB_OPTIONS} activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      </section>

      {/* Buttons Section - Below Tabs */}
      <div className="flex flex-col sm:flex-row justify-end items-center gap-3">
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E8851C] border border-[#E8851C] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white transition hover:bg-[#D77A1A] focus:outline-none focus:ring-2 focus:ring-[#E8851C] focus:ring-offset-2 whitespace-nowrap cursor-pointer"
        >
          Manage Filter
        </button>
        <button
          type="button"
          onClick={() => navigate('/categories/add-sub-category')}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white transition hover:bg-[#E8851C] focus:outline-none focus:ring-2 focus:ring-[#F7931E] focus:ring-offset-2 whitespace-nowrap cursor-pointer"
        >
          <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
          Add New Sub Categories
        </button>
      </div>

      {/* Add New Category Heading - Below Buttons */}
      <h2 className="text-base sm:text-lg font-semibold text-gray-900">{isEditMode ? 'Edit Category' : 'Add New Category'}</h2>

      {/* Main Content Card */}
      <section className="rounded-xl bg-white shadow-sm">
        <div className="px-4 sm:px-6 py-6">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          {/* Add New Category Section */}
          <div className="mb-6">

            <div className="space-y-4">
              {/* Category Name Input */}
              <div>
                <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  id="category-name"
                  type="text"
                  placeholder="Enter Categories Name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
                />
              </div>

              {/* Description Textarea */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Add Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E] resize-none"
                />
              </div>

              {/* Category Icon Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Icon</label>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative w-full rounded-lg border-2 border-dashed ${
                    dragActive ? 'border-[#F7931E] bg-orange-50' : 'border-orange-200 bg-orange-50/30'
                  } p-8 sm:p-12 text-center cursor-pointer transition-colors hover:border-[#F7931E] hover:bg-orange-50`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  {iconDataUrl ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden border-2 border-[#F7931E] bg-white">
                        <img
                          src={iconDataUrl}
                          alt="Category icon preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-medium text-gray-700 mb-1">
                          Icon selected ✓
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">Click to change</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-orange-100">
                        <UploadIcon className="h-6 w-6 sm:h-8 sm:w-8 text-[#E8851C]" />
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-medium text-gray-700 mb-1">
                          Upload category icon
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">Or Drag & Drop File</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Select Filters Section */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Select Filters for This Category</h2>
              <button
                type="button"
                onClick={() => navigate('/categories/edit-filter')}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white transition hover:bg-[#E8851C] focus:outline-none focus:ring-2 focus:ring-[#F7931E] focus:ring-offset-2 whitespace-nowrap cursor-pointer w-full sm:w-auto"
              >
                <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                Edit Filter
              </button>
            </div>

            {/* Filter Options Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {filterOptions.map((filter) => {
                const isSelected = selectedFilters.has(filter.id)
                return (
                  <div
                    key={filter.id}
                    onClick={(e) => {
                      // Only toggle if click is not on the checkbox
                      if ((e.target as HTMLElement).tagName !== 'INPUT') {
                        handleFilterToggle(filter.id)
                      }
                    }}
                    className={`relative rounded-lg border-2 p-3 sm:p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#F7931E] bg-orange-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col gap-2 flex-1">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 flex items-center justify-center ${
                          isSelected
                            ? 'border-[#F7931E] bg-orange-50'
                            : 'border-[#F7931E] bg-white'
                        }`}>
                          <FilterIcon className={`h-4 w-4 sm:h-5 sm:w-5 ${isSelected ? 'text-[#F7931E]' : 'text-[#F7931E]'}`} />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-700">{filter.label}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation()
                          handleFilterToggle(filter.id)
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-[#F7931E] focus:ring-[#F7931E] cursor-pointer"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 border-t border-gray-100 px-4 sm:px-6 py-4">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddCategory}
            className="w-full sm:w-auto rounded-lg bg-[#F7931E] px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium text-white transition hover:bg-[#E8851C] focus:outline-none focus:ring-2 focus:ring-[#F7931E] focus:ring-offset-2 cursor-pointer"
          >
            {isEditMode ? 'Update Category' : 'Add Category'}
          </button>
        </div>
      </section>
    </div>
  )
}

