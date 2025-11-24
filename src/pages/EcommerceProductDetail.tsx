import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { EyeIcon, XIcon, CalendarIcon } from '../components/icons/Icons'
import SelectDropdown from '../components/ui/SelectDropdown'

interface EcommerceProductDetail {
  id: string
  name: string
  category: string
  description: string
  images: string[]
  condition: string
  brand: string
  regularPrice: number
  salePrice: number
  stockQuantity: number
  productSlug: string
  weight: string
  dimensions: string
  metaTitle: string
  metaDescription: string
  videoUrl?: string
  performance: {
    totalViews: number
    totalOrders: number
    revenue: number
    conversionRate: number
    totalSaved: number
    totalShared: number
  }
}

export default function EcommerceProductDetail() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<EcommerceProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false)
  const [promoteData, setPromoteData] = useState({
    startDate: '',
    endDate: '',
    priority: '1',
  })

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true)
      try {
        // Simulate API call - replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        
        // Mock data - replace with actual API response
        const mockProduct: EcommerceProductDetail = {
          id: productId || '1',
          name: 'Apple AirPods Pro (2nd Generation)',
          category: 'Electronics',
          description: 'Experience next-level sound with the Apple AirPods Pro (2nd generation) Featuring personalized Spatial Audio, longer battery life, and the Apple H2 chip for a magical listening experience.',
          images: [
            'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
          ],
          condition: 'Excellent',
          brand: 'Apple',
          regularPrice: 249.99,
          salePrice: 199.99,
          stockQuantity: 45,
          productSlug: 'apple-airpods-pro-2nd-generation',
          weight: '0.056 kg',
          dimensions: '3.05 x 2.18 x 2.40 cm',
          metaTitle: 'Apple AirPods Pro 2nd Gen - Premium Wireless Earbuds',
          metaDescription: 'Shop Apple AirPods Pro 2nd Generation with personalized Spatial Audio, Active Noise Cancellation, and up to 6 hours of listening time.',
          videoUrl: 'https://www.youtube.com/watch?v=example',
          performance: {
            totalViews: 1234,
            totalOrders: 89,
            revenue: 17791,
            conversionRate: 7.2,
            totalSaved: 44,
            totalShared: 900,
          },
        }
        
        setProduct(mockProduct)
      } catch (error) {
        console.error('Error loading product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      loadProduct()
    }
  }, [productId])

  const handleEdit = () => {
    if (productId) {
      navigate(`/ecommerce-products/${productId}/edit`)
    }
  }

  const handleDelete = () => {
    const confirmed = window.confirm(`Are you sure you want to delete "${product?.name}"? This action cannot be undone.`)
    if (confirmed) {
      console.log('Delete product:', productId)
      // Add API call here
      navigate('/ecommerce-products')
    }
  }

  const handlePromote = () => {
    setIsPromoteModalOpen(true)
  }

  const handleClosePromoteModal = useCallback(() => {
    setIsPromoteModalOpen(false)
    setPromoteData({
      startDate: '',
      endDate: '',
      priority: '1',
    })
  }, [])

  const handlePromoteSubmit = async () => {
    if (!promoteData.startDate || !promoteData.endDate || !promoteData.priority) {
      alert('Please fill in all fields')
      return
    }

    try {
      console.log('Promoting product:', productId, promoteData)
      // Add API call here
      // await promoteProduct(productId, promoteData)
      alert('Product promoted successfully!')
      handleClosePromoteModal()
    } catch (error) {
      console.error('Error promoting product:', error)
      alert('Failed to promote product. Please try again.')
    }
  }

  const priorityOptions = Array.from({ length: 10 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1}/10`,
  }))

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPromoteModalOpen) {
        handleClosePromoteModal()
      }
    }

    if (isPromoteModalOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isPromoteModalOpen, handleClosePromoteModal])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Loading product details...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Product not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">E-commerce Products</h1>
        <p className="mt-1 text-sm text-gray-600">Dashboard : View Product</p>
      </div>

      {/* Main Content */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">E-commerce Products Detail</h2>
            <p className="mt-1 text-sm text-gray-600">Manage auction item and bidding activity</p>
          </div>
          <button
            type="button"
            onClick={handlePromote}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E8840D] cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Promote</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Product Images and Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Images */}
            <div className=''>
              <div className="mb-4">
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-70 h-70 object-cover rounded-lg"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
                      selectedImageIndex === index ? 'border-[#F7931E]' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Information */}
            <div className="">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-600">Category: {product.category}</p>
              </div>

              <div>
                <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {product.videoUrl && (
                <div>
                  <a
                    href={product.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer underline"
                  >
                    Watch Video
                  </a>
                </div>
              )}

              {/* Product Specifications */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600 w-32">Condition:</span>
                  <span className="text-sm text-gray-900">{product.condition}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600 w-32">Brand:</span>
                  <span className="text-sm text-gray-900">{product.brand}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600 w-32">Regular Price:</span>
                  <span className="text-sm text-gray-500 line-through">${product.regularPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600 w-32">Sale Price:</span>
                  <span className="text-sm font-semibold text-green-600">${product.salePrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600 w-32">Stock Quantity:</span>
                  <span className="text-sm text-gray-900">{product.stockQuantity}</span>
                </div>
              </div>

              {/* Product Slug */}
              <div>
                <span className="text-sm font-medium text-gray-600">Product Slug: </span>
                <span className="text-sm text-gray-900">{product.productSlug}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Admin Actions and Performance */}
          <div className="space-y-6">
            {/* Admin Actions */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-base font-semibold text-gray-900">Admin Actions</h3>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="w-full rounded-lg bg-[#F7931E] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#E8840D] cursor-pointer"
                >
                  Edit Product
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer"
                >
                  Delete Product
                </button>
              </div>
            </div>

            {/* Performance */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-base font-semibold text-gray-900">Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Views:</span>
                  <span className="text-sm font-medium text-gray-900">{product.performance.totalViews.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Orders:</span>
                  <span className="text-sm font-medium text-gray-900">{product.performance.totalOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Revenue:</span>
                  <span className="text-sm font-medium text-gray-900">${product.performance.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Conversion Rate:</span>
                  <span className="text-sm font-medium text-gray-900">{product.performance.conversionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Saved:</span>
                  <span className="text-sm font-medium text-gray-900">{product.performance.totalSaved}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Shared:</span>
                  <span className="text-sm font-medium text-gray-900">{product.performance.totalShared}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* YouTube Review Section */}
        <div className="mt-6 rounded-md bg-gray-100 p-4">
          <div className="flex items-center gap-3">
            <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span className="text-sm font-medium text-gray-900 underline">YouTube review</span>
            <EyeIcon className="h-4 w-4 text-red-600 ml-auto" />
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 space-y-4">
          <h3 className="text-base font-semibold text-gray-900">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-600">Weight: </span>
              <span className="text-sm text-gray-900">{product.weight}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Dimensions: </span>
              <span className="text-sm text-gray-900">{product.dimensions}</span>
            </div>
          </div>
        </div>

        {/* SEO & Marketing */}
        <div className="mt-6 space-y-4">
          <h3 className="text-base font-semibold text-gray-900">SEO & Marketing</h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-600">Meta Title: </span>
              <span className="text-sm text-gray-900">{product.metaTitle}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Meta Description: </span>
              <span className="text-sm text-gray-900">{product.metaDescription}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Promote Product Modal */}
      {isPromoteModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleClosePromoteModal}
        >
          <div 
            className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative flex items-center justify-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Promote Product</h3>
              <button
                type="button"
                onClick={handleClosePromoteModal}
                className="absolute right-6 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-normal text-gray-400 mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={promoteData.startDate}
                    onChange={(e) => setPromoteData({ ...promoteData, startDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F3F5F6] border-0 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F7931E] cursor-pointer"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-normal text-gray-400 mb-2">
                  End date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={promoteData.endDate}
                    onChange={(e) => setPromoteData({ ...promoteData, endDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F3F5F6] border-0 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F7931E] cursor-pointer"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-normal text-gray-400 mb-2">
                  Priority
                </label>
                <SelectDropdown
                  value={promoteData.priority}
                  options={priorityOptions}
                  onChange={(value) => setPromoteData({ ...promoteData, priority: value })}
                  className="w-full"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handlePromoteSubmit}
                className="w-full rounded-lg bg-[#F7931E] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#E8840D] cursor-pointer"
              >
                Promote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

