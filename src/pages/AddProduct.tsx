import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CalendarIcon, ChevronDownIcon, ClockIcon } from '../components/icons/Icons'
import { featuredProductsApi, productsApi } from '../services/featured-products.api'

interface ProductFormData {
  productId: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  priority: 'High' | 'Medium' | 'Low'
}

// Helper function to combine date and time into ISO string
const combineDateAndTime = (date: string, time: string): string => {
  if (!date || !time) return ''
  
  // Parse time (format: "10:00AM" or "10:00 AM")
  const timeMatch = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  if (!timeMatch) return date
  
  let hours = parseInt(timeMatch[1], 10)
  const minutes = parseInt(timeMatch[2], 10)
  const ampm = timeMatch[3].toUpperCase()
  
  if (ampm === 'PM' && hours !== 12) hours += 12
  if (ampm === 'AM' && hours === 12) hours = 0
  
  // Combine date and time
  const dateTime = new Date(`${date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`)
  return dateTime.toISOString()
}

// Helper function to extract time from ISO string
const extractTime = (dateString: string): string => {
  const date = new Date(dateString)
  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12
  return `${String(hours).padStart(2, '0')}:${minutes}${ampm}`
}

export default function AddProduct() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEditMode = !!id
  const startDateInputRef = useRef<HTMLInputElement>(null)
  const endDateInputRef = useRef<HTMLInputElement>(null)
  const startTimeInputRef = useRef<HTMLInputElement>(null)
  const endTimeInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<ProductFormData>({
    productId: '',
    startDate: '',
    endDate: '',
    startTime: '10:00AM',
    endTime: '10:00AM',
    priority: 'High',
  })

  const [availableProducts, setAvailableProducts] = useState<any[]>([])
  const [productSearch, setProductSearch] = useState('')
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Custom dropdown states
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false)
  
  // Refs for click-outside detection
  const productDropdownRef = useRef<HTMLDivElement>(null)
  const priorityDropdownRef = useRef<HTMLDivElement>(null)

  // Fetch available products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsApi.search({
          search: productSearch || undefined,
          limit: 50,
        })
        setAvailableProducts(response.data || [])
      } catch (err) {
        console.error('Error fetching products:', err)
      }
    }
    fetchProducts()
  }, [productSearch])

  // Load featured product data in edit mode
  useEffect(() => {
    const fetchFeaturedProduct = async () => {
      if (isEditMode && id) {
        setIsLoadingData(true)
        setError(null)
        try {
          const featuredProduct = await featuredProductsApi.getById(id)
          
          setSelectedProduct(featuredProduct.product)
          setFormData({
            productId: featuredProduct.productId,
            startDate: featuredProduct.startDate.split('T')[0],
            endDate: featuredProduct.endDate.split('T')[0],
            startTime: extractTime(featuredProduct.startDate),
            endTime: extractTime(featuredProduct.endDate),
            priority: featuredProduct.priority === 'high' ? 'High' : featuredProduct.priority === 'medium' ? 'Medium' : 'Low',
          })
        } catch (err: any) {
          console.error('Error fetching featured product:', err)
          setError(err.response?.data?.message || 'Failed to load featured product')
        } finally {
          setIsLoadingData(false)
        }
      }
    }

    fetchFeaturedProduct()
  }, [id, isEditMode])

  // Click-outside detection for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productDropdownRef.current && !productDropdownRef.current.contains(event.target as Node)) {
        setIsProductDropdownOpen(false)
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

  const handleInputChange = (field: keyof ProductFormData, value: string | 'High' | 'Medium' | 'Low') => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product)
    setFormData((prev) => ({ ...prev, productId: product.id }))
    setIsProductDropdownOpen(false)
    setProductSearch('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const startDateTime = combineDateAndTime(formData.startDate, formData.startTime)
      const endDateTime = combineDateAndTime(formData.endDate, formData.endTime)

      if (!startDateTime || !endDateTime) {
        throw new Error('Please provide both start and end dates')
      }

      const data = {
        productId: formData.productId,
        priority: formData.priority.toLowerCase() as 'high' | 'medium' | 'low',
        startDate: startDateTime,
        endDate: endDateTime,
      }

      if (isEditMode && id) {
        await featuredProductsApi.update(id, data)
        setSuccessMessage('Featured product updated successfully')
      } else {
        await featuredProductsApi.create(data)
        setSuccessMessage('Featured product created successfully')
      }

      setTimeout(() => {
        navigate('/marketing?tab=product')
      }, 1000)
    } catch (err: any) {
      console.error('Error saving featured product:', err)
      setError(err.response?.data?.message || 'Failed to save featured product')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/marketing?tab=product')
  }

  const priorityOptions: ('High' | 'Medium' | 'Low')[] = ['High', 'Medium', 'Low']

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Marketing</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Dashboard - Products</p>
      </div>

      {/* Main Navigation Bar */}
      <nav className="flex flex-wrap items-center gap-1 sm:gap-2 md:gap-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto pt-3 pb-1">
        <button
          type="button"
          onClick={() => navigate('/marketing?tab=story-highlight')}
          className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
        >
          Story Highlight
        </button>
        <button
          type="button"
          onClick={() => navigate('/marketing?tab=banners')}
          className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
        >
          Banners
        </button>
        <button
          type="button"
          onClick={() => navigate('/marketing?tab=pop-up')}
          className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
        >
          Pop-Up
        </button>
        <button
          type="button"
          onClick={() => navigate('/marketing?tab=push-notifications')}
          className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
        >
          Push Notifications
        </button>
        <button
          type="button"
          onClick={() => navigate('/marketing?tab=product')}
          className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap text-[#F7931E] border-b-2 border-[#F7931E] cursor-pointer"
        >
          Product
        </button>
      </nav>

      {/* Section Title */}
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{isEditMode ? 'Edit Featured Product' : 'Add New Featured Product'}</h2>

      {/* Error/Success Messages */}
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-800 dark:text-red-200">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-800 dark:text-green-200">
          {successMessage}
        </div>
      )}

      {/* Form Container */}
      <div className="rounded-xl bg-white dark:bg-gray-800 shadow-sm p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Selection */}
          <div>
            <label htmlFor="product" className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
              Product *
            </label>
            <div className="relative" ref={productDropdownRef}>
              <input
                type="text"
                id="product"
                value={productSearch || selectedProduct?.title || ''}
                onChange={(e) => {
                  setProductSearch(e.target.value)
                  setIsProductDropdownOpen(true)
                }}
                onFocus={() => setIsProductDropdownOpen(true)}
                placeholder="Search and select a product"
                className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                required={!isEditMode}
                disabled={isEditMode}
              />
              {isProductDropdownOpen && !isEditMode && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {availableProducts.length > 0 ? (
                    availableProducts.map((product) => {
                      const price = product.priceMinor ? (parseFloat(product.priceMinor) / 100).toLocaleString() : '0'
                      const categoryName = product.categories && product.categories.length > 0 
                        ? (product.categories[0]?.category?.name || 'No category')
                        : 'No category'
                      
                      return (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => handleProductSelect(product)}
                          className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          <div className="font-medium">{product.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">{categoryName}</span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{price} {product.currency || 'QAR'}</span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">ID: {product.id.slice(0, 8)}...</span>
                          </div>
                        </button>
                      )
                    })
                  ) : (
                    <div className="px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400">No products found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Date Fields - Parallel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start-date" className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
                Start Date *
              </label>
              <div className="relative">
                <input
                  ref={startDateInputRef}
                  type="date"
                  id="start-date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F7931E] [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  style={{ WebkitAppearance: 'none' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => startDateInputRef.current?.showPicker?.()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                  aria-label="Open calendar"
                >
                  <CalendarIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="end-date" className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
                End Date *
              </label>
              <div className="relative">
                <input
                  ref={endDateInputRef}
                  type="date"
                  id="end-date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F7931E] [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  style={{ WebkitAppearance: 'none' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => endDateInputRef.current?.showPicker?.()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                  aria-label="Open calendar"
                >
                  <CalendarIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Time Fields - Parallel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start-time" className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
                Start Time *
              </label>
              <div className="relative">
                <input
                  ref={startTimeInputRef}
                  type="text"
                  id="start-time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  placeholder="10:00AM"
                  className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                  required
                />
                <button
                  type="button"
                  onClick={() => startTimeInputRef.current?.focus()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                  aria-label="Set time"
                >
                  <ClockIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="end-time" className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
                End Time *
              </label>
              <div className="relative">
                <input
                  ref={endTimeInputRef}
                  type="text"
                  id="end-time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  placeholder="10:00AM"
                  className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
                  required
                />
                <button
                  type="button"
                  onClick={() => endTimeInputRef.current?.focus()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                  aria-label="Set time"
                >
                  <ClockIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Priority Dropdown */}
          <div>
            <label htmlFor="priority" className="mb-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
              Priority *
            </label>
            <div className="relative" ref={priorityDropdownRef}>
              <button
                type="button"
                onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-left text-sm focus:outline-none focus:ring-1 focus:ring-[#F7931E] cursor-pointer flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <span className={`text-sm font-medium ${
                  formData.priority === 'High' ? 'text-red-600 dark:text-red-400' : 
                  formData.priority === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' : 
                  'text-gray-600 dark:text-gray-300'
                }`}>
                  {formData.priority}
                </span>
                <ChevronDownIcon
                  className={`h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform ${isPriorityDropdownOpen ? 'transform rotate-180' : ''}`}
                />
              </button>
              {isPriorityDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {priorityOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        handleInputChange('priority', option)
                        setIsPriorityDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                        formData.priority === option ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <span className={`font-medium ${
                        option === 'High' ? 'text-red-600 dark:text-red-400' : 
                        option === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' : 
                        'text-gray-600 dark:text-gray-300'
                      }`}>
                        {option}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto rounded-lg bg-[#F7931E] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#E8840D] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : isEditMode ? 'Update Featured Product' : 'Add Featured Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
