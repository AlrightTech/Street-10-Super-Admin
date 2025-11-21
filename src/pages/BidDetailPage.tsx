import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import BidderInfoCard from '../components/bids/BidderInfoCard'
import ProductInfoCard from '../components/bids/ProductInfoCard'
import BidTimeline from '../components/bids/BidTimeline'
import { getBidDetails } from '../data/mockBidDetails'
import type { BidDetails } from '../types/bidDetails'

/**
 * Bid Detail page component
 */
export default function BidDetailPage() {
  const { bidId } = useParams<{ bidId: string }>()
  const [bid, setBid] = useState<BidDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBid = async () => {
      setLoading(true)
      if (bidId) {
        const bidData = getBidDetails(bidId)
        if (bidData) {
          setBid(bidData)
        }
      }
      setLoading(false)
    }

    loadBid()
  }, [bidId])

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

