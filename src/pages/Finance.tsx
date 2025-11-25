import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FinanceSummaryCard from '../components/finance/FinanceSummaryCard'
import VendorUsersToggle from '../components/finance/VendorUsersToggle'
import FinanceFilterTabs, { type FinanceFilterKey } from '../components/finance/FinanceFilterTabs'
import FinanceTable from '../components/finance/FinanceTable'
import VendorTransactionDetail from '../components/finance/VendorTransactionDetail'
import UserTransactionDetail from '../components/finance/UserTransactionDetail'
import FilterDropdown from '../components/finance/FilterDropdown'
import type { FinanceActionType } from '../components/finance/FinanceActionMenu'
import SearchBar from '../components/ui/SearchBar'
import { DollarSignIcon, WalletIcon, ShoppingCartIcon, ExportIcon, BarChart3Icon, CalendarIcon } from '../components/icons/Icons'
import type { FinanceStatus } from '../components/finance/FinanceStatusBadge'

export interface FinanceTransaction {
  id: string
  transactionId: string
  user: string
  orderId: string
  amountPaid: string
  commission: string
  paymentMethod: string
  status: FinanceStatus
  orderDate: string
}

export interface UserTransaction {
  id: string
  transactionId: string
  userName: string
  userEmail: string
  type: 'credit' | 'debit'
  amount: string
  paymentMethod: string
  date: string
  status: 'pending' | 'completed' | 'failed'
}

// Mock data for transactions
const MOCK_TRANSACTIONS: FinanceTransaction[] = [
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
  { id: '11', transactionId: 'TX-1009', user: 'Tariq', orderId: '#1009', amountPaid: '$210', commission: '$21', paymentMethod: 'PayPal', status: 'pending', orderDate: '20 Aug 2025' },
  { id: '12', transactionId: 'TX-1010', user: 'Saeed', orderId: '#1010', amountPaid: '$165', commission: '$16.50', paymentMethod: 'Bank Transfer', status: 'paid', orderDate: '21 Aug 2025' },
  { id: '13', transactionId: 'TX-1011', user: 'Rehman', orderId: '#1011', amountPaid: '$195', commission: '$19.50', paymentMethod: 'Credit Card', status: 'refunded', orderDate: '22 Aug 2025' },
  { id: '14', transactionId: 'TX-1012', user: 'Khalid', orderId: '#1012', amountPaid: '$175', commission: '$17.50', paymentMethod: 'PayPal', status: 'completed', orderDate: '23 Aug 2025' },
  { id: '15', transactionId: 'TX-1013', user: 'Nadeem', orderId: '#1013', amountPaid: '$185', commission: '$18.50', paymentMethod: 'Bank Transfer', status: 'paid', orderDate: '24 Aug 2025' },
  { id: '16', transactionId: 'TX-1014', user: 'Waseem', orderId: '#1014', amountPaid: '$155', commission: '$15.50', paymentMethod: 'Credit Card', status: 'pending', orderDate: '25 Aug 2025' },
  { id: '17', transactionId: 'TX-1015', user: 'Faisal', orderId: '#1015', amountPaid: '$205', commission: '$20.50', paymentMethod: 'PayPal', status: 'refunded', orderDate: '26 Aug 2025' },
  { id: '18', transactionId: 'TX-1016', user: 'Junaid', orderId: '#1016', amountPaid: '$145', commission: '$14.50', paymentMethod: 'Bank Transfer', status: 'paid', orderDate: '27 Aug 2025' },
  { id: '19', transactionId: 'TX-1017', user: 'Rashid', orderId: '#1017', amountPaid: '$225', commission: '$22.50', paymentMethod: 'Credit Card', status: 'completed', orderDate: '28 Aug 2025' },
  { id: '20', transactionId: 'TX-1018', user: 'Yasir', orderId: '#1018', amountPaid: '$160', commission: '$16', paymentMethod: 'PayPal', status: 'pending', orderDate: '29 Aug 2025' },
]

const PAGE_SIZE = 10

const FILTER_OPTIONS: { key: FinanceFilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'refunded', label: 'Refunded' },
  { key: 'paid', label: 'Paid' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
]


const STATUS_BADGE_CLASS: Record<FinanceFilterKey, { active: string; inactive: string }> = {
  all: {
    active: 'bg-[#4C50A2] text-white',
    inactive: 'bg-[#4C50A2] text-white',
  },
  refunded: {
    active: 'bg-[#FFE4DE] text-[#B71D18]',
    inactive: 'bg-[#FFE4DE] text-[#B71D18]',
  },
  paid: {
    active: 'bg-[#DCF6E5] text-[#118D57]',
    inactive: 'bg-[#DCF6E5] text-[#118D57]',
  },
  pending: {
    active: 'bg-[#FFF2D6] text-[#B76E00]',
    inactive: 'bg-[#FFF2D6] text-[#B76E00]',
  },
  completed: {
    active: 'bg-[#FFF2D6] text-[#B76E00]',
    inactive: 'bg-[#FFF2D6] text-[#B76E00]',
  },
  failed: {
    active: 'bg-[#FFE4DE] text-[#B71D18]',
    inactive: 'bg-[#FFE4DE] text-[#B71D18]',
  },
}

/**
 * Finance page component
 */
export default function Finance() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'vendor' | 'users'>('vendor')
  const [activeFilter, setActiveFilter] = useState<FinanceFilterKey>('all')
  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('Sort By Date')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [viewingTransaction, setViewingTransaction] = useState<FinanceTransaction | null>(null)
  const [viewingUserTransaction, setViewingUserTransaction] = useState<UserTransaction | null>(null)

  const filterTabsWithCounts = useMemo(
    () =>
      FILTER_OPTIONS.map((tab) => ({
        ...tab,
        count:
          tab.key === 'all'
            ? MOCK_TRANSACTIONS.length
            : MOCK_TRANSACTIONS.filter((t) => {
                if (tab.key === 'refunded') return t.status === 'refunded'
                if (tab.key === 'paid') return t.status === 'paid'
                if (tab.key === 'pending') return t.status === 'pending'
                if (tab.key === 'completed') return t.status === 'completed'
                return false
              }).length,
        badgeClassName: STATUS_BADGE_CLASS[tab.key],
      })),
    [],
  )

  const filteredTransactions = useMemo(() => {
    let result = [...MOCK_TRANSACTIONS]

    if (activeFilter !== 'all') {
      result = result.filter((transaction) => {
        if (activeFilter === 'refunded') return transaction.status === 'refunded'
        if (activeFilter === 'paid') return transaction.status === 'paid'
        if (activeFilter === 'pending') return transaction.status === 'pending'
        if (activeFilter === 'completed') return transaction.status === 'completed'
        return false
      })
    }

    if (searchValue.trim()) {
      const query = searchValue.toLowerCase()
      result = result.filter(
        (transaction) =>
          transaction.transactionId.toLowerCase().includes(query) ||
          transaction.user.toLowerCase().includes(query) ||
          transaction.orderId.toLowerCase().includes(query),
      )
    }

    return result
  }, [activeFilter, searchValue])

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE))

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredTransactions.slice(start, start + PAGE_SIZE)
  }, [filteredTransactions, currentPage])

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

  const handleFilterChange = (filterKey: FinanceFilterKey) => {
    setActiveFilter(filterKey)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const handleTransactionAction = (transaction: FinanceTransaction | UserTransaction, action: FinanceActionType) => {
    if (action === 'view') {
      if ('orderId' in transaction) {
        // Vendor transaction - navigate to vendor finance detail page
        const vendorName = (transaction as FinanceTransaction).user.toLowerCase().replace(/\s+/g, '-')
        navigate(`/finance/vendor/${vendorName}`)
      } else {
        // User transaction
        setViewingUserTransaction(transaction as UserTransaction)
      }
    } else {
      // Placeholder callback for other actions
      // eslint-disable-next-line no-console
      console.log(`Action "${action}" selected for transaction ${transaction.transactionId}`)
    }
  }


  // Summary card data
  const summaryCards = [
    {
      icon: <DollarSignIcon className="h-6 w-6 text-white" />,
      title: 'Total Revenue',
      value: '$122,531',
      subtext: '442 Transactions',
      iconBgColor: 'bg-sky-400',
    },
    {
      icon: <BarChart3Icon className="h-6 w-6 text-white" />,
      title: 'Commission',
      value: '$145.87',
      subtext: '197 Transactions',
      iconBgColor: 'bg-green-300',
    },
    {
      icon: <WalletIcon className="h-6 w-6 text-white" />,
      title: 'Vendor Payouts Pending',
      value: '$1,65,531',
      subtext: '321 Transactions',
      iconBgColor: 'bg-green-500',
    },
    {
      icon: <ShoppingCartIcon className="h-6 w-6 text-white" />,
      title: 'Refunds Processed',
      value: '$1,23,531',
      subtext: '32 Transactions',
      iconBgColor: 'bg-sky-400',
    },
  ]

  // If viewing vendor transaction detail, show detail view
  if (viewingTransaction && activeTab === 'users') {
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Finance</h1>
          <p className="text-sm text-gray-600 mt-1">Dashboard - Finance</p>
        </div>
        <VendorTransactionDetail
          transaction={viewingTransaction}
          onClose={() => setViewingTransaction(null)}
          onActionSelect={handleTransactionAction}
        />
      </div>
    )
  }

  // If viewing user transaction detail, show detail view
  if (viewingUserTransaction && activeTab === 'vendor') {
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Finance</h1>
          <p className="text-sm text-gray-600 mt-1">Dashboard - Finance</p>
        </div>
        <UserTransactionDetail
          transaction={viewingUserTransaction}
          onClose={() => setViewingUserTransaction(null)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Finance</h1>
        <p className="text-sm text-gray-600 mt-1">Dashboard - Finance</p>
      </div>

      {/* Summary Cards */}
      <div className=" flex justify-between bg-white p-4 rounded-md">
        {summaryCards.map((card, index) => (
          
          <FinanceSummaryCard
            key={index}
            icon={card.icon}
            title={card.title}
            value={card.value}
            subtext={card.subtext}
            iconBgColor={card.iconBgColor}
          />
          
        ))}
        
      </div>

      {/* Vendor/Users Toggle */}
      <div className="mt-6">
        <div className="bg-white rounded-lg pt-1 px-1 pb-0">
          <div className="flex items-center justify-between">
            <VendorUsersToggle 
              activeTab={activeTab} 
              onTabChange={(tab) => {
                setActiveTab(tab)
                setCurrentPage(1)
                setSearchValue('')
              }} 
            />
            <button
              type="button"
              onClick={() => navigate('/finance/all-transactions')}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E8840D] cursor-pointer"
            >
              See All Transaction History
            </button>
          </div>
        </div>
      </div>

      {/* User Filters - Only show when Vendor tab is active, on second line, right-aligned */}
      {activeTab === 'vendor' && (
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

      {/* Transactions Section - Vendor View (shows FinanceTable) */}
      {activeTab === 'vendor' && (
        <>
          {/* Transactions Heading */}
          <div className="mt-6 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">All Transactions</h2>
          </div>

          <section className="rounded-xl bg-white shadow-sm">
            {/* Filters and Controls */}
            <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-gray-100 px-4 pt-4 pb-4 sm:px-6">
              <div className="flex items-center flex-shrink-0">
                <FinanceFilterTabs 
                  tabs={filterTabsWithCounts} 
                  activeTab={activeFilter} 
                  onTabChange={handleFilterChange} 
                />
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2 flex-shrink-0">
                <button
                  type="button"
                  className="inline-flex items-center justify-center 
                  gap-2 rounded-lg border border-gray-200 
                  px-3 py-2.5 text-xs font-medium text-gray-700 
                  transition hover:bg-gray-50 whitespace-nowrap cursor-pointer"
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
                transactions={paginatedTransactions}
                startIndex={(currentPage - 1) * PAGE_SIZE}
                onActionSelect={handleTransactionAction}
                onRowClick={(transaction) => {
                  const vendorName = transaction.user.toLowerCase().replace(/\s+/g, '-')
                  navigate(`/finance/vendor/${vendorName}`)
                }}
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
                  disabled={currentPage === totalPages}
                  className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </footer>
          </section>
        </>
      )}

      {/* Transactions Section - Users View (shows FinanceTable) */}
      {activeTab === 'users' && (
        <>
          {/* Transactions Heading */}
          <div className="">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Transactions</h2>
          </div>

          <section className="rounded-xl bg-white shadow-sm">
            {/* Filters and Controls */}
            <header className="flex flex-col gap-3 
            md:flex-row md:items-center md:justify-between
             border-b border-gray-100 px-4 pt-4  sm:px-6">
              <div className="flex items-center flex-shrink-0">
                <FinanceFilterTabs tabs={filterTabsWithCounts} activeTab={activeFilter} onTabChange={handleFilterChange} />
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2 flex-shrink-0">
                <button
                  type="button"
                  className="inline-flex items-center justify-center 
                  gap-2 rounded-lg border border-gray-200 
                  px-3 py-2.5 text-xs font-medium text-gray-700 
                  transition hover:bg-gray-50 whitespace-nowrap cursor-pointer"
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
                transactions={paginatedTransactions}
                startIndex={(currentPage - 1) * PAGE_SIZE}
                onActionSelect={handleTransactionAction}
                onRowClick={(transaction) => {
                  const vendorName = transaction.user.toLowerCase().replace(/\s+/g, '-')
                  navigate(`/finance/vendor/${vendorName}`)
                }}
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
                  disabled={currentPage === totalPages}
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
