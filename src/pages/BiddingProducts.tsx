import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarIcon } from '../components/icons/Icons'
import FilterDropdown from '../components/finance/FilterDropdown'
import SearchBar from '../components/ui/SearchBar'
import BiddingProductsTable, { type BiddingProduct } from '../components/bidding/BiddingProductsTable'
import { getProductDetailRoute } from '../utils/biddingProducts'
import { auctionsApi } from '../services/auctions.api'
import { productsApi } from '../services/products.api'
import { mapAuctionToBiddingProduct } from '../utils/auctionMapper'

// Unused - keeping for reference
/*
const BIDDING_PRODUCTS_DATA_OLD: BiddingProduct[] = [
  {
    id: '1',
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
    currentBid: '$No bids',
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
*/

const PAGE_SIZE = 20

/**
 * Bidding Products page component
 */
export default function BiddingProducts() {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [sortBy, setSortBy] = useState('Sort By Date')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [auctions, setAuctions] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)

  // Fetch auctions from API
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Map frontend status filter to backend state
        let stateFilter: string | undefined
        if (statusFilter !== 'All Status') {
          const statusMap: Record<string, string> = {
            'Ended - Unsold': 'ended',
            'Payment Requested': 'ended', // Payment requested = ended auctions
            'Live': 'live', // Live auctions
            'Fully Paid - Sold': 'settled',
            'Scheduled': 'scheduled',
          }
          stateFilter = statusMap[statusFilter]
        }

        const response = await auctionsApi.getAll({
          state: stateFilter,
          page: currentPage,
          limit: PAGE_SIZE,
        })

        setAuctions(response.data || [])
        setTotalPages(response.pagination?.totalPages || 1)
      } catch (err: any) {
        console.error('Error fetching auctions:', err)
        setError(err.response?.data?.message || 'Failed to fetch auctions')
        setAuctions([])
      } finally {
        setLoading(false)
      }
    }

    fetchAuctions()
  }, [currentPage, statusFilter])

  // Parse date from timeLeft string (e.g., "Ended 15/02/2024")
  const parseDate = (timeLeft: string): Date => {
    const match = timeLeft.match(/(\d{2})\/(\d{2})\/(\d{4})/)
    if (match) {
      const [, day, month, year] = match
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    }
    return new Date(0) // Default to epoch if parsing fails
  }

  const filteredProducts = useMemo(() => {
    // Convert auctions to bidding products
    let result = auctions.map(mapAuctionToBiddingProduct)

    // Filter by search value
    if (searchValue.trim()) {
      const query = searchValue.toLowerCase()
      result = result.filter((product) => product.name.toLowerCase().includes(query))
    }

    // Filter by status
    if (statusFilter !== 'All Status') {
      const statusMap: Record<string, string> = {
        'Ended - Unsold': 'ended-unsold',
        'Payment Requested': 'payment-requested',
        'Fully Paid - Sold': 'fully-paid-sold',
        'Scheduled': 'scheduled',
      }
      const statusValue = statusMap[statusFilter]
      if (statusValue) {
        result = result.filter((product) => product.status === statusValue)
      }
    }

    // Sort by date
    if (sortBy === 'Newest First') {
      result.sort((a, b) => {
        const dateA = parseDate(a.timeLeft)
        const dateB = parseDate(b.timeLeft)
        return dateB.getTime() - dateA.getTime()
      })
    } else if (sortBy === 'Oldest First') {
      result.sort((a, b) => {
        const dateA = parseDate(a.timeLeft)
        const dateB = parseDate(b.timeLeft)
        return dateA.getTime() - dateB.getTime()
      })
    }

    return result
  }, [auctions, searchValue, sortBy])

  const paginatedProducts = useMemo(() => {
    // Products are already paginated from API, but we apply search/sort client-side
    return filteredProducts
  }, [filteredProducts])

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    
    if (totalPages <= 8) {
      // Show all pages if 8 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      if (currentPage > 3) {
        pages.push('...')
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i)
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...')
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const handleViewProduct = (product: BiddingProduct) => {
    const route = getProductDetailRoute(product)
    navigate(route)
  }

  const handleDeleteProduct = async (product: BiddingProduct) => {
    // Show confirmation dialog
    const confirmed = window.confirm(`Are you sure you want to delete "${product.name}"? This will delete the product and its auction. This action cannot be undone.`)
    if (!confirmed) return

    try {
      // Delete the product (this will cascade delete the auction)
      await productsApi.delete(product.productId)
      alert('Product and auction deleted successfully!')
      
      // Refresh the auctions list
      const fetchAuctions = async () => {
        try {
          setLoading(true)
          setError(null)
          
          let stateFilter: string | undefined
          if (statusFilter !== 'All Status') {
            const statusMap: Record<string, string> = {
              'Ended - Unsold': 'ended',
              'Payment Requested': 'live',
              'Fully Paid - Sold': 'settled',
              'Scheduled': 'scheduled',
            }
            stateFilter = statusMap[statusFilter]
          }

          const response = await auctionsApi.getAll({
            state: stateFilter,
            page: currentPage,
            limit: PAGE_SIZE,
          })

          setAuctions(response.data || [])
          setTotalPages(response.pagination?.totalPages || 1)
        } catch (err: any) {
          console.error('Error fetching auctions:', err)
          setError(err.response?.data?.message || 'Failed to fetch auctions')
          setAuctions([])
        } finally {
          setLoading(false)
        }
      }
      fetchAuctions()
    } catch (error: any) {
      console.error('Error deleting product:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete product'
      alert(`Error: ${errorMessage}`)
    }
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setCurrentPage(1) // Reset to first page when sorting changes
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1) // Reset to first page when filter changes
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    setCurrentPage(1) // Reset to first page when search changes
  }

  const handleAddProduct = () => {
    navigate('/building-products/add')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <p className="text-sm text-gray-700">
          <span>Dashboard</span>
          <span className="mx-1">:</span>
          <span className="text-gray-900">Bidding Products</span>
        </p>
      </div>

      {/* Manage Product Catalog Section */}
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Manage your product catalog</h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
            {/* Sort By Date Dropdown */}
            <FilterDropdown
              label={sortBy}
              options={['Sort By Date', 'Newest First', 'Oldest First']}
              onSelect={handleSortChange}
              icon={<CalendarIcon className="h-4 w-4" />}
              hideArrow={true}
            />

            {/* All Status Dropdown */}
            <FilterDropdown
              label={statusFilter}
              options={['All Status', 'Ended - Unsold', 'Payment Requested', 'Live', 'Fully Paid - Sold', 'Scheduled']}
              onSelect={handleStatusChange}
            />

            {/* Search Input */}
            <SearchBar
              placeholder="Search by Title"
              value={searchValue}
              onChange={handleSearchChange}
              className="min-w-[180px] sm:min-w-[200px]"
            />

            {/* Add Product Button */}
            <button
              type="button"
              onClick={handleAddProduct}
              className="inline-flex items-center justify-center 
              gap-2 rounded-lg bg-[#F7931E] px-2 py-2.5 text-xs font-medium text-white transition hover:bg-[#E8840D] whitespace-nowrap cursor-pointer"
            >
              
              +Add Product
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#F7941D] border-r-transparent"></div>
                <p className="mt-4 text-sm text-gray-600">Loading auctions...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-sm font-medium text-red-600">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 inline-flex items-center justify-center rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D]"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <BiddingProductsTable 
              products={paginatedProducts} 
              onView={handleViewProduct}
              onDelete={handleDeleteProduct}
            />
          )}

          {/* Pagination */}
          <footer className="flex flex-col sm:flex-row justify-end items-center gap-3 border-t border-gray-200 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center sm:justify-end">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Back
              </button>
              <div className="flex items-center gap-0.5 sm:gap-1">
                {getPageNumbers().map((page, index) => {
                  if (page === '...') {
                    return (
                      <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                        ...
                      </span>
                    )
                  }
                  
                  const pageNum = page as number
                  const isActive = pageNum === currentPage
                  
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-7 w-7 sm:h-9 sm:w-9 rounded-lg text-xs sm:text-sm font-medium transition ${
                        isActive
                          ? 'bg-[#4C50A2] text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
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
