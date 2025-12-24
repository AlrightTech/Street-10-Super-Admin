import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { BiddingProduct } from '../../components/bidding/BiddingProductsTable'
import { auctionsApi } from '../../services/auctions.api'

interface ScheduledDetailProps {
  product: BiddingProduct
  mediaUrls?: string[] // All product media URLs
  onClose: () => void
  onAuctionStarted?: () => void // Callback to refresh parent list
}

/**
 * Scheduled Product Detail page
 */
export default function ScheduledDetail({ product, mediaUrls, onClose: _onClose, onAuctionStarted }: ScheduledDetailProps) {
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(0)
  const [isStarting, setIsStarting] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [statusError, setStatusError] = useState<string | null>(null)

  const handleEditProduct = () => {
    navigate(`/building-products/${product.id}/edit`)
  }

  const handleEditSchedule = () => {
    // Navigate to edit page with schedule focus
    navigate(`/building-products/${product.id}/edit`)
  }

  const handleStartAuction = async () => {
    if (!window.confirm('Are you sure you want to start this auction now? This will change the status from Scheduled to Live.')) {
      return
    }

    try {
      setIsStarting(true)
      setStatusError(null)
      setStatusMessage(null)

      // Call API to update auction state to "live"
      await auctionsApi.updateState(product.id, 'live')
      
      setStatusMessage('Auction started successfully! The auction is now live.')
      
      // Call callback to refresh parent list if provided
      if (onAuctionStarted) {
        onAuctionStarted()
      }
      
      // Navigate back to products list after a short delay
      setTimeout(() => {
        navigate('/building-products')
      }, 1500)
    } catch (error: any) {
      console.error('Error starting auction:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to start auction'
      setStatusError(errorMessage)
      alert(`Error: ${errorMessage}`)
    } finally {
      setIsStarting(false)
    }
  }

  const handleStartAuctionNow = () => {
    handleStartAuction()
  }

  const handleCancelAuction = () => {
    if (window.confirm('Are you sure you want to cancel this auction? This action cannot be undone.')) {
      // In a real app, this would make an API call to cancel the auction
      console.log('Cancelling auction for product:', product.id)
      alert('Auction cancelled successfully!')
      navigate('/building-products')
    }
  }

  const handleDeleteProduct = () => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      // In a real app, this would make an API call to delete the product
      console.log('Deleting product:', product.id)
      alert('Product deleted successfully!')
      navigate('/building-products')
    }
  }

  const handleYouTubeReview = () => {
    // Open YouTube review link (mock URL)
    window.open('https://www.youtube.com/watch?v=example', '_blank')
  }

  const handleViewPDF = () => {
    // Open PDF document (mock URL)
    window.open('https://example.com/review.pdf', '_blank')
  }

  // Use provided mediaUrls or fallback to single imageUrl, or placeholder
  const productImages = mediaUrls && mediaUrls.length > 0 
    ? mediaUrls 
    : product.imageUrl 
      ? [product.imageUrl]
      : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop']

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Status Messages */}
      {statusMessage && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4">
          <p className="text-sm font-medium text-green-800">{statusMessage}</p>
        </div>
      )}
      {statusError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm font-medium text-red-800">{statusError}</p>
        </div>
      )}

      {/* Top Header Section - Outside white card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Bidding Products</h1>
          <p className="mt-1 text-sm text-gray-700">
            <span>Dashboard</span>
            <span className="mx-1">:</span>
            <span className="text-gray-900">Bidding Products</span>
          </p>
        </div>
        <button
          onClick={handleEditProduct}
          className="inline-flex items-center justify-center rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D] cursor-pointer w-full sm:w-auto"
        >
          Edit Product
        </button>
      </div>

      {/* Main Content with Single White Background */}
      <div className="rounded-xl bg-white shadow-sm p-4 sm:p-6">
        {/* Header inside card */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Bidding Product Detail</h2>
          <p className="mt-1 text-sm text-gray-600">Manage auction item and schedule</p>
        </div>
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Product Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Detail Card */}
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Product Images */}
                <div className="space-y-4">
                  {/* Main Image */}
                  <div>
                    <img
                      src={productImages[selectedImage]}
                      alt={product.name}
                      className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-lg"
                    />
                  </div>
                  {/* Thumbnail Images */}
                  {productImages.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 sm:gap-3">
                      {productImages.slice(0, 4).map((img, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSelectedImage(index)}
                          className={`h-16 sm:h-20 w-full rounded-lg overflow-hidden border-2 transition ${
                            selectedImage === index ? 'border-[#F7931E]' : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Information */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-4">{product.category}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      A 1960 vintage Rolex Submariner watch from 1975 in excellent condition. This timepiece features the iconic black dial with luminous markers, unidirectional rotating bezel, and automatic movement. The watch has been serviced and comes with original box and papers. A true collector's item with historical significance and timeless appeal.
                    </p>
                  </div>

                  {/* Product Specifications */}
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Condition:</span>
                      <span className="text-sm font-medium text-gray-900">Excellent</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Dimensions:</span>
                      <span className="text-sm font-medium text-gray-900">46mm case diameter</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Weight:</span>
                      <span className="text-sm font-medium text-gray-900">155 grams</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Starting Price:</span>
                      <span className="text-sm font-medium text-gray-900">{product.startingPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Reserve Price:</span>
                      <span className="text-sm font-medium text-blue-600">$7,500</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* YouTube Review Section */}
            <div className="rounded-md bg-gray-100 p-4">
              <div className="flex items-center gap-3">
                {/* Orange PDF Icon */}
                <button
                  onClick={handleViewPDF}
                  className="flex items-center justify-center w-7 h-7 bg-[#F7931E] rounded cursor-pointer hover:bg-[#E8840D] transition-colors"
                >
                  <span className="text-white text-[10px] font-bold">PDF</span>
                </button>
                <button
                  onClick={handleYouTubeReview}
                  className="text-sm font-medium text-gray-900 underline cursor-pointer hover:text-[#F7931E] transition-colors"
                >
                  YouTube review
                </button>
                {/* Red Eye Icon */}
                <button
                  onClick={handleYouTubeReview}
                  className="ml-auto text-red-600 hover:text-red-700 cursor-pointer"
                  aria-label="View YouTube review"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Bidding History Section - Empty for scheduled products */}
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <h3 className="text-lg font-bold text-gray-900">Bidding History</h3>
                <span className="text-sm text-gray-600">0 total bids</span>
              </div>

              <div className="text-center py-8">
                <p className="text-sm text-gray-500">No bids yet. Bidding will start when the auction begins.</p>
              </div>
            </div>
          </div>

          {/* Right Column - Auction Status and Actions */}
          <div className="space-y-4 sm:space-y-6">
            {/* Current Auction Status Card */}
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Current Auction Status</h3>
              
              <div className="space-y-4">
                <div className="bg-[#118D57] text-white rounded-lg p-4">
                  <p className="text-sm font-medium mb-1">Scheduled</p>
                  <p className="text-xs text-gray-200">Auction Status</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-2xl font-bold text-gray-900 mb-2">{product.startingPrice}</p>
                  <p className="text-sm text-gray-500">Starting Price</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-gray-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">0</p>
                    <p className="text-xs font-medium text-gray-700">Total Bids</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">0</p>
                    <p className="text-xs font-medium text-gray-700">Bidders</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">0</p>
                    <p className="text-xs font-medium text-gray-700">Matches</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">0</p>
                    <p className="text-xs font-medium text-gray-700">Saved</p>
                  </div>
                </div>

                <button
                  onClick={handleStartAuctionNow}
                  disabled={isStarting}
                  className="w-full inline-flex items-center justify-center rounded-lg bg-[#118D57] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0F7A4A] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isStarting ? 'Starting...' : 'Start Auction Now'}
                </button>
              </div>
            </div>

            {/* Admin Actions Card */}
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Admin Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={handleEditSchedule}
                  className="w-full inline-flex items-center justify-center rounded-lg bg-[#118D57] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0F7A4A] cursor-pointer"
                >
                  Edit Schedule
                </button>
                <button
                  onClick={handleStartAuction}
                  disabled={isStarting}
                  className="w-full inline-flex items-center justify-center rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isStarting ? 'Starting...' : 'Start Auction'}
                </button>
                <button
                  onClick={handleCancelAuction}
                  className="w-full inline-flex items-center justify-center rounded-lg bg-[#B71D18] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#9A1914] cursor-pointer"
                >
                  Cancel Auction
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="w-full inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer"
                >
                  Delete Product
                </button>
              </div>
            </div>

            {/* Auction Timeline Card */}
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Auction Timeline</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Scheduled Start:</span>
                  <span className="text-sm font-medium text-gray-900">{product.timeLeft}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Scheduled End:</span>
                  <span className="text-sm font-medium text-gray-900">TBD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Duration:</span>
                  <span className="text-sm font-medium text-gray-900">18 Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Starting Time:</span>
                  <span className="text-sm font-medium text-gray-900">03:30:45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">End Time:</span>
                  <span className="text-sm font-medium text-gray-900">06:45:10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
