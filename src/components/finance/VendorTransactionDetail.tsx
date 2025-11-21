import { useState, useMemo } from 'react'
import FinanceActionMenu, { type FinanceActionType } from './FinanceActionMenu'
import FilterDropdown from './FilterDropdown'
import { DownloadIcon, CalendarIcon } from '../icons/Icons'
import type { FinanceTransaction } from '../../pages/Finance'

interface VendorTransactionDetailProps {
  transaction: FinanceTransaction
  onClose: () => void
  onActionSelect?: (transaction: FinanceTransaction, action: FinanceActionType) => void
}

interface VendorTransactionHistory {
  id: string
  transactionId: string
  orderId: string
  amountPaid: string
  commission: string
  totalEarning: string
  status: 'paid' | 'pending' | 'refunded'
  date: string
}

// Mock transaction history data
const MOCK_TRANSACTION_HISTORY: VendorTransactionHistory[] = [
  { id: '1', transactionId: 'TX-001', orderId: '#001', amountPaid: '$150', commission: '$10', totalEarning: '$140', status: 'paid', date: '12 Aug, 2023' },
  { id: '2', transactionId: 'TX-002', orderId: '#002', amountPaid: '$150', commission: '$10', totalEarning: '$140', status: 'pending', date: '12 Aug, 2023' },
  { id: '3', transactionId: 'TX-003', orderId: '#003', amountPaid: '$150', commission: '$10', totalEarning: '$140', status: 'refunded', date: '12 Aug, 2023' },
  { id: '4', transactionId: 'TX-004', orderId: '#004', amountPaid: '$150', commission: '$10', totalEarning: '$140', status: 'paid', date: '12 Aug, 2023' },
  { id: '5', transactionId: 'TX-005', orderId: '#005', amountPaid: '$150', commission: '$10', totalEarning: '$140', status: 'paid', date: '12 Aug, 2023' },
  { id: '6', transactionId: 'TX-006', orderId: '#006', amountPaid: '$150', commission: '$10', totalEarning: '$140', status: 'paid', date: '12 Aug, 2023' },
  { id: '7', transactionId: 'TX-007', orderId: '#007', amountPaid: '$150', commission: '$10', totalEarning: '$140', status: 'paid', date: '12 Aug, 2023' },
  { id: '8', transactionId: 'TX-008', orderId: '#008', amountPaid: '$150', commission: '$10', totalEarning: '$140', status: 'paid', date: '12 Aug, 2023' },
  { id: '9', transactionId: 'TX-009', orderId: '#009', amountPaid: '$150', commission: '$10', totalEarning: '$140', status: 'paid', date: '12 Aug, 2023' },
  { id: '10', transactionId: 'TX-010', orderId: '#010', amountPaid: '$150', commission: '$10', totalEarning: '$140', status: 'paid', date: '12 Aug, 2023' },
  { id: '11', transactionId: 'TX-011', orderId: '#011', amountPaid: '$150', commission: '$10', totalEarning: '$140', status: 'paid', date: '12 Aug, 2023' },
  { id: '12', transactionId: 'TX-012', orderId: '#012', amountPaid: '$150', commission: '$10', totalEarning: '$140', status: 'paid', date: '12 Aug, 2023' },
  { id: '13', transactionId: 'TX-013', orderId: '#013', amountPaid: '$150', commission: '$10', totalEarning: '$140', status: 'paid', date: '12 Aug, 2023' },
  { id: '14', transactionId: 'TX-014', orderId: '#014', amountPaid: '$150', commission: '$10', totalEarning: '$140', status: 'paid', date: '12 Aug, 2023' },
  { id: '15', transactionId: 'TX-015', orderId: '#015', amountPaid: '$150', commission: '$10', totalEarning: '$140', status: 'paid', date: '12 Aug, 2023' },
]

const PAGE_SIZE = 10

export default function VendorTransactionDetail({ transaction, onClose, onActionSelect }: VendorTransactionDetailProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('By Date')

  const totalPages = Math.max(1, Math.ceil(MOCK_TRANSACTION_HISTORY.length / PAGE_SIZE))

  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return MOCK_TRANSACTION_HISTORY.slice(start, start + PAGE_SIZE)
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
  }

  // Calculate finance summary values
  const totalEarning = MOCK_TRANSACTION_HISTORY
    .filter(t => t.status === 'paid')
    .reduce((sum, t) => sum + parseFloat(t.totalEarning.replace('$', '')), 0)
    .toFixed(2)

  const pendingPayments = MOCK_TRANSACTION_HISTORY
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + parseFloat(t.amountPaid.replace('$', '')), 0)
    .toFixed(2)

  const completedTransactions = MOCK_TRANSACTION_HISTORY
    .filter(t => t.status === 'paid')
    .length

  const failedTransactions = MOCK_TRANSACTION_HISTORY
    .filter(t => t.status === 'refunded')
    .length

  return (
    <div className="space-y-6">
      {/* Profile and Business Information Section */}
      <div className="rounded-xl bg-white shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div className="flex items-start gap-4">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <img
                src={`https://i.pravatar.cc/100?img=${(transaction.user.length % 70) + 1}`}
                alt={transaction.user}
                className="h-20 w-20 rounded-full object-cover ring-2 ring-gray-200"
              />
            </div>
            
            {/* Profile Information */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{transaction.user}</h2>
              <p className="text-sm text-gray-600 mb-4">Vendor</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">alice.johnson@example.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">+1 234 567 8900</span>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Business Name and View Profile Button */}
          <div className="flex flex-col items-end gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Business Name</p>
              <p className="text-lg font-semibold text-gray-900">GreenGrooms</p>
            </div>
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

      {/* Finance Summary Section */}
      <div className="rounded-xl bg-white shadow-sm p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Finance Summary</h2>
        <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-normal text-gray-600 mb-2">Total Earning</h3>
            <p className="text-2xl font-bold text-gray-900">${totalEarning}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-normal text-gray-600 mb-2">Pending Payments</h3>
            <p className="text-2xl font-bold text-gray-900">${pendingPayments}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-normal text-gray-600 mb-2">Completed Transactions</h3>
            <p className="text-2xl font-bold text-gray-900">{completedTransactions}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-normal text-gray-600 mb-2">Failed Transactions</h3>
            <p className="text-2xl font-bold text-gray-900">{failedTransactions}</p>
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      {/* Transaction History Heading and Controls */}
      <div className="mt-6 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Transaction History</h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
          <FilterDropdown
            label={sortBy}
            options={['By Date', 'Newest First', 'Oldest First']}
            onSelect={(value) => setSortBy(value)}
            icon={<CalendarIcon className="h-4 w-4" />}
          />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer"
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
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 whitespace-nowrap cursor-pointer"
          >
            <DownloadIcon className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <section className="rounded-xl bg-white shadow-sm">

        {/* Transaction History Table */}
        <div className="px-4 py-4 sm:px-6">
          <div className="overflow-x-auto md:overflow-x-visible">
            <div className="w-full rounded-xl" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}>
              <table className="min-w-[900px] md:min-w-full w-full border-collapse text-sm">
                <thead className="bg-transparent">
                  <tr>
                    <TableHeader>Transaction ID</TableHeader>
                    <TableHeader>Order ID</TableHeader>
                    <TableHeader align="right">Amount Paid</TableHeader>
                    <TableHeader align="right">Commission</TableHeader>
                    <TableHeader align="right">Total Earning</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Date</TableHeader>
                    <TableHeader align="center">Action</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {paginatedHistory.map((history) => (
                    <tr key={history.id} className="border-b border-gray-200 last:border-b-0">
                      <TableCell>{history.transactionId}</TableCell>
                      <TableCell>{history.orderId}</TableCell>
                      <TableCell align="right" className="font-medium">{history.amountPaid}</TableCell>
                      <TableCell align="right">{history.commission}</TableCell>
                      <TableCell align="right" className="font-medium">{history.totalEarning}</TableCell>
                      <TableCell>
                        <VendorStatusBadge status={history.status} />
                      </TableCell>
                      <TableCell className="text-xs">{history.date}</TableCell>
                      <TableCell align="center">
                        <FinanceActionMenu onSelect={(action) => onActionSelect?.(transaction, action)} />
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
              Previous
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
      className={`whitespace-nowrap px-2 sm:px-2.5 md:px-3 py-2 sm:py-3 text-xs sm:text-sm font-semibold tracking-wide text-gray-700 border-b-2 border-gray-300 bg-white ${textAlign}`}
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
      className={`px-2 sm:px-2.5 md:px-3 py-2 text-gray-700 ${textAlign} ${textSizeClass} ${className}`}
    >
      {children}
    </td>
  )
}

type VendorStatus = 'paid' | 'pending' | 'refunded'

interface VendorStatusBadgeProps {
  status: VendorStatus
  className?: string
}

const VENDOR_STATUS_STYLES: Record<VendorStatus, { bg: string; text: string }> = {
  paid: {
    bg: '#DCF6E5',
    text: '#118D57',
  },
  pending: {
    bg: '#FFF2D6',
    text: '#B76E00',
  },
  refunded: {
    bg: '#FFF2D6',
    text: '#B76E00',
  },
}

const VENDOR_STATUS_LABEL: Record<VendorStatus, string> = {
  paid: 'Paid',
  pending: 'Pending',
  refunded: 'Refunded',
}

function VendorStatusBadge({ status, className = '' }: VendorStatusBadgeProps) {
  const style = VENDOR_STATUS_STYLES[status]
  
  return (
    <span
      className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium ${className}`}
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {VENDOR_STATUS_LABEL[status]}
    </span>
  )
}

