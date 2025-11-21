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

  // Map to store API user IDs
  const [userIdMap, setUserIdMap] = useState<Map<number, string>>(new Map())

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const result = await usersApi.getAll({ ...filters, page: pagination.page, limit: pagination.limit })
        
        // Transform API users to frontend User format and create mapping
        const transformedUsers: User[] = result.data.map((user: ApiUser) => {
          const numericId = parseInt(user.id.replace(/-/g, '').substring(0, 10), 16) % 1000000
          return {
            id: numericId,
            name: user.email.split('@')[0],
            email: user.email,
            role: user.role,
            totalPurchase: user.stats?.totalSpent ? parseFloat(user.stats.totalSpent.toString()) / 100 : 0,
            status: user.status === 'active' ? 'active' : user.status === 'blocked' ? 'blocked' : 'pending',
            joinDate: new Date(user.createdAt).toLocaleDateString(),
          }
        })
        
        // Create mapping of numeric ID to API UUID
        const newMap = new Map<number, string>()
        result.data.forEach((user: ApiUser) => {
          const numericId = parseInt(user.id.replace(/-/g, '').substring(0, 10), 16) % 1000000
          newMap.set(numericId, user.id)
        })
        setUserIdMap(newMap)
        
        setUsers(transformedUsers)
        setPagination(result.pagination)
      } catch (error) {
        console.error('Error fetching users:', error)
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
    const apiUserId = userIdMap.get(userId)
    if (apiUserId) {
      navigate(`/users/${apiUserId}/edit`, { state: { user } })
    }
  }

  /**
   * Handle view user
   */
  const handleView = (userId: number) => {
    const apiUserId = userIdMap.get(userId)
    if (apiUserId) {
      navigate(`/users/${apiUserId}`)
    }
  }

  /**
   * Confirm delete user
   */
  const confirmDelete = async () => {
    if (userToDelete !== null) {
      try {
        // TODO: Implement delete user API endpoint when available
        // For now, just remove from local state
        setUsers((prevUsers) => prevUsers.filter((user) => {
          const apiUserId = userIdMap.get(user.id)
          return apiUserId !== userToDelete
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
      const apiUserId = userIdMap.get(userId)
      if (!apiUserId) return

      const user = users.find((u) => u.id === userId)
      if (!user) return

      const isCurrentlyBlocked = user.status === 'blocked'
      await usersApi.toggleBlock(apiUserId, !isCurrentlyBlocked)
      
      // Refresh users list
      const result = await usersApi.getAll({ ...filters, page: pagination.page, limit: pagination.limit })
      const transformedUsers: User[] = result.data.map((user: ApiUser) => {
        const numericId = parseInt(user.id.replace(/-/g, '').substring(0, 10), 16) % 1000000
        return {
          id: numericId,
          name: user.email.split('@')[0],
          email: user.email,
          role: user.role,
          totalPurchase: user.stats?.totalSpent ? parseFloat(user.stats.totalSpent.toString()) / 100 : 0,
          status: user.status === 'active' ? 'active' : user.status === 'blocked' ? 'blocked' : 'pending',
          joinDate: new Date(user.createdAt).toLocaleDateString(),
        }
      })
      
      // Update mapping
      const newMap = new Map<number, string>()
      result.data.forEach((user: ApiUser) => {
        const numericId = parseInt(user.id.replace(/-/g, '').substring(0, 10), 16) % 1000000
        newMap.set(numericId, user.id)
      })
      setUserIdMap(newMap)
      
      setUsers(transformedUsers)
    } catch (error) {
      console.error('Error toggling block status:', error)
      alert('Failed to update user status')
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
      <div className="mb-4 flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap w-full sm:w-auto">
          <FilterDropdown
            label="Total Purchase"
            options={['Ascending', 'Descending', 'All']}
            onSelect={() => {}}
            className="w-full sm:w-auto"
          />
          <FilterDropdown
            label="bidding win"
            options={['Yes', 'No', 'All']}
            onSelect={() => {}}
            className="w-full sm:w-auto"
          />
          <FilterDropdown
            label="Date Join"
            options={['Newest', 'Oldest', 'All']}
            onSelect={() => {}}
            className="w-full sm:w-auto"
          />
        </div>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap w-full sm:w-auto"
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
