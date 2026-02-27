import { useState, useMemo, useEffect, useRef } from 'react'
import { UserIcon, ArrowUpDownIcon, DollarSignIcon, LockIcon, CalendarIcon, MoreVerticalIcon, XIcon } from '../components/icons/Icons'
import Pagination from '../components/ui/Pagination'
import { walletApi } from '../services/wallet.api'
import type { UserWallet, UserWalletStatus } from '../types/wallet'

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
function getStatusBadgeColor(status: UserWalletStatus): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'frozen':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

/**
 * User Wallets Page Component
 */
export default function UserWallets() {
  const [wallets, setWallets] = useState<UserWallet[]>([])
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeWallets: 0,
    frozenWallets: 0,
    totalBalance: '0.00 QAR',
  })
  const [sortBy, setSortBy] = useState<string>('newest')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [activeFilter, setActiveFilter] = useState<'all' | UserWalletStatus>('all')
  const [searchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null)
  const [creditModalOpen, setCreditModalOpen] = useState(false)
  const [debitModalOpen, setDebitModalOpen] = useState(false)
  const [freezeModalOpen, setFreezeModalOpen] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<UserWallet | null>(null)
  const [creditAmount, setCreditAmount] = useState('')
  const [creditDescription, setCreditDescription] = useState('')
  const [debitAmount, setDebitAmount] = useState('')
  const [debitReason, setDebitReason] = useState('')
  const [freezeReason, setFreezeReason] = useState('')
  const [processing, setProcessing] = useState(false)
  const itemsPerPage = 10

  // Load wallets from API
  useEffect(() => {
    loadWallets()
    loadMetrics()
  }, [currentPage, activeFilter, statusFilter])

  const loadWallets = async () => {
    try {
      setLoading(true)
      const frozen = activeFilter === 'frozen' ? true : activeFilter === 'active' ? false : undefined
      const response = await walletApi.getUserWallets({
        page: currentPage,
        limit: itemsPerPage,
        frozen,
      })
      
      // Map backend wallets to frontend format
      const mappedWallets = response.data.map((wallet) => mapWalletToFrontend(wallet))
      setWallets(mappedWallets)
      setTotalPages(response.pagination.totalPages)
    } catch (error) {
      console.error('Error loading wallets:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMetrics = async () => {
    try {
      const metricsData = await walletApi.getMetrics()
      const totalBalance = parseFloat(metricsData.totalBalance) / 100
      
      setMetrics({
        totalUsers: metricsData.totalWallets,
        activeWallets: metricsData.totalWallets - metricsData.frozenWallets,
        frozenWallets: metricsData.frozenWallets,
        totalBalance: `${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} QAR`,
      })
    } catch (error) {
      console.error('Error loading metrics:', error)
    }
  }

  // Map backend wallet to frontend format
  const mapWalletToFrontend = (wallet: any): UserWallet => {
    const available = parseFloat(wallet.availableMinor) / 100
    const lastTransaction = wallet.updatedAt || wallet.createdAt
    
    return {
      id: wallet.userId,
      userId: wallet.userId,
      userName: wallet.user?.name || 'Unknown User',
      userEmail: wallet.user?.email || '',
      balance: `${available.toFixed(2)} ${wallet.currency}`,
      lastTransaction: new Date(lastTransaction).toISOString().split('T')[0],
      status: wallet.frozen ? 'frozen' : 'active',
    }
  }

  // Filter and sort wallets
  const filteredAndSortedWallets = useMemo(() => {
    let filtered = [...wallets]

    // Apply status filter from tabs
    if (activeFilter !== 'all') {
      filtered = filtered.filter((w) => w.status === activeFilter)
    }

    // Apply status filter from dropdown
    if (statusFilter !== 'all') {
      filtered = filtered.filter((w) => w.status === statusFilter)
    }

    // Apply search filter (search by User ID, User name/email)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (w) =>
          w.userId.toLowerCase().includes(query) ||
          w.userName.toLowerCase().includes(query) ||
          w.userEmail.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.lastTransaction).getTime()
      const dateB = new Date(b.lastTransaction).getTime()
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB
    })

    return sorted
  }, [wallets, activeFilter, statusFilter, searchQuery, sortBy])

  // Calculate filter counts
  const counts = useMemo(() => {
    return {
      all: wallets.length,
      active: wallets.filter((w) => w.status === 'active').length,
      frozen: wallets.filter((w) => w.status === 'frozen').length,
    }
  }, [wallets])

  // Use API pagination - wallets are already paginated
  const paginatedWallets = filteredAndSortedWallets

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
   * Handle filter change
   */
  const handleFilterChange = (filter: 'all' | UserWalletStatus) => {
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
   * Toggle action menu for a specific wallet
   */
  const toggleActionMenu = (walletId: string) => {
    setActionMenuOpen(actionMenuOpen === walletId ? null : walletId)
  }

  /**
   * Handle credit wallet
   */
  const handleCreditWallet = (wallet: UserWallet) => {
    setSelectedWallet(wallet)
    setCreditAmount('')
    setCreditDescription('')
    setCreditModalOpen(true)
    setActionMenuOpen(null)
  }

  /**
   * Handle credit wallet submit
   */
  const handleCreditSubmit = async () => {
    if (selectedWallet && creditAmount && creditDescription) {
      try {
        setProcessing(true)
        const amountMinor = Math.round(parseFloat(creditAmount) * 100)
        
        await walletApi.creditWallet(selectedWallet.userId, {
          amountMinor,
          description: creditDescription,
        })
        
        // Reload wallets to get updated data
        await loadWallets()
        await loadMetrics()
        
        setCreditModalOpen(false)
        setSelectedWallet(null)
        setCreditAmount('')
        setCreditDescription('')
        alert('Wallet credited successfully!')
      } catch (error: any) {
        console.error('Error crediting wallet:', error)
        alert(error?.response?.data?.error?.message || error?.message || 'Failed to credit wallet')
      } finally {
        setProcessing(false)
      }
    }
  }

  /**
   * Handle credit modal close
   */
  const handleCreditClose = () => {
    setCreditModalOpen(false)
    setSelectedWallet(null)
    setCreditAmount('')
    setCreditDescription('')
  }

  /**
   * Handle debit wallet
   */
  const handleDebitWallet = (wallet: UserWallet) => {
    setSelectedWallet(wallet)
    setDebitAmount('')
    setDebitReason('')
    setDebitModalOpen(true)
    setActionMenuOpen(null)
  }

  /**
   * Handle debit wallet submit
   */
  const handleDebitSubmit = async () => {
    if (selectedWallet && debitAmount && debitReason) {
      try {
        setProcessing(true)
        const amountMinor = Math.round(parseFloat(debitAmount) * 100)
        const currentBalance = parseFloat(selectedWallet.balance.replace(/[^0-9.-]+/g, ''))
        const debitValue = parseFloat(debitAmount)
        
        if (debitValue > currentBalance) {
          alert('Debit amount cannot exceed current balance')
          setProcessing(false)
          return
        }
        
        await walletApi.debitWallet(selectedWallet.userId, {
          amountMinor,
          reason: debitReason,
        })
        
        // Reload wallets to get updated data
        await loadWallets()
        await loadMetrics()
        
        setDebitModalOpen(false)
        setSelectedWallet(null)
        setDebitAmount('')
        setDebitReason('')
        alert('Wallet debited successfully!')
      } catch (error: any) {
        console.error('Error debiting wallet:', error)
        alert(error?.response?.data?.error?.message || error?.message || 'Failed to debit wallet')
      } finally {
        setProcessing(false)
      }
    }
  }

  /**
   * Handle debit modal close
   */
  const handleDebitClose = () => {
    setDebitModalOpen(false)
    setSelectedWallet(null)
    setDebitAmount('')
    setDebitReason('')
  }

  /**
   * Handle freeze wallet
   */
  const handleFreezeWallet = (wallet: UserWallet) => {
    setSelectedWallet(wallet)
    setFreezeReason('')
    setFreezeModalOpen(true)
    setActionMenuOpen(null)
  }

  /**
   * Handle freeze wallet submit
   */
  const handleFreezeSubmit = async () => {
    if (selectedWallet) {
      try {
        setProcessing(true)
        
        if (selectedWallet.status === 'active') {
          await walletApi.freezeWallet(selectedWallet.userId)
        } else {
          await walletApi.unfreezeWallet(selectedWallet.userId)
        }
        
        // Reload wallets to get updated data
        await loadWallets()
        await loadMetrics()
        
        setFreezeModalOpen(false)
        setSelectedWallet(null)
        setFreezeReason('')
        alert(`Wallet ${selectedWallet.status === 'active' ? 'frozen' : 'unfrozen'} successfully!`)
      } catch (error: any) {
        console.error('Error freezing/unfreezing wallet:', error)
        alert(error?.response?.data?.error?.message || error?.message || 'Failed to update wallet status')
      } finally {
        setProcessing(false)
      }
    }
  }

  /**
   * Handle freeze modal close
   */
  const handleFreezeClose = () => {
    setFreezeModalOpen(false)
    setSelectedWallet(null)
    setFreezeReason('')
  }

  return (
    <div className="max-w-screen w-full overflow-x-hidden">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Wallet</h1>
        <p className="text-sm text-gray-600 mt-1">Dashboard • User Wallet</p>
      </div>

      {/* Top Metrics Section */}
      <div className="mb-4 sm:mb-6 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 shadow-sm transition-colors hover:bg-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{metrics.totalUsers}</p>
            </div>
            <div className="text-[#EE8E32]">
              <UserIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </div>
        </div>

        {/* Active Wallets */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 shadow-sm transition-colors hover:bg-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Active Wallets</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{metrics.activeWallets}</p>
            </div>
            <div className="text-[#EE8E32]">
              <ArrowUpDownIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </div>
        </div>

        {/* Frozen Wallets */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 shadow-sm transition-colors hover:bg-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Frozen Wallets</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{metrics.frozenWallets}</p>
            </div>
            <div className="text-[#EE8E32]">
              <LockIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </div>
        </div>

        {/* Total Balance */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 shadow-sm transition-colors hover:bg-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Total Balance</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{metrics.totalBalance}</p>
            </div>
            <div className="text-[#EE8E32]">
              <DollarSignIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* All User Wallets Section */}
      <div className="mb-4 sm:mb-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">All User Wallets</h3>

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
                { label: 'Active', value: 'active' },
                { label: 'Frozen', value: 'frozen' },
              ]}
              onChange={setStatusFilter}
              placeholder="Active"
              className="w-full sm:w-[140px]"
            />
          </div>
        </div>
      </div>

      {/* Wallets Table Container */}
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
              onClick={() => handleFilterChange('active')}
              className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity"
            >
              <span
                className={`text-xs sm:text-sm font-medium py-1 sm:py-2 px-1 sm:px-2 text-gray-900 ${
                  activeFilter === 'active' ? 'border-b-2 border-gray-900' : ''
                }`}
              >
                Active
              </span>
              <span
                className={`inline-flex items-center justify-center rounded-md px-1.5 sm:px-2 py-0.5 text-xs font-medium ${
                  activeFilter === 'active' ? 'bg-[#6B46C1] text-white' : 'bg-green-100 text-gray-900'
                }`}
              >
                {counts.active}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('frozen')}
              className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity"
            >
              <span
                className={`text-xs sm:text-sm font-medium py-1 sm:py-2 px-1 sm:px-2 text-gray-900 ${
                  activeFilter === 'frozen' ? 'border-b-2 border-gray-900' : ''
                }`}
              >
                Frozen
              </span>
              <span
                className={`inline-flex items-center justify-center rounded-md px-1.5 sm:px-2 py-0.5 text-xs font-medium ${
                  activeFilter === 'frozen' ? 'bg-[#6B46C1] text-white' : 'bg-red-100 text-gray-900'
                }`}
              >
                {counts.frozen}
              </span>
            </button>
          </div>
        </div>

        {/* Wallets Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600">User ID</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600">User</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Balance</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Last Transaction</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FF8C00]"></div>
                      Loading wallets...
                    </div>
                  </td>
                </tr>
              ) : paginatedWallets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                    No wallets found for the selected filters.
                  </td>
                </tr>
              ) : (
                paginatedWallets.map((wallet) => (
                  <tr key={wallet.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-900 font-mono">{wallet.userId}</td>
                    <td className="px-4 py-2">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">{wallet.userName}</p>
                        <p className="text-xs text-gray-500 break-all">{wallet.userEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-900">{wallet.balance}</td>
                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-600 whitespace-nowrap">{wallet.lastTransaction}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(
                          wallet.status
                        )}`}
                      >
                        {wallet.status.charAt(0).toUpperCase() + wallet.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="relative" data-action-menu>
                        <button
                          type="button"
                          onClick={() => toggleActionMenu(wallet.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                          aria-label="More options"
                        >
                          <MoreVerticalIcon className="h-5 w-5" />
                        </button>
                        {actionMenuOpen === wallet.id && (
                          <div className="absolute right-0 mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-lg z-10">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCreditWallet(wallet)
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              Credit Wallet
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDebitWallet(wallet)
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              Debit Wallet
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleFreezeWallet(wallet)
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              {wallet.status === 'active' ? 'Freeze Wallet' : 'Unfreeze Wallet'}
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

      {/* Credit Wallet Modal */}
      {creditModalOpen && selectedWallet && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={handleCreditClose} aria-hidden="true" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleCreditClose}>
            <div
              className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Credit Wallet</h3>
                <button
                  type="button"
                  onClick={handleCreditClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* User Information */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <span className="text-base font-semibold text-gray-600">
                      {selectedWallet.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900 leading-5">{selectedWallet.userName}</p>
                    <p className="text-sm text-gray-600 leading-5 mt-0.5">{selectedWallet.userEmail}</p>
                    <p className="text-sm font-medium text-[#4C50A2] mt-1 leading-5">
                      Current Balance: {selectedWallet.balance}
                    </p>
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <label htmlFor="creditAmount" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Amount
                  </label>
                  <input
                    type="text"
                    id="creditAmount"
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(e.target.value)}
                    placeholder="Enter Amount"
                    className="w-full rounded-lg border-0 bg-gray-100 px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:bg-gray-100 focus:outline-none focus:ring-0"
                  />
                </div>

                {/* Reason Input */}
                <div>
                  <label htmlFor="creditDescription" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Reason
                  </label>
                  <textarea
                    id="creditDescription"
                    value={creditDescription}
                    onChange={(e) => setCreditDescription(e.target.value)}
                    placeholder="Enter Reason for this action"
                    rows={3}
                    maxLength={500}
                    className="w-full rounded-lg border-0 bg-gray-100 px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:bg-gray-100 focus:outline-none focus:ring-0 resize-none max-h-24"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <button
                  type="button"
                  onClick={handleCreditClose}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreditSubmit}
                  disabled={processing || !creditAmount || !creditDescription || parseFloat(creditAmount.replace(/[^0-9.-]+/g, '')) <= 0}
                  className="flex-1 rounded-lg bg-[#FF8C00] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#E67E00] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    'Credit Wallet'
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Debit Wallet Modal */}
      {debitModalOpen && selectedWallet && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={handleDebitClose} aria-hidden="true" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleDebitClose}>
            <div
              className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Debit Wallet</h3>
                <button
                  type="button"
                  onClick={handleDebitClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* User Information */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <span className="text-base font-semibold text-gray-600">
                      {selectedWallet.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900 leading-5">{selectedWallet.userName}</p>
                    <p className="text-sm text-gray-600 leading-5 mt-0.5">{selectedWallet.userEmail}</p>
                    <p className="text-sm font-medium text-[#4C50A2] mt-1 leading-5">
                      Current Balance: {selectedWallet.balance}
                    </p>
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <label htmlFor="debitAmount" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Amount
                  </label>
                  <input
                    type="text"
                    id="debitAmount"
                    value={debitAmount}
                    onChange={(e) => setDebitAmount(e.target.value)}
                    placeholder="Enter Amount"
                    className="w-full rounded-lg border-0 bg-gray-100 px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:bg-gray-100 focus:outline-none focus:ring-0"
                  />
                </div>

                {/* Reason Input */}
                <div>
                  <label htmlFor="debitReason" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Reason
                  </label>
                  <textarea
                    id="debitReason"
                    value={debitReason}
                    onChange={(e) => setDebitReason(e.target.value)}
                    placeholder="Enter Reason for this action"
                    rows={3}
                    maxLength={500}
                    className="w-full rounded-lg border-0 bg-gray-100 px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:bg-gray-100 focus:outline-none focus:ring-0 resize-none max-h-24"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <button
                  type="button"
                  onClick={handleDebitClose}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDebitSubmit}
                  disabled={processing || !debitAmount || !debitReason || parseFloat(debitAmount.replace(/[^0-9.-]+/g, '')) <= 0}
                  className="flex-1 rounded-lg bg-[#FF8C00] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#E67E00] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    'Debit Wallet'
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Freeze Wallet Modal */}
      {freezeModalOpen && selectedWallet && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={handleFreezeClose} aria-hidden="true" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleFreezeClose}>
            <div
              className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedWallet.status === 'active' ? 'Freeze Wallet' : 'Unfreeze Wallet'}
                </h3>
                <button
                  type="button"
                  onClick={handleFreezeClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* User Information */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <span className="text-base font-semibold text-gray-600">
                      {selectedWallet.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900 leading-5">{selectedWallet.userName}</p>
                    <p className="text-sm text-gray-600 leading-5 mt-0.5">{selectedWallet.userEmail}</p>
                    <p className="text-sm font-medium text-[#4C50A2] mt-1 leading-5">
                      Current Balance: {selectedWallet.balance}
                    </p>
                  </div>
                </div>

                {/* Reason Input */}
                <div>
                  <label htmlFor="freezeReason" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Reason
                  </label>
                  <textarea
                    id="freezeReason"
                    value={freezeReason}
                    onChange={(e) => setFreezeReason(e.target.value)}
                    placeholder="Enter Reason for this action"
                    rows={3}
                    maxLength={500}
                    className="w-full rounded-lg border-0 bg-gray-100 px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:bg-gray-100 focus:outline-none focus:ring-0 resize-none max-h-24"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <button
                  type="button"
                  onClick={handleFreezeClose}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFreezeSubmit}
                  disabled={processing}
                  className="flex-1 rounded-lg bg-[#FF8C00] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#E67E00] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    selectedWallet.status === 'active' ? 'Freeze Wallet' : 'Unfreeze Wallet'
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

