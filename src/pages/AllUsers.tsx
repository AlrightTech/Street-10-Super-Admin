import { useState, useMemo, useRef, useEffect } from 'react'
import { mockAllUsers, getKYCSummary } from '../data/mockAllUsers'
import KYCSummaryCards from '../components/allUsers/KYCSummaryCards'
import AllUsersTable from '../components/allUsers/AllUsersTable'
import { ChevronDownIcon } from '../components/icons/Icons'
import type { KYCSummaryCard } from '../types/allUsers'

/**
 * All Users page component
 */
export default function AllUsers() {
  const [activeFilter, setActiveFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('all')
  
  // Get KYC summary
  const summary = getKYCSummary()

  // Create summary cards matching reference image
  const summaryCards: KYCSummaryCard[] = [
    {
      type: 'pending',
      count: summary.pending,
      label: 'Pending',
      icon: 'people',
      iconColor: '#3B82F6',
      trend: {
        value: 2.6,
        label: 'Awaiting review',
        isPositive: true,
      },
    },
    {
      type: 'approved',
      count: summary.approved,
      label: 'Approved',
      icon: 'trophy',
      iconColor: '#4CAF50',
    },
    {
      type: 'rejected',
      count: summary.rejected,
      label: 'Rejected',
      icon: 'document',
      iconColor: '#F59E0B',
    },
    {
      type: 'total',
      count: summary.total,
      label: 'Total KYCs',
      icon: 'square',
      iconColor: '#9370DB',
      trend: {
        value: 2.6,
        label: 'All submissions',
        isPositive: true,
      },
    },
  ]

  // Get actual counts for filtering
  const actualPending = mockAllUsers.filter((user) => user.status === 'pending').length
  const actualApproved = mockAllUsers.filter((user) => user.status === 'approved').length
  const actualRejected = mockAllUsers.filter((user) => user.status === 'rejected').length

  // Filter users based on active filter
  const filteredUsers = useMemo(() => {
    if (activeFilter === 'all') {
      return mockAllUsers
    }
    return mockAllUsers.filter((user) => user.status === activeFilter)
  }, [activeFilter])

  const handleCardClick = (type: 'pending' | 'approved' | 'rejected' | 'total') => {
    if (type === 'total') {
      setActiveFilter('all')
    } else {
      setActiveFilter(type)
    }
  }

  const handleFilterClick = (filter: 'pending' | 'approved' | 'rejected' | 'all') => {
    setActiveFilter(filter)
  }

  // Filter dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const getFilterLabel = (filter: 'pending' | 'approved' | 'rejected' | 'all') => {
    switch (filter) {
      case 'all':
        return 'All'
      case 'pending':
        return 'Pending'
      case 'approved':
        return 'Approved'
      case 'rejected':
        return 'Rejected'
      default:
        return 'All'
    }
  }

  const handleDropdownSelect = (filter: 'pending' | 'approved' | 'rejected' | 'all') => {
    handleFilterClick(filter)
    setIsDropdownOpen(false)
  }

  return (
    <>
      {/* KYC Summary Cards */}
      <KYCSummaryCards cards={summaryCards} onCardClick={handleCardClick} />

      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">All Users</h1>
      </div>

      {/* Filter Tabs and Table */}
      <div className="bg-white  rounded-lg border border-gray-200 ">
        {/* Filter Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start 
          sm:items-end justify-between gap-4 px-4 pt-4 pb-0">
            <div className="flex w-full gap-4">
              <button
                type="button"
                onClick={() => handleFilterClick('pending')}
                className={`pb-2 px-1 text-sm  font-medium transition-colors cursor-pointer ${
                  activeFilter === 'pending'
                    ? 'text-[#FF8C00] border-b-2 border-[#FF8C00]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pending ({actualPending})
              </button>
              <button
                type="button"
                onClick={() => handleFilterClick('rejected')}
                className={`pb-2 px-1 text-sm font-medium transition-colors cursor-pointer ${
                  activeFilter === 'rejected'
                    ? 'text-[#FF8C00] border-b-2 border-[#FF8C00]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Rejected ({actualRejected})
              </button>
              <button
                type="button"
                onClick={() => handleFilterClick('approved')}
                className={`pb-2 px-1 text-sm font-medium transition-colors cursor-pointer ${
                  activeFilter === 'approved'
                    ? 'text-[#FF8C00] border-b-2 border-[#FF8C00]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Approved ({actualApproved})
              </button>
            </div>
            <div className="flex items-center gap-2 pb-2 w-full sm:w-auto" ref={dropdownRef}>
              <div className="relative w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer w-full sm:w-auto sm:min-w-[100px]"
                  aria-label="Filter by status"
                  aria-expanded={isDropdownOpen}
                >
                  <span>{getFilterLabel(activeFilter)}</span>
                  <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-full sm:w-48 origin-top-right rounded-lg border border-gray-200 bg-white shadow-lg">
                    <div className="py-1" role="menu">
                      <button
                        type="button"
                        onClick={() => handleDropdownSelect('all')}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                        role="menuitem"
                      >
                        All
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDropdownSelect('pending')}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                        role="menuitem"
                      >
                        Pending
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDropdownSelect('approved')}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                        role="menuitem"
                      >
                        Approved
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDropdownSelect('rejected')}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                        role="menuitem"
                      >
                        Rejected
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* All Users Table */}
        <AllUsersTable users={filteredUsers} />
      </div>
    </>
  )
}

