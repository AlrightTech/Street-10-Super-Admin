import type { BiddingProduct } from '../components/bidding/BiddingProductsTable'

// Sample data for Bidding Products - matching reference image
export const BIDDING_PRODUCTS_DATA: BiddingProduct[] = [
  {
    id: '1',
    productId: '1',
    name: 'Vintage Rolex Submariner Watch',
    category: 'Luxury Goods',
    startingPrice: '$5,000',
    currentBid: '$8,750',
    bids: 23,
    timeLeft: 'Ended 15/02/2024',
    status: 'ended-unsold',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
  },
  {
    id: '2',
    productId: '2',
    name: 'Rare Baseball Card Collection',
    category: 'Collectibles',
    startingPrice: '$200',
    currentBid: '$8,750',
    bids: 45,
    timeLeft: 'Ended 15/02/2024',
    status: 'payment-requested',
    imageUrl: 'https://images.unsplash.com/photo-1608190003443-83e60c40164e?w=100&h=100&fit=crop',
  },
  {
    id: '3',
    productId: '3',
    name: 'Original Oil Painting Landscape',
    category: 'Art',
    startingPrice: '$800',
    currentBid: '$1,250',
    bids: 45,
    timeLeft: 'Ended 15/02/2024',
    status: 'fully-paid-sold',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100&h=100&fit=crop',
  },
  {
    id: '4',
    productId: '4',
    name: 'Antique Persian Rug',
    category: 'Home Decor',
    startingPrice: '$1,200',
    currentBid: '$No bids',
    bids: 0,
    timeLeft: 'Ended 15/02/2024',
    status: 'scheduled',
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=100&h=100&fit=crop',
  },
  {
    id: '5',
    productId: '5',
    name: 'Vintage Camera Collection',
    category: 'Collectibles',
    startingPrice: '$500',
    currentBid: '$750',
    bids: 12,
    timeLeft: 'Ended 20/02/2024',
    status: 'ended-unsold',
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&h=100&fit=crop',
  },
  {
    id: '6',
    productId: '6',
    name: 'Designer Handbag Collection',
    category: 'Luxury Goods',
    startingPrice: '$2,000',
    currentBid: '$3,500',
    bids: 18,
    timeLeft: 'Ended 18/02/2024',
    status: 'payment-requested',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop',
  },
  {
    id: '7',
    productId: '7',
    name: 'Rare Coin Collection',
    category: 'Collectibles',
    startingPrice: '$1,500',
    currentBid: '$2,200',
    bids: 30,
    timeLeft: 'Ended 16/02/2024',
    status: 'fully-paid-sold',
    imageUrl: 'https://images.unsplash.com/photo-1608190003443-83e60c40164e?w=100&h=100&fit=crop',
  },
  {
    id: '8',
    productId: '8',
    name: 'Modern Art Sculpture',
    category: 'Art',
    startingPrice: '$3,000',
    currentBid: 'No bids',
    bids: 0,
    timeLeft: 'Ended 22/02/2024',
    status: 'scheduled',
    imageUrl: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=100&h=100&fit=crop',
  },
]

/**
 * Get product by ID
 */
export const getProductById = (id: string): BiddingProduct | undefined => {
  return BIDDING_PRODUCTS_DATA.find((product) => product.id === id)
}

/**
 * Get route path based on product status
 */
export const getProductDetailRoute = (product: BiddingProduct): string => {
  const statusRoutes: Record<BiddingProduct['status'], string> = {
    'ended-unsold': 'ended-unsold',
    'payment-requested': 'payment-requested',
    'fully-paid-sold': 'fully-paid-sold',
    'scheduled': 'scheduled',
  }
  
  const statusRoute = statusRoutes[product.status] || 'ended-unsold'
  return `/building-products/${product.id}/${statusRoute}`
}

