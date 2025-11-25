import { useParams } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import type { FinanceTransaction } from './Finance'
import FinanceStatusBadge from '../components/finance/FinanceStatusBadge'
import FinanceActionMenu from '../components/finance/FinanceActionMenu'
import FilterDropdown from '../components/finance/FilterDropdown'
import { ExportIcon, CalendarIcon } from '../components/icons/Icons'

// Mock vendor data
const MOCK_VENDOR = {
  id: 'vendor-1',
  name: 'Touseef Ahmed',
  email: 'alice.johnson@example.com',
  phone: '+1234 567 8900',
  businessName: 'GreenGrocers',
  avatar: 'https://i.pravatar.cc/100?img=12',
  status: 'active',
}

// Mock transactions for this vendor
const MOCK_VENDOR_TRANSACTIONS: FinanceTransaction[] = [
  { id: '1', transactionId: 'TX-1001', user: 'Farhan', orderId: '#1001', amountPaid: '$160', commission: '$16', paymentMethod: 'Credit Card', status: 'paid', orderDate: '12 Aug 2025' },
  { id: '2', transactionId: 'TX-1001', user: 'Hammad', orderId: '#1001', amountPaid: '$160', commission: '$16', paymentMethod: 'PayPal', status: 'pending', orderDate: '12 Aug 2025' },
  { id: '3', transactionId: 'TX-1001', user: 'Ubaid', orderId: '#1001', amountPaid: '$160', commission: '$16', paymentMethod: 'Bank Transfer', status: 'refunded', orderDate: '12 Aug 2025' },
  { id: '4', transactionId: 'TX-1001', user: 'Ahmed', orderId: '#1001', amountPaid: '$160', commission: '$16', paymentMethod: 'Credit Card', status: 'paid', orderDate: '12 Aug 2025' },
  { id: '5', transactionId: 'TX-1001', user: 'Ali', orderId: '#1001', amountPaid: '$160', commission: '$16', paymentMethod: 'PayPal', status: 'refunded', orderDate: '12 Aug 2025' },
  { id: '6', transactionId: 'TX-1001', user: 'Hassan', orderId: '#1001', amountPaid: '$160', commission: '$16', paymentMethod: 'Bank Transfer', status: 'paid', orderDate: '12 Aug 2025' },
  { id: '7', transactionId: 'TX-1001', user: 'Usman', orderId: '#1001', amountPaid: '$160', commission: '$16', paymentMethod: 'Credit Card', status: 'pending', orderDate: '12 Aug 2025' },
  { id: '8', transactionId: 'TX-1001', user: 'Bilal', orderId: '#1001', amountPaid: '$160', commission: '$16', paymentMethod: 'PayPal', status: 'paid', orderDate: '12 Aug 2025' },
  { id: '9', transactionId: 'TX-1001', user: 'Zain', orderId: '#1001', amountPaid: '$160', commission: '$16', paymentMethod: 'Bank Transfer', status: 'refunded', orderDate: '12 Aug 2025' },
  { id: '10', transactionId: 'TX-1001', user: 'Hamza', orderId: '#1001', amountPaid: '$160', commission: '$16', paymentMethod: 'Credit Card', status: 'paid', orderDate: '12 Aug 2025' },
  { id: '11', transactionId: 'TX-1001', user: 'Tariq', orderId: '#1001', amountPaid: '$160', commission: '$16', paymentMethod: 'PayPal', status: 'pending', orderDate: '12 Aug 2025' },
  { id: '12', transactionId: 'TX-1001', user: 'Saeed', orderId: '#1001', amountPaid: '$160', commission: '$16', paymentMethod: 'Bank Transfer', status: 'paid', orderDate: '12 Aug 2025' },
  { id: '13', transactionId: 'TX-1001', user: 'Rehman', orderId: '#1001', amountPaid: '$160', commission: '$16', paymentMethod: 'Credit Card', status: 'refunded', orderDate: '12 Aug 2025' },
  { id: '14', transactionId: 'TX-1001', user: 'Khalid', orderId: '#1001', amountPaid: '$160', commission: '$16', paymentMethod: 'PayPal', status: 'paid', orderDate: '12 Aug 2025' },
  { id: '15', transactionId: 'TX-1001', user: 'Nadeem', orderId: '#1001', amountPaid: '$160', commission: '$16', paymentMethod: 'Bank Transfer', status: 'pending', orderDate: '12 Aug 2025' },
  { id: '16', transactionId: 'TX-1001', user: 'Waseem', orderId: '#1001', amountPaid: '$160', commission: '$16', paymentMethod: 'Credit Card', status: 'paid', orderDate: '12 Aug 2025' },
  { id: '17', transactionId: 'TX-1001', user: 'Faisal', orderId: '#1001', amountPaid: '$160', commission: '$16', paymentMethod: 'PayPal', status: 'refunded', orderDate: '12 Aug 2025' },
  { id: '18', transactionId: 'TX-1001', user: 'Junaid', orderId: '#1001', amountPaid: '$160', commission: '$16', paymentMethod: 'Bank Transfer', status: 'paid', orderDate: '12 Aug 2025' },
]

const PAGE_SIZE = 10

export default function VendorFinanceDetail() {
  const { vendorId } = useParams<{ vendorId: string }>()
  const [vendor, setVendor] = useState<typeof MOCK_VENDOR | null>(null)
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('By Date')

  useEffect(() => {
    // Load vendor data - in a real app, this would fetch based on vendorId
    setVendor(MOCK_VENDOR)
    setTransactions(MOCK_VENDOR_TRANSACTIONS)
  }, [vendorId])

  const filteredTransactions = useMemo(() => {
    let result = [...transactions]

    // Apply sorting
    const parseDate = (dateStr: string) => {
      const months: Record<string, number> = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      }
      const parts = dateStr.split(' ')
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10)
        const month = months[parts[1]] ?? 0
        const year = parseInt(parts[2], 10)
        const date = new Date(year, month, day)
        return isNaN(date.getTime()) ? 0 : date.getTime()
      }
      return 0
    }

    if (sortBy === 'Newest First') {
      result.sort((a, b) => parseDate(b.orderDate) - parseDate(a.orderDate))
    } else if (sortBy === 'Oldest First') {
      result.sort((a, b) => parseDate(a.orderDate) - parseDate(b.orderDate))
    } else {
      // By Date (default) - newest first
      result.sort((a, b) => parseDate(b.orderDate) - parseDate(a.orderDate))
    }

    return result
  }, [transactions, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE))

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredTransactions.slice(start, start + PAGE_SIZE)
  }, [filteredTransactions, currentPage])

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
    console.log('View profile clicked')
    // Navigate to vendor profile page
  }

  // Calculate finance summary
  const totalEarnings = transactions.reduce((sum, t) => {
    const amount = parseFloat(t.amountPaid.replace('$', '').replace(',', ''))
    const commission = parseFloat(t.commission.replace('$', '').replace(',', ''))
    return sum + (amount - commission)
  }, 0)

  const pendingPayouts = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => {
      const amount = parseFloat(t.amountPaid.replace('$', '').replace(',', ''))
      const commission = parseFloat(t.commission.replace('$', '').replace(',', ''))
      return sum + (amount - commission)
    }, 0)

  const commissionPaid = transactions.reduce((sum, t) => {
    return sum + parseFloat(t.commission.replace('$', '').replace(',', ''))
  }, 0)

  const refundsProcessed = transactions
    .filter(t => t.status === 'refunded')
    .reduce((sum, t) => {
      const amount = parseFloat(t.amountPaid.replace('$', '').replace(',', ''))
      return sum + amount
    }, 0)

  if (!vendor) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Loading vendor details...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Finance</h1>
        <p className="text-sm text-gray-600 mt-1">Dashboard - Orders</p>
      </div>

      {/* Vendor Profile Section */}
      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-[#F7931E]/8 via-[#F7931E]/3 to-white p-6">
        <div className="flex items-center gap-6">
          <img
            src={vendor.avatar}
            alt={vendor.name}
            className="h-20 w-20 rounded-full object-cover border-2 border-[#F7931E]"
          />
          <div className="flex-1 flex items-start justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">{vendor.name}</h2>
              <p className="text-sm text-gray-600 mt-1">Vendor</p>
              <div className="mt-3 space-y-1.5">
                <p className="text-sm text-gray-600">{vendor.email}</p>
                <p className="text-sm text-gray-600">{vendor.phone}</p>
              </div>
              <div className="mt-3">
                <span className="inline-flex items-center justify-center rounded-full bg-green-500 px-3 py-1.5 text-sm font-medium text-white">
                  Active
                </span>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <p className="text-sm font-semibold text-gray-900">Business Name</p>
                <p className="text-base font-semibold text-gray-900 mt-1">{vendor.businessName}</p>
              </div>
              <button
                type="button"
                onClick={handleViewProfile}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E8840D] cursor-pointer"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Finance Summary Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Finance Summary</h2>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="pr-6 border-r border-gray-200 last:border-r-0">
              <div className="text-sm text-gray-600">
                <p>Total</p>
                <p>Earnings</p>
                <p>(all time)</p>
              </div>
              <p className="text-xl font-bold text-gray-900 mt-1">$ {totalEarnings.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
            </div>
            <div className="px-6 border-r border-gray-200 last:border-r-0">
              <div className="text-sm text-gray-600">
                <p>Pending</p>
                <p>Payouts</p>
              </div>
              <p className="text-xl font-bold text-gray-900 mt-1">$ {pendingPayouts.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
            </div>
            <div className="px-6 border-r border-gray-200 last:border-r-0">
              <div className="text-sm text-gray-600">
                <p>Commission Paid</p>
                <p>to Platform</p>
              </div>
              <p className="text-xl font-bold text-gray-900 mt-1">$ {commissionPaid.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
            </div>
            <div className="pl-6">
              <div className="text-sm text-gray-600">
                <p>Refunds</p>
                <p>Processed</p>
              </div>
              <p className="text-xl font-bold text-gray-900 mt-1">$ {refundsProcessed.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
          <div className="flex items-center gap-3">
            <FilterDropdown
              label={sortBy}
              options={['By Date', 'Newest First', 'Oldest First']}
              onSelect={(value) => setSortBy(value)}
              icon={<CalendarIcon className="h-4 w-4" />}
            />
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer"
            >
              Export
              <ExportIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          {/* Table */}
          <div className="py-4 -mx-6">
            <div className="w-full">
              <div className="overflow-x-auto md:overflow-x-visible">
                <table className="min-w-[900px] md:min-w-full w-full border-collapse text-sm">
                  <thead className="bg-transparent">
                    <tr>
                      <th className="whitespace-nowrap py-2 text-xs sm:text-sm font-semibold tracking-wide text-gray-700 border-b border-gray-200 bg-white text-left pl-6 pr-4">Transaction ID</th>
                      <th className="whitespace-nowrap py-2 text-xs sm:text-sm font-semibold tracking-wide text-gray-700 border-b border-gray-200 bg-white text-left px-4">Order ID</th>
                      <th className="whitespace-nowrap py-2 text-xs sm:text-sm font-semibold tracking-wide text-gray-700 border-b border-gray-200 bg-white text-left px-4">Amount Paid</th>
                      <th className="whitespace-nowrap py-2 text-xs sm:text-sm font-semibold tracking-wide text-gray-700 border-b border-gray-200 bg-white text-left px-4">Commission</th>
                      <th className="whitespace-nowrap py-2 text-xs sm:text-sm font-semibold tracking-wide text-gray-700 border-b border-gray-200 bg-white text-left px-4">Total Earning</th>
                      <th className="whitespace-nowrap py-2 text-xs sm:text-sm font-semibold tracking-wide text-gray-700 border-b border-gray-200 bg-white text-left px-4">Status</th>
                      <th className="whitespace-nowrap py-2 text-xs sm:text-sm font-semibold tracking-wide text-gray-700 border-b border-gray-200 bg-white text-left px-4">Date</th>
                      <th className="whitespace-nowrap py-2 text-xs sm:text-sm font-semibold tracking-wide text-gray-700 border-b border-gray-200 bg-white text-left pl-4 pr-6">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTransactions.map((transaction) => {
                      const amountPaid = parseFloat(transaction.amountPaid.replace('$', '').replace(',', ''))
                      const commission = parseFloat(transaction.commission.replace('$', '').replace(',', ''))
                      const totalEarning = amountPaid - commission
                      
                      return (
                        <tr key={transaction.id} className="border-b border-gray-200 last:border-b-0">
                          <td className="py-2 text-gray-700 text-sm pl-6 pr-4">{transaction.transactionId}</td>
                          <td className="py-2 text-gray-700 text-sm px-4">{transaction.orderId}</td>
                          <td className="py-2 text-gray-700 text-sm text-left px-4">{transaction.amountPaid}</td>
                          <td className="py-2 text-gray-700 text-sm text-left px-4">{transaction.commission}</td>
                          <td className="py-2 text-gray-700 text-sm text-left font-medium px-4">${totalEarning.toFixed(0)}</td>
                          <td className="py-2 text-gray-700 text-sm px-4">
                            <FinanceStatusBadge status={transaction.status} />
                          </td>
                          <td className="py-2 text-gray-700 text-xs text-left px-4">{transaction.orderDate}</td>
                          <td className="py-2 text-gray-700 text-sm text-left pl-4 pr-6">
                            <FinanceActionMenu onSelect={() => {}} />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <footer className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-4 mt-4">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center sm:justify-end">
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
        </div>
      </div>
    </div>
  )
}

