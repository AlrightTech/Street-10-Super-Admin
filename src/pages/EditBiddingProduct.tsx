import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { XIcon } from '../components/icons/Icons'
import { getProductById } from '../utils/biddingProducts'
import type { BiddingProduct } from '../components/bidding/BiddingProductsTable'

export default function EditBiddingProduct() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    startingPrice: '',
    imageUrl: '',
    currentBid: '',
    bids: 0,
    timeLeft: '',
    status: 'scheduled' as BiddingProduct['status'],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load product data when component mounts
    if (id) {
      const product = getProductById(id)
      if (product) {
        setFormData({
          name: product.name,
          category: product.category,
          startingPrice: product.startingPrice,
          imageUrl: product.imageUrl || '',
          currentBid: product.currentBid,
          bids: product.bids,
          timeLeft: product.timeLeft,
          status: product.status,
        })
      }
      setIsLoading(false)
    }
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Implement API call to update product
      console.log('Updating product:', id, formData)
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Navigate back to the product detail page after success
      const route = `/building-products/${id}/${formData.status}`
      navigate(route)
    } catch (error) {
      console.error('Error updating product:', error)
      // Handle error (show error message, etc.)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    // Navigate back to the product detail page
    if (id) {
      const product = getProductById(id)
      if (product) {
        const route = `/building-products/${id}/${product.status}`
        navigate(route)
      } else {
        navigate('/building-products')
      }
    } else {
      navigate('/building-products')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">Loading...</p>
        </div>
      </div>
    )
  }

  if (!id || !getProductById(id)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">Product not found</p>
          <button
            onClick={() => navigate('/building-products')}
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D]"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Bidding Product</h1>
        <p className="mt-1 text-sm text-gray-700">
          <span>Dashboard</span>
          <span className="mx-1">:</span>
          <span>Bidding Products</span>
          <span className="mx-1">:</span>
          <span className="text-gray-900">Edit Product</span>
        </p>
      </div>

      {/* Form Card */}
      <section className="rounded-xl bg-white shadow-sm border border-gray-200">
        <div className="px-4 sm:px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                id="category"
                name="category"
                type="text"
                required
                placeholder="Enter category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Starting Price */}
            <div>
              <label htmlFor="startingPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Starting Price <span className="text-red-500">*</span>
              </label>
              <input
                id="startingPrice"
                name="startingPrice"
                type="text"
                required
                placeholder="Enter starting price (e.g., $5,000)"
                value={formData.startingPrice}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Current Bid */}
            <div>
              <label htmlFor="currentBid" className="block text-sm font-medium text-gray-700 mb-2">
                Current Bid
              </label>
              <input
                id="currentBid"
                name="currentBid"
                type="text"
                placeholder="Enter current bid (e.g., $8,750 or No bids)"
                value={formData.currentBid}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Number of Bids */}
            <div>
              <label htmlFor="bids" className="block text-sm font-medium text-gray-700 mb-2">
                Number of Bids
              </label>
              <input
                id="bids"
                name="bids"
                type="number"
                min="0"
                placeholder="Enter number of bids"
                value={formData.bids}
                onChange={(e) => setFormData((prev) => ({ ...prev, bids: parseInt(e.target.value) || 0 }))}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Time Left */}
            <div>
              <label htmlFor="timeLeft" className="block text-sm font-medium text-gray-700 mb-2">
                Time Left
              </label>
              <input
                id="timeLeft"
                name="timeLeft"
                type="text"
                placeholder="Enter time left (e.g., Ended 15/02/2024)"
                value={formData.timeLeft}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                required
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              >
                <option value="scheduled">Scheduled</option>
                <option value="ended-unsold">Ended - Unsold</option>
                <option value="payment-requested">Payment Requested</option>
                <option value="fully-paid-sold">Fully Paid - Sold</option>
              </select>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                placeholder="Enter image URL"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 whitespace-nowrap cursor-pointer"
              >
                <XIcon className="h-4 w-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
              >
                {isSubmitting ? 'Updating...' : 'Update Product'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

