import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { XIcon } from '../components/icons/Icons'
import { categoriesApi, type Category } from '../services/categories.api'

export default function AddSubCategory() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEditMode = !!id
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('')
  const [items, setItems] = useState<Array<{ id: string; name: string; isNew?: boolean }>>([])
  const [newItemName, setNewItemName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingChildCategories, setExistingChildCategories] = useState<Category[]>([])
  const [parentCategories, setParentCategories] = useState<Category[]>([])
  const [selectedParentId, setSelectedParentId] = useState<string>('')
  const [isLoadingParent, setIsLoadingParent] = useState(false)

  // Load available parent categories (top-level) for dropdown in create mode
  useEffect(() => {
    const loadParents = async () => {
      if (isEditMode) return
      try {
        const { data } = await categoriesApi.getAll({
          page: 1,
          limit: 100,
          parentId: 'null',
        })
        setParentCategories(data)
      } catch (err: any) {
        console.error('Failed to load parent categories:', err)
      }
    }

    void loadParents()
  }, [isEditMode])

  // Load subcategory data in edit mode (parent category and its children)
  useEffect(() => {
    const load = async () => {
      if (isEditMode && id) {
        try {
          setError(null)
          const category = await categoriesApi.getById(id)
          const lang = (category.langData || {}) as any
          setTitle(category.name)
          setDescription(lang.en?.description || '')
          setIcon(lang.en?.icon || (category.name?.charAt(0).toUpperCase() ?? 'S'))

          const children = (category.children || []) as Category[]
          setExistingChildCategories(children)
          setItems(
            children.map((child) => ({
              id: child.id,
              name: child.name,
            })),
          )
          setSelectedParentId(id)
        } catch (err: any) {
          console.error('Failed to load subcategory group:', err)
          setError(err.response?.data?.message || 'Failed to load subcategory group')
        }
      }
    }

    void load()
  }, [id, isEditMode])

  // When a parent category is selected in create mode, load its children
  useEffect(() => {
    const loadSelectedParent = async () => {
      if (isEditMode) return
      if (!selectedParentId || selectedParentId === '') {
        // Reset to empty
        setExistingChildCategories([])
        setItems([])
        return
      }

      try {
        setIsLoadingParent(true)
        setError(null)
        const category = await categoriesApi.getById(selectedParentId)

        const children = (category.children || []) as Category[]
        setExistingChildCategories(children)
        setItems(
          children.map((child) => ({
            id: child.id,
            name: child.name,
          })),
        )
      } catch (err: any) {
        console.error('Failed to load selected parent category:', err)
        setError(err.response?.data?.message || 'Failed to load selected parent category')
      } finally {
        setIsLoadingParent(false)
      }
    }

    void loadSelectedParent()
  }, [selectedParentId, isEditMode])

  const handleAddItem = () => {
    if (newItemName.trim()) {
      const newItem = {
        id: `new-${Date.now()}`,
        name: newItemName.trim(),
        isNew: true,
      }
      setItems((prev) => [...prev, newItem])
      setNewItemName('')
    }
  }

  const handleRemoveItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const handleCancel = () => {
    navigate('/categories')
  }

  const handleSave = () => {
    if (isEditMode) {
      // In edit mode, no validation needed for parent category
    } else {
      // In create mode, validate that a parent category is selected
      if (!selectedParentId || selectedParentId === '') {
        setError('Please select a parent category')
        return
      }
    }

    const save = async () => {
      try {
        setIsSubmitting(true)
        setError(null)

        let parentId = id || ''

        // Determine parent category
        if (isEditMode && id) {
          // In edit mode, don't update the parent category - it's read-only
          // Just use the existing parent ID
          parentId = id
        } else {
          // In create mode, use the selected parent category
          if (!selectedParentId || selectedParentId === '') {
            setError('Please select a parent category')
            setIsSubmitting(false)
            return
          }
          parentId = selectedParentId
        }

        // Handle children differently in edit vs create mode
        if (isEditMode && id) {
          // In edit mode: ONLY update existing children and create new ones.
          // We do NOT delete any child categories automatically to avoid
          // conflicts when a child already has products.
          const existingIds = new Set(existingChildCategories.map((c) => c.id))

          const toUpdate = items.filter((i) => !i.isNew && existingIds.has(i.id))
          const toCreate = items.filter((i) => i.isNew)

          await Promise.all([
            // Update existing children
            ...toUpdate.map((item) =>
              categoriesApi.update(item.id, {
                name: item.name,
              }),
            ),
            // Create new children
            ...toCreate.map((item) =>
              categoriesApi.create({
                name: item.name,
                parentId,
              } as any),
            ),
          ])
        } else {
          // In create mode: NEVER delete or update existing child categories.
          // Only append new child categories under the selected parent.
          const toCreate = items.filter((i) => i.isNew) // only "new" items

          if (toCreate.length === 0) {
            setError('Please add at least one subcategory')
            setIsSubmitting(false)
            return
          }

          await Promise.all(
            toCreate.map((item) =>
              categoriesApi.create({
                name: item.name,
                parentId,
              } as any),
            ),
          )
        }

        navigate('/categories')
      } catch (err: any) {
        console.error('Failed to save subcategory group:', err)
        setError(err.response?.data?.message || 'Failed to save subcategory group')
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
          <span>{isEditMode ? 'Edit Subcategory' : 'Add Subcategory'}</span>
        </p>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Subcategories</h1>
      </div>

      {/* Main Content Card */}
      <section className="rounded-xl bg-white shadow-sm">
        <div className="px-4 sm:px-6 py-6">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="space-y-4">
            {/* Parent Category Select (create mode) or Display (edit mode) */}
            {isEditMode ? (
              <div>
                <label htmlFor="parent-category-display" className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Category
                </label>
                <input
                  id="parent-category-display"
                  type="text"
                  value={title}
                  readOnly
                  disabled
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none text-gray-600 cursor-not-allowed"
                />
              </div>
            ) : (
              <div>
                <label htmlFor="parent-category" className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Category
                </label>
                <select
                  id="parent-category"
                  value={selectedParentId}
                  onChange={(e) => setSelectedParentId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
                >
                  <option value="">Select a parent category</option>
                  {parentCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {isLoadingParent && (
                  <p className="mt-1 text-xs text-gray-500">Loading selected parent details...</p>
                )}
              </div>
            )}

            {/* Add subcategory Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add subcategory
              </label>
              
              {/* Add New Subcategory */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Enter subcategory name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddItem()
                    }
                  }}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
                />
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8851C] cursor-pointer"
                >
                  Add
                </button>
              </div>

              {/* Items List */}
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    {item.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="ml-0.5 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                      aria-label={`Remove ${item.name}`}
                    >
                      <XIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {items.length === 0 && (
                  <p className="text-sm text-gray-500">No items added yet</p>
                )}
              </div>
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
            onClick={handleSave}
            disabled={isSubmitting}
            className="w-full sm:w-auto rounded-lg bg-[#F7931E] px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium text-white transition hover:bg-[#E8851C] focus:outline-none focus:ring-2 focus:ring-[#F7931E] focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : isEditMode ? 'Update Subcategory' : 'Add Subcategory'}
          </button>
        </div>
      </section>
    </div>
  )
}

