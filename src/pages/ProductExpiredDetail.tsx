import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CalendarIcon, EditIcon } from '../components/icons/Icons'
import { type Product } from '../components/marketing/ProductsTable'
import MarketingStatusBadge from '../components/marketing/MarketingStatusBadge'

// Mock data - in a real app, this would come from an API
const MOCK_PRODUCTS: Product[] = [
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
    id: '6',
    product: 'Flash Sale',
    vendor: 'User',
    category: 'Reminder',
    startDate: 'Immediate',
    endDate: 'Immediate',
    priority: 'High',
    status: 'expired',
  },
]

export default function ProductExpiredDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (id) {
      const found = MOCK_PRODUCTS.find((p) => p.id === id && p.status === 'expired')
      if (found) {
        setProduct(found)
      } else {
        // Fallback to default expired data
        setProduct(MOCK_PRODUCTS[0])
      }
    }
  }, [id])

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Loading product details...</p>
      </div>
    )
  }

  const productData = {
    id: product.id,
    product: product.product || 'Payment Reminder',
    vendor: product.vendor || 'User',
    category: product.category || 'Reminder',
    startDate: product.startDate || 'Dec 22, 2024',
    endDate: product.endDate || 'Dec 22, 2024',
    priority: product.priority || 'Medium',
    status: product.status || 'expired',
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

      {/* Product Detail Section */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Product Detail</h2>

        <div className="rounded-xl bg-white shadow-sm p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Product Status */}
            <div className="flex items-center gap-2">
              <MarketingStatusBadge status={productData.status} />
            </div>

            {/* Product Name */}
            <div>
              <p className="text-base sm:text-lg font-bold text-gray-900">{productData.product}</p>
            </div>

            {/* Product Details - Two Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Vendor</span>
                </div>
                <div className="pl-0">
                  <span className="text-sm text-gray-900">{productData.vendor}</span>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <CalendarIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-500">Start Date</span>
                </div>
                <div className="pl-6">
                  <span className="text-sm text-gray-900">{productData.startDate}</span>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <CalendarIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-500">End Date</span>
                </div>
                <div className="pl-6">
                  <span className="text-sm text-gray-900">{productData.endDate}</span>
                </div>
              </div>

              {/* Right Column - Category & Priority */}
              <div className="space-y-4 flex gap-8">
                <div>
                  <span className="text-sm text-gray-500">Category</span>
                  <div className="mt-2">
                    <span className="inline-flex items-center rounded-md px-3 py-1 text-xs font-medium bg-purple-600 text-white">
                      {productData.category}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Priority</span>
                  <div className="mt-2">
                    <span className={`inline-flex items-center rounded-md px-3 py-1 text-xs font-medium ${
                      productData.priority === 'High' ? 'bg-red-100 text-red-600' : 
                      productData.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {productData.priority}
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
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D] whitespace-nowrap w-full sm:w-auto cursor-pointer"
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

