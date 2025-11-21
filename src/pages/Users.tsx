import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import UsersTable from '../components/users/UsersTable'
import FilterDropdown from '../components/users/FilterDropdown'
import ConfirmModal from '../components/ui/ConfirmModal'
import { usersApi, type User as ApiUser } from '../services/users.api'
import { mockUsers } from '../data/mockUsers'
import type { User } from '../types/users'

/**
 * Filter icon component
 */
const FilterIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
)

/**
 * Users page component
 */
export default function Users() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<number | null>(null)
  
  // Filter states
  const [totalPurchaseFilter, setTotalPurchaseFilter] = useState<string>('All')
  const [biddingWinFilter, setBiddingWinFilter] = useState<string>('All')
  const [dateJoinFilter, setDateJoinFilter] = useState<string>('All')
  const [filters] = useState<any>({})
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 })

  // Fetch users from API with fallback to mock data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const result = await usersApi.getAll({ ...filters, page: pagination.page, limit: pagination.limit })
        
        // Transform API users to frontend User format
        const transformedUsers: User[] = result.data.map((user: ApiUser) => ({
          id: parseInt(user.id.replace(/-/g, '').substring(0, 10), 16) % 1000000, // Convert UUID to number for compatibility
          name: user.email.split('@')[0], // Use email prefix as name
          email: user.email,
          role: user.role,
          totalPurchase: user.stats?.totalSpent ? parseFloat(user.stats.totalSpent) / 100 : 0, // Convert minor units
          status: user.status === 'active' ? 'active' : user.status === 'blocked' ? 'blocked' : 'pending',
          joinDate: new Date(user.createdAt).toLocaleDateString(),
          biddingWins: 0, // Default value
        }))
        
        setUsers(transformedUsers)
        setPagination(result.pagination)
      } catch (error) {
        console.error('Error fetching users:', error)
        // Fallback to mock data on error
        setUsers(mockUsers)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [filters, pagination.page])

  /**
   * Handle edit user
   */
  const handleEdit = (userId: number, user: User) => {
    // Navigate to edit page with user data in state
    navigate(`/users/${userId}/edit`, { state: { user } })
  }

  /**
   * Handle view user
   */
  const handleView = (userId: number) => {
    // Navigate to user details page
    navigate(`/users/${userId}`)
  }

  /**
   * Parse date string in format "DD MMM YYYY" to Date object
   */
  const parseDate = (dateString: string): Date => {
    const months: Record<string, number> = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    }
    const parts = dateString.split(' ')
    const day = parseInt(parts[0], 10)
    const month = months[parts[1]]
    const year = parseInt(parts[2], 10)
    return new Date(year, month, day)
  }

  /**
   * Filter and sort users based on selected filters
   */
  const filteredUsers = useMemo(() => {
    let result = [...users]

    // Filter by bidding wins
    if (biddingWinFilter === 'Yes') {
      result = result.filter((user) => (user.biddingWins ?? 0) > 0)
    } else if (biddingWinFilter === 'No') {
      result = result.filter((user) => (user.biddingWins ?? 0) === 0)
    }

    // Sort by total purchase
    if (totalPurchaseFilter === 'Ascending') {
      result.sort((a, b) => a.totalPurchase - b.totalPurchase)
    } else if (totalPurchaseFilter === 'Descending') {
      result.sort((a, b) => b.totalPurchase - a.totalPurchase)
    }

    // Sort by join date
    if (dateJoinFilter === 'Newest') {
      result.sort((a, b) => {
        const dateA = parseDate(a.joinDate)
        const dateB = parseDate(b.joinDate)
        return dateB.getTime() - dateA.getTime()
      })
    } else if (dateJoinFilter === 'Oldest') {
      result.sort((a, b) => {
        const dateA = parseDate(a.joinDate)
        const dateB = parseDate(b.joinDate)
        return dateA.getTime() - dateB.getTime()
      })
    }

    return result
  }, [users, totalPurchaseFilter, biddingWinFilter, dateJoinFilter])

  /**
   * Confirm delete user
   */
  const confirmDelete = async () => {
    if (userToDelete !== null) {
      try {
        // TODO: Implement delete user API endpoint
        // For now, just remove from local state
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete))
        setDeleteModalOpen(false)
        setUserToDelete(null)
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('Failed to delete user')
      }
    }
  }

  /**
   * Cancel delete user
   */
  const cancelDelete = () => {
    setDeleteModalOpen(false)
    setUserToDelete(null)
  }

  /**
   * Handle toggle block/unblock user
   */
  const handleToggleBlock = async (userId: number) => {
    try {
      // Find user in current list to get their status
      const user = users.find((u) => u.id === userId)
      if (!user) return

      const isCurrentlyBlocked = user.status === 'blocked'
      // Find the API user ID (we need to store mapping or refetch)
      // For now, we'll need to handle this differently
      // This is a simplified version - in production, maintain a proper mapping
      const apiUserId = users.find((u) => u.id === userId)?.email
      
      if (apiUserId) {
        await usersApi.toggleBlock(apiUserId, !isCurrentlyBlocked)
        // Refresh users list
        const result = await usersApi.getAll({ ...filters, page: pagination.page, limit: pagination.limit })
        const transformedUsers: User[] = result.data.map((user: ApiUser) => ({
          id: parseInt(user.id.replace(/-/g, '').substring(0, 10), 16) % 1000000,
          name: user.email.split('@')[0],
          email: user.email,
          role: user.role,
          totalPurchase: user.stats?.totalSpent ? parseFloat(user.stats.totalSpent) / 100 : 0,
          status: user.status === 'active' ? 'active' : user.status === 'blocked' ? 'blocked' : 'pending',
          joinDate: new Date(user.createdAt).toLocaleDateString(),
          biddingWins: 0,
        }))
        setUsers(transformedUsers)
      } else {
        // Fallback: update local state if API call fails
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  status: user.status === 'active' ? 'blocked' : user.status === 'blocked' ? 'active' : user.status,
                }
              : user
          )
        )
      }
    } catch (error) {
      console.error('Error toggling block status:', error)
      // Fallback: update local state if API call fails
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                status: user.status === 'active' ? 'blocked' : user.status === 'blocked' ? 'active' : user.status,
              }
            : user
        )
      )
    }
  }

  /**
   * Handle filter selection
   */
  const handleFilterSelect = (filterType: string, value: string) => {
    if (filterType === 'totalPurchase') {
      setTotalPurchaseFilter(value)
    } else if (filterType === 'biddingWin') {
      setBiddingWinFilter(value)
    } else if (filterType === 'dateJoin') {
      setDateJoinFilter(value)
    }
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="mb-2 text-xl sm:text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-xs sm:text-sm text-gray-600">Dashboard - Users</p>
      </div>

      {/* Filter Section */}
      <div className="mb-4 flex flex-col sm:flex-row justify-start sm:justify-end items-stretch sm:items-center gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap sm:order-last"
          aria-label="Filter"
        >
          <FilterIcon className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap w-full sm:w-auto">
          <FilterDropdown
            label="Total Purchase"
            options={['Ascending', 'Descending', 'All']}
            onSelect={(value) => handleFilterSelect('totalPurchase', value)}
            className="w-full sm:w-auto"
          />
          <FilterDropdown
            label="bidding win"
            options={['Yes', 'No', 'All']}
            onSelect={(value) => handleFilterSelect('biddingWin', value)}
            className="w-full sm:w-auto"
          />
          <FilterDropdown
            label="Date Join"
            options={['Newest', 'Oldest', 'All']}
            onSelect={(value) => handleFilterSelect('dateJoin', value)}
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="mt-5">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-600">Loading users...</p>
          </div>
        ) : (
          <UsersTable
            users={filteredUsers}
            onEdit={handleEdit}
            onView={handleView}
            onToggleBlock={handleToggleBlock}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete User"
        message="Are you sure you want to delete this user?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  )
}
