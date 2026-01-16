import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UploadIcon } from '../components/icons/Icons'
import SelectDropdown from '../components/ui/SelectDropdown'
import { productsApi } from '../services/products.api'
import { categoriesApi, type Category } from '../services/categories.api'
import { filtersApi, type Filter as BackendFilter } from '../services/filters.api'

export default function AddEcommerceProduct() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    productTitle: '',
    categoryId: '',
    condition: '',
    productDescription: '',
    metaTitle: '',
    metaDescription: '',
    productUrlSlug: '',
    price: '',
    discountPrice: '',
    stockQuantity: '1',
    stockStatus: '',
    brand: '',
    weight: '',
    dimensions: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [documentFiles, setDocumentFiles] = useState<File[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [availableFilters, setAvailableFilters] = useState<BackendFilter[]>([])
  const [selectedFilters, setSelectedFilters] = useState<Array<{ filterId: string; value: string }>>([])

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        const tree = await categoriesApi.getTree()
        // Flatten tree to get all categories
        const flattenCategories = (cats: Category[]): Category[] => {
          const result: Category[] = []
          cats.forEach(cat => {
            result.push(cat)
            if (cat.children && cat.children.length > 0) {
              result.push(...flattenCategories(cat.children))
            }
          })
          return result
        }
        setCategories(flattenCategories(tree).filter(cat => cat.isActive))
      } catch (err: any) {
        console.error('Error fetching categories:', err)
        setError('Failed to load categories')
      } finally {
        setLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [])

  // Convert category tree to dropdown options
  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }))

  const conditionOptions = [
    { value: 'new', label: 'New' },
    { value: 'used', label: 'Used' },
    { value: 'refurbished', label: 'Refurbished' },
  ]

  const stockStatusOptions = [
    { value: 'in-stock', label: 'In Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' },
    { value: 'low-stock', label: 'Low Stock' },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      // Limit to 10 images total
      const remainingSlots = 10 - mediaFiles.length
      if (remainingSlots > 0) {
        setMediaFiles([...mediaFiles, ...newFiles.slice(0, remainingSlots)])
      } else {
        setError('Maximum 10 images allowed')
      }
    }
  }

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocumentFiles([...documentFiles, ...Array.from(e.target.files)])
    }
  }

  const handleAddFilter = () => {
    setSelectedFilters([...selectedFilters, { filterId: '', value: '' }])
  }

  const handleFilterChange = (index: number, field: 'filterId' | 'value', value: string) => {
    const updated = [...selectedFilters]
    updated[index] = { ...updated[index], [field]: value }
    setSelectedFilters(updated)
  }

  const removeFilter = (index: number) => {
    setSelectedFilters(selectedFilters.filter((_, i) => i !== index))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent, type: 'media' | 'document') => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = Array.from(e.dataTransfer.files)
    if (type === 'media') {
      const imageFiles = files.filter(file => file.type.startsWith('image/'))
      const remainingSlots = 10 - mediaFiles.length
      if (remainingSlots > 0) {
        setMediaFiles([...mediaFiles, ...imageFiles.slice(0, remainingSlots)])
      } else {
          setError('Maximum 10 images allowed')
      }
    } else {
      const docFiles = files.filter(file => 
        file.type === 'application/pdf' || 
        file.type.includes('document') ||
        file.name.endsWith('.pdf') ||
        file.name.endsWith('.doc') ||
        file.name.endsWith('.docx')
      )
      setDocumentFiles([...documentFiles, ...docFiles])
    }
  }

  const removeMediaFile = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index))
  }

  const removeDocumentFile = (index: number) => {
    setDocumentFiles(documentFiles.filter((_, i) => i !== index))
  }

  // Load filters for selected category
  useEffect(() => {
    const loadCategoryFilters = async () => {
      if (!formData.categoryId) {
        setAvailableFilters([])
        setSelectedFilters([])
        return
      }
      try {
        const categoryFilters = await categoriesApi.getCategoryFilters(formData.categoryId)
        const filterIds = categoryFilters.map((cf: any) => cf.filterId)
        const allFilters = await filtersApi.getAll()
        const relevantFilters = allFilters.filter((f: BackendFilter) => filterIds.includes(f.id))
        setAvailableFilters(relevantFilters)
        // Reset selected filters when category changes
        setSelectedFilters([])
      } catch (err: any) {
        console.error('Error fetching category filters for e-commerce product:', err)
      }
    }
    loadCategoryFilters()
  }, [formData.categoryId])

  // Convert files to data URLs (for now - in production, upload to S3/DO Spaces first)
  const convertFileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccessMessage(null)

    try {
      // Validation
      if (!formData.productTitle.trim()) {
        setError('Product title is required')
        return
      }
      if (!formData.categoryId) {
        setError('Category is required')
        return
      }
      if (!formData.price || parseFloat(formData.price) <= 0) {
        setError('Valid price is required')
        return
      }
      if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
        setError('Valid stock quantity is required')
        return
      }

      // Convert media files to URLs
      const mediaUrls: string[] = []
      for (const file of mediaFiles) {
        try {
          const dataUrl = await convertFileToDataURL(file)
          mediaUrls.push(dataUrl)
        } catch (err) {
          console.error('Error converting file:', err)
        }
      }

      // If no media files, use placeholder
      if (mediaUrls.length === 0) {
        mediaUrls.push('https://via.placeholder.com/400')
      }

      // Convert price to minor units (cents)
      const priceMinor = Math.round(parseFloat(formData.price) * 100)
      const stock = parseInt(formData.stockQuantity) || 1

      // Create product attributes from form data
      // Mark this as an e-commerce product so we can separate it from bidding products
      const attributes = {
        productType: 'ecommerce',
        condition: formData.condition || undefined,
        brand: formData.brand || undefined,
        weight: formData.weight || undefined,
        dimensions: formData.dimensions || undefined,
        stockStatus: formData.stockStatus || undefined,
        discountPrice: formData.discountPrice ? Math.round(parseFloat(formData.discountPrice) * 100) : undefined,
        metaTitle: formData.metaTitle || undefined,
        metaDescription: formData.metaDescription || undefined,
        productUrlSlug: formData.productUrlSlug || undefined,
      }

      // Prepare filter values (same structure as bidding products)
      const filterValues: Array<{ filterId: string; value: string }> = []
      for (const filter of selectedFilters) {
        if (!filter.filterId || !filter.value.trim()) continue
        filterValues.push({
          filterId: filter.filterId,
          value: filter.value.trim(),
        })
      }

      // Create product via API
      await productsApi.create({
        title: formData.productTitle,
        description: formData.productDescription || undefined,
        priceMinor: priceMinor,
        currency: 'QAR',
        stock: stock,
        status: 'active',
        categoryIds: [formData.categoryId],
        attributes: attributes,
        mediaUrls: mediaUrls,
        filterValues: filterValues.length > 0 ? filterValues : undefined,
      })

      setSuccessMessage('Product created successfully!')

      // Navigate back to e-commerce products page after a short delay
      setTimeout(() => {
        navigate('/ecommerce-products')
      }, 800)
    } catch (err: any) {
      console.error('Error creating product:', err)
      console.error('Error response:', err.response?.data)
      console.error('Error details:', {
        status: err.response?.status,
        message: err.response?.data?.message,
        errors: err.response?.data?.errors,
        data: err.response?.data
      })
      const errorMessage = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || err.message || 'Failed to create product'
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/ecommerce-products')
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="mt-1 text-sm text-gray-600">Dashboard : Add New Product</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-6">
          {/* Product Details Section */}
          <div className="space-y-4">
            <div>
              <label htmlFor="productTitle" className="block text-sm font-medium text-[#888888] mb-1.5">
                Product Title
              </label>
              <input
                type="text"
                id="productTitle"
                name="productTitle"
                value={formData.productTitle}
                onChange={handleChange}
                placeholder="Enter Product Title"
                className="w-full rounded-lg bg-[#F3F5F6] px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-[#888888] mb-1.5">
                Category
              </label>
              {loadingCategories ? (
                <div className="w-full rounded-lg bg-[#F3F5F6] px-4 py-2.5 text-sm text-gray-500">
                  Loading categories...
                </div>
              ) : (
                <SelectDropdown
                  value={formData.categoryId}
                  options={categoryOptions}
                  onChange={(value) => handleSelectChange('categoryId', value)}
                  placeholder="Select Category"
                  className="w-full"
                />
              )}
            </div>

            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-[#888888] mb-1.5">
                Condition
              </label>
              <SelectDropdown
                value={formData.condition}
                options={conditionOptions}
                onChange={(value) => handleSelectChange('condition', value)}
                placeholder="Select Condition"
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="productDescription" className="block text-sm font-medium text-[#888888] mb-1.5">
                Product Description
              </label>
              <textarea
                id="productDescription"
                name="productDescription"
                value={formData.productDescription}
                onChange={handleChange}
                rows={6}
                className="w-full rounded-lg bg-[#F3F5F6] px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E] resize-none"
              />
            </div>
          </div>

          {/* Upload Media Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#888888] mb-1.5">Upload Media</label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#F7931E] transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'media')}
              >
                <input
                  type="file"
                  id="mediaUpload"
                  multiple
                  accept="image/*"
                  onChange={handleMediaUpload}
                  className="hidden"
                />
                <label htmlFor="mediaUpload" className="cursor-pointer block">
                  <UploadIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Drag & drop for images</p>
                  <p className="text-xs text-gray-500">Support JPG, PNG, WEBP up to 5MB each. max 10 images.</p>
                </label>
              </div>
              {mediaFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {mediaFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-xs text-gray-700 truncate flex-1">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeMediaFile(index)}
                        className="ml-2 text-red-600 hover:text-red-700 text-xs cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => document.getElementById('mediaUpload')?.click()}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                + Add Another Media
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#888888] mb-1.5">Upload Doc</label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#F7931E] transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'document')}
              >
                <input
                  type="file"
                  id="documentUpload"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={handleDocumentUpload}
                  className="hidden"
                />
                <label htmlFor="documentUpload" className="cursor-pointer block">
                  <UploadIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Drag & drop for Document</p>
                </label>
              </div>
              {documentFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {documentFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-xs text-gray-700 truncate flex-1">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeDocumentFile(index)}
                        className="ml-2 text-red-600 hover:text-red-700 text-xs cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => document.getElementById('documentUpload')?.click()}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                + Add Another Doc
              </button>
            </div>
          </div>

          {/* SEO & Marketing Section */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">SEO & Marketing</h2>
            <div>
              <label htmlFor="metaTitle" className="block text-sm font-medium text-[#888888] mb-1.5">
                Meta Title
              </label>
              <input
                type="text"
                id="metaTitle"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                placeholder="Enter Meta Title"
                className="w-full rounded-lg bg-[#F3F5F6] px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            <div>
              <label htmlFor="metaDescription" className="block text-sm font-medium text-[#888888] mb-1.5">
                Meta Description
              </label>
              <input
                type="text"
                id="metaDescription"
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                placeholder="Enter Description"
                className="w-full rounded-lg bg-[#F3F5F6] px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            <div>
              <label htmlFor="productUrlSlug" className="block text-sm font-medium text-[#888888] mb-1.5">
                Product URL Slug
              </label>
              <input
                type="text"
                id="productUrlSlug"
                name="productUrlSlug"
                value={formData.productUrlSlug}
                onChange={handleChange}
                placeholder="Product Url Slug"
                className="w-full rounded-lg bg-[#F3F5F6] px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>
          </div>

          {/* Pricing & Stock Section */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Pricing & Stock</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-[#888888] mb-1.5">
                  Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full rounded-lg bg-[#F3F5F6] px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                />
              </div>

              <div>
                <label htmlFor="discountPrice" className="block text-sm font-medium text-[#888888] mb-1.5">
                  Discount Price ($)
                </label>
                <input
                  type="number"
                  id="discountPrice"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full rounded-lg bg-[#F3F5F6] px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                />
              </div>

              <div>
                <label htmlFor="stockQuantity" className="block text-sm font-medium text-[#888888] mb-1.5">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  id="stockQuantity"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-[#F3F5F6] px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                />
              </div>

              <div>
                <label htmlFor="stockStatus" className="block text-sm font-medium text-[#888888] mb-1.5">
                  Stock Status
                </label>
                <SelectDropdown
                  value={formData.stockStatus}
                  options={stockStatusOptions}
                  onChange={(value) => handleSelectChange('stockStatus', value)}
                  placeholder="Select Stock Status"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Additional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-[#888888] mb-1.5">
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-[#F3F5F6] px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-[#888888] mb-1.5">
                  Weight
                </label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-[#F3F5F6] px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                />
              </div>

              <div>
                <label htmlFor="dimensions" className="block text-sm font-medium text-[#888888] mb-1.5">
                  Dimensions
                </label>
                <input
                  type="text"
                  id="dimensions"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-[#F3F5F6] px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Filters Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Product Filters</h2>
          <p className="text-sm text-gray-600">
            Select filters from the category and set their values for this product.
            These filters will appear on the product detail page on the website.
          </p>

          {selectedFilters.map((filter, index) => {
            const filterDetails = availableFilters.find((f: BackendFilter) => f.id === filter.filterId)
            const filterOptions = (filterDetails as any)?.options?.values || []
            const filterType = filterDetails?.type || 'text'

            return (
              <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700">Filter {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeFilter(index)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium cursor-pointer"
                  >
                    Remove
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[#888888] mb-2">
                      Select Filter <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={filter.filterId}
                      onChange={(e) => handleFilterChange(index, 'filterId', e.target.value)}
                      className="w-full rounded-lg bg-white border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#F7931E]"
                      required
                    >
                      <option value="">-- Select Filter --</option>
                      {availableFilters.map((f: BackendFilter) => (
                        <option key={f.id} value={f.id}>
                          {f.i18n?.en?.label || f.key}
                        </option>
                      ))}
                    </select>
                  </div>

                  {filter.filterId && (
                    <div>
                      <label className="block text-sm font-medium text-[#888888] mb-2">
                        Filter Value <span className="text-red-500">*</span>
                      </label>
                      {filterType === 'number' ? (
                        <input
                          type="number"
                          value={filter.value}
                          onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                          placeholder="Enter value"
                          className="w-full rounded-lg bg-white border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#F7931E]"
                          required
                        />
                      ) : filterOptions.length > 0 ? (
                        <select
                          value={filter.value}
                          onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                          className="w-full rounded-lg bg-white border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#F7931E]"
                          required
                        >
                          <option value="">-- Select Value --</option>
                          {filterOptions.map((opt: string) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={filter.value}
                          onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                          placeholder="Enter value"
                          className="w-full rounded-lg bg-white border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#F7931E]"
                          required
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          <button
            type="button"
            onClick={handleAddFilter}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#F7931E] bg-[#FDF4EB] rounded-lg hover:bg-[#F9E8D3] transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Filter
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && !error && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || loadingCategories}
            className="px-6 py-2.5 text-sm font-medium text-white bg-[#F7931E] rounded-lg hover:bg-[#E8840D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

