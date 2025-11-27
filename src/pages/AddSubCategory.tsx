import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { XIcon } from '../components/icons/Icons'
import { type SubCategoryCardData } from '../components/categories/SubCategoryCard'
import { MOCK_SUB_CATEGORIES } from './Categories'

export default function AddSubCategory() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEditMode = !!id
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('')
  const [items, setItems] = useState<Array<{ id: string; name: string }>>([])
  const [newItemName, setNewItemName] = useState('')

  // Load subcategory data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const subCategory = MOCK_SUB_CATEGORIES.find((sc) => sc.id === id)
      if (subCategory) {
        setTitle(subCategory.title)
        setDescription(subCategory.description)
        setIcon(subCategory.icon)
        setItems([...subCategory.items])
      }
    }
  }, [id, isEditMode])

  const handleAddItem = () => {
    if (newItemName.trim()) {
      const newItem = {
        id: `item-${Date.now()}`,
        name: newItemName.trim(),
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
    if (!title.trim()) {
      // eslint-disable-next-line no-alert
      alert('Please enter a title')
      return
    }

    // Get existing subcategories from localStorage
    const savedSubCategories = localStorage.getItem('subCategories')
    let existingSubCategories: SubCategoryCardData[] = []
    
    if (savedSubCategories) {
      try {
        existingSubCategories = JSON.parse(savedSubCategories)
      } catch (error) {
        console.error('Failed to parse saved subcategories:', error)
      }
    }

    if (isEditMode && id) {
      // Update existing subcategory
      const updatedSubCategories = existingSubCategories.map((sc) =>
        sc.id === id
          ? {
              ...sc,
              title: title.trim(),
              description: description.trim(),
              icon: icon.trim() || 'B',
              items,
              subCategoryCount: items.length,
            }
          : sc
      )
      localStorage.setItem('subCategories', JSON.stringify(updatedSubCategories))
    } else {
      // Add new subcategory
      const newSubCategory: SubCategoryCardData = {
        id: `sub-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        icon: icon.trim() || 'B',
        items,
        subCategoryCount: items.length,
        status: 'active',
      }
      const updatedSubCategories = [...existingSubCategories, newSubCategory]
      localStorage.setItem('subCategories', JSON.stringify(updatedSubCategories))
    }

    // Dispatch custom event to notify Categories page
    window.dispatchEvent(new Event('subCategoriesUpdated'))
    navigate('/categories')
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
          <div className="space-y-4">
            {/* Title Input */}
            <div>
              <label htmlFor="subcategory-title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                id="subcategory-title"
                type="text"
                placeholder="Enter Subcategory Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Description Input */}
            <div>
              <label htmlFor="subcategory-description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                id="subcategory-description"
                type="text"
                placeholder="Enter Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Icon Input */}
            <div>
              <label htmlFor="subcategory-icon" className="block text-sm font-medium text-gray-700 mb-2">
                Icon (Single character or abbreviation)
              </label>
              <input
                id="subcategory-icon"
                type="text"
                placeholder="Enter Icon (e.g., B, C, CT)"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                maxLength={3}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Items Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
              
              {/* Add New Item */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Enter item name"
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
            className="w-full sm:w-auto rounded-lg bg-[#F7931E] px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium text-white transition hover:bg-[#E8851C] focus:outline-none focus:ring-2 focus:ring-[#F7931E] focus:ring-offset-2 cursor-pointer"
          >
            {isEditMode ? 'Update Subcategory' : 'Add Subcategory'}
          </button>
        </div>
      </section>
    </div>
  )
}

