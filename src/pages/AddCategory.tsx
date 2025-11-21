import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import CategoriesFilterTabs from '../components/categories/CategoriesFilterTabs'
import { PlusIcon, UploadIcon } from '../components/icons/Icons'

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

const FILTER_OPTIONS = [
  { id: 'brand', label: 'Brand' },
  { id: 'mileage', label: 'Mileage' },
  { id: 'model-year', label: 'Model Year' },
  { id: 'gear-type', label: 'Gear Type' },
  { id: 'engine-capacity', label: 'Engine Capacity' },
  { id: 'conditions', label: 'Conditions' },
  { id: 'fuel-type', label: 'Fuel Type' },
  { id: 'color', label: 'Color' },
]

export default function AddCategory() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<string>('categories')
  const [categoryName, setCategoryName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set())
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    // Handle file drop here
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Handle file upload here
    }
  }

  const handleCancel = () => {
    navigate('/categories')
  }

  const handleAddCategory = () => {
    // Handle add category logic here
    // eslint-disable-next-line no-console
    console.log('Add category:', { categoryName, description, selectedFilters })
    navigate('/categories')
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <p className="text-xs sm:text-sm text-gray-600 mb-1">
          <span>Dashboard</span>
          <span className="mx-1">•</span>
          <span>Add Categories</span>
        </p>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Categories</h1>
      </div>

      {/* Tabs Section - Separate White Card */}
      <section className="rounded-xl bg-white shadow-sm">
        <div className="px-4 sm:px-6 py-4">
          <CategoriesFilterTabs tabs={TAB_OPTIONS} activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      </section>

      {/* Buttons Section - Below Tabs */}
      <div className="flex flex-col sm:flex-row justify-end items-center gap-3">
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E8851C] border border-[#E8851C] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white transition hover:bg-[#D77A1A] focus:outline-none focus:ring-2 focus:ring-[#E8851C] focus:ring-offset-2 whitespace-nowrap cursor-pointer"
        >
          Manage Filter
        </button>
        <button
          type="button"
          onClick={() => navigate('/categories/add-sub-category')}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F7931E] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white transition hover:bg-[#E8851C] focus:outline-none focus:ring-2 focus:ring-[#F7931E] focus:ring-offset-2 whitespace-nowrap cursor-pointer"
        >
          <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
          Add New Sub Categories
        </button>
      </div>

      {/* Add New Category Heading - Below Buttons */}
      <h2 className="text-base sm:text-lg font-semibold text-gray-900">Add New Category</h2>

      {/* Main Content Card */}
      <section className="rounded-xl bg-white shadow-sm">
        <div className="px-4 sm:px-6 py-6">
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
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F7931E] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white transition hover:bg-[#E8851C] focus:outline-none focus:ring-2 focus:ring-[#F7931E] focus:ring-offset-2 whitespace-nowrap cursor-pointer w-full sm:w-auto"
              >
                <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                Edit Filter
              </button>
            </div>

            {/* Filter Options Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {FILTER_OPTIONS.map((filter) => {
                const isSelected = selectedFilters.has(filter.id)
                return (
                  <div
                    key={filter.id}
                    onClick={() => handleFilterToggle(filter.id)}
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
                        onChange={() => handleFilterToggle(filter.id)}
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
            className="w-full sm:w-auto rounded-full border border-gray-300 bg-white px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddCategory}
            className="w-full sm:w-auto rounded-full bg-[#F7931E] px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium text-white transition hover:bg-[#E8851C] focus:outline-none focus:ring-2 focus:ring-[#F7931E] focus:ring-offset-2 cursor-pointer"
          >
            Add Category
          </button>
        </div>
      </section>
    </div>
  )
}

