import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CalendarIcon, ClockIcon, EditIcon } from '../components/icons/Icons'
import MarketingStatusBadge from '../components/marketing/MarketingStatusBadge'
import { featuredProductsApi } from '../services/featured-products.api'

// Helper function to format date from ISO string to "DD MMM YYYY"
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

// Helper function to format time from ISO string to "HH:MM AM/PM"
const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12
  return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`
}

export default function ProductActiveDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return

      setIsLoading(true)
      setError(null)

      try {
        const featuredProduct = await featuredProductsApi.getById(id)
        setProduct(featuredProduct)
      } catch (err: any) {
        console.error('Error fetching featured product:', err)
        setError(err.response?.data?.message || 'Failed to load featured product')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600 dark:text-gray-400">Loading product details...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-600 dark:text-red-400">{error || 'Product not found'}</p>
      </div>
    )
  }

  const handleEdit = () => {
    navigate(`/marketing/edit-product/${id}`)
  }

  const handleCreateNew = () => {
    navigate('/marketing/add-product')
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

      {/* Product Detail Section */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Product Detail</h2>

        <div className="rounded-xl bg-white dark:bg-gray-800 shadow-sm p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Product Status */}
            <div className="flex items-center gap-2">
              <MarketingStatusBadge status={product.status} />
            </div>

            {/* Product Name */}
            <div>
              <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">{product.product.title}</p>
              {product.product.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{product.product.description}</p>
              )}
            </div>

            {/* Product Details - Two Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Vendor</span>
                </div>
                <div className="pl-0">
                  <span className="text-sm text-gray-900 dark:text-gray-100">Super Admin</span>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <CalendarIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Start Date</span>
                </div>
                <div className="pl-6">
                  <span className="text-sm text-gray-900 dark:text-gray-100">{formatDate(product.startDate)}</span>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <ClockIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Start Time</span>
                </div>
                <div className="pl-6">
                  <span className="text-sm text-gray-900 dark:text-gray-100">{formatTime(product.startDate)}</span>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <CalendarIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">End Date</span>
                </div>
                <div className="pl-6">
                  <span className="text-sm text-gray-900 dark:text-gray-100">{formatDate(product.endDate)}</span>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <ClockIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">End Time</span>
                </div>
                <div className="pl-6">
                  <span className="text-sm text-gray-900 dark:text-gray-100">{formatTime(product.endDate)}</span>
                </div>
              </div>

              {/* Right Column - Category & Priority */}
              <div className="space-y-4 flex gap-8">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Category</span>
                  <div className="mt-2">
                    {product.product.categories && product.product.categories.length > 0 && product.product.categories[0]?.category ? (
                      <span className="inline-flex items-center rounded-md px-3 py-1 text-xs font-medium bg-purple-600 text-white">
                        {product.product.categories[0].category.name}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md px-3 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        Uncategorized
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Priority</span>
                  <div className="mt-2">
                    <span className={`inline-flex items-center rounded-md px-3 py-1 text-xs font-medium ${
                      product.priority === 'high' ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 
                      product.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400' : 
                      'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}>
                      {product.priority === 'high' ? 'High' : product.priority === 'medium' ? 'Medium' : 'Low'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCreateNew}
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white dark:border-gray-800 bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D] whitespace-nowrap w-full sm:w-auto cursor-pointer"
              >
                Create New Product
              </button>
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D] whitespace-nowrap w-full sm:w-auto cursor-pointer"
              >
                <EditIcon className="h-4 w-4" />
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
