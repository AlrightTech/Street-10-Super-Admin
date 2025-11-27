import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusIcon, TrashIcon } from '../components/icons/Icons'

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

// Mock initial filters - in a real app, this would come from an API
const INITIAL_FILTERS: FilterOption[] = [
  { id: 'brand', label: 'Brand' },
  { id: 'mileage', label: 'Mileage' },
  { id: 'model-year', label: 'Model Year' },
  { id: 'gear-type', label: 'Gear Type' },
  { id: 'engine-capacity', label: 'Engine Capacity' },
  { id: 'conditions', label: 'Conditions' },
  { id: 'fuel-type', label: 'Fuel Type' },
  { id: 'color', label: 'Color' },
]

export default function EditFilter() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<FilterOption[]>(INITIAL_FILTERS)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [newFilterLabel, setNewFilterLabel] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  // Load filters from localStorage on mount (in a real app, this would be from an API)
  useEffect(() => {
    const savedFilters = localStorage.getItem('filterOptions')
    if (savedFilters) {
      try {
        const parsed = JSON.parse(savedFilters)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFilters(parsed)
        }
      } catch (error) {
        // If parsing fails, use initial filters
        console.error('Failed to parse saved filters:', error)
      }
    }
  }, [])

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('filterOptions', JSON.stringify(filters))
  }, [filters])

  const handleEdit = (filter: FilterOption) => {
    setEditingId(filter.id)
    setEditValue(filter.label)
  }

  const handleSaveEdit = (id: string) => {
    if (editValue.trim()) {
      setFilters((prev) =>
        prev.map((filter) => (filter.id === id ? { ...filter, label: editValue.trim() } : filter))
      )
      setEditingId(null)
      setEditValue('')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  const handleDelete = (id: string) => {
    setFilters((prev) => prev.filter((filter) => filter.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setEditValue('')
    }
  }

  const handleAddFilter = () => {
    if (newFilterLabel.trim()) {
      const newId = `filter-${Date.now()}`
      const newFilter: FilterOption = {
        id: newId,
        label: newFilterLabel.trim(),
      }
      setFilters((prev) => [...prev, newFilter])
      setNewFilterLabel('')
      setShowAddForm(false)
    }
  }

  const handleCancel = () => {
    navigate('/categories/add')
  }

  const handleSave = () => {
    // In a real app, you would save to an API here
    // For now, we're using localStorage which is already handled in useEffect
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('filterOptionsUpdated'))
    navigate('/categories/add')
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <p className="text-xs sm:text-sm text-gray-600 mb-1">
          <span>Dashboard</span>
          <span className="mx-1">•</span>
          <span>Edit Filter</span>
        </p>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Edit Filter</h1>
      </div>

      {/* Main Content Card */}
      <section className="rounded-xl bg-white shadow-sm">
        <div className="px-4 sm:px-6 py-6">
          {/* Header with Add Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Manage Filters</h2>
            {!showAddForm && (
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white transition hover:bg-[#E8851C] focus:outline-none focus:ring-2 focus:ring-[#F7931E] focus:ring-offset-2 whitespace-nowrap cursor-pointer w-full sm:w-auto"
              >
                <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                Add New Filter
              </button>
            )}
          </div>

          {/* Add New Filter Form */}
          {showAddForm && (
            <div className="mb-6 p-4 rounded-lg border-2 border-[#F7931E] bg-orange-50">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Enter filter name"
                  value={newFilterLabel}
                  onChange={(e) => setNewFilterLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddFilter()
                    } else if (e.key === 'Escape') {
                      setShowAddForm(false)
                      setNewFilterLabel('')
                    }
                  }}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddFilter}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white transition hover:bg-[#E8851C] focus:outline-none focus:ring-2 focus:ring-[#F7931E] focus:ring-offset-2 whitespace-nowrap cursor-pointer"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false)
                      setNewFilterLabel('')
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 whitespace-nowrap cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Filters Grid */}
          {filters.length === 0 ? (
            <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
              <p className="text-base font-semibold text-gray-800">No filters available</p>
              <p className="mt-1 max-w-sm text-sm text-gray-500">Add a new filter to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {filters.map((filter) => (
                <div
                  key={filter.id}
                  className="relative rounded-lg border-2 border-gray-200 bg-white p-3 sm:p-4 transition-all hover:border-gray-300"
                >
                  {editingId === filter.id ? (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col gap-2 flex-1">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 border-[#F7931E] bg-orange-50 flex items-center justify-center">
                            <FilterIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#F7931E]" />
                          </div>
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveEdit(filter.id)
                              } else if (e.key === 'Escape') {
                                handleCancelEdit()
                              }
                            }}
                            className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs sm:text-sm outline-none focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(filter.id)}
                          className="flex-1 rounded-lg bg-[#F7931E] px-2 py-1.5 text-xs font-medium text-white transition hover:bg-[#E8851C] cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="flex-1 rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col gap-2 flex-1">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 border-[#F7931E] bg-white flex items-center justify-center">
                            <FilterIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#F7931E]" />
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-gray-700">{filter.label}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(filter)}
                          className="flex-1 rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(filter.id)}
                          className="flex-1 rounded-lg border border-red-300 bg-white px-2 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 cursor-pointer"
                        >
                          <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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

