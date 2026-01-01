import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { BiddingProduct } from '../../components/bidding/BiddingProductsTable'
import { auctionsApi, type Auction } from '../../services/auctions.api'
import { productsApi } from '../../services/products.api'

interface LiveDetailProps {
  product: BiddingProduct
  auction: Auction | null // Full auction data for timeline and bidding history
  mediaUrls?: string[] // All product media URLs
  onClose: () => void
}

interface BidHistoryItem {
  id: string
  bidderName: string
  bidderEmail: string
  status: string
  date: string
  time: string
  amount: string
  isWinning?: boolean
}

/**
 * Live (Started) Auction Detail page
 */
export default function LiveDetail({ product, auction, mediaUrls, onClose: _onClose }: LiveDetailProps) {
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(0)
  const [bids, setBids] = useState<any[]>([])
  const [loadingBids, setLoadingBids] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [statusError, setStatusError] = useState<string | null>(null)

  // Fetch bids if auction is available
  useEffect(() => {
    if (auction?.id) {
      const fetchBids = async () => {
        try {
          setLoadingBids(true)
          const bidsData = await auctionsApi.getBids(auction.id, 1, 50)
          setBids(bidsData.bids || [])
        } catch (error) {
          console.error('Error fetching bids:', error)
          // Use bids from auction object if available
          if (auction.bids) {
            setBids(auction.bids)
          }
        } finally {
          setLoadingBids(false)
        }
      }
      fetchBids()
    } else if (auction?.bids) {
      // Use bids from auction object if available
      setBids(auction.bids)
    }
  }, [auction])

  // Extract product attributes (if available)
  const attributes = (auction?.product as any)?.attributes || {}
  const condition = attributes?.condition || 'N/A'
  const dimensions = attributes?.dimensions || 'N/A'
  const weight = attributes?.weight || 'N/A'

  // Format price helper
  const formatPrice = (priceMinor: string | null | undefined, currency: string = 'QAR') => {
    if (!priceMinor) return 'N/A'
    const amount = parseFloat(priceMinor) / 100
    return `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // Format date helper (DD/MM/YYYY)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Format time helper (HH:MM:SS)
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  // Calculate duration in days
  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const durationMs = end.getTime() - start.getTime()
    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24))
    return `${durationDays} Day${durationDays !== 1 ? 's' : ''}`
  }

  // Get winning bid (highest bid)
  const winningBid = bids.find(bid => bid.isWinning) || bids[0]
  const currentHighestBid = winningBid ? formatPrice(winningBid.amountMinor, auction?.product?.currency || 'QAR') : 'No bids yet'

  // Format bids for display
  const formattedBids: BidHistoryItem[] = bids.map((bid) => {
    return {
      id: bid.id,
      bidderName: bid.user?.name || bid.user?.email?.split('@')[0] || 'Unknown',
      bidderEmail: bid.user?.email || 'N/A',
      status: bid.isWinning ? 'Winning' : 'Bidding',
      date: formatDate(bid.placedAt),
      time: formatTime(bid.placedAt),
      amount: formatPrice(bid.amountMinor, auction?.product?.currency || 'QAR'),
      isWinning: bid.isWinning,
    }
  })

  const handleEditProduct = () => {
    navigate(`/building-products/${product.id}/edit`)
  }

  const handlePauseAuction = async () => {
    if (!window.confirm('Are you sure you want to pause this auction? The auction will be paused and removed from the website.')) {
      return
    }

    try {
      setIsProcessing(true)
      setStatusError(null)
      setStatusMessage(null)

      await auctionsApi.pause(product.id)
      
      setStatusMessage('Auction paused successfully!')
      
      // Navigate back to products list after a short delay
      setTimeout(() => {
        navigate('/building-products')
      }, 1500)
    } catch (error: any) {
      console.error('Error pausing auction:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to pause auction'
      setStatusError(errorMessage)
      alert(`Error: ${errorMessage}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleEndAuction = async () => {
    if (!window.confirm('Are you sure you want to end this auction now? This will change the status to Payment Requested.')) {
      return
    }

    try {
      setIsProcessing(true)
      setStatusError(null)
      setStatusMessage(null)

      // Update auction to ENDED state and set endAt to current time
      await auctionsApi.update(product.id, {
        state: 'ended',
        endAt: new Date().toISOString(),
      })
      
      setStatusMessage('Auction ended successfully!')
      
      // Navigate back to products list after a short delay
      setTimeout(() => {
        navigate('/building-products')
      }, 1500)
    } catch (error: any) {
      console.error('Error ending auction:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to end auction'
      setStatusError(errorMessage)
      alert(`Error: ${errorMessage}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancelAuction = async () => {
    const reason = window.prompt('Are you sure you want to cancel this auction? Please provide a reason (optional):')
    if (reason === null) {
      return // User cancelled
    }

    try {
      setIsProcessing(true)
      setStatusError(null)
      setStatusMessage(null)

      await auctionsApi.cancel(product.id, reason || undefined)
      
      setStatusMessage('Auction cancelled successfully!')
      
      // Navigate back to products list after a short delay
      setTimeout(() => {
        navigate('/building-products')
      }, 1500)
    } catch (error: any) {
      console.error('Error cancelling auction:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to cancel auction'
      setStatusError(errorMessage)
      alert(`Error: ${errorMessage}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"? This will delete the product and its auction. This action cannot be undone.`)) {
      return
    }

    try {
      setIsProcessing(true)
      setStatusError(null)
      setStatusMessage(null)

      await productsApi.delete(product.productId)
      
      setStatusMessage('Product deleted successfully!')
      
      // Navigate back to products list after a short delay
      setTimeout(() => {
        navigate('/building-products')
      }, 1500)
    } catch (error: any) {
      console.error('Error deleting product:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete product'
      setStatusError(errorMessage)
      alert(`Error: ${errorMessage}`)
    } finally {
      setIsProcessing(false)
    }
  }
  
  // Use provided mediaUrls or fallback to single imageUrl, or placeholder
  const productImages = mediaUrls && mediaUrls.length > 0 
    ? mediaUrls 
    : product.imageUrl 
      ? [product.imageUrl]
      : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop']

  // Calculate time remaining until end
  const getTimeRemaining = () => {
    if (!auction?.endAt) return 'N/A'
    const endDate = new Date(auction.endAt)
    const now = new Date()
    const diff = endDate.getTime() - now.getTime()
    
    if (diff <= 0) return 'Ended'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${days}d : ${hours}h : ${minutes}m`
  }

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
            <span className="text-gray-900">View Product</span>
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
          <p className="mt-1 text-sm text-gray-600">Manage auction item and bidding activity</p>
        </div>
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Product Information and Bidding History */}
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
                      {product.description || 'No description available.'}
                    </p>
                  </div>

                  {/* Product Specifications */}
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Condition:</span>
                      <span className="text-sm font-medium text-gray-900 capitalize">{condition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Dimensions:</span>
                      <span className="text-sm font-medium text-gray-900">{dimensions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Weight:</span>
                      <span className="text-sm font-medium text-gray-900">{weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Starting Price:</span>
                      <span className="text-sm font-medium text-gray-900">{product.startingPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Reserve Price:</span>
                      <span className="text-sm font-medium text-blue-600">
                        {auction?.reservePrice ? formatPrice(auction.reservePrice, auction?.product?.currency || 'QAR') : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* YouTube Review Section */}
            <div className="rounded-md bg-gray-100 p-4">
              <div className="flex items-center gap-3">
                {/* Orange PDF Icon */}
                <div className="flex items-center justify-center w-7 h-7 bg-[#F7931E] rounded">
                  <span className="text-white text-[10px] font-bold">PDF</span>
                </div>
                <span className="text-sm font-medium text-gray-900 underline">YouTube review</span>
                {/* Red Eye Icon */}
                <button className="ml-auto text-red-600 hover:text-red-700">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Bidding History Section */}
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <h3 className="text-lg font-bold text-gray-900">Bidding History</h3>
                <span className="text-sm text-gray-600">{bids.length} total bid{bids.length !== 1 ? 's' : ''}</span>
              </div>

              {loadingBids ? (
                <div className="text-center py-8">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-[#F7941D] border-r-transparent"></div>
                  <p className="mt-2 text-sm text-gray-600">Loading bids...</p>
                </div>
              ) : formattedBids.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-600">No bids yet</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {formattedBids.map((bid) => (
                  <div key={bid.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{bid.bidderName}</p>
                        <p className="text-xs text-gray-500 truncate">{bid.bidderEmail}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <div className="text-sm font-medium text-gray-900">{bid.amount}</div>
                      <div className="flex items-center gap-2">
                        {bid.isWinning ? (
                          <span className="inline-flex items-center rounded px-2 py-1 text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">
                            {bid.status}
                          </span>
                        ) : (
                          <>
                            <span className="text-xs text-gray-600 hidden sm:inline">{bid.status} {bid.date}, {bid.time}</span>
                            <span className="text-xs text-gray-600 sm:hidden">{bid.status} {bid.date}</span>
                            <span className="inline-flex items-center rounded px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 whitespace-nowrap">
                              Bidding
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-green-600 hover:text-green-700" aria-label="Approve">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button className="text-gray-400 hover:text-gray-600" aria-label="Reject">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => navigate(`/building-products/${product.id}/history`)}
                  className="inline-flex items-center justify-center rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D] cursor-pointer w-full sm:w-auto"
                >
                  View All History
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Auction Status and Actions */}
          <div className="space-y-4 sm:space-y-6">
            {/* Current Auction Status Card */}
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Current Auction Status</h3>
              
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-2xl font-bold text-[#118D57] mb-2">{currentHighestBid}</p>
                  <p className="text-sm text-gray-500">Current Highest Bid</p>
                </div>

                <div className="bg-blue-600 text-white rounded-lg p-4">
                  <p className="text-sm font-medium mb-1">Auction Live</p>
                  <p className="text-xs text-gray-200">Time Remaining: {getTimeRemaining()}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-gray-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">{bids.length}</p>
                    <p className="text-xs font-medium text-gray-700">Total Bids</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">-</p>
                    <p className="text-xs font-medium text-gray-700">Watches</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">-</p>
                    <p className="text-xs font-medium text-gray-700">Shares</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">-</p>
                    <p className="text-xs font-medium text-gray-700">Saved</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Actions Card */}
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Admin Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full inline-flex items-center justify-center rounded-lg bg-[#118D57] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0F7A4A] cursor-pointer">
                  Approve All Bids
                </button>
                <button 
                  onClick={handlePauseAuction}
                  disabled={isProcessing}
                  className="w-full inline-flex items-center justify-center rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Pause Auction'}
                </button>
                <button 
                  onClick={handleEndAuction}
                  disabled={isProcessing}
                  className="w-full inline-flex items-center justify-center rounded-lg bg-[#B71D18] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#9A1814] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'End Auction Now'}
                </button>
                <button 
                  onClick={handleCancelAuction}
                  disabled={isProcessing}
                  className="w-full inline-flex items-center justify-center rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Cancel Auction'}
                </button>
                <button 
                  onClick={handleDeleteProduct}
                  disabled={isProcessing}
                  className="w-full inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Delete Product'}
                </button>
              </div>
            </div>

            {/* Auction Timeline Card */}
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Auction Timeline</h3>
              
              {auction?.startAt && auction?.endAt ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Start Date:</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(auction.startAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">End Date:</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(auction.endAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Duration:</span>
                    <span className="text-sm font-medium text-gray-900">{calculateDuration(auction.startAt, auction.endAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Starting Time:</span>
                    <span className="text-sm font-medium text-gray-900">{formatTime(auction.startAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">End Time:</span>
                    <span className="text-sm font-medium text-gray-900">{formatTime(auction.endAt)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600">Timeline data not available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

