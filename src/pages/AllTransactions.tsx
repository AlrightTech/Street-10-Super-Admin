import { useState, useMemo, useEffect, useRef } from 'react'
import { MoreVerticalIcon, CalendarIcon, PencilIcon, TrashIcon } from '../components/icons/Icons'
import SearchBar from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'
import ConfirmModal from '../components/ui/ConfirmModal'
import { mockWalletTransactions } from '../data/mockWallet'
import type { WalletTransaction, TransactionStatus, PaymentMethod } from '../types/wallet'
import { useNavigate } from 'react-router-dom'

/**
 * Input-style Dropdown Component
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

  const selectedOption = options.find((opt) => opt.value === value)
  const displayText = selectedOption ? selectedOption.label : placeholder
  const textColorClass = selectedOption ? 'text-gray-700' : 'text-gray-400'

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 text-sm outline-none hover:bg-gray-50 focus:border-[#FF8C00] focus:ring-1 focus:ring-[#FF8C00]"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="flex-shrink-0 text-gray-400">{icon}</span>}
          <span className={`block truncate text-left ${textColorClass}`}>{displayText}</span>
        </div>
        <svg
          className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute left-0 z-50 mt-1 w-full min-w-[160px] origin-top-left rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="max-h-60 overflow-auto py-1" role="menu">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`block w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 ${
                  value === option.value ? 'bg-gray-50 font-medium' : ''
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
 * Get status badge color class
 */
function getStatusBadgeColor(status: TransactionStatus): string {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

/**
 * All Transactions Page Component
 */
export default function AllTransactions() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState<WalletTransaction[]>(
    mockWalletTransactions.map((t) => ({
      ...t,
      paymentMethod:
        t.paymentMethod ||
        (['Bank Transfer', 'Wallet Balance', 'Credit Card', 'Debit Card'][
          Math.floor(Math.random() * 4)
        ] as PaymentMethod),
    }))
  )
  const [sortBy, setSortBy] = useState<string>('newest')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [activeFilter, setActiveFilter] = useState<'all' | TransactionStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null)
  const [transactionToEdit, setTransactionToEdit] = useState<WalletTransaction | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const itemsPerPage = 10

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...transactions]

    // Apply status filter from tabs
    if (activeFilter !== 'all') {
      filtered = filtered.filter((t) => t.status === activeFilter)
    }

    // Apply status filter from dropdown
    if (statusFilter !== 'all') {
      filtered = filtered.filter((t) => t.status === statusFilter)
    }

    // Apply search filter (search by Transaction ID or User name/email)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (t) =>
          t.transactionId.toLowerCase().includes(query) ||
          t.userName.toLowerCase().includes(query) ||
          t.userEmail.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB
    })

    return sorted
  }, [transactions, activeFilter, statusFilter, searchQuery, sortBy])

  // Calculate filter counts
  const counts = useMemo(() => {
    return {
      all: transactions.length,
      completed: transactions.filter((t) => t.status === 'completed').length,
      pending: transactions.filter((t) => t.status === 'pending').length,
      failed: transactions.filter((t) => t.status === 'failed').length,
    }
  }, [transactions])

  // Paginate transactions
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredAndSortedTransactions.slice(startIndex, endIndex)
  }, [filteredAndSortedTransactions, currentPage])

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedTransactions.length / itemsPerPage)
  }, [filteredAndSortedTransactions.length])

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

  // Close action menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (actionMenuOpen) {
        const target = event.target as HTMLElement
        if (!target.closest('[data-action-menu]')) {
          setActionMenuOpen(null)
        }
      }
    }

    if (actionMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [actionMenuOpen])

  /**
   * Handle edit transaction
   */
  const handleEdit = (transactionId: string) => {
    const transaction = transactions.find((t) => t.id === transactionId)
    if (transaction) {
      setTransactionToEdit({ ...transaction })
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
        prevTransactions.map((t) => (t.id === transactionToEdit.id ? transactionToEdit : t))
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
  }

  /**
   * Handle page change
   */
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  /**
   * Toggle action menu for a specific transaction
   */
  const toggleActionMenu = (transactionId: string) => {
    setActionMenuOpen(actionMenuOpen === transactionId ? null : transactionId)
  }

  return (
    <div className="max-w-screen w-full overflow-x-hidden">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Wallet</h1>
        <p className="text-sm text-gray-600 mt-1">Dashboard • All Transactions</p>
      </div>

      {/* All Transactions Section */}
      <div className="mb-4 sm:mb-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">All Transactions</h3>

          {/* Header Tools - Aligned to right */}
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
      <div className="mb-4 sm:mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Filter Tabs - Inside table container */}
        <div className="px-4.5 mt-2 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 md:gap-6">
            <button
              type="button"
              onClick={() => handleFilterChange('all')}
              className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity"
            >
              <span
                className={`text-xs sm:text-sm font-medium py-1 sm:py-2 px-1 sm:px-2 text-gray-900 ${
                  activeFilter === 'all' ? 'border-b-2 border-gray-900' : ''
                }`}
              >
                All
              </span>
              <span
                className={`inline-flex items-center justify-center rounded-md px-1.5 sm:px-2 py-0.5 text-xs font-medium ${
                  activeFilter === 'all' ? 'bg-[#6B46C1] text-white' : 'bg-gray-100 text-gray-900'
                }`}
              >
                {counts.all}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('completed')}
              className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity"
            >
              <span
                className={`text-xs sm:text-sm font-medium py-1 sm:py-2 px-1 sm:px-2 text-gray-900 ${
                  activeFilter === 'completed' ? 'border-b-2 border-gray-900' : ''
                }`}
              >
                Completed
              </span>
              <span
                className={`inline-flex items-center justify-center rounded-md px-1.5 sm:px-2 py-0.5 text-xs font-medium ${
                  activeFilter === 'completed' ? 'bg-[#6B46C1] text-white' : 'bg-green-100 text-gray-900'
                }`}
              >
                {counts.completed}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('pending')}
              className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity"
            >
              <span
                className={`text-xs sm:text-sm font-medium py-1 sm:py-2 px-1 sm:px-2 text-gray-900 ${
                  activeFilter === 'pending' ? 'border-b-2 border-gray-900' : ''
                }`}
              >
                Pending
              </span>
              <span
                className={`inline-flex items-center justify-center rounded-md px-1.5 sm:px-2 py-0.5 text-xs font-medium ${
                  activeFilter === 'pending' ? 'bg-[#6B46C1] text-white' : 'bg-orange-100 text-gray-900'
                }`}
              >
                {counts.pending}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('failed')}
              className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity"
            >
              <span
                className={`text-xs sm:text-sm font-medium py-1 sm:py-2 px-1 sm:px-2 text-gray-900 ${
                  activeFilter === 'failed' ? 'border-b-2 border-gray-900' : ''
                }`}
              >
                Failed
              </span>
              <span
                className={`inline-flex items-center justify-center rounded-md px-1.5 sm:px-2 py-0.5 text-xs font-medium ${
                  activeFilter === 'failed' ? 'bg-[#6B46C1] text-white' : 'bg-red-100 text-gray-900'
                }`}
              >
                {counts.failed}
              </span>
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Transaction ID</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600">User/Vendor</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Type</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Payment Method</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                    No transactions found for the selected filters.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <button
                        onClick={() => navigate(`/transactions/detail/${transaction.id}`)}
                        className="text-xs sm:text-sm text-gray-900 font-mono break-all hover:text-blue-600 hover:underline cursor-pointer"
                      >
                        {transaction.transactionId}
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">{transaction.userName}</p>
                        <p className="text-xs text-gray-500 break-all">{transaction.userEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`text-xs sm:text-sm font-medium ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        } capitalize`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-900">{transaction.amount}</td>
                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-600">
                      {transaction.paymentMethod || 'N/A'}
                    </td>
                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                      {transaction.date}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(
                          transaction.status
                        )}`}
                      >
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="relative" data-action-menu>
                        <button
                          type="button"
                          onClick={() => toggleActionMenu(transaction.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                          aria-label="More options"
                        >
                          <MoreVerticalIcon className="h-5 w-5" />
                        </button>
                        {actionMenuOpen === transaction.id && (
                          <div className="absolute right-0 mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-lg z-10">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/transactions/detail/${transaction.id}`)
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              View Details
                            </button>
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
          <div className="p-2 sm:p-6 border-t border-gray-200 flex justify-center sm:justify-end overflow-x-auto">
            <div className="min-w-0">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          </div>
        )}
      </div>

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

      {/* Edit Modal */}
      {editModalOpen && transactionToEdit && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={cancelEdit} aria-hidden="true" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Edit Transaction</h3>
              <div className="mb-4">
                <label htmlFor="editTransactionId" className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction ID
                </label>
                <input
                  type="text"
                  id="editTransactionId"
                  value={transactionToEdit.transactionId}
                  onChange={(e) => setTransactionToEdit({ ...transactionToEdit, transactionId: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF8C00] focus:ring-1 focus:ring-[#FF8C00]"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="editAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="text"
                  id="editAmount"
                  value={transactionToEdit.amount}
                  onChange={(e) => setTransactionToEdit({ ...transactionToEdit, amount: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF8C00] focus:ring-1 focus:ring-[#FF8C00]"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="editPaymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <CustomDropdown
                  value={transactionToEdit.paymentMethod || 'Bank Transfer'}
                  options={[
                    { label: 'Bank Transfer', value: 'Bank Transfer' },
                    { label: 'Wallet Balance', value: 'Wallet Balance' },
                    { label: 'Credit Card', value: 'Credit Card' },
                    { label: 'Debit Card', value: 'Debit Card' },
                  ]}
                  onChange={(value) =>
                    setTransactionToEdit({ ...transactionToEdit, paymentMethod: value as PaymentMethod })
                  }
                  placeholder="Select Payment Method"
                  className="w-full"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="editStatus" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <CustomDropdown
                  value={transactionToEdit.status}
                  options={[
                    { label: 'Completed', value: 'completed' },
                    { label: 'Pending', value: 'pending' },
                    { label: 'Failed', value: 'failed' },
                  ]}
                  onChange={(value) =>
                    setTransactionToEdit({ ...transactionToEdit, status: value as TransactionStatus })
                  }
                  placeholder="Select Status"
                  className="w-full"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="rounded-lg bg-[#FF8C00] px-4 py-2 text-sm font-medium text-white hover:bg-[#E67E00] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

