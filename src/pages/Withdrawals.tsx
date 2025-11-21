import { useState, useMemo, useEffect, useRef } from 'react'
import { MoreVerticalIcon, CalendarIcon, ArrowUpDownIcon, ClockIcon, PercentIcon, DollarSignIcon, XIcon } from '../components/icons/Icons'
import Pagination from '../components/ui/Pagination'
import { mockWithdrawalMetrics, mockWithdrawalRequests } from '../data/mockWithdrawals'
import type { WithdrawalRequest, WithdrawalStatus } from '../types/wallet'

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
function getStatusBadgeColor(status: WithdrawalStatus): string {
  switch (status) {
    case 'approved':
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'pending':
    case 'hold':
      return 'bg-yellow-100 text-yellow-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

/**
 * Withdrawals Page Component
 */
export default function Withdrawals() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(mockWithdrawalRequests)
  const [sortBy, setSortBy] = useState<string>('newest')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [activeFilter, setActiveFilter] = useState<'all' | WithdrawalStatus>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null)
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [holdModalOpen, setHoldModalOpen] = useState(false)
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null)
  const [approveReason, setApproveReason] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [holdReason, setHoldReason] = useState('')
  const itemsPerPage = 10

  // Filter and sort withdrawals
  const filteredAndSortedWithdrawals = useMemo(() => {
    let filtered = [...withdrawals]

    // Apply status filter from tabs
    if (activeFilter !== 'all') {
      filtered = filtered.filter((w) => w.status === activeFilter)
    }

    // Apply status dropdown filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((w) => w.status === statusFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.requestDate).getTime()
      const dateB = new Date(b.requestDate).getTime()

      if (sortBy === 'newest') {
        return dateB - dateA
      } else {
        return dateA - dateB
      }
    })

    return filtered
  }, [withdrawals, activeFilter, statusFilter, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedWithdrawals.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedWithdrawals = filteredAndSortedWithdrawals.slice(startIndex, endIndex)

  // Update current page if it's out of bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [currentPage, totalPages])

  // Close action menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement
      if (!target.closest('[data-action-menu]')) {
        setActionMenuOpen(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Get filter counts
  const filterCounts = useMemo(() => {
    return {
      all: withdrawals.length,
      approved: withdrawals.filter((w) => w.status === 'approved').length,
      rejected: withdrawals.filter((w) => w.status === 'rejected').length,
      pending: withdrawals.filter((w) => w.status === 'pending').length,
    }
  }, [withdrawals])

  /**
   * Toggle action menu
   */
  const toggleActionMenu = (id: string) => {
    setActionMenuOpen(actionMenuOpen === id ? null : id)
  }

  /**
   * Handle page change
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setActionMenuOpen(null)
  }

  /**
   * Handle approve request
   */
  const handleApproveRequest = (withdrawal: WithdrawalRequest) => {
    setSelectedWithdrawal(withdrawal)
    setApproveReason('')
    setApproveModalOpen(true)
    setActionMenuOpen(null)
  }

  /**
   * Handle approve submit
   */
  const handleApproveSubmit = () => {
    if (selectedWithdrawal) {
      // Update withdrawal status to approved
      setWithdrawals((prevWithdrawals) =>
        prevWithdrawals.map((w) => {
          if (w.id === selectedWithdrawal.id) {
            return {
              ...w,
              status: 'approved' as WithdrawalStatus,
            }
          }
          return w
        })
      )
      setApproveModalOpen(false)
      setSelectedWithdrawal(null)
      setApproveReason('')
    }
  }

  /**
   * Handle approve modal close
   */
  const handleApproveClose = () => {
    setApproveModalOpen(false)
    setSelectedWithdrawal(null)
    setApproveReason('')
  }

  /**
   * Format date for display
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00')
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  /**
   * Format time for display
   */
  const formatTime = (dateString: string) => {
    const date = new Date(dateString + 'T04:34:00')
    let hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'AM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`
  }

  /**
   * Handle reject request
   */
  const handleRejectRequest = (withdrawal: WithdrawalRequest) => {
    setSelectedWithdrawal(withdrawal)
    setRejectReason('')
    setRejectModalOpen(true)
    setActionMenuOpen(null)
  }

  /**
   * Handle reject submit
   */
  const handleRejectSubmit = () => {
    if (selectedWithdrawal) {
      // Update withdrawal status to rejected
      setWithdrawals((prevWithdrawals) =>
        prevWithdrawals.map((w) => {
          if (w.id === selectedWithdrawal.id) {
            return {
              ...w,
              status: 'rejected' as WithdrawalStatus,
            }
          }
          return w
        })
      )
      setRejectModalOpen(false)
      setSelectedWithdrawal(null)
      setRejectReason('')
    }
  }

  /**
   * Handle reject modal close
   */
  const handleRejectClose = () => {
    setRejectModalOpen(false)
    setSelectedWithdrawal(null)
    setRejectReason('')
  }

  /**
   * Handle hold request
   */
  const handleHoldRequest = (withdrawal: WithdrawalRequest) => {
    setSelectedWithdrawal(withdrawal)
    setHoldReason('')
    setHoldModalOpen(true)
    setActionMenuOpen(null)
  }

  /**
   * Handle hold submit
   */
  const handleHoldSubmit = () => {
    if (selectedWithdrawal) {
      // Update withdrawal status to hold
      setWithdrawals((prevWithdrawals) =>
        prevWithdrawals.map((w) => {
          if (w.id === selectedWithdrawal.id) {
            return {
              ...w,
              status: 'hold' as WithdrawalStatus,
            }
          }
          return w
        })
      )
      setHoldModalOpen(false)
      setSelectedWithdrawal(null)
      setHoldReason('')
    }
  }

  /**
   * Handle hold modal close
   */
  const handleHoldClose = () => {
    setHoldModalOpen(false)
    setSelectedWithdrawal(null)
    setHoldReason('')
  }

  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
  ]

  const statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Hold', value: 'hold' },
    { label: 'Active', value: 'active' },
  ]

  return (
    <div className="max-w-screen w-full overflow-x-hidden">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Wallet</h1>
        <p className="text-sm text-gray-600 mt-1">Dashboard • Withdrawal Requests</p>
      </div>

      {/* Top Metrics Section */}
      <div className="mb-4 sm:mb-6 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Requests */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 shadow-sm transition-colors hover:bg-gray-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Total Requests</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{mockWithdrawalMetrics.totalRequests}</p>
            </div>
            <div className="p-2">
              <ArrowUpDownIcon className="h-5 w-5 text-[#FF8C00]" />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 shadow-sm transition-colors hover:bg-gray-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{mockWithdrawalMetrics.pending}</p>
            </div>
            <div className="p-2">
              <ClockIcon className="h-5 w-5 text-[#FF8C00]" />
            </div>
          </div>
        </div>

        {/* Processing Fees */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 shadow-sm transition-colors hover:bg-gray-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Processing Fees</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{mockWithdrawalMetrics.processingFees}</p>
            </div>
            <div className="p-2">
              <PercentIcon className="h-5 w-5 text-[#FF8C00]" />
            </div>
          </div>
        </div>

        {/* Total Balance */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 shadow-sm transition-colors hover:bg-gray-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Total Balance</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{mockWithdrawalMetrics.totalBalance}</p>
            </div>
            <div className="p-2">
              <DollarSignIcon className="h-5 w-5 text-[#FF8C00]" />
            </div>
          </div>
        </div>
      </div>

      {/* All Withdrawal Requests Section Header - Outside table container */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">All Withdrawal Requests</h2>

          {/* Header Tools - Aligned to right, same row as title */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center w-full sm:w-auto">
            {/* Sort By Date */}
            <CustomDropdown
              value={sortBy}
              options={sortOptions}
              onChange={setSortBy}
              placeholder="Sort By Date"
              icon={<CalendarIcon className="h-4 w-4" />}
              className="w-full sm:w-[150px]"
            />

            {/* Status Dropdown */}
            <CustomDropdown
              value={statusFilter}
              options={statusOptions}
              onChange={setStatusFilter}
              placeholder="All Status"
              className="w-full sm:w-[140px]"
            />
          </div>
        </div>
      </div>

      {/* All Withdrawal Requests Table Container */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Filter Tabs */}
        <div className="border-b border-gray-200 px-4 sm:px-6">
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-0">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`flex items-center gap-2 px-1 py-4 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap border-b-2 ${
                activeFilter === 'all'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              All
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                  activeFilter === 'all' ? 'bg-[#4C50A2] text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {filterCounts.all}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('approved')}
              className={`flex items-center gap-2 px-1 py-4 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap border-b-2 ${
                activeFilter === 'approved'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Approved
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                  activeFilter === 'approved' ? 'bg-[#4C50A2] text-white' : 'bg-green-100 text-green-800'
                }`}
              >
                {filterCounts.approved}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('rejected')}
              className={`flex items-center gap-2 px-1 py-4 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap border-b-2 ${
                activeFilter === 'rejected'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Rejected
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                  activeFilter === 'rejected' ? 'bg-[#4C50A2] text-white' : 'bg-red-100 text-red-800'
                }`}
              >
                {filterCounts.rejected}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('pending')}
              className={`flex items-center gap-2 px-1 py-4 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap border-b-2 ${
                activeFilter === 'pending'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                  activeFilter === 'pending' ? 'bg-[#4C50A2] text-white' : 'bg-orange-100 text-orange-800'
                }`}
              >
                {filterCounts.pending}
              </span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Request ID</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600">User</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Payment Method</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Request Date</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedWithdrawals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                    No withdrawal requests found for the selected filters.
                  </td>
                </tr>
              ) : (
                paginatedWithdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2">
                      <span className="text-xs sm:text-sm font-medium text-gray-900">{withdrawal.requestId}</span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-medium text-gray-900">{withdrawal.userName}</span>
                        <span className="text-xs text-gray-500">{withdrawal.userEmail}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-medium text-gray-900">{withdrawal.amount}</span>
                        <span className="text-xs text-gray-500">
                          Fee: {withdrawal.fee} • Net: {withdrawal.netAmount}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm text-gray-900">{withdrawal.paymentMethod}</span>
                        {withdrawal.bankName && <span className="text-xs text-gray-500">{withdrawal.bankName}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                      {withdrawal.requestDate}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(
                          withdrawal.status
                        )}`}
                      >
                        {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="relative" data-action-menu>
                        <button
                          type="button"
                          onClick={() => toggleActionMenu(withdrawal.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                          aria-label="More options"
                        >
                          <MoreVerticalIcon className="h-5 w-5" />
                        </button>
                        {actionMenuOpen === withdrawal.id && (
                          <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg z-10">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleApproveRequest(withdrawal)
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              Approve Request
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRejectRequest(withdrawal)
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              Reject Request
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleHoldRequest(withdrawal)
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              Hold Request
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
        {totalPages > 1 && (
          <div className="flex justify-center sm:justify-end p-4 sm:p-6 border-t border-gray-200">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </div>

      {/* Approve Withdrawal Request Modal */}
      {approveModalOpen && selectedWithdrawal && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={handleApproveClose} aria-hidden="true" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleApproveClose}>
            <div
              className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Approve Withdrawal Request</h3>
                <button
                  type="button"
                  onClick={handleApproveClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* User Information */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <span className="text-base font-semibold text-gray-600">
                      {selectedWithdrawal.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm font-semibold text-gray-900 leading-5">{selectedWithdrawal.userName}</p>
                    <p className="text-sm text-gray-600 leading-5 mt-0.5">{selectedWithdrawal.userEmail}</p>
                    <p className="text-sm font-semibold text-[#4C50A2] mt-1 leading-5">
                      Current Balance: $1,245.50
                    </p>
                  </div>
                </div>

                {/* Request Details */}
                <div className="flex justify-between  bg-[#F3F5F6] rounded-md p-2 px-8 gap-8">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Request ID: </span>
                      <span className="text-sm font-semibold text-gray-900 block">{selectedWithdrawal.requestId}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Requested Date: </span>
                      <span className="text-sm font-semibold text-gray-900 block">{formatDate(selectedWithdrawal.requestDate)}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Amount: </span>
                      <span className="text-sm font-semibold text-gray-900 block">{selectedWithdrawal.amount}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Requested Time: </span>
                      <span className="text-sm font-semibold text-[#4C50A2] block">{formatTime(selectedWithdrawal.requestDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Reason Input */}
                <div>
                  <label htmlFor="approveReason" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Reason
                  </label>
                  <textarea
                    id="approveReason"
                    value={approveReason}
                    onChange={(e) => setApproveReason(e.target.value)}
                    placeholder="Enter Reason for this action"
                    rows={3}
                    maxLength={500}
                    className="w-full rounded-lg border-0 bg-gray-100 px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:bg-gray-100 focus:outline-none focus:ring-0 resize-none max-h-24"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-center items-center gap-3">
                <button
                  type="button"
                  onClick={handleApproveClose}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Handle upload document
                    console.log('Upload document')
                  }}
                  className="flex-1 rounded-lg bg-[#4C50A2] px-4 py-2 text-xs font-medium text-white hover:bg-[#3D4180] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Upload Document
                </button>
                <button
                  type="button"
                  onClick={handleApproveSubmit}
                  className="flex-1 rounded-lg bg-[#FF8C00] px-4 py-2 text-xs font-medium text-white hover:bg-[#E67E00] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Approve Request
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Reject Withdrawal Request Modal */}
      {rejectModalOpen && selectedWithdrawal && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={handleRejectClose} aria-hidden="true" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleRejectClose}>
            <div
              className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Reject Withdrawal Request</h3>
                <button
                  type="button"
                  onClick={handleRejectClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* User Information */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <span className="text-base font-semibold text-gray-600">
                      {selectedWithdrawal.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm font-semibold text-gray-900 leading-5">{selectedWithdrawal.userName}</p>
                    <p className="text-sm text-gray-600 leading-5 mt-0.5">{selectedWithdrawal.userEmail}</p>
                    <p className="text-sm font-semibold text-[#4C50A2] mt-1 leading-5">
                      Current Balance: $1,245.50
                    </p>
                  </div>
                </div>

                {/* Request Details */}
                <div className="flex justify-between bg-[#F3F5F6] rounded-md p-2 px-8 gap-8">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Request ID: </span>
                      <span className="text-sm font-semibold text-gray-900 block">{selectedWithdrawal.requestId}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Requested Date: </span>
                      <span className="text-sm font-semibold text-gray-900 block">{formatDate(selectedWithdrawal.requestDate)}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Amount: </span>
                      <span className="text-sm font-semibold text-gray-900 block">{selectedWithdrawal.amount}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Requested Time: </span>
                      <span className="text-sm font-semibold text-[#4C50A2] block">{formatTime(selectedWithdrawal.requestDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Reason for Reject Input */}
                <div>
                  <label htmlFor="rejectReason" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Reason for reject
                  </label>
                  <textarea
                    id="rejectReason"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter Reason for this action"
                    rows={3}
                    maxLength={500}
                    className="w-full rounded-lg border-0 bg-gray-100 px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:bg-gray-100 focus:outline-none focus:ring-0 resize-none max-h-24"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-center items-center gap-3">
                <button
                  type="button"
                  onClick={handleRejectClose}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRejectSubmit}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Reject Request
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Hold Withdrawal Request Modal */}
      {holdModalOpen && selectedWithdrawal && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={handleHoldClose} aria-hidden="true" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleHoldClose}>
            <div
              className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Hold Withdrawal Request</h3>
                <button
                  type="button"
                  onClick={handleHoldClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* User Information */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <span className="text-base font-semibold text-gray-600">
                      {selectedWithdrawal.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm font-semibold text-gray-900 leading-5">{selectedWithdrawal.userName}</p>
                    <p className="text-sm text-gray-600 leading-5 mt-0.5">{selectedWithdrawal.userEmail}</p>
                    <p className="text-sm font-semibold text-[#4C50A2] mt-1 leading-5">
                      Current Balance: $1,245.50
                    </p>
                  </div>
                </div>

                {/* Request Details */}
                <div className="flex justify-between bg-[#F3F5F6] rounded-md p-2 px-8 gap-8">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Request ID: </span>
                      <span className="text-sm font-semibold text-gray-900 block">{selectedWithdrawal.requestId}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Requested Date: </span>
                      <span className="text-sm font-semibold text-gray-900 block">{formatDate(selectedWithdrawal.requestDate)}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Amount: </span>
                      <span className="text-sm font-semibold text-gray-900 block">{selectedWithdrawal.amount}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Requested Time: </span>
                      <span className="text-sm font-semibold text-[#4C50A2] block">{formatTime(selectedWithdrawal.requestDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Reason for Hold Input */}
                <div>
                  <label htmlFor="holdReason" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Reason for hold
                  </label>
                  <textarea
                    id="holdReason"
                    value={holdReason}
                    onChange={(e) => setHoldReason(e.target.value)}
                    placeholder="Enter Reason for this action"
                    rows={3}
                    maxLength={500}
                    className="w-full rounded-lg border-0 bg-gray-100 px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:bg-gray-100 focus:outline-none focus:ring-0 resize-none max-h-24"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-center items-center gap-3">
                <button
                  type="button"
                  onClick={handleHoldClose}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleHoldSubmit}
                  className="flex-1 rounded-lg bg-[#FF8C00] px-4 py-2 text-xs font-medium text-white hover:bg-[#E67E00] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Hold Request
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
