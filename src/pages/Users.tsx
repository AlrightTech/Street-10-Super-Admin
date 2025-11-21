import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import UsersTable from '../components/users/UsersTable'
import FilterDropdown from '../components/users/FilterDropdown'
import ConfirmModal from '../components/ui/ConfirmModal'
import { usersApi, type User as ApiUser } from '../services/users.api'
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
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [filters] = useState<any>({})
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 })

  // Fetch users from API
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
        }))
        
        setUsers(transformedUsers)
        setPagination(result.pagination)
      } catch (error) {
        console.error('Error fetching users:', error)
        // Fallback to empty array on error
        setUsers([])
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
   * Handle delete user
   */
  const handleDelete = (userId: number) => {
    setUserToDelete(String(userId))
    setDeleteModalOpen(true)
  }

  /**
   * Confirm delete user
   */
  const confirmDelete = async () => {
    if (userToDelete !== null) {
      try {
        // TODO: Implement delete user API endpoint
        // For now, just remove from local state
        setUsers((prevUsers) => prevUsers.filter((user) => {
          const userIdStr = String(user.id)
          return userIdStr !== userToDelete
        }))
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
        }))
        setUsers(transformedUsers)
      }
    } catch (error) {
      console.error('Error toggling block status:', error)
      alert('Failed to update user status')
    }
  }

  /**
   * Handle filter selection
   */
  const handleFilterSelect = (filterType: string, value: string) => {
    // Filter logic can be implemented here
    console.log(`Filter ${filterType}: ${value}`)
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="mb-2 text-xl sm:text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-xs sm:text-sm text-gray-600">Dashboard - Users</p>
      </div>

      {/* Filter Section */}
      <div className="mb-4 flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap">
          <FilterDropdown
            label="Total Purchase"
            options={['Ascending', 'Descending', 'All']}
            onSelect={(value) => handleFilterSelect('totalPurchase', value)}
          />
          <FilterDropdown
            label="bidding win"
            options={['Yes', 'No', 'All']}
            onSelect={(value) => handleFilterSelect('biddingWin', value)}
          />
          <FilterDropdown
            label="Date Join"
            options={['Newest', 'Oldest', 'All']}
            onSelect={(value) => handleFilterSelect('dateJoin', value)}
          />
        </div>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
          aria-label="Filter"
        >
          <FilterIcon className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>

      {/* Users Table */}
      <div className="mt-5">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-600">Loading users...</p>
          </div>
        ) : (
          <UsersTable
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
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
