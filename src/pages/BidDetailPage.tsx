import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import BidderInfoCard from '../components/bids/BidderInfoCard'
import ProductInfoCard from '../components/bids/ProductInfoCard'
import BidTimeline from '../components/bids/BidTimeline'
import { bidsApi } from '../services/bids.api'
import type { BidDetails } from '../types/bidDetails'

/**
 * Bid Detail page component
 */
export default function BidDetailPage() {
  const { bidId } = useParams<{ bidId: string }>()
  const navigate = useNavigate()
  const [bid, setBid] = useState<BidDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBid = async () => {
      setLoading(true)
      let bidIdToFetch: string | null = null

      if (bidId) {
        try {
          // Check if bidId is a UUID (contains hyphens)
          const isUuid = bidId.includes("-") && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(bidId)

          console.log("Processing bid ID:", { bidId, isUuid })

          if (isUuid) {
            // It's already a UUID, use it directly
            bidIdToFetch = bidId
            console.log("Using UUID directly:", bidIdToFetch)
          } else {
            // Numeric ID or other format - try to find by fetching all bids
            console.log("Non-UUID detected, fetching bids to find UUID...", bidId)
            try {
              const bidsResult = await bidsApi.getAll({
                page: 1,
                limit: 1000,
              })

              if (!bidsResult.data || bidsResult.data.length === 0) {
                throw new Error("No bids found in the system")
              }

              // Try to find bid by numeric ID conversion or direct match
              const numericId = /^\d+$/.test(bidId) ? parseInt(bidId) : null
              const matchingBid = bidsResult.data.find((bid: any) => {
                if (bid.id === bidId) return true
                if (numericId) {
                  const bidNumericId = parseInt(bid.id.replace(/-/g, "").substring(0, 10), 16) % 1000000
                  return bidNumericId === numericId
                }
                return false
              })

              if (!matchingBid) {
                throw new Error(`Bid with ID ${bidId} not found. The bid may not exist.`)
              }

              bidIdToFetch = matchingBid.id
              console.log(`Successfully found bid: ${bidId} -> UUID: ${bidIdToFetch}`)
            } catch (error: any) {
              console.error("Error finding bid:", error)
              throw new Error(`Failed to find bid: ${error?.message || "Unknown error"}`)
            }
          }

          // Fetch bid details using UUID
          const apiBid = await bidsApi.getById(bidIdToFetch)
          
          // Transform API response to frontend format
          const bidData = apiBid.bid as any
          const auctionData = bidData.auction as any
          const productData = auctionData?.product || {}
          // amountMinor is now a string from the API, not BigInt
          const reservePriceValue = auctionData?.reservePrice || productData?.priceMinor || "0"
          
          // Get all bids to find highest
          // amountMinor is now a string from the API
          const highestBid = apiBid.allBids?.reduce((max: any, b: any) => {
            const maxAmount = parseFloat(typeof max.amountMinor === 'string' ? max.amountMinor : max.amountMinor?.toString() || '0')
            const bidAmount = parseFloat(typeof b.amountMinor === 'string' ? b.amountMinor : b.amountMinor?.toString() || '0')
            return bidAmount > maxAmount ? b : max
          }, { amountMinor: '0' }) || bidData
          
          const transformedBid: BidDetails = {
            id: bidData.id,
            bidId: bidData.id,
            auctionId: bidData.auctionId,
            auctionName: productData.title || 'Auction',
            categoryName: productData.categories?.[0]?.category?.name || 'Category',
            startingPrice: parseFloat(typeof reservePriceValue === 'string' ? reservePriceValue : reservePriceValue?.toString() || '0') / 100,
            finalBidAmount: parseFloat(typeof bidData.amountMinor === 'string' ? bidData.amountMinor : bidData.amountMinor?.toString() || '0') / 100,
            status: bidData.isWinning ? 'winning' : 'lost',
            bidDate: new Date(bidData.placedAt).toLocaleDateString(),
            bidTime: new Date(bidData.placedAt).toLocaleTimeString(),
            bidder: {
              id: parseInt(bidData.user.id.replace(/-/g, '').substring(0, 10), 16) % 1000000,
              name: bidData.user.email?.split('@')[0] || 'Bidder',
              email: bidData.user.email || '',
              phone: bidData.user.phone || undefined,
              avatar: '',
            },
            product: {
              id: productData.id || '',
              name: productData.title || 'Product',
              image: productData.media?.[0]?.url || '',
              category: productData.categories?.[0]?.category?.name || 'Category',
              condition: 'New',
              description: productData.description || '',
              startingPrice: parseFloat(typeof reservePriceValue === 'string' ? reservePriceValue : reservePriceValue?.toString() || '0') / 100,
              reservePrice: parseFloat(typeof reservePriceValue === 'string' ? reservePriceValue : reservePriceValue?.toString() || '0') / 100,
              currentHighestBid: parseFloat(
                typeof highestBid.amountMinor === 'string' 
                  ? highestBid.amountMinor 
                  : highestBid.amountMinor?.toString() || 
                typeof bidData.amountMinor === 'string'
                  ? bidData.amountMinor
                  : bidData.amountMinor?.toString() || '0'
              ) / 100,
              auctionStatus: auctionData?.state === 'live' ? 'ongoing' : 
                            auctionData?.state === 'ended' ? 'completed' : 'cancelled',
            },
            timeline: (apiBid.timeline || []).map((bidItem: any) => ({
              id: bidItem.id,
              amount: parseFloat(typeof bidItem.amountMinor === 'string' ? bidItem.amountMinor : bidItem.amountMinor?.toString() || '0') / 100,
              status: bidItem.isWinning ? 'winning' : 'outbid',
              date: new Date(bidItem.placedAt).toLocaleDateString(),
              time: new Date(bidItem.placedAt).toLocaleTimeString(),
            })),
          }
          
          setBid(transformedBid)
        } catch (error: any) {
          console.error('Error loading bid details:', error)
          console.error('Error details:', {
            message: error?.message,
            response: error?.response?.data,
            status: error?.response?.status,
            bidId,
            bidIdToFetch,
            stack: error?.stack,
          })

          // Show user-friendly error message based on error type
          let errorMessage = 'Failed to load bid details'
          
          if (error?.response?.status === 404) {
            errorMessage = `Bid with ID ${bidId} not found. Please check if the bid exists.`
          } else if (error?.response?.status === 500) {
            errorMessage = `Server error while loading bid details. This might be a BigInt serialization issue. Please check backend logs.`
            console.error('Backend 500 error - likely BigInt serialization issue')
          } else if (error?.response?.status === 401) {
            errorMessage = `Unauthorized. Please log in again.`
          } else if (error?.message) {
            errorMessage = `Failed to load bid details: ${error.message}`
          } else {
            errorMessage = `Failed to load bid details: Unknown error occurred.`
          }

          alert(errorMessage)
          navigate('/bidding')
        }
      }
      setLoading(false)
    }

    loadBid()
  }, [bidId, navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Loading bid details...</p>
      </div>
    )
  }

  if (!bid) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Bid not found</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-hidden">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Users</h1>
        <p className="mb-4 text-sm text-gray-600">Dashboard • Bid View</p>
      </div>

      {/* Bid Details Container */}
      <div className="rounded-lg bg-white p-4 sm:p-6 space-y-6 overflow-x-hidden">
        {/* Bid Detail Header */}
        <div>
          <h2 className="text-xl font-bold text-gray-900">Bid Detail</h2>
          <p className="text-sm text-gray-600">{bid.bidDate} at {bid.bidTime}</p>
        </div>

        {/* Bidder Information Card with Bid Summary */}
        <BidderInfoCard bid={bid} />

        {/* Product Information Card */}
        <ProductInfoCard product={bid.product} />

        {/* Bid Timeline */}
        <BidTimeline timeline={bid.timeline} />
      </div>
    </div>
  )
}

