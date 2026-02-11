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
 * @deprecated This function is currently unused
 */
// const mapAuctionStateToStatus = (state: string): BiddingProduct['status'] => {
//   switch (state) {
//     case 'ended':
//       return 'payment-requested' // Ended auctions show as payment requested
//     case 'settled':
//       return 'fully-paid-sold'
//     case 'scheduled':
//       return 'scheduled'
//     case 'live':
//       return 'live' // Live auctions show as "Live" (started)
//     default:
//       return 'scheduled'
//   }
// }

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
  // Also check time to ensure status is correct even if backend state hasn't updated yet
  const now = new Date()
  const startDate = new Date(auction.startAt)
  const endDate = new Date(auction.endAt)
  let effectiveState = auction.state
  
  // Override state based on time if backend hasn't updated yet
  if (effectiveState === 'scheduled' && now >= startDate) {
    effectiveState = 'live' // Should be live if start time passed
  }
  if (effectiveState === 'live' && now >= endDate) {
    effectiveState = 'ended' // Should be ended if end time passed
  }
  
  let status: BiddingProduct['status'] = 'scheduled' // Default
  
  if (effectiveState === 'live') {
    status = 'live'
  } else if (effectiveState === 'scheduled') {
    status = 'scheduled'
  } else if (effectiveState === 'ended') {
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
      // Reserve price met (or no reserve) - check order payment stage
      const order = (auction as any).order
      if (order && order.paymentStage) {
        // Use new payment stage logic - prioritize paymentStage over old status
        switch (order.paymentStage) {
          case 'down_payment_required':
            status = 'down-payment-required'
            break
          case 'final_payment_required':
            status = 'final-payment-required'
            break
          case 'full_payment_required':
            status = 'full-payment-required'
            break
          case 'fully_paid':
            status = 'fully-paid-sold'
            break
          case 'settlement_missed':
            status = 'settlement-missed'
            break
          default:
            // Default to down-payment-required for ended auctions with order (new flow)
            status = 'down-payment-required'
        }
      } else if (order) {
        // Order exists but no paymentStage - check order.status (backward compatibility)
        // If order.status is 'down_payment_paid', it means down payment was paid, so show final payment required
        if (order.status === 'down_payment_paid') {
          status = 'final-payment-required'
        } else if (order.status === 'paid') {
          status = 'fully-paid-sold'
        } else {
          status = 'down-payment-required'
        }
      } else {
        // Ended with winner but no order yet - settlement might be in progress
        // Show as down-payment-required (will be updated when order is created)
        status = 'down-payment-required'
      }
    }
  } else if (auction.state === 'settled') {
    // Settled auctions - check order payment stage
    const order = (auction as any).order
    if (order?.paymentStage === 'fully_paid') {
      status = 'fully-paid-sold'
    } else {
      status = order && order.status === 'paid' ? 'fully-paid-sold' : 'fully-paid-sold'
    }
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

