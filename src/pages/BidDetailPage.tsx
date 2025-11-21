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
      if (bidId) {
        try {
          const apiBid = await bidsApi.getById(bidId)
          
          // Transform API response to frontend format
          const bidData = apiBid.bid as any
          const auctionData = bidData.auction as any
          const productData = auctionData?.product || {}
          const reservePriceValue = auctionData?.reservePrice || productData?.priceMinor || BigInt(0)
          
          // Get all bids to find highest
          const highestBid = apiBid.allBids?.reduce((max: any, b: any) => {
            const maxAmount = parseFloat(max.amountMinor?.toString() || '0')
            const bidAmount = parseFloat(b.amountMinor?.toString() || '0')
            return bidAmount > maxAmount ? b : max
          }, { amountMinor: '0' }) || bidData
          
          const transformedBid: BidDetails = {
            id: bidData.id,
            bidId: bidData.id,
            auctionId: bidData.auctionId,
            auctionName: productData.title || 'Auction',
            categoryName: productData.categories?.[0]?.category?.name || 'Category',
            startingPrice: parseFloat(reservePriceValue?.toString() || '0') / 100,
            finalBidAmount: parseFloat(bidData.amountMinor?.toString() || '0') / 100,
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
              startingPrice: parseFloat(reservePriceValue?.toString() || '0') / 100,
              reservePrice: parseFloat(reservePriceValue?.toString() || '0') / 100,
              currentHighestBid: parseFloat(highestBid.amountMinor?.toString() || bidData.amountMinor?.toString() || '0') / 100,
              auctionStatus: auctionData?.state === 'live' ? 'ongoing' : 
                            auctionData?.state === 'ended' ? 'completed' : 'cancelled',
            },
            timeline: (apiBid.timeline || []).map((bidItem: any) => ({
              id: bidItem.id,
              amount: parseFloat(bidItem.amountMinor?.toString() || '0') / 100,
              status: bidItem.isWinning ? 'winning' : 'outbid',
              date: new Date(bidItem.placedAt).toLocaleDateString(),
              time: new Date(bidItem.placedAt).toLocaleTimeString(),
            })),
          }
          
          setBid(transformedBid)
        } catch (error) {
          console.error('Error loading bid details:', error)
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

