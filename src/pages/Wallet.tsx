import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { DollarSignIcon, HandIcon, BellIcon, ArrowUpDownIcon, MoreVerticalIcon, CalendarIcon, UserIcon, SettingsIcon, PencilIcon, TrashIcon } from '../components/icons/Icons'
import SearchBar from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'
import ConfirmModal from '../components/ui/ConfirmModal'
import { mockWalletMetrics, mockWalletTransactions } from '../data/mockWallet'
import type { WalletTransaction, TransactionStatus } from '../types/wallet'

/**
 * Input-style Dropdown Component (matches reference image)
 */
interface CustomDropdownProps {
  value: string
  options: { label: string; value: string }[]
  onChange: (value: string) => void
  placeholder: string
  icon?: React.ReactNode
  className?: string
}

function CustomDropdown({ value, options, onChange, placeholder, icon, className = '' }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 pr-8 text-sm outline-none hover:bg-gray-50 dark:hover:bg-gray-600 focus:border-[#FF8C00] focus:ring-1 focus:ring-[#FF8C00] transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="flex-shrink-0 text-gray-400 dark:text-gray-500">{icon}</span>}
          <span className="block truncate text-left text-gray-400 dark:text-gray-500">
            {placeholder}
          </span>
        </div>
        <svg className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 z-50 mt-1 w-full min-w-[160px] origin-top-left rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg transition-colors">
          <div className="py-1 max-h-60 overflow-auto" role="menu">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  value === option.value ? 'bg-gray-50 dark:bg-gray-700 font-medium' : ''
                }`}
                role="menuitem"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Get status badge color
 */
const getStatusBadgeColor = (status: TransactionStatus) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-orange-100 text-orange-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

/**
 * Wallet page component
 */
export default function Wallet() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState<WalletTransaction[]>(mockWalletTransactions)
  const [activeFilter, setActiveFilter] = useState<'all' | TransactionStatus>('all')
  const [sortBy, setSortBy] = useState('newest')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null)
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [transactionToEdit, setTransactionToEdit] = useState<WalletTransaction | null>(null)
  const actionMenuRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const itemsPerPage = 10

  // Close action menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      let clickedInside = false

      actionMenuRefs.current.forEach((ref) => {
        if (ref && ref.contains(target)) {
          clickedInside = true
        }
      })

      if (!clickedInside) {
        setActionMenuOpen(null)
      }
    }

    if (actionMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [actionMenuOpen])

  // Calculate counts for filters
  const counts = useMemo(() => {
    return {
      all: transactions.length,
      completed: transactions.filter((t) => t.status === 'completed').length,
      pending: transactions.filter((t) => t.status === 'pending').length,
      failed: transactions.filter((t) => t.status === 'failed').length,
    }
  }, [transactions])

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions

    // Apply status filter tab
    if (activeFilter !== 'all') {
      filtered = filtered.filter((t) => t.status === activeFilter)
    }

    // Apply status dropdown filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((t) => t.status === statusFilter)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((t) => t.transactionId.toLowerCase().includes(query))
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB
    })

    return sorted
  }, [transactions, activeFilter, statusFilter, searchQuery, sortBy])

  // Paginate transactions
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredAndSortedTransactions.slice(startIndex, endIndex)
  }, [filteredAndSortedTransactions, currentPage])

  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage)

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeFilter, statusFilter, searchQuery])

  // Reset to page 1 if current page is greater than total pages
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1)
    }
  }, [totalPages, currentPage])

  /**
   * Handle edit transaction
   */
  const handleEdit = (transactionId: string) => {
    const transaction = transactions.find((t) => t.id === transactionId)
    if (transaction) {
      setTransactionToEdit(transaction)
      setEditModalOpen(true)
      setActionMenuOpen(null)
    }
  }

  /**
   * Handle delete transaction
   */
  const handleDelete = (transactionId: string) => {
    setTransactionToDelete(transactionId)
    setDeleteModalOpen(true)
    setActionMenuOpen(null)
  }

  /**
   * Confirm delete transaction
   */
  const confirmDelete = () => {
    if (transactionToDelete) {
      setTransactions((prevTransactions) => prevTransactions.filter((t) => t.id !== transactionToDelete))
      setDeleteModalOpen(false)
      setTransactionToDelete(null)
    }
  }

  /**
   * Cancel delete transaction
   */
  const cancelDelete = () => {
    setDeleteModalOpen(false)
    setTransactionToDelete(null)
  }

  /**
   * Handle save edit transaction
   */
  const handleSaveEdit = () => {
    if (transactionToEdit) {
      setTransactions((prevTransactions) =>
        prevTransactions.map((t) =>
          t.id === transactionToEdit.id ? transactionToEdit : t
        )
      )
      setEditModalOpen(false)
      setTransactionToEdit(null)
    }
  }

  /**
   * Cancel edit transaction
   */
  const cancelEdit = () => {
    setEditModalOpen(false)
    setTransactionToEdit(null)
  }

  /**
   * Handle filter change
   */
  const handleFilterChange = (filter: 'all' | TransactionStatus) => {
    setActiveFilter(filter)
    setCurrentPage(1)
  }

  /**
   * Handle page change
   */
  const handlePageChange = (page: number) => {
    // Ensure page is within valid range
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  /**
   * Toggle action menu
   */
  const toggleActionMenu = (transactionId: string) => {
    setActionMenuOpen(actionMenuOpen === transactionId ? null : transactionId)
  }

  return (
    <div className="max-w-screen w-full overflow-x-hidden">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Wallet</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Dashboard • Wallet</p>
      </div>

      {/* Top Metrics Section */}
      <div className="mb-4 sm:mb-6 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Balance */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5 shadow-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Balance</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{mockWalletMetrics.totalBalance}</p>
            </div>
            <div className="rounded-full bg-[#FF8C00] p-1.5 sm:p-2">
              <DollarSignIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5 shadow-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Transactions</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{mockWalletMetrics.totalTransactions.toLocaleString()}</p>
            </div>
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-1.5 sm:p-2">
              <ArrowUpDownIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Pending Withdrawals */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5 shadow-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending Withdrawals</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{mockWalletMetrics.pendingWithdrawals}</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{mockWalletMetrics.pendingWithdrawalsCount} requests pending</p>
            </div>
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-1.5 sm:p-2">
              <HandIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5 shadow-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Success Rate</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{mockWalletMetrics.successRate}</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{mockWalletMetrics.successRatePendingCount} requests pending</p>
            </div>
            <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/30 p-1.5 sm:p-2">
              <BellIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Navigation Cards */}
      <div className="mb-4 sm:mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {/* All Transactions */}
        <button
          type="button"
          onClick={() => navigate('/wallet/all-transactions')}
          className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/30 p-2">
              <ArrowUpDownIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">All Transactions</span>
          </div>
        </button>

        {/* User Wallets */}
        <button
          type="button"
          onClick={() => navigate('/wallet/user-wallets')}
          className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-50 dark:bg-green-900/30 p-2">
              <UserIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">User Wallets</span>
          </div>
        </button>

        {/* Withdrawals */}
        <button
          type="button"
          onClick={() => navigate('/wallet/withdrawals')}
          className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-50 dark:bg-purple-900/30 p-2">
              <HandIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Withdrawals</span>
          </div>
        </button>

        {/* Settings */}
        <button
          type="button"
          onClick={() => navigate('/wallet/settings')}
          className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-50 dark:bg-gray-700 p-2">
              <SettingsIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Settings</span>
          </div>
        </button>
      </div>

      {/* Recent Transactions Section */}
      {/* Section Header - Outside table container */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">Recent Transactions</h3>

          {/* Header Tools - Aligned to right, same row as title */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center w-full sm:w-auto">
            {/* Sort By Date */}
            <CustomDropdown
              value={sortBy}
              options={[
                { label: 'Newest First', value: 'newest' },
                { label: 'Oldest First', value: 'oldest' },
              ]}
              onChange={setSortBy}
              placeholder="Sort By Date"
              icon={<CalendarIcon className="h-4 w-4" />}
              className="w-full sm:w-[150px]"
            />

            {/* Status Dropdown */}
            <CustomDropdown
              value={statusFilter}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Completed', value: 'completed' },
                { label: 'Pending', value: 'pending' },
                { label: 'Failed', value: 'failed' },
              ]}
              onChange={setStatusFilter}
              placeholder="All Status"
              className="w-full sm:w-[140px]"
            />

            {/* Search Bar */}
            <div className="w-full sm:w-auto sm:min-w-[250px]">
              <SearchBar
                placeholder="Transaction ID"
                value={searchQuery}
                onChange={setSearchQuery}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table Container */}
      <div className="mb-4 sm:mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-colors">
        {/* Filter Tabs - Inside table container */}
        <div className="px-4.5 mt-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 md:gap-6">
            <button
              type="button"
              onClick={() => handleFilterChange('all')}
              className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity"
            >
              <span className={`text-xs sm:text-sm font-medium py-1 sm:py-2 px-1 sm:px-2 text-gray-900 dark:text-gray-100 ${activeFilter === 'all' ? 'border-b-2 border-gray-900 dark:border-gray-100' : ''}`}>
                All
              </span>
              <span className={`inline-flex items-center justify-center rounded-md px-1.5 sm:px-2 py-0.5 text-xs font-medium ${
                activeFilter === 'all'
                  ? 'bg-[#6B46C1] text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}>
                {counts.all}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('completed')}
              className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity"
            >
              <span className={`text-xs sm:text-sm font-medium py-1 sm:py-2 px-1 sm:px-2 text-gray-900 dark:text-gray-100 ${activeFilter === 'completed' ? 'border-b-2 border-gray-900 dark:border-gray-100' : ''}`}>
                Completed
              </span>
              <span className={`inline-flex items-center justify-center rounded-md px-1.5 sm:px-2 py-0.5 text-xs font-medium ${
                activeFilter === 'completed'
                  ? 'bg-[#6B46C1] text-white'
                  : 'bg-green-100 dark:bg-green-900/30 text-gray-900 dark:text-gray-100'
              }`}>
                {counts.completed}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('pending')}
              className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity"
            >
              <span className={`text-xs sm:text-sm font-medium py-1 sm:py-2 px-1 sm:px-2 text-gray-900 dark:text-gray-100 ${activeFilter === 'pending' ? 'border-b-2 border-gray-900 dark:border-gray-100' : ''}`}>
                Pending
              </span>
              <span className={`inline-flex items-center justify-center rounded-md px-1.5 sm:px-2 py-0.5 text-xs font-medium ${
                activeFilter === 'pending'
                  ? 'bg-[#6B46C1] text-white'
                  : 'bg-orange-100 dark:bg-orange-900/30 text-gray-900 dark:text-gray-100'
              }`}>
                {counts.pending}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('failed')}
              className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity"
            >
              <span className={`text-xs sm:text-sm font-medium py-1 sm:py-2 px-1 sm:px-2 text-gray-900 dark:text-gray-100 ${activeFilter === 'failed' ? 'border-b-2 border-gray-900 dark:border-gray-100' : ''}`}>
                Failed
              </span>
              <span className={`inline-flex items-center justify-center rounded-md px-1.5 sm:px-2 py-0.5 text-xs font-medium ${
                activeFilter === 'failed'
                  ? 'bg-[#6B46C1] text-white'
                  : 'bg-red-100 dark:bg-red-900/30 text-gray-900 dark:text-gray-100'
              }`}>
                {counts.failed}
              </span>
            </button>
          </div>
        </div>
        {/* Transactions Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Transaction ID</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">User</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Type</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Amount</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                    No transactions found for the selected filters.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-900 font-mono break-all">{transaction.transactionId}</td>
                    <td className="px-4 py-2">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">{transaction.userName}</p>
                        <p className="text-xs text-gray-500 break-all">{transaction.userEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-900 capitalize">{transaction.type}</td>
                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-900">{transaction.amount}</td>
                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-600 whitespace-nowrap">{transaction.date}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div
                        ref={(el) => {
                          if (el) {
                            actionMenuRefs.current.set(transaction.id, el)
                          } else {
                            actionMenuRefs.current.delete(transaction.id)
                          }
                        }}
                        className="relative"
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleActionMenu(transaction.id)
                          }}
                          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                          aria-label="More options"
                        >
                          <MoreVerticalIcon className="h-5 w-5" />
                        </button>
                        {actionMenuOpen === transaction.id && (
                          <div className="absolute right-0 mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-lg z-50">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEdit(transaction.id)
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              <PencilIcon className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(transaction.id)
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              <TrashIcon className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="p-2 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-center sm:justify-end overflow-x-auto transition-colors">
            <div className="min-w-0">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editModalOpen && transactionToEdit && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={cancelEdit}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="w-full max-w-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-xl transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Edit Transaction</h3>
              <div className="mb-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Transaction ID</label>
                  <input
                    type="text"
                    value={transactionToEdit.transactionId}
                    onChange={(e) =>
                      setTransactionToEdit({ ...transactionToEdit, transactionId: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-[#FF8C00] focus:outline-none focus:ring-1 focus:ring-[#FF8C00]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                  <input
                    type="text"
                    value={transactionToEdit.amount}
                    onChange={(e) =>
                      setTransactionToEdit({ ...transactionToEdit, amount: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-[#FF8C00] focus:outline-none focus:ring-1 focus:ring-[#FF8C00]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select
                    value={transactionToEdit.status}
                    onChange={(e) =>
                      setTransactionToEdit({
                        ...transactionToEdit,
                        status: e.target.value as TransactionStatus,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-[#FF8C00] focus:outline-none focus:ring-1 focus:ring-[#FF8C00]"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="rounded-lg bg-[#FF8C00] px-4 py-2 text-sm font-medium text-white hover:bg-[#FF7A00] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:ring-offset-2"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  )
}
