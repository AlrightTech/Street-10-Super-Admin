import { type Auction } from '../services/auctions.api'
import type { BiddingProduct } from '../components/bidding/BiddingProductsTable'

/**
 * Format price from minor units (cents) to currency string
 */
const formatPrice = (amountMinor: string | null | undefined, currency = 'QAR'): string => {
  if (!amountMinor) return 'No bids'
  const amount = parseFloat(amountMinor) / 100
  return `${amount.toLocaleString()} ${currency}`
}

/**
 * Format date to "Ended DD/MM/YYYY" or time remaining
 */
const formatTimeLeft = (endAt: string): string => {
  const endDate = new Date(endAt)
  const now = new Date()
  
  if (endDate < now) {
    // Auction ended
    const day = String(endDate.getDate()).padStart(2, '0')
    const month = String(endDate.getMonth() + 1).padStart(2, '0')
    const year = endDate.getFullYear()
    return `Ended ${day}/${month}/${year}`
  } else {
    // Time remaining
    const diff = endDate.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${days}d : ${hours}h : ${minutes}m`
  }
}

/**
 * Map backend auction state to frontend status
 */
const mapAuctionStateToStatus = (state: string): BiddingProduct['status'] => {
  switch (state) {
    case 'ended':
      return 'payment-requested' // Ended auctions show as payment requested
    case 'settled':
      return 'fully-paid-sold'
    case 'scheduled':
      return 'scheduled'
    case 'live':
      return 'live' // Live auctions show as "Live" (started)
    default:
      return 'scheduled'
  }
}

/**
 * Convert backend Auction to frontend BiddingProduct
 */
export const mapAuctionToBiddingProduct = (auction: Auction): BiddingProduct => {
  const currentBid = auction.bids && auction.bids.length > 0 
    ? formatPrice(auction.bids[0].amountMinor)
    : formatPrice(auction.reservePrice) || 'No bids'
  
  const startingPrice = formatPrice(auction.reservePrice || auction.depositAmount)
  const bidsCount = auction.bids?.length || 0
  const timeLeft = formatTimeLeft(auction.endAt)
  const status = mapAuctionStateToStatus(auction.state)
  
  // Get category from product categories or default
  const category = (auction.product as any).categories?.[0]?.category?.name || 'Uncategorized'
  
  return {
    id: auction.id, // Auction ID
    productId: auction.productId, // Product ID for deletion
    name: auction.product.title,
    category: category,
    description: auction.product.description || null,
    startingPrice: startingPrice,
    currentBid: currentBid,
    bids: bidsCount,
    timeLeft: timeLeft,
    status: status,
    imageUrl: auction.product.media?.[0]?.url || undefined,
  }
}

