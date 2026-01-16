import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SelectDropdown from '../components/ui/SelectDropdown'
import { XIcon } from '../components/icons/Icons'
import { filtersApi, type Filter as BackendFilter } from '../services/filters.api'
import { categoriesApi, type Category } from '../services/categories.api'

export default function AddCategoryFilter() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEditMode = !!id
  const [filterName, setFilterName] = useState('')
  const [inputType, setInputType] = useState<'number' | 'radio' | 'checkbox' | 'text'>('text')
  const [originalInputType, setOriginalInputType] = useState<'number' | 'radio' | 'checkbox' | 'text'>('text')
  const [options, setOptions] = useState<string[]>([])
  const [newOption, setNewOption] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([])
  const [_categories, setCategories] = useState<Category[]>([])
  const [_subCategories, setSubCategories] = useState<Category[]>([])
  const [_iconFile, setIconFile] = useState<File | null>(null)
  const [iconPreview, setIconPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load categories and subcategories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        // Load top-level categories
        const { data: topCategories } = await categoriesApi.getAll({
          page: 1,
          limit: 1000,
          parentId: 'null',
        })
        setCategories(topCategories)

        // Load all categories to get subcategories
        const { data: allCategories } = await categoriesApi.getAll({
          page: 1,
          limit: 1000,
        })
        const subCats = allCategories.filter((cat) => cat.parentId !== null)
        setSubCategories(subCats)
      } catch (err: any) {
        console.error('Failed to load categories:', err)
      }
    }

    void loadCategories()
  }, [])

  // Load filter data in edit mode and fetch assigned categories/subcategories
  useEffect(() => {
    const load = async () => {
      if (isEditMode && id) {
        try {
          setIsLoadingData(true)
          setError(null)
          const filter = await filtersApi.getById(id)
          const label = filter.i18n?.en?.label || filter.key
          setFilterName(label)
          const mappedType: 'number' | 'radio' | 'checkbox' | 'text' =
            filter.type === 'number'
              ? 'number'
              : filter.type === 'multi-select'
              ? 'checkbox'
              : filter.type === 'boolean' || filter.type === 'select'
              ? 'radio'
              : 'text'
          setInputType(mappedType)
          setOriginalInputType(mappedType)
          setOptions(Array.isArray(filter.options) ? filter.options : [])
          if (filter.iconUrl) {
            setIconPreview(filter.iconUrl)
          }
          
          // Load all categories and check which ones have this filter assigned
          const { data: allCategories } = await categoriesApi.getAll({
            page: 1,
            limit: 1000,
          })
          
          const assignedCategoryIds: string[] = []
          const assignedSubCategoryIds: string[] = []
          
          // Check each category to see if it has this filter
          for (const category of allCategories) {
            try {
              const categoryFilters = await categoriesApi.getCategoryFilters(category.id)
              const hasFilter = categoryFilters.some((cf: any) => cf.filterId === id)
              
              if (hasFilter) {
                if (category.parentId === null) {
                  assignedCategoryIds.push(category.id)
                } else {
                  assignedSubCategoryIds.push(category.id)
                }
              }
            } catch (err) {
              // Skip if we can't fetch filters for this category
              console.warn(`Failed to fetch filters for category ${category.id}:`, err)
            }
          }
          
          setSelectedCategories(assignedCategoryIds)
          setSelectedSubCategories(assignedSubCategoryIds)
        } catch (err: any) {
          console.error('Failed to load filter:', err)
          setError(err.response?.data?.message || 'Failed to load filter')
        } finally {
          setIsLoadingData(false)
        }
      }
    }

    load()
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

    const save = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const payload: Partial<BackendFilter> = {
          key: filterName.trim().toLowerCase().replace(/\s+/g, '_'),
          type:
            inputType === 'number'
              ? 'number'
              : inputType === 'checkbox'
              ? 'multi-select'
              : inputType === 'radio'
              ? 'select'
              : 'text',
          options: inputType === 'number' ? [] : options,
          i18n: {
            en: {
              label: filterName.trim(),
            },
          },
          iconUrl: iconPreview || undefined,
          isIndexed: inputType === 'number',
        }

        let filterId = id || ''
        
        if (isEditMode && id) {
          const updated = await filtersApi.update(id, payload)
          filterId = updated.id
          
          // Get all categories that currently have this filter
          const { data: allCategories } = await categoriesApi.getAll({
            page: 1,
            limit: 1000,
          })
          
          const currentlyAssignedCategoryIds: string[] = []
          for (const category of allCategories) {
            try {
              const categoryFilters = await categoriesApi.getCategoryFilters(category.id)
              const hasFilter = categoryFilters.some((cf: any) => cf.filterId === id)
              if (hasFilter) {
                currentlyAssignedCategoryIds.push(category.id)
              }
            } catch (err) {
              // Skip
            }
          }
          
          // Remove filter from categories that are no longer selected
          const toRemove = currentlyAssignedCategoryIds.filter(
            (catId) => !selectedCategories.includes(catId) && !selectedSubCategories.includes(catId)
          )
          await Promise.all(
            toRemove.map((catId) =>
              categoriesApi.removeFilterFromCategory(catId, filterId).catch((err) => {
                console.error(`Failed to remove filter from category ${catId}:`, err)
              })
            )
          )
          
          // Add filter to newly selected categories
          const toAddCategories = selectedCategories.filter((catId) => !currentlyAssignedCategoryIds.includes(catId))
          const toAddSubCategories = selectedSubCategories.filter((catId) => !currentlyAssignedCategoryIds.includes(catId))
          
          await Promise.all([
            ...toAddCategories.map((categoryId, index) =>
              categoriesApi.assignFilterToCategory(categoryId, {
                filterId,
                displayOrder: index,
                required: false,
                visibility: 'detail',
              }).catch((err) => {
                console.error(`Failed to assign filter to category ${categoryId}:`, err)
              })
            ),
            ...toAddSubCategories.map((subCategoryId, index) =>
              categoriesApi.assignFilterToCategory(subCategoryId, {
                filterId,
                displayOrder: index,
                required: false,
                visibility: 'detail',
              }).catch((err) => {
                console.error(`Failed to assign filter to subcategory ${subCategoryId}:`, err)
              })
            ),
          ])
        } else {
          const created = await filtersApi.create(payload as any)
          filterId = created.id

          // Assign filter to selected categories
          if (selectedCategories.length > 0) {
            await Promise.all(
              selectedCategories.map((categoryId, index) =>
                categoriesApi.assignFilterToCategory(categoryId, {
                  filterId,
                  displayOrder: index,
                  required: false,
                  visibility: 'detail',
                }).catch((err) => {
                  console.error(`Failed to assign filter to category ${categoryId}:`, err)
                })
              )
            )
          }

          // Assign filter to selected subcategories
          if (selectedSubCategories.length > 0) {
            await Promise.all(
              selectedSubCategories.map((subCategoryId, index) =>
                categoriesApi.assignFilterToCategory(subCategoryId, {
                  filterId,
                  displayOrder: index,
                  required: false,
                  visibility: 'detail',
                }).catch((err) => {
                  console.error(`Failed to assign filter to subcategory ${subCategoryId}:`, err)
                })
              )
            )
          }
        }

        navigate('/categories/filters')
      } catch (err: any) {
        console.error('Failed to save filter:', err)
        setError(err.response?.data?.message || 'Failed to save filter')
      } finally {
        setIsLoading(false)
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
          <span>{isEditMode ? 'Edit' : 'Add Filter'}</span>
        </p>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Filter Details</h1>
      </div>

      {/* Main Content Card */}
      <section className="rounded-xl bg-white shadow-sm">
        <div className="px-4 sm:px-6 py-6">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          {isLoadingData && (
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#F7931E]"></div>
              <span>Loading filter data...</span>
            </div>
          )}
          <div className={`space-y-4 ${isLoadingData ? 'opacity-50 pointer-events-none' : ''}`}>
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
                  setInputType(value as 'number' | 'radio' | 'checkbox' | 'text')
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

            {/* Icon Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Icon (Optional)
              </label>
              <div className="space-y-3">
                {iconPreview && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <img
                      src={iconPreview}
                      alt="Filter icon"
                      className="w-10 h-10 object-contain"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">Current icon</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIconFile(null)
                        setIconPreview(null)
                      }}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setIconFile(file)
                        const reader = new FileReader()
                        reader.onload = (e) => {
                          setIconPreview(e.target?.result as string)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="hidden"
                    id="icon-upload"
                  />
                  <label
                    htmlFor="icon-upload"
                    className="cursor-pointer text-sm text-[#F7931E] hover:text-[#E8840D]"
                  >
                    {iconPreview ? 'Change Icon' : '+ Upload Icon'}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG up to 2MB</p>
                </div>
              </div>
            </div>

            {/* Options (always show, but only editable for radio/checkbox) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options {inputType !== 'radio' && inputType !== 'checkbox' && '(Optional)'}
              </label>
                <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                  {/* Header Row */}
                  <div className="grid grid-cols-[1fr_auto] gap-4 px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <span className="text-sm font-medium text-gray-700">Option</span>
                    <span className="text-sm font-medium text-gray-700 text-right">Remove</span>
                  </div>
                  
                  {/* Options List */}
                  <div className="px-4 py-3 space-y-3">
                    {options.length > 0 ? (
                      options.map((option, index) => (
                        <div key={index} className="grid grid-cols-[1fr_auto] gap-4 items-center">
                          <input
                            type="text"
                            value={option}
                            disabled={inputType !== 'radio' && inputType !== 'checkbox'}
                            onChange={(e) => {
                              const updated = [...options]
                              updated[index] = e.target.value
                              setOptions(updated)
                            }}
                            className={`w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E] ${
                              inputType !== 'radio' && inputType !== 'checkbox' ? 'bg-gray-50 cursor-not-allowed' : ''
                            }`}
                            placeholder="Enter option value"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(option)}
                            disabled={inputType !== 'radio' && inputType !== 'checkbox'}
                            className={`p-2 text-red-600 hover:text-red-800 transition-colors flex-shrink-0 ${
                              inputType !== 'radio' && inputType !== 'checkbox' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                            }`}
                            aria-label={`Remove ${option}`}
                          >
                            <XIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 py-2">
                        {inputType === 'radio' || inputType === 'checkbox' 
                          ? 'No options added yet. Click "Add Option" below to add options.'
                          : 'Options are not applicable for this input type.'}
                      </div>
                    )}
                  </div>
                  
                  {/* Add Option Button - only show for radio/checkbox */}
                  {(inputType === 'radio' || inputType === 'checkbox') && (
                    <div className="px-4 pb-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newOption}
                          onChange={(e) => setNewOption(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              if (newOption.trim()) {
                                handleAddOption()
                              } else {
                                setOptions((prev) => [...prev, ''])
                              }
                            }
                          }}
                          placeholder="Enter option name"
                          className="flex-1 rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newOption.trim()) {
                              handleAddOption()
                            } else {
                              setOptions((prev) => [...prev, ''])
                            }
                          }}
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 cursor-pointer"
                        >
                          <span className="text-lg">+</span>
                          Add Option
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            {/* Category/Subcategory selection removed per request */}
          </div>
        </div>

        {/* Bottom Action Button */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 px-4 sm:px-6 py-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading || isLoadingData}
            className="w-full sm:w-auto rounded-lg bg-[#F7931E] px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium text-white transition hover:bg-[#E8851C] focus:outline-none focus:ring-2 focus:ring-[#F7931E] focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : isLoadingData ? 'Loading...' : 'Save Changes'}
          </button>
        </div>
      </section>
    </div>
  )
}

