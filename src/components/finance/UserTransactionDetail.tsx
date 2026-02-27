import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import FilterDropdown from './FilterDropdown'
import FinanceStatusBadge from './FinanceStatusBadge'
import { DownloadIcon, CalendarIcon, MoreVerticalIcon } from '../icons/Icons'
import type { UserTransaction } from '../../pages/Finance'
import type { FinanceStatus } from './FinanceStatusBadge'
import { userApi, walletApi, type UserOrder, type UserBid, type UserSpendingSummary } from '../../services/wallet.api'

interface UserTransactionDetailProps {
  transaction: UserTransaction
  onClose: () => void
}

const PAGE_SIZE = 10

export default function UserTransactionDetail({ transaction, onClose }: UserTransactionDetailProps) {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('By Date')
  const [activeTab, setActiveTab] = useState<'orders' | 'biddings'>('orders')
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<UserSpendingSummary | null>(null)
  const [orders, setOrders] = useState<UserOrder[]>([])
  const [bids, setBids] = useState<UserBid[]>([])
  const [ordersTotalPages, setOrdersTotalPages] = useState(1)
  const [bidsTotalPages, setBidsTotalPages] = useState(1)
  const [userPhone, setUserPhone] = useState<string>('')
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null)

  // Extract userId from transaction
  const userId = transaction.userId || ''

  useEffect(() => {
    if (userId) {
      loadData()
    }
  }, [userId, activeTab, currentPage])

  const loadData = async () => {
    try {
      setLoading(true)
      
      if (activeTab === 'orders') {
        const ordersResponse = await userApi.getOrders(userId, {
          page: currentPage,
          limit: PAGE_SIZE,
        })
        setOrders(ordersResponse.data)
        setOrdersTotalPages(ordersResponse.pagination.totalPages)
      } else {
        const bidsResponse = await userApi.getBids(userId, {
          page: currentPage,
          limit: PAGE_SIZE,
        })
        setBids(bidsResponse.data)
        setBidsTotalPages(bidsResponse.pagination.totalPages)
      }

      // Load summary and user wallet (for phone and profile image) once
      if (!summary) {
        const [summaryData, walletData] = await Promise.all([
          userApi.getSpendingSummary(userId),
          walletApi.getUserWallet(userId).catch(() => null),
        ])
        setSummary(summaryData)
        // Get user phone and profile image from wallet data if available
        const walletUser = walletData?.wallet?.user
        if (walletUser) {
          if (walletUser.phone) {
            setUserPhone(walletUser.phone)
          }
          if ((walletUser as { profileImageUrl?: string }).profileImageUrl) {
            setUserProfileImage((walletUser as { profileImageUrl?: string }).profileImageUrl!)
          }
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab: 'orders' | 'biddings') => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  // Helper function to map order status to finance status
  const mapOrderStatusToFinanceStatus = (status: string): FinanceStatus => {
    switch (status) {
      case 'paid':
      case 'delivered':
        return 'paid'
      case 'refunded':
        return 'refunded'
      case 'pending':
      case 'created':
        return 'pending'
      default:
        return 'pending'
    }
  }

  const totalPages = useMemo(() => {
    return activeTab === 'orders' ? ordersTotalPages : bidsTotalPages
  }, [activeTab, ordersTotalPages, bidsTotalPages])

  // Map backend orders to frontend format
  const mappedOrders = useMemo(() => {
    return orders.map((order) => ({
      id: order.id,
      transactionId: order.id.slice(0, 8).toUpperCase(),
      orderId: `#${order.orderNumber}`,
      amountPaid: `${(parseFloat(order.totalMinor) / 100).toFixed(2)} ${order.currency}`,
      vendor: order.vendor?.name || 'Unknown',
      status: mapOrderStatusToFinanceStatus(order.status),
      date: new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    }))
  }, [orders])

  // Map backend bids to frontend format
  const mappedBids = useMemo(() => {
    return bids.map((bid) => {
      const amount = parseFloat(bid.amountMinor) / 100
      const product = bid.auction?.product
      
      return {
        id: bid.id,
        product: {
          name: product?.title || 'Unknown Product',
          category: bid.auction?.product?.id || 'Unknown',
          image: product?.media?.[0]?.url,
        },
        bidId: bid.id.slice(0, 12).toUpperCase(),
        bidAmount: `${amount.toFixed(2)} ${bid.currency}`,
        currentPrice: `${amount.toFixed(2)} ${bid.currency}`,
        result: bid.isWinning ? 'Won' : bid.auction?.state === 'closed' ? 'Lost' : 'Pending',
        endDate: new Date(bid.auction?.endAt || bid.placedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' }),
        status: bid.isWinning ? 'won' : bid.auction?.state === 'closed' ? 'lost' : 'winning',
      }
    })
  }, [bids])

  const paginatedOrders = mappedOrders
  const paginatedHistory = mappedBids

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
    // Scroll to top of table section when page changes
    const tableSection = document.getElementById('transaction-history-table')
    if (tableSection) {
      tableSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <div className="rounded-xl bg-white shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div className="flex items-start gap-4">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <img
                src={userProfileImage || `https://i.pravatar.cc/100?img=${(transaction.userName.length % 70) + 1}`}
                alt={transaction.userName}
                className="h-20 w-20 rounded-full object-cover ring-2 ring-gray-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = `https://i.pravatar.cc/100?img=${(transaction.userName.length % 70) + 1}`
                }}
              />
            </div>
            
            {/* Profile Information */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{transaction.userName}</h2>
              <p className="text-sm text-gray-600 mb-4">User</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{transaction.userEmail}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-600">{userPhone || 'N/A'}</span>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 w-fit">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* View Profile Button */}
          <div className="flex flex-col items-end gap-4">
            <button
              type="button"
              onClick={() => {
                if (userId) {
                  navigate(`/users/${userId}`)
                } else {
                  onClose()
                }
              }}
              className="inline-flex items-center justify-center rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8851A]"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>

      {/* Spending & Refunds Summary Section */}
      <div className="rounded-xl bg-white shadow-sm p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Spending & Refunds Summary</h2>
        {loading && !summary ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8C00]"></div>
          </div>
        ) : summary ? (
          <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-xl font-semibold text-gray-900 mb-1">
                {(parseFloat(summary.totalOrdersSpent) / 100).toFixed(2)}
                <span className="ml-1 text-xs font-normal text-gray-500">QAR</span>
              </p>
              <h3 className="text-sm font-normal text-gray-600">Total Orders Spent</h3>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-xl font-semibold text-gray-900 mb-1">
                {(parseFloat(summary.totalBiddingSpent) / 100).toFixed(2)}
                <span className="ml-1 text-xs font-normal text-gray-500">QAR</span>
              </p>
              <h3 className="text-sm font-normal text-gray-600">Total Bidding Spent</h3>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-xl font-semibold text-green-600 mb-1">
                {(parseFloat(summary.totalOrderRefunds) / 100).toFixed(2)}
                <span className="ml-1 text-xs font-normal text-gray-500">QAR</span>
              </p>
              <h3 className="text-sm font-normal text-gray-600">Total Order Refunds</h3>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-xl font-semibold text-green-600 mb-1">
                {(parseFloat(summary.totalWalletRefunds) / 100).toFixed(2)}
                <span className="ml-1 text-xs font-normal text-gray-500">QAR</span>
              </p>
              <h3 className="text-sm font-normal text-gray-600">Total Wallet Refunds</h3>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-xl font-semibold text-orange-600 mb-1">
                {(parseFloat(summary.pendingOrderRefunds) / 100).toFixed(2)}
                <span className="ml-1 text-xs font-normal text-gray-500">QAR</span>
              </p>
              <h3 className="text-sm font-normal text-gray-600">Pending Order Refunds</h3>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-xl font-semibold text-orange-600 mb-1">
                {(parseFloat(summary.pendingWalletRefunds) / 100).toFixed(2)}
                <span className="ml-1 text-xs font-normal text-gray-500">QAR</span>
              </p>
              <h3 className="text-sm font-normal text-gray-600">Pending Wallet Refunds</h3>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-xl font-semibold text-gray-900 mb-1">
                {(parseFloat(summary.netSpending) / 100).toFixed(2)}
                <span className="ml-1 text-xs font-normal text-gray-500">QAR</span>
              </p>
              <h3 className="text-sm font-normal text-gray-600">Net Spending</h3>
            </div>
          </div>
        ) : null}
      </div>

      {/* Order Summary Section */}
      <div className="rounded-xl bg-white shadow-sm p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
        {summary ? (
          <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="text-sm font-normal text-gray-600 mb-2">Total Orders</h3>
              <p className="text-2xl font-bold text-gray-900">{summary.totalOrders}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="text-sm font-normal text-gray-600 mb-2">Completed orders</h3>
              <p className="text-2xl font-bold text-green-600">{summary.completedOrders}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="text-sm font-normal text-gray-600 mb-2">Refunds Orders</h3>
              <p className="text-2xl font-bold text-orange-600">{summary.refundedOrders}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="text-sm font-normal text-gray-600 mb-2">Total Bidding won</h3>
              <p className="text-2xl font-bold text-gray-900">{summary.totalBiddingWon}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8C00]"></div>
          </div>
        )}
      </div>

      {/* Transaction History Section */}
      <section className="rounded-xl bg-white shadow-sm">
        {/* Transaction History Heading */}
        <div className="px-4 pt-4 pb-2 sm:px-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Transaction History</h2>
        </div>

        {/* Controls and Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 px-4 pt-2 pb-4 sm:px-6">
          <div className="flex items-center gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => handleTabChange('orders')}
                className={`inline-flex items-center px-3 pt-1.5 pb-3 text-sm font-medium transition-colors duration-150 ${
                  activeTab === 'orders'
                    ? 'text-black border-b-2 border-black relative z-10 -mb-px'
                    : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
                }`}
              >
                Orders ({summary?.totalOrders || 0})
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('biddings')}
                className={`inline-flex items-center px-3 pt-1.5 pb-3 text-sm font-medium transition-colors duration-150 ${
                  activeTab === 'biddings'
                    ? 'text-black border-b-2 border-black relative z-10 -mb-px'
                    : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
                }`}
              >
                Biddings ({summary?.totalBiddingWon || 0})
              </button>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
            <FilterDropdown
              label={sortBy}
              options={['By Date', 'Newest First', 'Oldest First']}
              onSelect={(value) => setSortBy(value)}
              icon={<CalendarIcon className="h-4 w-4" />}
            />
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 whitespace-nowrap"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 01.8 1.6l-4.2 5.6a2 2 0 00-.4 1.2v5.6a1 1 0 01-1.447.894L12 16.618l-2.753 1.676A1 1 0 017.8 16.4v-5.6a2 2 0 00-.4-1.2L3.2 5.6A1 1 0 013 4z"
                />
              </svg>
              Filter
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 whitespace-nowrap"
            >
              <DownloadIcon className="h-4 w-4" />
              Export
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 whitespace-nowrap"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Transaction History Table */}
        {activeTab === 'biddings' && (
          <>
            <div id="transaction-history-table" className="px-4 py-4 sm:px-6">
              <div className="overflow-x-auto">
                <div className="w-full overflow-x-auto rounded-xl" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}>
                  <table className="min-w-[1000px] w-full border-collapse text-sm">
                    <thead className="bg-transparent">
                      <tr>
                        <TableHeader>Product</TableHeader>
                        <TableHeader>Bid ID</TableHeader>
                        <TableHeader align="right">Bid Amount</TableHeader>
                        <TableHeader align="right">Current Price</TableHeader>
                        <TableHeader>Result</TableHeader>
                        <TableHeader>End Date</TableHeader>
                        <TableHeader>Status</TableHeader>
                        <TableHeader align="center">Action</TableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                            <div className="flex items-center justify-center gap-2">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FF8C00]"></div>
                              Loading bids...
                            </div>
                          </td>
                        </tr>
                      ) : paginatedHistory.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                            No bids found
                          </td>
                        </tr>
                      ) : (
                        paginatedHistory.map((history) => (
                        <tr key={history.id} className="border-b border-gray-200 last:border-b-0">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                {history.product.image ? (
                                  <img src={history.product.image} alt={history.product.name} className="h-10 w-10 rounded-full object-cover" />
                                ) : (
                                  <span className="text-xs font-medium text-gray-600">{history.product.name.charAt(0)}</span>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{history.product.name}</p>
                                <p className="text-xs text-gray-500">{history.product.category}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{history.bidId}</TableCell>
                          <TableCell align="right" className="font-medium">{history.bidAmount}</TableCell>
                          <TableCell align="right" className="font-medium">{history.currentPrice}</TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-700 capitalize">{history.result}</span>
                          </TableCell>
                          <TableCell className="text-xs">{history.endDate}</TableCell>
                          <TableCell>
                            <BiddingStatusBadge status={history.status as BiddingStatus} />
                          </TableCell>
                          <TableCell align="center">
                            <ActionMenuButton 
                              transactionId={history.id} 
                              type="bid"
                              auctionId={bids.find(b => b.id === history.id)?.auction?.id}
                            />
                          </TableCell>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <footer className="flex flex-col sm:flex-row justify-end items-center gap-3 border-t border-gray-100 px-4 py-4 sm:px-6">
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
          </>
        )}

        {activeTab === 'orders' && (
          <>
            <div id="transaction-history-table" className="px-4 py-4 sm:px-6">
              <div className="overflow-x-auto">
                <div className="w-full overflow-x-auto rounded-xl" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}>
                  <table className="min-w-[1000px] w-full border-collapse text-sm">
                    <thead className="bg-transparent">
                      <tr>
                        <TableHeader>Transaction ID</TableHeader>
                        <TableHeader>Order ID</TableHeader>
                        <TableHeader align="right">Amount Paid</TableHeader>
                        <TableHeader>Vendor</TableHeader>
                        <TableHeader>Status</TableHeader>
                        <TableHeader>Date</TableHeader>
                        <TableHeader align="center">Action</TableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                            <div className="flex items-center justify-center gap-2">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FF8C00]"></div>
                              Loading orders...
                            </div>
                          </td>
                        </tr>
                      ) : paginatedOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                            No orders found
                          </td>
                        </tr>
                      ) : (
                        paginatedOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-200 last:border-b-0">
                          <TableCell className="text-sm">{order.transactionId}</TableCell>
                          <TableCell className="text-sm">{order.orderId}</TableCell>
                          <TableCell align="right" className="font-medium">{order.amountPaid}</TableCell>
                          <TableCell className="text-sm">{order.vendor}</TableCell>
                          <TableCell>
                            <FinanceStatusBadge status={order.status} />
                          </TableCell>
                          <TableCell className="text-xs">{order.date}</TableCell>
                          <TableCell align="center">
                            <ActionMenuButton 
                              transactionId={order.id} 
                              type="order"
                              orderId={orders.find(o => o.id === order.id)?.id}
                            />
                          </TableCell>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <footer className="flex flex-col sm:flex-row justify-end items-center gap-3 border-t border-gray-100 px-4 py-4 sm:px-6">
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
          </>
        )}
      </section>
    </div>
  )
}

interface TableHeaderProps {
  children: React.ReactNode
  align?: 'left' | 'right' | 'center'
}

function TableHeader({ children, align = 'left' }: TableHeaderProps) {
  const textAlign = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
  
  return (
    <th
      scope="col"
      className={`whitespace-nowrap px-3 py-3 sm:px-5 text-xs font-semibold uppercase tracking-wide text-gray-700 border-b-2 border-gray-300 ${textAlign}`}
    >
      {children}
    </th>
  )
}

interface TableCellProps {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'right' | 'center'
}

function TableCell({ children, className = '', align = 'left' }: TableCellProps) {
  const textAlign = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
  const hasCustomTextSize = className.match(/\btext-(xs|sm|base|lg|xl)\b/)
  const textSizeClass = hasCustomTextSize ? hasCustomTextSize[0] : 'text-sm'
  
  return (
    <td
      className={`px-3 py-2 sm:px-5 text-gray-700 ${textAlign} ${textSizeClass} ${className}`}
    >
      {children}
    </td>
  )
}

type BiddingStatus = 'won' | 'won-payment-pending' | 'lost' | 'winning'

interface BiddingStatusBadgeProps {
  status: BiddingStatus
  className?: string
}

const BIDDING_STATUS_STYLES: Record<BiddingStatus, { bg: string; text: string; label: string }> = {
  won: {
    bg: '#DCF6E5',
    text: '#118D57',
    label: 'Won',
  },
  'won-payment-pending': {
    bg: '#FFF2D6',
    text: '#B76E00',
    label: 'Won - Payment Pend.',
  },
  lost: {
    bg: '#FFE4DE',
    text: '#B71D18',
    label: 'Lost',
  },
  winning: {
    bg: '#DBEAFE',
    text: '#1E40AF',
    label: 'Winning',
  },
}

function BiddingStatusBadge({ status, className = '' }: BiddingStatusBadgeProps) {
  const style = BIDDING_STATUS_STYLES[status]
  
  return (
    <span
      className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium ${className}`}
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {style.label}
    </span>
  )
}

interface ActionMenuButtonProps {
  transactionId: string
  type?: 'order' | 'bid'
  orderId?: string
  auctionId?: string
}

function ActionMenuButton({ transactionId: _transactionId, type, orderId, auctionId }: ActionMenuButtonProps) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const handleView = () => {
    if (type === 'order' && orderId) {
      navigate(`/orders/${orderId}/detail`)
    } else if (type === 'bid' && auctionId) {
      navigate(`/building-products/${auctionId}`)
    }
    setOpen(false)
  }

  return (
    <div className="relative inline-flex" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4C50A2]"
      >
        <MoreVerticalIcon className="h-5 w-5" />
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-40 rounded-xl border border-gray-100 bg-white py-2 shadow-lg ring-1 ring-black/5 origin-top-right">
          <button
            type="button"
            onClick={handleView}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
          >
            View
          </button>
        </div>
      )}
    </div>
  )
}

