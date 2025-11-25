import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import FinanceActionMenu from '../components/finance/FinanceActionMenu'
import FilterDropdown from '../components/finance/FilterDropdown'
import { ExportIcon, CalendarIcon } from '../components/icons/Icons'

// Mock user data
const MOCK_USER = {
  id: 'user-1',
  name: 'Touseef Ahmed',
  email: 'alice.johnson@example.com',
  phone: '+1 234 567 8900',
  avatar: 'https://i.pravatar.cc/100?img=12',
  status: 'active',
}

// Mock bidding transaction data
interface BiddingTransaction {
  id: string
  productName: string
  productCategory: string
  productImage: string
  bidId: string
  bidAmount: string
  currentPrice: string
  result: 'won' | 'lost' | 'pending'
  endDate: string
  status: 'won' | 'won-payment-pending' | 'lost' | 'winning'
}

const MOCK_BIDDING_TRANSACTIONS: BiddingTransaction[] = [
  {
    id: '1',
    productName: 'Vintage Leather Jacket',
    productCategory: 'Electronics',
    productImage: 'https://images.unsplash.com/photo-1551028719-00167b16e628?w=100',
    bidId: 'BID-2024-001',
    bidAmount: '$8750',
    currentPrice: '$8750',
    result: 'won',
    endDate: '16/01/2024',
    status: 'won',
  },
  {
    id: '2',
    productName: 'Smart Watch Pro',
    productCategory: 'Collectibles',
    productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100',
    bidId: 'BID-2024-001',
    bidAmount: '$299.99',
    currentPrice: '$299.99',
    result: 'pending',
    endDate: '15/01/2024',
    status: 'won-payment-pending',
  },
  {
    id: '3',
    productName: 'Designer Handbag',
    productCategory: 'Art',
    productImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100',
    bidId: 'BID-2024-001',
    bidAmount: '$299.99',
    currentPrice: '$299.99',
    result: 'lost',
    endDate: '15/01/2024',
    status: 'lost',
  },
  {
    id: '4',
    productName: 'Wireless Headphones',
    productCategory: 'Home Decor',
    productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100',
    bidId: 'BID-2024-001',
    bidAmount: '$299.99',
    currentPrice: '$299.99',
    result: 'pending',
    endDate: '15/01/2024',
    status: 'winning',
  },
]

// Mock order transactions
const MOCK_ORDER_TRANSACTIONS: any[] = []

const PAGE_SIZE = 10

export default function UserFinanceDetail() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<typeof MOCK_USER | null>(null)
  const [biddingTransactions, setBiddingTransactions] = useState<BiddingTransaction[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('By Date')
  const [activeTab, setActiveTab] = useState<'orders' | 'biddings'>('biddings')

  useEffect(() => {
    // Load user data - in a real app, this would fetch based on userId
    setUser(MOCK_USER)
    setBiddingTransactions(MOCK_BIDDING_TRANSACTIONS)
  }, [userId])

  // Calculate summary metrics
  const totalOrdersSpent = 2149.96
  const totalBiddingSpent = 2149.96
  const totalOrderRefunds = 199.99
  const totalWalletRefunds = 199.99
  const pendingOrderRefunds = 0.00
  const pendingWalletRefunds = 0.00
  const netSpending = 1949.97

  const totalOrders = 15
  const completedOrders = 9
  const refundOrders = 5
  const totalBiddingWon = 1

  const filteredBiddingTransactions = useMemo(() => {
    let result = [...biddingTransactions]

    // Apply sorting
    const parseDate = (dateStr: string) => {
      const parts = dateStr.split('/')
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10)
        const month = parseInt(parts[1], 10) - 1
        const year = parseInt(parts[2], 10)
        const date = new Date(year, month, day)
        return isNaN(date.getTime()) ? 0 : date.getTime()
      }
      return 0
    }

    if (sortBy === 'Newest First') {
      result.sort((a, b) => parseDate(b.endDate) - parseDate(a.endDate))
    } else if (sortBy === 'Oldest First') {
      result.sort((a, b) => parseDate(a.endDate) - parseDate(b.endDate))
    } else {
      // By Date (default) - newest first
      result.sort((a, b) => parseDate(b.endDate) - parseDate(a.endDate))
    }

    return result
  }, [biddingTransactions, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredBiddingTransactions.length / PAGE_SIZE))

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredBiddingTransactions.slice(start, start + PAGE_SIZE)
  }, [filteredBiddingTransactions, currentPage])

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    
    if (totalPages <= 8) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      
      if (currentPage > 3) {
        pages.push('...')
      }
      
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
      
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const handleViewProfile = () => {
    // Navigate to user profile page
    navigate(`/users/${user?.id}`)
  }

  const handleExport = () => {
    // Create CSV content
    const headers = ['Product', 'Bid ID', 'Bid Amount', 'Current Price', 'Result', 'End Date', 'Status']
    const rows = filteredBiddingTransactions.map((transaction) => [
      transaction.productName,
      transaction.bidId,
      transaction.bidAmount,
      transaction.currentPrice,
      transaction.result,
      transaction.endDate,
      transaction.status,
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n')

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `user-bidding-transactions-${user?.name || 'export'}-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'won':
        return (
          <span className="inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium whitespace-nowrap" style={{ backgroundColor: '#DCF6E5', color: '#118D57' }}>
            Won
          </span>
        )
      case 'won-payment-pending':
        return (
          <span className="inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium whitespace-nowrap" style={{ backgroundColor: '#DCF6E5', color: '#118D57' }}>
            Pending
          </span>
        )
      case 'lost':
        return (
          <span className="inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium whitespace-nowrap" style={{ backgroundColor: '#FFE4DE', color: '#B71D18' }}>
            Lost
          </span>
        )
      case 'winning':
        return (
          <span className="inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium whitespace-nowrap" style={{ backgroundColor: '#E0E7FF', color: '#4C50A2' }}>
            Winning
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium whitespace-nowrap" style={{ backgroundColor: '#FFF2D6', color: '#B76E00' }}>
            Pending
          </span>
        )
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Loading user details...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Finance</h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">Dashboard - Orders</p>
      </div>

      {/* User Profile Section */}
      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 via-gray-50/50 to-white p-4 sm:p-6 relative">
        <button
          type="button"
          onClick={handleViewProfile}
          className="hidden sm:inline-flex absolute top-6 right-6 items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E8840D] cursor-pointer"
        >
          View Profile
        </button>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-2 border-green-500 flex-shrink-0"
          />
          <div className="flex-1 text-center sm:text-left w-full">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">{user.name}</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">User</p>
            <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-1.5">
              <p className="text-xs sm:text-sm text-gray-600">{user.email}</p>
              <p className="text-xs sm:text-sm text-gray-600">{user.phone}</p>
            </div>
            <div className="mt-2 sm:mt-3">
              <span className="inline-flex items-center justify-center rounded-full bg-green-500 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium text-white">
                Active
              </span>
            </div>
            <button
              type="button"
              onClick={handleViewProfile}
              className="mt-3 sm:hidden w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E8840D] cursor-pointer"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>

      {/* Spending & Refunds Summary Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Spending & Refunds Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 sm:gap-4">
          <div className="flex flex-col">
            <p className="text-lg sm:text-xl font-bold text-gray-900">${totalOrdersSpent.toFixed(2)}</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Total Orders Spent</p>
          </div>
          <div className="flex flex-col">
            <p className="text-lg sm:text-xl font-bold text-gray-900">${totalBiddingSpent.toFixed(2)}</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Total Bidding Spent</p>
          </div>
          <div className="flex flex-col">
            <p className="text-lg sm:text-xl font-bold text-green-600">${totalOrderRefunds.toFixed(2)}</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Total Order Refunds</p>
          </div>
          <div className="flex flex-col">
            <p className="text-lg sm:text-xl font-bold text-green-600">${totalWalletRefunds.toFixed(2)}</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Total Wallet Refunds</p>
          </div>
          <div className="flex flex-col">
            <p className="text-lg sm:text-xl font-bold text-orange-600">${pendingOrderRefunds.toFixed(2)}</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Pending Order Refunds</p>
          </div>
          <div className="flex flex-col">
            <p className="text-lg sm:text-xl font-bold text-orange-600">${pendingWalletRefunds.toFixed(2)}</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Pending Wallet Refunds</p>
          </div>
          <div className="flex flex-col">
            <p className="text-lg sm:text-xl font-bold text-gray-900">${netSpending.toFixed(2)}</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Net Spending</p>
          </div>
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Order Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="flex flex-col items-center text-center">
            <p className="text-lg sm:text-xl font-bold text-gray-900">{totalOrders}</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Total Orders</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <p className="text-lg sm:text-xl font-bold text-green-600">{completedOrders}</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Completed orders</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <p className="text-lg sm:text-xl font-bold text-orange-600">{refundOrders}</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Refunds Orders</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <p className="text-lg sm:text-xl font-bold text-gray-900">{totalBiddingWon}</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Total Bidding won</p>
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Transaction History</h2>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <FilterDropdown
              label={sortBy}
              options={['By Date', 'Newest First', 'Oldest First']}
              onSelect={(value) => setSortBy(value)}
              icon={<CalendarIcon className="h-4 w-4" />}
            />
            <button
              type="button"
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-gray-200 bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer"
            >
              <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 01.8 1.6l-4.2 5.6a2 2 0 00-.4 1.2v5.6a1 1 0 01-1.447.894L12 16.618l-2.753 1.676A1 1 0 017.8 16.4v-5.6a2 2 0 00-.4-1.2L3.2 5.6A1 1 0 013 4z"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-gray-200 bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer"
            >
              Export
              <ExportIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-gray-200 mb-3 sm:mb-4 -mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto overflow-y-hidden">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 text-sm font-medium transition cursor-pointer ${
                activeTab === 'orders'
                  ? 'border-b-2 border-black text-gray-900 relative -mb-[2px]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Orders ({MOCK_ORDER_TRANSACTIONS.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('biddings')}
              className={`px-4 py-2 text-sm font-medium transition cursor-pointer ${
                activeTab === 'biddings'
                  ? 'border-b-2 border-black text-gray-900 relative -mb-[2px]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Biddings ({biddingTransactions.length})
            </button>
          </div>

          {/* Table */}
          {activeTab === 'biddings' && (
            <>
              <div className="-mx-4 sm:-mx-6">
                <div className="w-full">
                  <div className="overflow-x-auto overflow-y-hidden">
                    <table className="min-w-[900px] md:min-w-full w-full border-collapse text-sm">
                      <thead className="bg-transparent">
                        <tr>
                          <th className="whitespace-nowrap py-2 text-xs sm:text-sm font-semibold tracking-wide text-gray-700 border-b border-gray-200 bg-white text-left pl-4 sm:pl-6 pr-2 sm:pr-4">Product</th>
                          <th className="whitespace-nowrap py-2 text-xs sm:text-sm font-semibold tracking-wide text-gray-700 border-b border-gray-200 bg-white text-left px-2 sm:px-4">Bid ID</th>
                          <th className="whitespace-nowrap py-2 text-xs sm:text-sm font-semibold tracking-wide text-gray-700 border-b border-gray-200 bg-white text-left px-2 sm:px-4">Bid Amount</th>
                          <th className="whitespace-nowrap py-2 text-xs sm:text-sm font-semibold tracking-wide text-gray-700 border-b border-gray-200 bg-white text-left px-2 sm:px-4">Current Price</th>
                          <th className="whitespace-nowrap py-2 text-xs sm:text-sm font-semibold tracking-wide text-gray-700 border-b border-gray-200 bg-white text-left px-2 sm:px-4">Result</th>
                          <th className="whitespace-nowrap py-2 text-xs sm:text-sm font-semibold tracking-wide text-gray-700 border-b border-gray-200 bg-white text-left px-2 sm:px-4">End Date</th>
                          <th className="whitespace-nowrap py-2 text-xs sm:text-sm font-semibold tracking-wide text-gray-700 border-b border-gray-200 bg-white text-left px-2 sm:px-4">Status</th>
                          <th className="whitespace-nowrap py-2 text-xs sm:text-sm font-semibold tracking-wide text-gray-700 border-b border-gray-200 bg-white text-left pl-2 sm:pl-4 pr-4 sm:pr-6">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedTransactions.map((transaction) => (
                          <tr key={transaction.id} className="border-b border-gray-200 last:border-b-0">
                            <td className="py-2 text-gray-700 text-xs sm:text-sm pl-4 sm:pl-6 pr-2 sm:pr-4">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <img
                                  src={transaction.productImage}
                                  alt={transaction.productName}
                                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover flex-shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="font-medium text-gray-900 whitespace-nowrap text-xs sm:text-sm">{transaction.productName}</p>
                                  <p className="text-xs text-gray-500 whitespace-nowrap">({transaction.productCategory})</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-2 text-gray-700 text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap">{transaction.bidId}</td>
                            <td className="py-2 text-gray-700 text-xs sm:text-sm text-left px-2 sm:px-4">{transaction.bidAmount}</td>
                            <td className="py-2 text-gray-700 text-xs sm:text-sm text-left px-2 sm:px-4">{transaction.currentPrice}</td>
                            <td className="py-2 text-gray-700 text-xs sm:text-sm text-left px-2 sm:px-4 capitalize">{transaction.result}</td>
                            <td className="py-2 text-gray-700 text-xs px-2 sm:px-4">{transaction.endDate}</td>
                            <td className="py-2 text-gray-700 text-xs sm:text-sm px-2 sm:px-4">
                              {getStatusBadge(transaction.status)}
                            </td>
                            <td className="py-2 text-gray-700 text-xs sm:text-sm text-left pl-2 sm:pl-4 pr-4 sm:pr-6">
                              <FinanceActionMenu onSelect={() => {}} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              <footer className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-4 mt-4">
                <div className="flex items-center gap-1 sm:gap-1.5 sm:gap-2 flex-wrap justify-center sm:justify-end w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    &lt; Back
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
                    Next &gt;
                  </button>
                </div>
              </footer>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

