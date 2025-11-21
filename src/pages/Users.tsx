import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UsersTable from '../components/users/UsersTable'
import FilterDropdown from '../components/users/FilterDropdown'
import ConfirmModal from '../components/ui/ConfirmModal'
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
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<number | null>(null)

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
    setUserToDelete(userId)
    setDeleteModalOpen(true)
  }

  /**
   * Confirm delete user
   */
  const confirmDelete = () => {
    if (userToDelete !== null) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete))
      setDeleteModalOpen(false)
      setUserToDelete(null)
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
  const handleToggleBlock = (userId: number) => {
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
        <UsersTable
          users={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleBlock={handleToggleBlock}
        />
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
