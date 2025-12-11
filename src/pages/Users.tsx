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
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
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
  
  // Filter states
  const [totalPurchaseFilter, setTotalPurchaseFilter] = useState<string>('All')
  const [biddingWinFilter, setBiddingWinFilter] = useState<string>('All')
  const [dateJoinFilter, setDateJoinFilter] = useState<string>('All')
  const [filters] = useState<any>({})
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 })

  // Map to store API user IDs
  const [userIdMap, setUserIdMap] = useState<Map<number, string>>(new Map())

  // Fetch users from API with fallback to mock data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const result = await usersApi.getAll({
          ...filters,
          page: pagination.page,
          limit: pagination.limit,
        })

        // Debug: Log the result to see what we're receiving
        console.log('Users API result:', result)
        console.log('Users data:', result?.data)
        console.log('Users pagination:', result?.pagination)

        // Handle case where result.data might be undefined
        const usersArray = result?.data || []
        if (!Array.isArray(usersArray)) {
          console.error('Users data is not an array:', usersArray)
          setUsers([])
          return
        }

        // Transform API users to frontend User format and create mapping
        const transformedUsers: User[] = usersArray.map((user: ApiUser) => {
          const numericId =
            parseInt(user.id.replace(/-/g, '').substring(0, 10), 16) % 1000000
          return {
            id: numericId,
            name: user.email.split('@')[0],
            email: user.email,
            role: user.role,
            totalPurchase: user.stats?.totalSpent
              ? parseFloat(user.stats.totalSpent.toString()) / 100
              : 0,
            status:
              user.status === 'active'
                ? 'active'
                : user.status === 'blocked'
                ? 'blocked'
                : 'pending',
            joinDate: new Date(user.createdAt).toLocaleDateString(),
            biddingWins: 0, // Default value
          }
        })

        // Create mapping of numeric ID to API UUID
        const newMap = new Map<number, string>()
        usersArray.forEach((user: ApiUser) => {
          const numericId =
            parseInt(user.id.replace(/-/g, '').substring(0, 10), 16) % 1000000
          newMap.set(numericId, user.id)
        })
        setUserIdMap(newMap)

        setUsers(transformedUsers)
        setPagination(
          result?.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 }
        )
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
        // userToDelete is already the UUID string
        await usersApi.delete(userToDelete)
        
        // Remove from local state
        setUsers((prevUsers) =>
          prevUsers.filter((user) => {
            const mappedUserId = userIdMap.get(user.id)
            return mappedUserId !== userToDelete
          })
        )
        setDeleteModalOpen(false)
        setUserToDelete(null)
        
        // Refresh the list
        const result = await usersApi.getAll({
          ...filters,
          page: pagination.page,
          limit: pagination.limit,
        })
        const usersArray = result?.data || []
        const transformedUsers: User[] = usersArray.map((user: ApiUser) => {
          const numericId =
            parseInt(user.id.replace(/-/g, '').substring(0, 10), 16) % 1000000
          return {
            id: numericId,
            name: user.email.split('@')[0],
            email: user.email,
            role: user.role,
            totalPurchase: user.stats?.totalSpent
              ? parseFloat(user.stats.totalSpent.toString()) / 100
              : 0,
            status:
              user.status === 'active'
                ? 'active'
                : user.status === 'blocked'
                ? 'blocked'
                : 'pending',
            joinDate: new Date(user.createdAt).toLocaleDateString(),
            biddingWins: 0,
          }
        })
        const newMap = new Map<number, string>()
        usersArray.forEach((user: ApiUser) => {
          const numericId =
            parseInt(user.id.replace(/-/g, '').substring(0, 10), 16) % 1000000
          newMap.set(numericId, user.id)
        })
        setUsers(transformedUsers)
        setUserIdMap(newMap)
        if (result?.pagination) {
          setPagination(result.pagination)
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('Failed to delete user. Please try again.')
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
   * Handle delete user
   */
  const handleDelete = (userId: number) => {
    const apiUserId = userIdMap.get(userId)
    if (apiUserId) {
      setUserToDelete(apiUserId)
      setDeleteModalOpen(true)
    } else {
      console.error('User ID not found in map')
      alert('User ID not found')
    }
  }

  /**
   * Handle toggle block/unblock user
   */
  const handleToggleBlock = async (userId: number) => {
    try {
      const apiUserId = userIdMap.get(userId);
      if (!apiUserId) {
        console.error("User UUID not found in map for ID:", userId);
        return;
      }

      const user = users.find((u) => u.id === userId);
      if (!user) {
        console.error("User not found in users list:", userId);
        return;
      }

      const isCurrentlyBlocked = user.status === "blocked";
      const action = isCurrentlyBlocked ? "unblock" : "block";
      
      if (!confirm(`Are you sure you want to ${action} this user?`)) {
        return;
      }

      await usersApi.toggleBlock(apiUserId, !isCurrentlyBlocked);

      // Update local state immediately for better UX
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId
            ? {
                ...u,
                status: isCurrentlyBlocked ? "active" : "blocked",
                accountStatus: isCurrentlyBlocked ? "verified" : "unverified",
              }
            : u
        )
      );

      // Refresh users list to ensure consistency
      const result = await usersApi.getAll({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      })
      const transformedUsers: User[] = result.data.map((user: ApiUser) => {
        const numericId =
          parseInt(user.id.replace(/-/g, '').substring(0, 10), 16) % 1000000
        return {
          id: numericId,
          name: user.email.split('@')[0],
          email: user.email,
          role: user.role,
          totalPurchase: user.stats?.totalSpent
            ? parseFloat(user.stats.totalSpent.toString()) / 100
            : 0,
          status:
            user.status === 'active'
              ? 'active'
              : user.status === 'blocked'
              ? 'blocked'
              : 'pending',
          joinDate: new Date(user.createdAt).toLocaleDateString(),
          biddingWins: 0,
        }
      })

      // Update mapping
      const newMap = new Map<number, string>()
      result.data.forEach((user: ApiUser) => {
        const numericId =
          parseInt(user.id.replace(/-/g, '').substring(0, 10), 16) % 1000000
        newMap.set(numericId, user.id)
      })
      setUserIdMap(newMap)

      setUsers(transformedUsers);
      setPagination(result.pagination);
      
      alert(`User ${action}ed successfully!`);
    } catch (error: any) {
      console.error("Error toggling block status:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update user status";
      alert(`Error: ${errorMessage}`);
      
      // Refresh users list on error to restore correct state
      try {
        const result = await usersApi.getAll({
          ...filters,
          page: pagination.page,
          limit: pagination.limit,
        });
        const transformedUsers: User[] = result.data.map((user: ApiUser) => {
          const numericId =
            parseInt(user.id.replace(/-/g, "").substring(0, 10), 16) % 1000000;
          return {
            id: numericId,
            name: user.email.split("@")[0],
            email: user.email,
            role: user.role,
            totalPurchase: user.stats?.totalSpent
              ? parseFloat(user.stats.totalSpent.toString()) / 100
              : 0,
            status:
              user.status === "active"
                ? "active"
                : user.status === "blocked"
                ? "blocked"
                : "pending",
            joinDate: new Date(user.createdAt).toLocaleDateString(),
            biddingWins: 0,
          };
        });
        setUsers(transformedUsers);
        setPagination(result.pagination);
      } catch (refreshError) {
        console.error("Error refreshing users list:", refreshError);
      }
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
        <h1 className="mb-2 text-xl sm:text-2xl font-bold text-gray-900">
          Users
        </h1>
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
            onDelete={handleDelete}
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
