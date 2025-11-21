import { useState, useMemo, useEffect, useRef } from 'react'
import FilterDropdown from './FilterDropdown'
import FinanceStatusBadge from './FinanceStatusBadge'
import { DownloadIcon, CalendarIcon, MoreVerticalIcon } from '../icons/Icons'
import type { UserTransaction } from '../../pages/Finance'
import type { FinanceStatus } from './FinanceStatusBadge'

interface UserTransactionDetailProps {
  transaction: UserTransaction
  onClose: () => void
}

interface BiddingTransaction {
  id: string
  product: {
    name: string
    category: string
    image?: string
  }
  bidId: string
  bidAmount: string
  currentPrice: string
  result: 'Won' | 'Pending' | 'Lost' | 'Winning'
  endDate: string
  status: 'won' | 'won-payment-pending' | 'lost' | 'winning'
}

interface OrderTransaction {
  id: string
  transactionId: string
  orderId: string
  amountPaid: string
  vendor: string
  status: FinanceStatus
  date: string
}

// Mock order transaction data
const MOCK_ORDER_TRANSACTIONS: OrderTransaction[] = [
  { id: '1', transactionId: 'TX-001', orderId: '#001', amountPaid: '$2,750', vendor: 'Electronic', status: 'paid', date: '15 Aug 2023' },
  { id: '2', transactionId: 'TX-002', orderId: '#002', amountPaid: '$299', vendor: 'Carlos Rohn', status: 'refunded', date: '3 Aug 2023' },
  { id: '3', transactionId: 'TX-003', orderId: '#003', amountPaid: '$299', vendor: 'Juri', status: 'pending', date: '3 Aug 2023' },
  { id: '4', transactionId: 'TX-004', orderId: '#004', amountPaid: '$299', vendor: 'Juri', status: 'paid', date: '3 Aug 2023' },
  { id: '5', transactionId: 'TX-005', orderId: '#005', amountPaid: '$299', vendor: 'Juri', status: 'refunded', date: '3 Aug 2023' },
  { id: '6', transactionId: 'TX-006', orderId: '#006', amountPaid: '$299', vendor: 'Juri', status: 'paid', date: '3 Aug 2023' },
  { id: '7', transactionId: 'TX-007', orderId: '#007', amountPaid: '$299', vendor: 'Juri', status: 'pending', date: '3 Aug 2023' },
  { id: '8', transactionId: 'TX-008', orderId: '#008', amountPaid: '$299', vendor: 'Juri', status: 'paid', date: '3 Aug 2023' },
  { id: '9', transactionId: 'TX-009', orderId: '#009', amountPaid: '$299', vendor: 'Juri', status: 'refunded', date: '3 Aug 2023' },
  { id: '10', transactionId: 'TX-010', orderId: '#010', amountPaid: '$299', vendor: 'Juri', status: 'paid', date: '3 Aug 2023' },
  { id: '11', transactionId: 'TX-011', orderId: '#011', amountPaid: '$299', vendor: 'Juri', status: 'paid', date: '3 Aug 2023' },
  { id: '12', transactionId: 'TX-012', orderId: '#012', amountPaid: '$299', vendor: 'Juri', status: 'pending', date: '3 Aug 2023' },
  { id: '13', transactionId: 'TX-013', orderId: '#013', amountPaid: '$299', vendor: 'Juri', status: 'paid', date: '3 Aug 2023' },
  { id: '14', transactionId: 'TX-014', orderId: '#014', amountPaid: '$299', vendor: 'Juri', status: 'refunded', date: '3 Aug 2023' },
  { id: '15', transactionId: 'TX-015', orderId: '#015', amountPaid: '$299', vendor: 'Juri', status: 'paid', date: '3 Aug 2023' },
  { id: '16', transactionId: 'TX-016', orderId: '#016', amountPaid: '$299', vendor: 'Juri', status: 'paid', date: '3 Aug 2023' },
  { id: '17', transactionId: 'TX-017', orderId: '#017', amountPaid: '$299', vendor: 'Juri', status: 'pending', date: '3 Aug 2023' },
  { id: '18', transactionId: 'TX-018', orderId: '#018', amountPaid: '$299', vendor: 'Juri', status: 'paid', date: '3 Aug 2023' },
  { id: '19', transactionId: 'TX-019', orderId: '#019', amountPaid: '$299', vendor: 'Juri', status: 'refunded', date: '3 Aug 2023' },
  { id: '20', transactionId: 'TX-020', orderId: '#020', amountPaid: '$299', vendor: 'Juri', status: 'paid', date: '3 Aug 2023' },
  { id: '21', transactionId: 'TX-021', orderId: '#021', amountPaid: '$299', vendor: 'Juri', status: 'paid', date: '3 Aug 2023' },
  { id: '22', transactionId: 'TX-022', orderId: '#022', amountPaid: '$299', vendor: 'Juri', status: 'pending', date: '3 Aug 2023' },
  { id: '23', transactionId: 'TX-023', orderId: '#023', amountPaid: '$299', vendor: 'Juri', status: 'paid', date: '3 Aug 2023' },
  { id: '24', transactionId: 'TX-024', orderId: '#024', amountPaid: '$299', vendor: 'Juri', status: 'refunded', date: '3 Aug 2023' },
  { id: '25', transactionId: 'TX-025', orderId: '#025', amountPaid: '$299', vendor: 'Juri', status: 'paid', date: '3 Aug 2023' },
  { id: '26', transactionId: 'TX-026', orderId: '#026', amountPaid: '$299', vendor: 'Juri', status: 'paid', date: '3 Aug 2023' },
  { id: '27', transactionId: 'TX-027', orderId: '#027', amountPaid: '$299', vendor: 'Juri', status: 'pending', date: '3 Aug 2023' },
  { id: '28', transactionId: 'TX-028', orderId: '#028', amountPaid: '$299', vendor: 'Juri', status: 'paid', date: '3 Aug 2023' },
  { id: '29', transactionId: 'TX-029', orderId: '#029', amountPaid: '$299', vendor: 'Juri', status: 'refunded', date: '3 Aug 2023' },
  { id: '30', transactionId: 'TX-030', orderId: '#030', amountPaid: '$299', vendor: 'Juri', status: 'paid', date: '3 Aug 2023' },
  { id: '31', transactionId: 'TX-031', orderId: '#031', amountPaid: '$299', vendor: 'Juri', status: 'paid', date: '3 Aug 2023' },
  { id: '32', transactionId: 'TX-032', orderId: '#032', amountPaid: '$299', vendor: 'Juri', status: 'pending', date: '3 Aug 2023' },
  { id: '33', transactionId: 'TX-033', orderId: '#033', amountPaid: '$299', vendor: 'Juri', status: 'paid', date: '3 Aug 2023' },
  { id: '34', transactionId: 'TX-034', orderId: '#034', amountPaid: '$299', vendor: 'Juri', status: 'refunded', date: '3 Aug 2023' },
  { id: '35', transactionId: 'TX-035', orderId: '#035', amountPaid: '$299', vendor: 'Juri', status: 'paid', date: '3 Aug 2023' },
  { id: '36', transactionId: 'TX-036', orderId: '#036', amountPaid: '$299', vendor: 'Juri', status: 'paid', date: '3 Aug 2023' },
  { id: '37', transactionId: 'TX-037', orderId: '#037', amountPaid: '$299', vendor: 'Juri', status: 'pending', date: '3 Aug 2023' },
  { id: '38', transactionId: 'TX-038', orderId: '#038', amountPaid: '$299', vendor: 'Juri', status: 'paid', date: '3 Aug 2023' },
  { id: '39', transactionId: 'TX-039', orderId: '#039', amountPaid: '$299', vendor: 'Juri', status: 'refunded', date: '3 Aug 2023' },
  { id: '40', transactionId: 'TX-040', orderId: '#040', amountPaid: '$299', vendor: 'Juri', status: 'paid', date: '3 Aug 2023' },
]

// Mock bidding transaction data
const MOCK_BIDDING_TRANSACTIONS: BiddingTransaction[] = [
  {
    id: '1',
    product: { name: 'Vintage Leather Jacket', category: 'Electronic' },
    bidId: 'BID-2024-001',
    bidAmount: '$8,750',
    currentPrice: '$8,750',
    result: 'Won',
    endDate: '15/01/2024',
    status: 'won',
  },
  {
    id: '2',
    product: { name: 'Smart Watch Pro', category: 'Carlos Rohn' },
    bidId: 'BID-2024-002',
    bidAmount: '$299.99',
    currentPrice: '$299.99',
    result: 'Pending',
    endDate: '15/01/2024',
    status: 'won-payment-pending',
  },
  {
    id: '3',
    product: { name: 'Designer Handbag', category: 'Juri' },
    bidId: 'BID-2024-003',
    bidAmount: '$299.99',
    currentPrice: '$299.99',
    result: 'Lost',
    endDate: '15/01/2024',
    status: 'lost',
  },
  {
    id: '4',
    product: { name: 'Wireless Headphones', category: 'Home Decor' },
    bidId: 'BID-2024-004',
    bidAmount: '$299.99',
    currentPrice: '$299.99',
    result: 'Pending',
    endDate: '15/01/2024',
    status: 'winning',
  },
  {
    id: '5',
    product: { name: 'Gaming Laptop', category: 'Electronics' },
    bidId: 'BID-2024-005',
    bidAmount: '$1,200',
    currentPrice: '$1,200',
    result: 'Won',
    endDate: '16/01/2024',
    status: 'won',
  },
  {
    id: '6',
    product: { name: 'Vintage Camera', category: 'Photography' },
    bidId: 'BID-2024-006',
    bidAmount: '$450',
    currentPrice: '$450',
    result: 'Lost',
    endDate: '17/01/2024',
    status: 'lost',
  },
  {
    id: '7',
    product: { name: 'Designer Sunglasses', category: 'Fashion' },
    bidId: 'BID-2024-007',
    bidAmount: '$150',
    currentPrice: '$150',
    result: 'Won',
    endDate: '18/01/2024',
    status: 'won',
  },
  {
    id: '8',
    product: { name: 'Smartphone', category: 'Electronics' },
    bidId: 'BID-2024-008',
    bidAmount: '$800',
    currentPrice: '$800',
    result: 'Pending',
    endDate: '19/01/2024',
    status: 'won-payment-pending',
  },
  {
    id: '9',
    product: { name: 'Vintage Watch', category: 'Accessories' },
    bidId: 'BID-2024-009',
    bidAmount: '$600',
    currentPrice: '$600',
    result: 'Won',
    endDate: '20/01/2024',
    status: 'won',
  },
  {
    id: '10',
    product: { name: 'Art Painting', category: 'Art' },
    bidId: 'BID-2024-010',
    bidAmount: '$2,500',
    currentPrice: '$2,500',
    result: 'Lost',
    endDate: '21/01/2024',
    status: 'lost',
  },
  {
    id: '11',
    product: { name: 'Musical Instrument', category: 'Music' },
    bidId: 'BID-2024-011',
    bidAmount: '$950',
    currentPrice: '$950',
    result: 'Won',
    endDate: '22/01/2024',
    status: 'won',
  },
  {
    id: '12',
    product: { name: 'Collectible Item', category: 'Collectibles' },
    bidId: 'BID-2024-012',
    bidAmount: '$350',
    currentPrice: '$350',
    result: 'Pending',
    endDate: '23/01/2024',
    status: 'winning',
  },
  {
    id: '13',
    product: { name: 'Sports Equipment', category: 'Sports' },
    bidId: 'BID-2024-013',
    bidAmount: '$180',
    currentPrice: '$180',
    result: 'Won',
    endDate: '24/01/2024',
    status: 'won',
  },
  {
    id: '14',
    product: { name: 'Furniture Set', category: 'Home Decor' },
    bidId: 'BID-2024-014',
    bidAmount: '$1,500',
    currentPrice: '$1,500',
    result: 'Lost',
    endDate: '25/01/2024',
    status: 'lost',
  },
  {
    id: '15',
    product: { name: 'Jewelry Piece', category: 'Jewelry' },
    bidId: 'BID-2024-015',
    bidAmount: '$750',
    currentPrice: '$750',
    result: 'Won',
    endDate: '26/01/2024',
    status: 'won',
  },
]

const PAGE_SIZE = 10

export default function UserTransactionDetail({ transaction, onClose }: UserTransactionDetailProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('By Date')
  const [activeTab, setActiveTab] = useState<'orders' | 'biddings'>('orders')

  const handleTabChange = (tab: 'orders' | 'biddings') => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const totalPages = useMemo(() => {
    const dataLength = activeTab === 'orders' ? MOCK_ORDER_TRANSACTIONS.length : MOCK_BIDDING_TRANSACTIONS.length
    return Math.max(1, Math.ceil(dataLength / PAGE_SIZE))
  }, [activeTab])

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return MOCK_ORDER_TRANSACTIONS.slice(start, start + PAGE_SIZE)
  }, [currentPage])

  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return MOCK_BIDDING_TRANSACTIONS.slice(start, start + PAGE_SIZE)
  }, [currentPage])

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
                src={`https://i.pravatar.cc/100?img=${(transaction.userName.length % 70) + 1}`}
                alt={transaction.userName}
                className="h-20 w-20 rounded-full object-cover ring-2 ring-gray-200"
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
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">+12345678900</span>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
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
              onClick={onClose}
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
        <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-normal text-gray-600 mb-2">Total Orders Spent</h3>
            <p className="text-2xl font-bold text-gray-900">$2149.96</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-normal text-gray-600 mb-2">Total Bidding Spent</h3>
            <p className="text-2xl font-bold text-gray-900">$2149.96</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-normal text-gray-600 mb-2">Total Order Refunds</h3>
            <p className="text-2xl font-bold text-green-600">$199.99</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-normal text-gray-600 mb-2">Total Wallet Refunds</h3>
            <p className="text-2xl font-bold text-green-600">$199.99</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-normal text-gray-600 mb-2">Pending Order Refunds</h3>
            <p className="text-2xl font-bold text-orange-600">$0.00</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-normal text-gray-600 mb-2">Pending Wallet Refunds</h3>
            <p className="text-2xl font-bold text-orange-600">$0.00</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-normal text-gray-600 mb-2">Net Spending</h3>
            <p className="text-2xl font-bold text-gray-900">$1949.97</p>
          </div>
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="rounded-xl bg-white shadow-sm p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
        <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-normal text-gray-600 mb-2">Total Orders</h3>
            <p className="text-2xl font-bold text-gray-900">15</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-normal text-gray-600 mb-2">Completed orders</h3>
            <p className="text-2xl font-bold text-green-600">9</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-normal text-gray-600 mb-2">Refunds Orders</h3>
            <p className="text-2xl font-bold text-orange-600">5</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-normal text-gray-600 mb-2">Total Bidding won</h3>
            <p className="text-2xl font-bold text-gray-900">1</p>
          </div>
        </div>
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
                Orders (40)
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
                Biddings (15)
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
                      {paginatedHistory.map((history) => (
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
                            <BiddingStatusBadge status={history.status} />
                          </TableCell>
                          <TableCell align="center">
                            <ActionMenuButton transactionId={history.id} />
                          </TableCell>
                        </tr>
                      ))}
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
                      {paginatedOrders.map((order) => (
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
                            <ActionMenuButton transactionId={order.id} />
                          </TableCell>
                        </tr>
                      ))}
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
}

function ActionMenuButton({ transactionId }: ActionMenuButtonProps) {
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
    // Handle view action
    // eslint-disable-next-line no-console
    console.log(`View transaction: ${transactionId}`)
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

