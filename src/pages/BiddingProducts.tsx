import { useMemo, useState } from 'react'
import { PlusIcon, CalendarIcon, ChevronDownIcon } from '../components/icons/Icons'
import BiddingProductsTable, { type BiddingProduct } from '../components/bidding/BiddingProductsTable'
import EndedUnsoldDetail from './bidding/EndedUnsoldDetail'
import PaymentRequestedDetail from './bidding/PaymentRequestedDetail'
import FullyPaidSoldDetail from './bidding/FullyPaidSoldDetail'
import ScheduledDetail from './bidding/ScheduledDetail'

// Sample data for Bidding Products
const BIDDING_PRODUCTS_DATA: BiddingProduct[] = [
  {
    id: '1',
    name: 'Vintage Rolex Submariner Watch',
    category: 'Luxury Goods',
    startingPrice: '$8,000',
    currentBid: '$8,750',
    bids: 23,
    timeLeft: 'Ended 15/02/2024',
    status: 'ended-unsold',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
  },
  {
    id: '2',
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
    name: 'Antique Persian Rug',
    category: 'Home Decor',
    startingPrice: '$1,200',
    currentBid: 'No bids',
    bids: 0,
    timeLeft: 'Ended 15/02/2024',
    status: 'scheduled',
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=100&h=100&fit=crop',
  },
  {
    id: '5',
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

const PAGE_SIZE = 4

/**
 * Bidding Products page component
 */
export default function BiddingProducts() {
  const [searchValue, setSearchValue] = useState('')
  const [sortBy] = useState('date')
  const [statusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewingProduct, setViewingProduct] = useState<BiddingProduct | null>(null)

  const filteredProducts = useMemo(() => {
    let result = [...BIDDING_PRODUCTS_DATA]

    if (searchValue.trim()) {
      const query = searchValue.toLowerCase()
      result = result.filter((product) => product.name.toLowerCase().includes(query))
    }

    if (statusFilter !== 'all') {
      result = result.filter((product) => product.status === statusFilter)
    }

    // Sort by date (for now, just return as is since we don't have actual dates)
    if (sortBy === 'date') {
      // Keep original order
    }

    return result
  }, [searchValue, statusFilter, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredProducts.slice(start, start + PAGE_SIZE)
  }, [filteredProducts, currentPage])

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const handleViewProduct = (product: BiddingProduct) => {
    setViewingProduct(product)
  }

  const handleCloseDetail = () => {
    setViewingProduct(null)
  }

  // Show detail view based on product status
  if (viewingProduct) {
    switch (viewingProduct.status) {
      case 'ended-unsold':
        return <EndedUnsoldDetail product={viewingProduct} onClose={handleCloseDetail} />
      case 'payment-requested':
        return <PaymentRequestedDetail product={viewingProduct} onClose={handleCloseDetail} />
      case 'fully-paid-sold':
        return <FullyPaidSoldDetail product={viewingProduct} onClose={handleCloseDetail} />
      case 'scheduled':
        return <ScheduledDetail product={viewingProduct} onClose={handleCloseDetail} />
      default:
        return <EndedUnsoldDetail product={viewingProduct} onClose={handleCloseDetail} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Bidding Products</h1>
        <p className="mt-1 text-sm text-gray-600">
          <span>Dashboard &gt; </span>
          <span className="text-gray-900">Bidding Products</span>
        </p>
      </div>

      {/* Manage Product Catalog Section */}
      <section className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Manage your product catalog</h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
            {/* Sort By Date Dropdown */}
            <div className="relative">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <CalendarIcon className="h-4 w-4" />
                <span>Sort By Date</span>
                <ChevronDownIcon className="h-4 w-4" />
              </button>
            </div>

            {/* All Status Dropdown */}
            <div className="relative">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <span>All Status</span>
                <ChevronDownIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-auto min-w-[180px] sm:min-w-[200px]">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by Title"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#FF8C00] focus:ring-1 focus:ring-[#FF8C00]"
              />
            </div>

            {/* Add Product Button */}
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D] whitespace-nowrap cursor-pointer"
            >
              <PlusIcon className="h-4 w-4" />
              Add Product
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-xl bg-white shadow-sm">
          <div className="px-4 py-4 sm:px-6">
            <BiddingProductsTable products={paginatedProducts} onView={handleViewProduct} />
          </div>

          {/* Pagination */}
          <footer className="flex flex-col sm:flex-row justify-end items-center gap-3 border-t border-gray-100 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Back
              </button>
              <div className="flex items-center gap-1">
                {/* Show first 3 pages */}
                {Array.from({ length: Math.min(totalPages, 3) }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`h-8 w-8 sm:h-9 sm:w-9 rounded-lg text-xs sm:text-sm font-medium transition ${
                      currentPage === page
                        ? 'bg-[#6B46C1] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                {/* Show ellipsis if there are more than 3 pages */}
                {totalPages > 3 && (
                  <span className="px-1 text-gray-600 text-sm">...</span>
                )}
                {/* Show last 2 pages if total pages > 3 */}
                {totalPages > 3 && (
                  <>
                    <button
                      type="button"
                      onClick={() => handlePageChange(totalPages - 1)}
                      className={`h-8 w-8 sm:h-9 sm:w-9 rounded-lg text-xs sm:text-sm font-medium transition ${
                        currentPage === totalPages - 1
                          ? 'bg-[#6B46C1] text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {totalPages - 1}
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePageChange(totalPages)}
                      className={`h-8 w-8 sm:h-9 sm:w-9 rounded-lg text-xs sm:text-sm font-medium transition ${
                        currentPage === totalPages
                          ? 'bg-[#6B46C1] text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </footer>
        </div>
      </section>
    </div>
  )
}
