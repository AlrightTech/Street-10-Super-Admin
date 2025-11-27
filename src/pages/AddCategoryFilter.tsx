import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { type Filter } from './CategoryFilters'
import SelectDropdown from '../components/ui/SelectDropdown'
import { XIcon } from '../components/icons/Icons'

// Mock filter data
const getInitialFilters = (): Filter[] => {
  const saved = localStorage.getItem('categoryFilters')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      return []
    }
  }
  return []
}

export default function AddCategoryFilter() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEditMode = !!id
  const [filterName, setFilterName] = useState('')
  const [inputType, setInputType] = useState<'number' | 'radio' | 'checkbox' | 'text'>('text')
  const [originalInputType, setOriginalInputType] = useState<'number' | 'radio' | 'checkbox' | 'text'>('text')
  const [options, setOptions] = useState<string[]>([])
  const [newOption, setNewOption] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState<'active' | 'inactive'>('active')

  // Load filter data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const filters = getInitialFilters()
      const filter = filters.find((f) => f.id === id)
      if (filter) {
        setFilterName(filter.filterName)
        setInputType(filter.inputType)
        setOriginalInputType(filter.inputType)
        setOptions(filter.options || [])
        setDescription(filter.description || '')
        setCategory(filter.category || '')
        setStatus(filter.status)
      }
    }
  }, [id, isEditMode])

  const handleAddOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      setOptions((prev) => [...prev, newOption.trim()])
      setNewOption('')
    } else if (!newOption.trim()) {
      // Add empty option if input is empty
      setOptions((prev) => [...prev, ''])
    }
  }

  const handleRemoveOption = (option: string) => {
    setOptions((prev) => prev.filter((opt) => opt !== option))
  }

  const handleSave = () => {
    if (!filterName.trim()) {
      // eslint-disable-next-line no-alert
      alert('Please enter a filter name')
      return
    }

    const filters = getInitialFilters()
    const filterData: Filter = {
      id: isEditMode && id ? id : `filter-${Date.now()}`,
      filterName: filterName.trim(),
      inputType,
      options: inputType === 'number' ? [] : options,
      description: description.trim() || undefined,
      category: category.trim() || undefined,
      status,
    }

    if (isEditMode && id) {
      const updated = filters.map((f) => (f.id === id ? filterData : f))
      localStorage.setItem('categoryFilters', JSON.stringify(updated))
    } else {
      const updated = [...filters, filterData]
      localStorage.setItem('categoryFilters', JSON.stringify(updated))
    }

    window.dispatchEvent(new Event('categoryFiltersUpdated'))
    navigate('/categories/filters')
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <p className="text-xs sm:text-sm text-gray-600 mb-1">
          <span>Dashboard</span>
          <span className="mx-1">•</span>
          <span>{isEditMode ? 'Edit' : 'Add Filter'}</span>
        </p>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Filter Details</h1>
      </div>

      {/* Main Content Card */}
      <section className="rounded-xl bg-white shadow-sm">
        <div className="px-4 sm:px-6 py-6">
          <div className="space-y-4">
            {/* Filter Name */}
            <div>
              <label htmlFor="filter-name" className="block text-sm font-medium text-gray-700 mb-2">
                Filter Name
              </label>
              <input
                id="filter-name"
                type="text"
                placeholder="Enter filter name"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
              <p className="mt-1.5 text-xs text-gray-500">
                This is the label that will appear in the vendor product form.
              </p>
            </div>

            {/* Input Type */}
            <div>
              <SelectDropdown
                id="input-type"
                label="Input Type"
                value={inputType}
                options={[
                  { value: 'text', label: 'Text' },
                  { value: 'number', label: 'Number' },
                  { value: 'radio', label: 'Radio' },
                  { value: 'checkbox', label: 'Checkbox' },
                ]}
                onChange={(value) => {
                  setInputType(value as Filter['inputType'])
                  if (value === 'number') {
                    setOptions([])
                  }
                }}
              />
              {isEditMode && inputType !== originalInputType && (
                <div className="mt-2 flex items-start gap-2 rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-2">
                  <span className="text-yellow-600 text-sm">▲</span>
                  <p className="text-xs text-yellow-800">
                    Changing input type may affect existing product data.
                  </p>
                </div>
              )}
            </div>

            {/* Options (show for radio/checkbox, or always in edit mode) */}
            {(inputType === 'radio' || inputType === 'checkbox' || isEditMode) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                  {/* Header Row */}
                  <div className="grid grid-cols-[1fr_auto] gap-4 px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <span className="text-sm font-medium text-gray-700">Option</span>
                    <span className="text-sm font-medium text-gray-700 text-right">Remove</span>
                  </div>
                  
                  {/* Options List */}
                  <div className="px-4 py-3 space-y-3">
                    {(options.length > 0 ? options : ['Yes', 'No']).map((option, index) => {
                      return (
                        <div key={index} className="grid grid-cols-[1fr_auto] gap-4 items-center">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              // If options array is empty, initialize it with mock data first
                              const currentOptions = options.length > 0 ? options : ['Yes', 'No']
                              const updated = [...currentOptions]
                              updated[index] = e.target.value
                              setOptions(updated)
                            }}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              // If options array is empty, initialize it first
                              if (options.length === 0) {
                                const filtered = ['Yes', 'No'].filter((opt) => opt !== option)
                                setOptions(filtered)
                              } else {
                                handleRemoveOption(option)
                              }
                            }}
                            className="p-2 text-red-600 hover:text-red-800 transition-colors cursor-pointer flex-shrink-0"
                            aria-label={`Remove ${option}`}
                          >
                            <XIcon className="h-5 w-5" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                  
                  {/* Add Option Button - only show for radio/checkbox */}
                  {(inputType === 'radio' || inputType === 'checkbox') && (
                    <div className="px-4 pb-4">
                      <button
                        type="button"
                        onClick={() => {
                          if (newOption.trim()) {
                            handleAddOption()
                          } else {
                            // If no new option, add empty option to edit
                            setOptions((prev) => [...prev, ''])
                          }
                        }}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 cursor-pointer"
                      >
                        <span className="text-lg">+</span>
                        Add Option
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description (Optional) */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                placeholder="Enter the car's total mileage in kilometers."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E] resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                id="category"
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
              <p className="mt-1.5 text-xs text-gray-500">
                This filter is linked to the {category || 'selected'} category.
              </p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStatus(status === 'active' ? 'inactive' : 'active')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full border border-transparent px-1 transition-colors ${
                    status === 'active' ? 'bg-blue-600' : 'bg-gray-300'
                  } cursor-pointer`}
                  aria-pressed={status === 'active'}
                  aria-label="Toggle status"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                      status === 'active' ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-gray-700">
                  {status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-gray-500">
                Inactive filters will be hidden from vendor product forms.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Action Button */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 px-4 sm:px-6 py-4">
          <button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto rounded-lg bg-[#F7931E] px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium text-white transition hover:bg-[#E8851C] focus:outline-none focus:ring-2 focus:ring-[#F7931E] focus:ring-offset-2 cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </section>
    </div>
  )
}

