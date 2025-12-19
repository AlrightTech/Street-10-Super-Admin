import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { XIcon } from '../components/icons/Icons'
import { auctionsApi, type Auction } from '../services/auctions.api'
import { productsApi } from '../services/products.api'
import { categoriesApi, type Category } from '../services/categories.api'
import { getProductDetailRoute } from '../utils/biddingProducts'
import type { BiddingProduct } from '../components/bidding/BiddingProductsTable'

export default function EditBiddingProduct() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [formData, setFormData] = useState({
    productTitle: '',
    categoryId: '',
    description: '',
    startingPrice: '',
    reservePrice: '',
    buyNowPrice: '',
    minIncrement: '',
    auctionStartDate: '',
    auctionEndDate: '',
    auctionStartTime: '',
    auctionEndTime: '',
    status: 'scheduled' as BiddingProduct['status'],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [auction, setAuction] = useState<Auction | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const tree = await categoriesApi.getTree()
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
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }
    fetchCategories()
  }, [])

  // Load auction and product data
  useEffect(() => {
    const loadAuction = async () => {
      if (!id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        
        const auctionData = await auctionsApi.getById(id)
        setAuction(auctionData)

        // Map auction data to form
        const product = auctionData.product
        const startDate = new Date(auctionData.startAt)
        const endDate = new Date(auctionData.endAt)
        
        setFormData({
          productTitle: product.title,
          categoryId: product.categories?.[0]?.category?.id || '',
          description: product.description || '',
          startingPrice: (parseFloat(auctionData.reservePrice || auctionData.depositAmount) / 100).toString(),
          reservePrice: auctionData.reservePrice ? (parseFloat(auctionData.reservePrice) / 100).toString() : '',
          buyNowPrice: auctionData.buyNowPrice ? (parseFloat(auctionData.buyNowPrice) / 100).toString() : '',
          minIncrement: (parseFloat(auctionData.minIncrement) / 100).toString(),
          auctionStartDate: startDate.toISOString().split('T')[0],
          auctionEndDate: endDate.toISOString().split('T')[0],
          auctionStartTime: startDate.toTimeString().slice(0, 5),
          auctionEndTime: endDate.toTimeString().slice(0, 5),
          status: mapAuctionStateToStatus(auctionData.state),
        })
      } catch (err: any) {
        console.error('Error loading auction:', err)
        setError(err.response?.data?.message || 'Failed to load auction')
      } finally {
        setIsLoading(false)
      }
    }

    loadAuction()
  }, [id])

  // Map auction state to frontend status
  const mapAuctionStateToStatus = (state: string): BiddingProduct['status'] => {
    switch (state) {
      case 'ended':
        return 'ended-unsold'
      case 'settled':
        return 'fully-paid-sold'
      case 'scheduled':
        return 'scheduled'
      case 'live':
        return 'payment-requested'
      default:
        return 'scheduled'
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!id || !auction) {
      alert('Auction ID is missing')
      setIsSubmitting(false)
      return
    }

    try {
      // Validate required fields
      if (!formData.productTitle.trim()) {
        alert('Product title is required')
        setIsSubmitting(false)
        return
      }

      if (!formData.startingPrice || parseFloat(formData.startingPrice) <= 0) {
        alert('Starting price must be greater than 0')
        setIsSubmitting(false)
        return
      }

      if (!formData.auctionStartDate || !formData.auctionEndDate) {
        alert('Auction start and end dates are required')
        setIsSubmitting(false)
        return
      }

      // Combine date and time
      const startDateTime = new Date(`${formData.auctionStartDate}T${formData.auctionStartTime || '00:00'}`)
      const endDateTime = new Date(`${formData.auctionEndDate}T${formData.auctionEndTime || '23:59'}`)

      if (startDateTime >= endDateTime) {
        alert('End date must be after start date')
        setIsSubmitting(false)
        return
      }

      // Convert prices to minor units
      const startingPriceMinor = Math.round(parseFloat(formData.startingPrice) * 100)
      const reservePriceMinor = formData.reservePrice ? Math.round(parseFloat(formData.reservePrice) * 100) : undefined
      const buyNowPriceMinor = formData.buyNowPrice ? Math.round(parseFloat(formData.buyNowPrice) * 100) : undefined
      const minIncrement = formData.minIncrement ? Math.round(parseFloat(formData.minIncrement) * 100) : Math.round(startingPriceMinor * 0.1)

      // Update product
      await productsApi.update(auction.productId, {
        title: formData.productTitle,
        description: formData.description || undefined,
        priceMinor: startingPriceMinor,
        categoryIds: formData.categoryId ? [formData.categoryId] : undefined,
      })

      // Update auction state if status changed
      const newState = formData.status === 'scheduled' ? 'scheduled' 
        : formData.status === 'ended-unsold' ? 'ended'
        : formData.status === 'fully-paid-sold' ? 'settled'
        : 'live'

      if (newState !== auction.state) {
        await auctionsApi.updateState(id, newState)
      }

      // Note: Backend doesn't currently support updating auction dates/prices
      // Only state can be updated. For full updates, a new endpoint would need to be added.

      alert('Product and auction updated successfully!')
      
      // Navigate back to the product detail page
      const route = getProductDetailRoute({
        id: id,
        name: formData.productTitle,
        category: categories.find(c => c.id === formData.categoryId)?.name || '',
        startingPrice: formData.startingPrice,
        currentBid: '',
        bids: 0,
        timeLeft: '',
        status: formData.status,
      })
      navigate(route)
    } catch (err: any) {
      console.error('Error updating product:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update product'
      setError(errorMessage)
      alert(`Error: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (id && auction) {
      const route = getProductDetailRoute({
        id: id,
        name: formData.productTitle,
        category: categories.find(c => c.id === formData.categoryId)?.name || '',
        startingPrice: formData.startingPrice,
        currentBid: '',
        bids: 0,
        timeLeft: '',
        status: formData.status,
      })
      navigate(route)
    } else {
      navigate('/building-products')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#F7941D] border-r-transparent"></div>
          <p className="mt-4 text-lg font-semibold text-gray-900">Loading auction...</p>
        </div>
      </div>
    )
  }

  if (error || !id || !auction) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">{error || 'Auction not found'}</p>
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
            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Product Title */}
            <div>
              <label htmlFor="productTitle" className="block text-sm font-medium text-gray-700 mb-2">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                id="productTitle"
                name="productTitle"
                type="text"
                required
                placeholder="Enter product title"
                value={formData.productTitle}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Enter product description"
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E] resize-none"
              />
            </div>

            {/* Starting Price */}
            <div>
              <label htmlFor="startingPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Starting Price (QAR) <span className="text-red-500">*</span>
              </label>
              <input
                id="startingPrice"
                name="startingPrice"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                value={formData.startingPrice}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Reserve Price */}
            <div>
              <label htmlFor="reservePrice" className="block text-sm font-medium text-gray-700 mb-2">
                Reserve Price (QAR)
              </label>
              <input
                id="reservePrice"
                name="reservePrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.reservePrice}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Buy Now Price */}
            <div>
              <label htmlFor="buyNowPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Buy Now Price (QAR)
              </label>
              <input
                id="buyNowPrice"
                name="buyNowPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.buyNowPrice}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Minimum Increment */}
            <div>
              <label htmlFor="minIncrement" className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Bid Increment (QAR)
              </label>
              <input
                id="minIncrement"
                name="minIncrement"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.minIncrement}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Auction Start Date */}
            <div>
              <label htmlFor="auctionStartDate" className="block text-sm font-medium text-gray-700 mb-2">
                Auction Start Date <span className="text-red-500">*</span>
              </label>
              <input
                id="auctionStartDate"
                name="auctionStartDate"
                type="date"
                required
                value={formData.auctionStartDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Auction End Date */}
            <div>
              <label htmlFor="auctionEndDate" className="block text-sm font-medium text-gray-700 mb-2">
                Auction End Date <span className="text-red-500">*</span>
              </label>
              <input
                id="auctionEndDate"
                name="auctionEndDate"
                type="date"
                required
                value={formData.auctionEndDate}
                onChange={handleChange}
                min={formData.auctionStartDate}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Auction Start Time */}
            <div>
              <label htmlFor="auctionStartTime" className="block text-sm font-medium text-gray-700 mb-2">
                Auction Start Time
              </label>
              <input
                id="auctionStartTime"
                name="auctionStartTime"
                type="time"
                value={formData.auctionStartTime}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
              />
            </div>

            {/* Auction End Time */}
            <div>
              <label htmlFor="auctionEndTime" className="block text-sm font-medium text-gray-700 mb-2">
                Auction End Time
              </label>
              <input
                id="auctionEndTime"
                name="auctionEndTime"
                type="time"
                value={formData.auctionEndTime}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
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

