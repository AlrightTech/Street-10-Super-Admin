import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { auctionsApi } from '../../services/auctions.api'
import { mapAuctionToBiddingProduct } from '../../utils/auctionMapper'
import type { BiddingProduct } from '../../components/bidding/BiddingProductsTable'
import EndedUnsoldDetail from './EndedUnsoldDetail'

export default function EndedUnsoldDetailRoute() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<BiddingProduct | null>(null)
  const [mediaUrls, setMediaUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchAuction = async () => {
      if (!id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const auction = await auctionsApi.getById(id)
        const biddingProduct = mapAuctionToBiddingProduct(auction)
        setProduct(biddingProduct)
        // Extract all media URLs from the auction product
        const media = auction.product.media || []
        const urls = media.map(m => m.url).filter(Boolean)
        setMediaUrls(urls.length > 0 ? urls : [biddingProduct.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'])
      } catch (err: any) {
        console.error('Error fetching auction:', err)
        setError(err.response?.data?.message || 'Failed to load auction')
      } finally {
        setLoading(false)
      }
    }

    fetchAuction()
  }, [id])
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#F7941D] border-r-transparent"></div>
          <p className="mt-4 text-lg font-semibold text-gray-900">Loading auction...</p>
        </div>
      </div>
    )
  }
  
  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">{error || 'Product not found'}</p>
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
  
  return <EndedUnsoldDetail product={product} mediaUrls={mediaUrls} onClose={() => navigate('/building-products')} />
}

