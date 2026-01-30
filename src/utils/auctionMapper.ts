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
  // Current bid: Use currentBid from backend if available (for live auctions with highest bid)
  // Otherwise, find highest bid from bids array, or show "No bids"
  let currentBid: string
  if ((auction as any).currentBid?.amountMinor) {
    // Use currentBid from backend (highest bid for live auctions)
    currentBid = formatPrice((auction as any).currentBid.amountMinor)
  } else if (auction.bids && auction.bids.length > 0) {
    // Find highest bid from bids array (sorted by amount descending)
    const highestBid = auction.bids.reduce((highest: any, bid: any) => 
      parseFloat(bid.amountMinor) > parseFloat(highest.amountMinor) ? bid : highest
    )
    currentBid = formatPrice(highestBid.amountMinor)
  } else {
    // No bids yet
    currentBid = 'No bids'
  }
  
  // Starting price: reservePrice OR product.priceMinor (from backend startingPrice field)
  const startingPrice = formatPrice((auction as any).startingPrice || auction.reservePrice || auction.product?.priceMinor)
  // Use bidCount from backend if available, otherwise use bids array length
  const bidsCount = (auction as any).bidCount !== undefined ? (auction as any).bidCount : (auction.bids?.length || 0)
  const timeLeft = formatTimeLeft(auction.endAt)
  
  // Determine status based on auction state, reserve price, and order status
  let status = mapAuctionStateToStatus(auction.state)
  
  if (auction.state === 'ended') {
    // Use reservePriceMet from backend if available (more reliable than recalculating)
    const reservePriceMet = (auction as any).reservePriceMet !== undefined 
      ? (auction as any).reservePriceMet 
      : (() => {
          // Fallback: calculate from bids if reservePriceMet not provided
          const highestBid = auction.bids && auction.bids.length > 0
            ? auction.bids.reduce((highest: any, bid: any) => 
                parseFloat(bid.amountMinor) > parseFloat(highest.amountMinor) ? bid : highest
              )
            : null
          const bidAmount = highestBid ? parseFloat(highestBid.amountMinor) : 0
          const reserveAmount = auction.reservePrice ? parseFloat(auction.reservePrice) : 0
          return reserveAmount === 0 || bidAmount >= reserveAmount
        })()
    
    // If reserve price exists and wasn't met, it's unsold
    if (!reservePriceMet) {
      status = 'ended-unsold'
    } else {
      // Reserve price met (or no reserve) - check order status
      const order = (auction as any).order
      if (order) {
        // If order status is 'paid', it's fully-paid-sold
        // Otherwise, it's payment-requested
        status = order.status === 'paid' ? 'fully-paid-sold' : 'payment-requested'
      } else {
        // Ended with winner but no order yet (shouldn't happen, but handle it)
        status = 'payment-requested'
      }
    }
  } else if (auction.state === 'settled') {
    // Settled auctions should check order status
    // Note: Auctions now stay as ENDED until order is paid, but handle settled for backward compatibility
    const order = (auction as any).order
    status = order && order.status === 'paid' ? 'fully-paid-sold' : 'payment-requested'
  }
  
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
    endAt: auction.endAt, // Include endAt for live countdown
  }
}

