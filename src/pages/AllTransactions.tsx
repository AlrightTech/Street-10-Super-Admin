import { useMemo, useState } from 'react'
import VendorUsersToggle from '../components/finance/VendorUsersToggle'
import FinanceFilterTabs, { type FinanceFilterKey } from '../components/finance/FinanceFilterTabs'
import FinanceTable from '../components/finance/FinanceTable'
import UserTransactionsTable from '../components/finance/UserTransactionsTable'
import UserTransactionDetail from '../components/finance/UserTransactionDetail'
import VendorTransactionDetail from '../components/finance/VendorTransactionDetail'
import FilterDropdown from '../components/finance/FilterDropdown'
import type { FinanceActionType } from '../components/finance/FinanceActionMenu'
import SearchBar from '../components/ui/SearchBar'
import { CalendarIcon, ExportIcon } from '../components/icons/Icons'
import type { UserTransaction, FinanceTransaction } from './Finance'

// Mock data for all transactions
const MOCK_ALL_TRANSACTIONS: UserTransaction[] = [
  { id: '1', transactionId: 'TXN-2024-001', userName: 'Michael Johnson', userEmail: 'michael.j@email.com', type: 'credit', amount: '$150.00', paymentMethod: 'Bank Transfer', date: '2024-01-20', status: 'pending' },
  { id: '2', transactionId: 'TXN-2024-001', userName: 'Michael Johnson', userEmail: 'michael.j@email.com', type: 'debit', amount: '$150.00', paymentMethod: 'Wallet Balance', date: '2024-01-20', status: 'completed' },
  { id: '3', transactionId: 'TXN-2024-001', userName: 'Michael Johnson', userEmail: 'michael.j@email.com', type: 'credit', amount: '$150.00', paymentMethod: 'Credit Card', date: '2024-01-20', status: 'pending' },
  { id: '4', transactionId: 'TXN-2024-001', userName: 'Michael Johnson', userEmail: 'michael.j@email.com', type: 'debit', amount: '$150.00', paymentMethod: 'Wallet Balance', date: '2024-01-20', status: 'failed' },
  { id: '5', transactionId: 'TXN-2024-001', userName: 'Michael Johnson', userEmail: 'michael.j@email.com', type: 'credit', amount: '$150.00', paymentMethod: 'Bank Transfer', date: '2024-01-20', status: 'completed' },
  { id: '6', transactionId: 'TXN-2024-002', userName: 'Sarah Williams', userEmail: 'sarah.w@email.com', type: 'credit', amount: '$200.00', paymentMethod: 'Credit Card', date: '2024-01-21', status: 'completed' },
  { id: '7', transactionId: 'TXN-2024-003', userName: 'David Brown', userEmail: 'david.b@email.com', type: 'debit', amount: '$175.00', paymentMethod: 'Wallet Balance', date: '2024-01-22', status: 'pending' },
  { id: '8', transactionId: 'TXN-2024-004', userName: 'Emily Davis', userEmail: 'emily.d@email.com', type: 'credit', amount: '$125.00', paymentMethod: 'Bank Transfer', date: '2024-01-23', status: 'failed' },
  { id: '9', transactionId: 'TXN-2024-005', userName: 'James Wilson', userEmail: 'james.w@email.com', type: 'credit', amount: '$300.00', paymentMethod: 'Credit Card', date: '2024-01-24', status: 'completed' },
  { id: '10', transactionId: 'TXN-2024-006', userName: 'Lisa Anderson', userEmail: 'lisa.a@email.com', type: 'debit', amount: '$100.00', paymentMethod: 'Wallet Balance', date: '2024-01-25', status: 'pending' },
  { id: '11', transactionId: 'TXN-2024-007', userName: 'Robert Taylor', userEmail: 'robert.t@email.com', type: 'credit', amount: '$250.00', paymentMethod: 'Bank Transfer', date: '2024-01-26', status: 'completed' },
  { id: '12', transactionId: 'TXN-2024-008', userName: 'Jennifer Martinez', userEmail: 'jennifer.m@email.com', type: 'debit', amount: '$180.00', paymentMethod: 'Credit Card', date: '2024-01-27', status: 'failed' },
  { id: '13', transactionId: 'TXN-2024-009', userName: 'Christopher Lee', userEmail: 'christopher.l@email.com', type: 'credit', amount: '$220.00', paymentMethod: 'Wallet Balance', date: '2024-01-28', status: 'completed' },
  { id: '14', transactionId: 'TXN-2024-010', userName: 'Amanda White', userEmail: 'amanda.w@email.com', type: 'credit', amount: '$190.00', paymentMethod: 'Bank Transfer', date: '2024-01-29', status: 'pending' },
  { id: '15', transactionId: 'TXN-2024-011', userName: 'Daniel Harris', userEmail: 'daniel.h@email.com', type: 'debit', amount: '$160.00', paymentMethod: 'Credit Card', date: '2024-01-30', status: 'completed' },
  { id: '16', transactionId: 'TXN-2024-012', userName: 'Jessica Clark', userEmail: 'jessica.c@email.com', type: 'credit', amount: '$140.00', paymentMethod: 'Wallet Balance', date: '2024-02-01', status: 'failed' },
  { id: '17', transactionId: 'TXN-2024-013', userName: 'Matthew Lewis', userEmail: 'matthew.l@email.com', type: 'credit', amount: '$270.00', paymentMethod: 'Bank Transfer', date: '2024-02-02', status: 'completed' },
  { id: '18', transactionId: 'TXN-2024-014', userName: 'Ashley Walker', userEmail: 'ashley.w@email.com', type: 'debit', amount: '$130.00', paymentMethod: 'Credit Card', date: '2024-02-03', status: 'pending' },
  { id: '19', transactionId: 'TXN-2024-015', userName: 'Ryan Hall', userEmail: 'ryan.h@email.com', type: 'credit', amount: '$210.00', paymentMethod: 'Wallet Balance', date: '2024-02-04', status: 'completed' },
  { id: '20', transactionId: 'TXN-2024-016', userName: 'Nicole Young', userEmail: 'nicole.y@email.com', type: 'debit', amount: '$165.00', paymentMethod: 'Bank Transfer', date: '2024-02-05', status: 'failed' },
  { id: '21', transactionId: 'TXN-2024-017', userName: 'Kevin King', userEmail: 'kevin.k@email.com', type: 'credit', amount: '$240.00', paymentMethod: 'Credit Card', date: '2024-02-06', status: 'completed' },
  { id: '22', transactionId: 'TXN-2024-018', userName: 'Michelle Wright', userEmail: 'michelle.w@email.com', type: 'credit', amount: '$155.00', paymentMethod: 'Wallet Balance', date: '2024-02-07', status: 'pending' },
  { id: '23', transactionId: 'TXN-2024-019', userName: 'Brandon Lopez', userEmail: 'brandon.l@email.com', type: 'debit', amount: '$185.00', paymentMethod: 'Bank Transfer', date: '2024-02-08', status: 'completed' },
  { id: '24', transactionId: 'TXN-2024-020', userName: 'Stephanie Hill', userEmail: 'stephanie.h@email.com', type: 'credit', amount: '$195.00', paymentMethod: 'Credit Card', date: '2024-02-09', status: 'failed' },
]

const PAGE_SIZE = 10

// Mock data for vendor transactions
const MOCK_VENDOR_TRANSACTIONS: FinanceTransaction[] = [
  { id: '1', transactionId: 'TX-1001', user: 'Farhan', orderId: '#1001', amountPaid: '$160', commission: '$16', paymentMethod: 'Credit Card', status: 'paid', orderDate: '12 Aug 2025' },
  { id: '2', transactionId: 'TX-1001', user: 'Hammad', orderId: '#1001', amountPaid: '$160', commission: '$16', paymentMethod: 'PayPal', status: 'pending', orderDate: '12 Aug 2025' },
  { id: '3', transactionId: 'TX-1001', user: 'Ubaid', orderId: '#1001', amountPaid: '$160', commission: '$16', paymentMethod: 'Bank Transfer', status: 'refunded', orderDate: '12 Aug 2025' },
  { id: '4', transactionId: 'TX-1002', user: 'Ahmed', orderId: '#1002', amountPaid: '$200', commission: '$20', paymentMethod: 'Credit Card', status: 'paid', orderDate: '13 Aug 2025' },
  { id: '5', transactionId: 'TX-1003', user: 'Ali', orderId: '#1003', amountPaid: '$150', commission: '$15', paymentMethod: 'PayPal', status: 'refunded', orderDate: '14 Aug 2025' },
  { id: '6', transactionId: 'TX-1004', user: 'Hassan', orderId: '#1004', amountPaid: '$180', commission: '$18', paymentMethod: 'Bank Transfer', status: 'pending', orderDate: '15 Aug 2025' },
  { id: '7', transactionId: 'TX-1005', user: 'Usman', orderId: '#1005', amountPaid: '$220', commission: '$22', paymentMethod: 'Credit Card', status: 'paid', orderDate: '16 Aug 2025' },
  { id: '8', transactionId: 'TX-1006', user: 'Bilal', orderId: '#1006', amountPaid: '$140', commission: '$14', paymentMethod: 'PayPal', status: 'completed', orderDate: '17 Aug 2025' },
  { id: '9', transactionId: 'TX-1007', user: 'Zain', orderId: '#1007', amountPaid: '$190', commission: '$19', paymentMethod: 'Bank Transfer', status: 'paid', orderDate: '18 Aug 2025' },
  { id: '10', transactionId: 'TX-1008', user: 'Hamza', orderId: '#1008', amountPaid: '$170', commission: '$17', paymentMethod: 'Credit Card', status: 'refunded', orderDate: '19 Aug 2025' },
]

const USER_FILTER_OPTIONS: { key: 'all' | 'completed' | 'pending' | 'failed'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'completed', label: 'Completed' },
  { key: 'pending', label: 'Pending' },
  { key: 'failed', label: 'Failed' },
]

const VENDOR_FILTER_OPTIONS: { key: FinanceFilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'refunded', label: 'Refunded' },
  { key: 'paid', label: 'Paid' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
]

export default function AllTransactions() {
  const [activeTab, setActiveTab] = useState<'vendor' | 'users'>('users')
  const [activeFilter, setActiveFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all')
  const [vendorActiveFilter, setVendorActiveFilter] = useState<FinanceFilterKey>('all')
  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('Sort By Date')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [viewingTransaction, setViewingTransaction] = useState<UserTransaction | null>(null)
  const [viewingVendorTransaction, setViewingVendorTransaction] = useState<FinanceTransaction | null>(null)

  const userFilterTabsWithCounts = useMemo(
    () =>
      USER_FILTER_OPTIONS.map((tab) => ({
        ...tab,
        count:
          tab.key === 'all'
            ? MOCK_ALL_TRANSACTIONS.length
            : MOCK_ALL_TRANSACTIONS.filter((t) => t.status === tab.key).length,
        badgeClassName: {
          active: tab.key === 'all' ? 'bg-[#4C50A2] text-white' : 
                  tab.key === 'completed' ? 'bg-[#DCF6E5] text-[#118D57]' :
                  tab.key === 'pending' ? 'bg-[#FFF2D6] text-[#B76E00]' :
                  'bg-[#FFE4DE] text-[#B71D18]',
          inactive: tab.key === 'all' ? 'bg-[#4C50A2] text-white' : 
                    tab.key === 'completed' ? 'bg-[#DCF6E5] text-[#118D57]' :
                    tab.key === 'pending' ? 'bg-[#FFF2D6] text-[#B76E00]' :
                    'bg-[#FFE4DE] text-[#B71D18]',
        },
      })),
    [],
  )

  const vendorFilterTabsWithCounts = useMemo(
    () =>
      VENDOR_FILTER_OPTIONS.map((tab) => ({
        ...tab,
        count:
          tab.key === 'all'
            ? MOCK_VENDOR_TRANSACTIONS.length
            : MOCK_VENDOR_TRANSACTIONS.filter((t) => {
                if (tab.key === 'refunded') return t.status === 'refunded'
                if (tab.key === 'paid') return t.status === 'paid'
                if (tab.key === 'pending') return t.status === 'pending'
                if (tab.key === 'completed') return t.status === 'completed'
                return false
              }).length,
        badgeClassName: {
          active: tab.key === 'all' ? 'bg-[#4C50A2] text-white' : 
                  tab.key === 'refunded' ? 'bg-[#FFE4DE] text-[#B71D18]' :
                  tab.key === 'paid' ? 'bg-[#DCF6E5] text-[#118D57]' :
                  tab.key === 'pending' ? 'bg-[#FFF2D6] text-[#B76E00]' :
                  'bg-[#FFF2D6] text-[#B76E00]',
          inactive: tab.key === 'all' ? 'bg-[#4C50A2] text-white' : 
                    tab.key === 'refunded' ? 'bg-[#FFE4DE] text-[#B71D18]' :
                    tab.key === 'paid' ? 'bg-[#DCF6E5] text-[#118D57]' :
                    tab.key === 'pending' ? 'bg-[#FFF2D6] text-[#B76E00]' :
                    'bg-[#FFF2D6] text-[#B76E00]',
        },
      })),
    [],
  )

  const filteredUserTransactions = useMemo(() => {
    let result = [...MOCK_ALL_TRANSACTIONS]

    // Apply status filter from dropdown
    if (statusFilter !== 'All Status') {
      const statusMap: Record<string, 'completed' | 'pending' | 'failed'> = {
        'Completed': 'completed',
        'Pending': 'pending',
        'Failed': 'failed',
      }
      const status = statusMap[statusFilter]
      if (status) {
        result = result.filter((transaction) => transaction.status === status)
      }
    }

    // Apply tab filter
    if (activeFilter !== 'all') {
      result = result.filter((transaction) => transaction.status === activeFilter)
    }

    // Apply search filter
    if (searchValue.trim()) {
      const query = searchValue.toLowerCase()
      result = result.filter(
        (transaction) =>
          transaction.transactionId.toLowerCase().includes(query) ||
          transaction.userName.toLowerCase().includes(query) ||
          transaction.userEmail.toLowerCase().includes(query),
      )
    }

    // Apply sorting
    const parseDate = (dateStr: string) => {
      // Handle YYYY-MM-DD format
      const date = new Date(dateStr)
      return isNaN(date.getTime()) ? 0 : date.getTime()
    }
    
    if (sortBy === 'Newest First') {
      result.sort((a, b) => parseDate(b.date) - parseDate(a.date))
    } else if (sortBy === 'Oldest First') {
      result.sort((a, b) => parseDate(a.date) - parseDate(b.date))
    } else {
      // Sort By Date (default) - newest first
      result.sort((a, b) => parseDate(b.date) - parseDate(a.date))
    }

    return result
  }, [activeFilter, searchValue, statusFilter, sortBy])

  const filteredVendorTransactions = useMemo(() => {
    let result = [...MOCK_VENDOR_TRANSACTIONS]

    // Apply tab filter
    if (vendorActiveFilter !== 'all') {
      result = result.filter((transaction) => {
        if (vendorActiveFilter === 'refunded') return transaction.status === 'refunded'
        if (vendorActiveFilter === 'paid') return transaction.status === 'paid'
        if (vendorActiveFilter === 'pending') return transaction.status === 'pending'
        if (vendorActiveFilter === 'completed') return transaction.status === 'completed'
        return false
      })
    }

    // Apply search filter
    if (searchValue.trim()) {
      const query = searchValue.toLowerCase()
      result = result.filter(
        (transaction) =>
          transaction.transactionId.toLowerCase().includes(query) ||
          transaction.user.toLowerCase().includes(query) ||
          transaction.orderId.toLowerCase().includes(query),
      )
    }

    // Apply sorting
    const parseVendorDate = (dateStr: string) => {
      // Handle "12 Aug 2025" format
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
      result.sort((a, b) => parseVendorDate(b.orderDate) - parseVendorDate(a.orderDate))
    } else if (sortBy === 'Oldest First') {
      result.sort((a, b) => parseVendorDate(a.orderDate) - parseVendorDate(b.orderDate))
    } else {
      // Sort By Date (default) - newest first
      result.sort((a, b) => parseVendorDate(b.orderDate) - parseVendorDate(a.orderDate))
    }

    return result
  }, [vendorActiveFilter, searchValue, sortBy])

  const userTotalPages = Math.max(1, Math.ceil(filteredUserTransactions.length / PAGE_SIZE))
  const vendorTotalPages = Math.max(1, Math.ceil(filteredVendorTransactions.length / PAGE_SIZE))

  const paginatedUserTransactions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredUserTransactions.slice(start, start + PAGE_SIZE)
  }, [filteredUserTransactions, currentPage])

  const paginatedVendorTransactions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredVendorTransactions.slice(start, start + PAGE_SIZE)
  }, [filteredVendorTransactions, currentPage])

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const totalPagesToUse = activeTab === 'users' ? userTotalPages : vendorTotalPages
    
    if (totalPagesToUse <= 8) {
      for (let i = 1; i <= totalPagesToUse; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      
      if (currentPage > 3) {
        pages.push('...')
      }
      
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPagesToUse - 1, currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPagesToUse) {
          pages.push(i)
        }
      }
      
      if (currentPage < totalPagesToUse - 2) {
        pages.push('...')
      }
      
      if (totalPagesToUse > 1) {
        pages.push(totalPagesToUse)
      }
    }
    
    return pages
  }

  const handleUserFilterChange = (filterKey: FinanceFilterKey) => {
    setActiveFilter(filterKey as 'all' | 'completed' | 'pending' | 'failed')
    setCurrentPage(1)
  }

  const handleVendorFilterChange = (filterKey: FinanceFilterKey) => {
    setVendorActiveFilter(filterKey)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    const maxPages = activeTab === 'users' ? userTotalPages : vendorTotalPages
    if (page < 1 || page > maxPages) return
    setCurrentPage(page)
  }

  const handleTransactionAction = (transaction: UserTransaction | FinanceTransaction, action: FinanceActionType) => {
    if (action === 'view') {
      if ('orderId' in transaction) {
        // Vendor transaction
        setViewingVendorTransaction(transaction as FinanceTransaction)
      } else {
        // User transaction
        setViewingTransaction(transaction as UserTransaction)
      }
    } else {
      console.log(`Action "${action}" selected for transaction ${transaction.transactionId}`)
    }
  }

  // If viewing user transaction detail, show detail view
  if (viewingTransaction && activeTab === 'users') {
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">All Transactions</h1>
          <p className="text-sm text-gray-600 mt-1">Dashboard - Finance - All Transactions</p>
        </div>
        <UserTransactionDetail
          transaction={viewingTransaction}
          onClose={() => setViewingTransaction(null)}
        />
      </div>
    )
  }

  // If viewing vendor transaction detail, show detail view
  if (viewingVendorTransaction && activeTab === 'vendor') {
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">All Transactions</h1>
          <p className="text-sm text-gray-600 mt-1">Dashboard - Finance - All Transactions</p>
        </div>
        <VendorTransactionDetail
          transaction={viewingVendorTransaction}
          onClose={() => setViewingVendorTransaction(null)}
          onActionSelect={handleTransactionAction}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">All Transactions</h1>
        <p className="text-sm text-gray-600 mt-1">Dashboard - Finance - All Transactions</p>
      </div>

      {/* Vendor/Users Toggle */}
      <div className="mt-6">
        <div className="bg-white rounded-lg pt-1 px-1 pb-0">
          <VendorUsersToggle 
            activeTab={activeTab} 
            onTabChange={(tab) => {
              setActiveTab(tab)
              setCurrentPage(1)
              setSearchValue('')
            }} 
          />
        </div>
      </div>

      {/* User Filters - Only show when Users tab is active, on second line, right-aligned */}
      {activeTab === 'users' && (
        <div className="mt-4 flex justify-end">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
            <FilterDropdown
              label={sortBy}
              options={['Sort By Date', 'Newest First', 'Oldest First']}
              onSelect={(value) => setSortBy(value)}
              icon={<CalendarIcon className="h-4 w-4" />}
            />
            <FilterDropdown
              label={statusFilter}
              options={['All Status', 'Completed', 'Pending', 'Failed']}
              onSelect={(value) => setStatusFilter(value)}
            />
            <SearchBar
              placeholder="Transaction ID"
              value={searchValue}
              onChange={handleSearchChange}
              className="min-w-[220px] sm:min-w-[240px]"
            />
          </div>
        </div>
      )}

      {/* Transactions Section - Users View */}
      {activeTab === 'users' && (
        <>
          {/* Transactions Heading */}
          <div className="mt-6 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">All Transactions</h2>
          </div>

          <section className="rounded-xl bg-white shadow-sm">
            {/* Filters and Controls */}
            <header className="flex flex-col gap-3 
            md:flex-row md:items-center md:justify-between border-b border-gray-100
             px-4  sm:px-6">
              <div className="flex items-center flex-shrink-0 overflow-x-auto sm:overflow-x-visible">
                <FinanceFilterTabs 
                  tabs={userFilterTabsWithCounts.map(tab => ({ ...tab, key: tab.key as FinanceFilterKey }))} 
                  activeTab={activeFilter as FinanceFilterKey} 
                  onTabChange={(key) => handleUserFilterChange(key as FinanceFilterKey)} 
                />
              </div>
            </header>

            {/* Table */}
            <div className="">
              <UserTransactionsTable
                transactions={paginatedUserTransactions}
                startIndex={(currentPage - 1) * PAGE_SIZE}
                onActionSelect={handleTransactionAction}
              />
            </div>

            {/* Pagination */}
            <footer className="flex flex-col sm:flex-row justify-end
             items-center gap-3 border-t border-gray-100 px-4 py-4 sm:px-6">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap
               justify-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="cursor-pointer rounded-lg border
                   border-gray-200 px-3 py-1.5
                    sm:px-4 sm:py-2 text-xs sm:text-sm 
                    font-medium text-gray-600 transition
                     hover:border-gray-900 hover:text-gray-900
                      disabled:cursor-not-allowed disabled:opacity-50"
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
                  disabled={currentPage === userTotalPages}
                  className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </footer>
          </section>
        </>
      )}

      {/* Transactions Section - Vendor View */}
      {activeTab === 'vendor' && (
        <>
          {/* Transactions Heading */}
          <div className="mt-6 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Transactions</h2>
          </div>

          <section className="rounded-xl bg-white shadow-sm">
            {/* Filters and Controls */}
            <header className="flex flex-col gap-3 
            md:flex-row md:items-center md:justify-between
             border-b border-gray-100 px-4 pt-4  sm:px-6">
              <div className="flex items-center flex-shrink-0
               overflow-x-auto sm:overflow-x-visible">
                <FinanceFilterTabs tabs={vendorFilterTabsWithCounts} activeTab={vendorActiveFilter} onTabChange={handleVendorFilterChange} />
              </div>

              <div className="flex flex-col gap-2 sm:flex-row
               sm:items-center sm:gap-2 flex-shrink-0">
                <button
                  type="button"
                  className="inline-flex items-center justify-center 
                  gap-2 rounded-lg border border-gray-200 px-3 py-2.5 
                  text-xs font-medium text-gray-700 transition hover:bg-gray-50
                   whitespace-nowrap cursor-pointer"
                >
                  Export
                  <ExportIcon className="h-4 w-4" />
                </button>
                <SearchBar
                  placeholder="Search Order"
                  value={searchValue}
                  onChange={handleSearchChange}
                  className="min-w-[180px] sm:min-w-[200px]"
                />
                <button
                  type="button"
                  className="inline-flex items-center 
                  justify-center gap-2  px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 whitespace-nowrap cursor-pointer"
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
              </div>
            </header>

            {/* Table */}
            <div className="py-4">
              <FinanceTable
                transactions={paginatedVendorTransactions}
                startIndex={(currentPage - 1) * PAGE_SIZE}
                onActionSelect={handleTransactionAction}
              />
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
                  disabled={currentPage === vendorTotalPages}
                  className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </footer>
          </section>
        </>
      )}
    </div>
  )
}
