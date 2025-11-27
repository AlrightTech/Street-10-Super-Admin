import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CalendarIcon, ChevronDownIcon } from '../components/icons/Icons'
import { type Product } from '../components/marketing/ProductsTable'
import { type MarketingStatus } from '../components/marketing/MarketingStatusBadge'

interface ProductFormData {
  product: string
  vendor: string
  category: string
  startDate: string
  endDate: string
  priority: 'High' | 'Medium' | 'Low'
  status: MarketingStatus
}

// Mock data - in a real app, this would come from an API
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    product: 'Flash Sale',
    vendor: 'Vendor',
    category: 'Promo',
    startDate: 'Immediate',
    endDate: 'Immediate',
    priority: 'High',
    status: 'active',
  },
  {
    id: '2',
    product: 'Payment Reminder',
    vendor: 'User',
    category: 'Reminder',
    startDate: 'Dec 22, 2024',
    endDate: 'Dec 22, 2024',
    priority: 'Medium',
    status: 'expired',
  },
  {
    id: '3',
    product: 'System Maintenance',
    vendor: 'User',
    category: '$100',
    startDate: 'Immediate',
    endDate: 'Immediate',
    priority: 'Low',
    status: 'active',
  },
  {
    id: '4',
    product: 'Flash Sale',
    vendor: 'Vendor',
    category: 'Info',
    startDate: 'Dec 22, 2024',
    endDate: 'Dec 22, 2024',
    priority: 'High',
    status: 'scheduled',
  },
]

// Helper function to convert date from "Dec 22, 2024" to "2024-12-22"
const convertDateToInputFormat = (dateStr: string): string => {
  if (dateStr === 'Immediate') return ''
  const months: { [key: string]: string } = {
    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
    'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
    'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
  }
  const parts = dateStr.split(' ')
  if (parts.length === 3) {
    const day = parts[1].replace(',', '').padStart(2, '0')
    const month = months[parts[0]] || '01'
    const year = parts[2]
    return `${year}-${month}-${day}`
  }
  return dateStr
}

// Helper function to convert date from "2024-12-22" to "Dec 22, 2024"
const convertDateFromInputFormat = (dateStr: string): string => {
  if (!dateStr) return 'Immediate'
  const months: { [key: string]: string } = {
    '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
    '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
    '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
  }
  const parts = dateStr.split('-')
  if (parts.length === 3) {
    const year = parts[0]
    const month = months[parts[1]] || 'Jan'
    const day = parts[2]
    return `${month} ${day}, ${year}`
  }
  return dateStr
}

export default function AddProduct() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEditMode = !!id
  const startDateInputRef = useRef<HTMLInputElement>(null)
  const endDateInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<ProductFormData>({
    product: '',
    vendor: 'Vendor',
    category: '',
    startDate: '',
    endDate: '',
    priority: 'High',
    status: 'active',
  })

  const [isImmediateStart, setIsImmediateStart] = useState(false)
  const [isImmediateEnd, setIsImmediateEnd] = useState(false)

  // Custom dropdown states
  const [isVendorDropdownOpen, setIsVendorDropdownOpen] = useState(false)
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)

  // Refs for click-outside detection
  const vendorDropdownRef = useRef<HTMLDivElement>(null)
  const categoryDropdownRef = useRef<HTMLDivElement>(null)
  const priorityDropdownRef = useRef<HTMLDivElement>(null)
  const statusDropdownRef = useRef<HTMLDivElement>(null)

  // Load product data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const product = MOCK_PRODUCTS.find((p) => p.id === id)
      if (product) {
        const startIsImmediate = product.startDate === 'Immediate'
        const endIsImmediate = product.endDate === 'Immediate'
        
        setIsImmediateStart(startIsImmediate)
        setIsImmediateEnd(endIsImmediate)

        setFormData({
          product: product.product || '',
          vendor: product.vendor || 'Vendor',
          category: product.category || '',
          startDate: startIsImmediate ? '' : convertDateToInputFormat(product.startDate),
          endDate: endIsImmediate ? '' : convertDateToInputFormat(product.endDate),
          priority: product.priority || 'High',
          status: product.status || 'active',
        })
      }
    }
  }, [id, isEditMode])

  // Click-outside detection for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (vendorDropdownRef.current && !vendorDropdownRef.current.contains(event.target as Node)) {
        setIsVendorDropdownOpen(false)
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false)
      }
      if (priorityDropdownRef.current && !priorityDropdownRef.current.contains(event.target as Node)) {
        setIsPriorityDropdownOpen(false)
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleInputChange = (field: keyof ProductFormData, value: string | 'High' | 'Medium' | 'Low' | MarketingStatus) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImmediateStartChange = (checked: boolean) => {
    setIsImmediateStart(checked)
    if (checked) {
      setFormData((prev) => ({ ...prev, startDate: '' }))
    }
  }

  const handleImmediateEndChange = (checked: boolean) => {
    setIsImmediateEnd(checked)
    if (checked) {
      setFormData((prev) => ({ ...prev, endDate: '' }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    // eslint-disable-next-line no-console
    console.log('Form submitted:', {
      ...formData,
      startDate: isImmediateStart ? 'Immediate' : convertDateFromInputFormat(formData.startDate),
      endDate: isImmediateEnd ? 'Immediate' : convertDateFromInputFormat(formData.endDate),
    })
    // Add your save logic here
    // After saving, navigate back to marketing page
    navigate('/marketing')
  }

  const handleCancel = () => {
    navigate('/marketing')
  }

  const vendorOptions = ['Vendor', 'User']
  const categoryOptions = ['Promo', 'Reminder', 'Info', '$100', 'Category A', 'Category B']
  const priorityOptions: ('High' | 'Medium' | 'Low')[] = ['High', 'Medium', 'Low']
  const statusOptions: MarketingStatus[] = ['active', 'scheduled', 'expired']

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Marketing</h1>
        <p className="text-sm text-gray-600 mt-1">Dashboard - Finance</p>
      </div>

      {/* Main Navigation Bar */}
      <nav className="flex flex-wrap items-center gap-1 sm:gap-2 md:gap-4 border-b border-gray-200 overflow-x-auto pt-3 pb-1">
        <button
          type="button"
          onClick={() => navigate('/marketing')}
          className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap text-gray-600 hover:text-gray-900"
        >
          Story Highlight
        </button>
        <button
          type="button"
          onClick={() => navigate('/marketing')}
          className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap text-gray-600 hover:text-gray-900"
        >
          Banners
        </button>
        <button
          type="button"
          onClick={() => navigate('/marketing')}
          className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap text-gray-600 hover:text-gray-900"
        >
          Pop-Up
        </button>
        <button
          type="button"
          onClick={() => navigate('/marketing')}
          className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap text-gray-600 hover:text-gray-900"
        >
          Push Notifications
        </button>
        <button
          type="button"
          onClick={() => navigate('/marketing')}
          className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap text-[#F7931E] border-b-2 border-[#F7931E]"
        >
          Product
        </button>
      </nav>

      {/* Section Title */}
      <h2 className="text-lg sm:text-xl font-bold text-gray-900">{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>

      {/* Form Container */}
      <div className="rounded-xl bg-white shadow-sm p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="product" className="mb-2 block text-sm font-normal text-gray-500">
              Product Name
            </label>
            <input
              type="text"
              id="product"
              value={formData.product}
              onChange={(e) => handleInputChange('product', e.target.value)}
              placeholder="Enter Product Name"
              className="w-full rounded-lg bg-gray-100 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E]"
              required
            />
          </div>

          {/* Vendor Dropdown */}
          <div>
            <label htmlFor="vendor" className="mb-2 block text-sm font-normal text-gray-500">
              Vendor
            </label>
            <div className="relative" ref={vendorDropdownRef}>
              <button
                type="button"
                onClick={() => setIsVendorDropdownOpen(!isVendorDropdownOpen)}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-100 text-left text-sm focus:outline-none focus:ring-1 focus:ring-[#F7931E] cursor-pointer flex items-center justify-between hover:bg-gray-200 transition-colors"
              >
                <span className="text-gray-900">{formData.vendor}</span>
                <ChevronDownIcon
                  className={`h-5 w-5 text-gray-400 transition-transform ${isVendorDropdownOpen ? 'transform rotate-180' : ''}`}
                />
              </button>
              {isVendorDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {vendorOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        handleInputChange('vendor', option)
                        setIsVendorDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                        formData.vendor === option ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label htmlFor="category" className="mb-2 block text-sm font-normal text-gray-500">
              Category
            </label>
            <div className="relative" ref={categoryDropdownRef}>
              <button
                type="button"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-100 text-left text-sm focus:outline-none focus:ring-1 focus:ring-[#F7931E] cursor-pointer flex items-center justify-between hover:bg-gray-200 transition-colors"
              >
                <span className="text-gray-900">{formData.category || 'Select Category'}</span>
                <ChevronDownIcon
                  className={`h-5 w-5 text-gray-400 transition-transform ${isCategoryDropdownOpen ? 'transform rotate-180' : ''}`}
                />
              </button>
              {isCategoryDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {categoryOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        handleInputChange('category', option)
                        setIsCategoryDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                        formData.category === option ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start-date" className="mb-2 block text-sm font-normal text-gray-500">
                Start Date
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isImmediateStart}
                    onChange={(e) => handleImmediateStartChange(e.target.checked)}
                    className="rounded border-gray-300 text-[#F7931E] focus:ring-[#F7931E] cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">Immediate</span>
                </label>
                {!isImmediateStart && (
                  <div className="relative">
                    <input
                      ref={startDateInputRef}
                      type="date"
                      id="start-date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="w-full rounded-lg bg-gray-100 px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E] [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      style={{ WebkitAppearance: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => startDateInputRef.current?.showPicker?.()}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-gray-600 cursor-pointer"
                      aria-label="Open calendar"
                    >
                      <CalendarIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="end-date" className="mb-2 block text-sm font-normal text-gray-500">
                End Date
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isImmediateEnd}
                    onChange={(e) => handleImmediateEndChange(e.target.checked)}
                    className="rounded border-gray-300 text-[#F7931E] focus:ring-[#F7931E] cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">Immediate</span>
                </label>
                {!isImmediateEnd && (
                  <div className="relative">
                    <input
                      ref={endDateInputRef}
                      type="date"
                      id="end-date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className="w-full rounded-lg bg-gray-100 px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F7931E] [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      style={{ WebkitAppearance: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => endDateInputRef.current?.showPicker?.()}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-gray-600 cursor-pointer"
                      aria-label="Open calendar"
                    >
                      <CalendarIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Priority Dropdown */}
          <div>
            <label htmlFor="priority" className="mb-2 block text-sm font-normal text-gray-500">
              Priority
            </label>
            <div className="relative" ref={priorityDropdownRef}>
              <button
                type="button"
                onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-100 text-left text-sm focus:outline-none focus:ring-1 focus:ring-[#F7931E] cursor-pointer flex items-center justify-between hover:bg-gray-200 transition-colors"
              >
                <span className={`text-sm font-medium ${
                  formData.priority === 'High' ? 'text-red-600' : 
                  formData.priority === 'Medium' ? 'text-yellow-600' : 
                  'text-gray-600'
                }`}>
                  {formData.priority}
                </span>
                <ChevronDownIcon
                  className={`h-5 w-5 text-gray-400 transition-transform ${isPriorityDropdownOpen ? 'transform rotate-180' : ''}`}
                />
              </button>
              {isPriorityDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {priorityOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        handleInputChange('priority', option)
                        setIsPriorityDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                        formData.priority === option ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      <span className={`font-medium ${
                        option === 'High' ? 'text-red-600' : 
                        option === 'Medium' ? 'text-yellow-600' : 
                        'text-gray-600'
                      }`}>
                        {option}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Status Dropdown */}
          <div>
            <label htmlFor="status" className="mb-2 block text-sm font-normal text-gray-500">
              Status
            </label>
            <div className="relative" ref={statusDropdownRef}>
              <button
                type="button"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-100 text-left text-sm focus:outline-none focus:ring-1 focus:ring-[#F7931E] cursor-pointer flex items-center justify-between hover:bg-gray-200 transition-colors"
              >
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: formData.status === 'active' ? '#DCF6E5' : formData.status === 'scheduled' ? '#FFF2D6' : '#FFE4DE',
                    color: formData.status === 'active' ? '#118D57' : formData.status === 'scheduled' ? '#B76E00' : '#B71D18',
                  }}
                >
                  {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                </span>
                <ChevronDownIcon
                  className={`h-5 w-5 text-gray-400 transition-transform ${isStatusDropdownOpen ? 'transform rotate-180' : ''}`}
                />
              </button>
              {isStatusDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {statusOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        handleInputChange('status', option)
                        setIsStatusDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                        formData.status === option ? 'bg-blue-50' : ''
                      }`}
                    >
                      <span
                        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: option === 'active' ? '#DCF6E5' : option === 'scheduled' ? '#FFF2D6' : '#FFE4DE',
                          color: option === 'active' ? '#118D57' : option === 'scheduled' ? '#B76E00' : '#B71D18',
                        }}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
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
              className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto rounded-lg bg-[#F7931E] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#E8840D] cursor-pointer"
            >
              {isEditMode ? 'Update' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

