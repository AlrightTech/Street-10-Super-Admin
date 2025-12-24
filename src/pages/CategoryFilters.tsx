import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CategoriesFilterTabs from '../components/categories/CategoriesFilterTabs'
import { PlusIcon } from '../components/icons/Icons'
import { filtersApi, type Filter as BackendFilter } from '../services/filters.api'
import { categoriesApi } from '../services/categories.api'

const TAB_OPTIONS: { key: string; label: string }[] = [
  { key: 'categories', label: 'Categories' },
  { key: 'sub-category', label: 'Sub Category' },
  { key: 'filter', label: 'Filter' },
]

export interface Filter {
  id: string
  filterName: string
  inputType: 'number' | 'radio' | 'checkbox' | 'text'
  options: string[]
  description?: string
  category?: string
  status: 'active' | 'inactive'
}

export default function CategoryFilters() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<Filter[]>([])
  const [previewValues, setPreviewValues] = useState<Record<string, string>>({})
  const [assignedFilterIds, setAssignedFilterIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mapBackendFilter = (f: BackendFilter): Filter => ({
    id: f.id,
    filterName: f.i18n?.en?.label || f.key,
    inputType:
      f.type === 'number'
        ? 'number'
        : f.type === 'multi-select'
        ? 'checkbox'
        : f.type === 'boolean' || f.type === 'select'
        ? 'radio'
        : 'text',
    options: Array.isArray(f.options) ? f.options : [],
    description: f.i18n?.en?.placeholder,
    category: undefined,
    status: 'active',
  })

  // Load filters from API and check which ones are assigned to categories
  useEffect(() => {
    const loadFilters = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const backendFilters = await filtersApi.getAll()
        const mapped = backendFilters.map(mapBackendFilter)
        setFilters(mapped)

        const previews: Record<string, string> = {}
        mapped.forEach((f) => {
          if (f.inputType === 'number') {
            previews[f.id] = ''
          } else if (f.inputType === 'radio' && f.options.length > 0) {
            previews[f.id] = f.options[0]
          } else {
            previews[f.id] = ''
          }
        })
        setPreviewValues(previews)

        // Check which filters are assigned to categories/subcategories
        const assignedIds = new Set<string>()
        try {
          const { data: allCategories } = await categoriesApi.getAll({
            page: 1,
            limit: 1000,
          })

          // Check each category to see which filters are assigned
          for (const category of allCategories) {
            try {
              const categoryFilters = await categoriesApi.getCategoryFilters(category.id)
              categoryFilters.forEach((cf: any) => {
                assignedIds.add(cf.filterId)
              })
            } catch (err) {
              // Skip if we can't fetch filters for this category
              console.warn(`Failed to fetch filters for category ${category.id}:`, err)
            }
          }
        } catch (err) {
          console.warn('Failed to load category assignments:', err)
        }

        setAssignedFilterIds(assignedIds)
      } catch (err: any) {
        console.error('Failed to load filters:', err)
        setError(err.response?.data?.message || 'Failed to load filters')
      } finally {
        setIsLoading(false)
      }
    }

    loadFilters()
  }, [])

  const handleTabChange = (tabKey: string) => {
    if (tabKey === 'categories') {
      navigate('/categories')
    } else if (tabKey === 'sub-category') {
      navigate('/categories')
      // Switch to sub-category tab (would need state management for this)
    } else {
      // Already on filter tab
    }
  }

  const handleEdit = (filter: Filter) => {
    navigate(`/categories/edit-filter/${filter.id}`)
  }

  const handleDelete = async (filterId: string) => {
    if (!window.confirm('Are you sure you want to delete this filter?')) {
      return
    }

    try {
      await filtersApi.delete(filterId)
      setFilters((prev) => prev.filter((f) => f.id !== filterId))
      setPreviewValues((prev) => {
        const updated = { ...prev }
        delete updated[filterId]
        return updated
      })
      setAssignedFilterIds((prev) => {
        const updated = new Set(prev)
        updated.delete(filterId)
        return updated
      })
    } catch (err: any) {
      console.error('Failed to delete filter:', err)
      // Error is handled by disabling the button, so we don't show alert
    }
  }

  const handleAddNewFilter = () => {
    navigate('/categories/add-filter')
  }

  const handlePreviewChange = (filterId: string, value: string) => {
    setPreviewValues((prev) => ({
      ...prev,
      [filterId]: value,
    }))
  }

  const getInputTypeLabel = (inputType: string) => {
    switch (inputType) {
      case 'number':
        return 'Number'
      case 'radio':
        return 'Radio'
      case 'checkbox':
        return 'Checkbox'
      case 'text':
        return 'Text'
      default:
        return inputType
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Category Filters</h1>
        <p className="mt-1 text-sm text-gray-600">
          <span>Dashboard</span>
          <span className="mx-1">•</span>
          <span>Filters</span>
        </p>
      </div>

      {/* Tabs Section */}
      <section className="rounded-xl bg-white shadow-sm">
        <div className="px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CategoriesFilterTabs tabs={TAB_OPTIONS} activeTab="filter" onTabChange={handleTabChange} />
            <button
              type="button"
              onClick={handleAddNewFilter}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white transition hover:bg-[#E8851C] focus:outline-none focus:ring-2 focus:ring-[#F7931E] focus:ring-offset-2 whitespace-nowrap cursor-pointer w-full sm:w-auto"
            >
              <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              Add New Filter
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Card */}
      <section className="rounded-xl bg-white shadow-sm">
        <div className="px-4 sm:px-6 py-6">
          {/* Existing Filters Section */}
          <div className="mb-8">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Existing Filters</h2>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center text-sm text-gray-600">
                Loading filters...
              </div>
            ) : filters.length === 0 ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
                <p className="text-base font-semibold text-gray-800">No filters available</p>
                <p className="mt-1 max-w-sm text-sm text-gray-500">Add a new filter to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto  border border-gray-200 rounded-lg">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Filter Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Input Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Options</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {filters.map((filter) => (
                      <tr key={filter.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">{filter.filterName}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {filter.inputType === 'number' ? (
                            <span>Number</span>
                          ) : filter.inputType === 'radio' ? (
                            <div className="flex items-center gap-2">
                              <input type="radio" checked readOnly className="cursor-default" />
                              <span>{getInputTypeLabel(filter.inputType)}</span>
                            </div>
                          ) : (
                            getInputTypeLabel(filter.inputType)
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {filter.options.length > 0 ? filter.options.join(', ') : '—'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="text-green-600 font-medium">Active</span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              onClick={() => handleEdit(filter)}
                              className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer font-medium"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(filter.id)}
                              disabled={assignedFilterIds.has(filter.id)}
                              className={`transition-colors font-medium ${
                                assignedFilterIds.has(filter.id)
                                  ? 'text-gray-400 cursor-not-allowed opacity-50'
                                  : 'text-red-600 hover:text-red-800 cursor-pointer'
                              }`}
                              title={
                                assignedFilterIds.has(filter.id)
                                  ? 'Cannot delete filter that is assigned to categories or subcategories'
                                  : 'Delete filter'
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Preview: How Vendors Will See These Filters
            </h2>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filters.map((filter) => {
                  // For Cylinders, place it in the first column of second row
                  const isCylinders = filter.filterName === 'Cylinders'
                  const gridColumn = isCylinders ? 'col-span-1 sm:col-start-1' : ''
                  
                  return (
                    <div key={filter.id} className={`flex flex-col ${gridColumn}`}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {filter.filterName}
                      </label>
                      {filter.inputType === 'number' ? (
                        <input
                          type="number"
                          value={previewValues[filter.id] || ''}
                          onChange={(e) => handlePreviewChange(filter.id, e.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
                        />
                      ) : filter.inputType === 'radio' ? (
                        <div className="flex flex-wrap gap-4">
                          {filter.options.map((option) => (
                            <label key={option} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`preview-${filter.id}`}
                                value={option}
                                checked={previewValues[filter.id] === option}
                                onChange={(e) => handlePreviewChange(filter.id, e.target.value)}
                                className="text-[#F7931E] focus:ring-[#F7931E] cursor-pointer"
                              />
                              <span className="text-sm text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      ) : filter.inputType === 'checkbox' ? (
                        <div className="flex flex-wrap gap-4">
                          {filter.options.map((option) => (
                            <label key={option} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={(previewValues[filter.id] || '').includes(option)}
                                onChange={(e) => {
                                  const current = (previewValues[filter.id] || '').split(',').filter(Boolean)
                                  const updated = e.target.checked
                                    ? [...current, option]
                                    : current.filter((v) => v !== option)
                                  handlePreviewChange(filter.id, updated.join(','))
                                }}
                                className="text-[#F7931E] focus:ring-[#F7931E] cursor-pointer"
                              />
                              <span className="text-sm text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={previewValues[filter.id] || ''}
                          onChange={(e) => handlePreviewChange(filter.id, e.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

