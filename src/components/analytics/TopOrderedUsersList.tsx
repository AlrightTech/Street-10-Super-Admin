import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import ActionDropdown from '../users/ActionDropdown'
import Modal from '../ui/Modal'
import ConfirmModal from '../ui/ConfirmModal'
import TextField from '../ui/TextField'
import { StarIcon } from '../icons/Icons'
import type { TopOrderedUser } from '../../types/analytics'

/**
 * TopOrderedUsersList component props
 */
export interface TopOrderedUsersListProps {
  users: TopOrderedUser[]
}

/**
 * Top ordered users list component
 */
export default function TopOrderedUsersList({ users: initialUsers }: TopOrderedUsersListProps) {
  const navigate = useNavigate()
  const [users, setUsers] = useState<TopOrderedUser[]>(initialUsers)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<TopOrderedUser | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<TopOrderedUser>>({})

  // Update local state when props change
  useEffect(() => {
    setUsers(initialUsers)
  }, [initialUsers])

  const handleEdit = (user: TopOrderedUser) => {
    setSelectedUser(user)
    setEditFormData({
      userId: user.userId,
      customerName: user.customerName,
      totalOrders: user.totalOrders,
      completedOrders: user.completedOrders,
      totalSpending: user.totalSpending,
      rating: user.rating,
    })
    setEditModalOpen(true)
  }

  const handleView = (user: TopOrderedUser) => {
    navigate(`/analytics/order-detail/${user.id}`)
  }

  const handleDelete = (user: TopOrderedUser) => {
    setSelectedUser(user)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      setUsers(users.filter((u) => u.id !== selectedUser.id))
      setDeleteModalOpen(false)
      setSelectedUser(null)
    }
  }

  const handleEditSave = () => {
    if (selectedUser && editFormData) {
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                userId: editFormData.userId || u.userId,
                customerName: editFormData.customerName || u.customerName,
                totalOrders: editFormData.totalOrders !== undefined ? editFormData.totalOrders : u.totalOrders,
                completedOrders: editFormData.completedOrders !== undefined ? editFormData.completedOrders : u.completedOrders,
                totalSpending: editFormData.totalSpending || u.totalSpending,
                rating: editFormData.rating !== undefined ? editFormData.rating : u.rating,
              }
            : u
        )
      )
      setEditModalOpen(false)
      setSelectedUser(null)
      setEditFormData({})
    }
  }

  return (
    <div>
      <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-900">Top Ordered Users</h3>
        <Button variant="primary" className="rounded-lg text-[11px] px-3.5 py-2 cursor-pointer sm:text-xs sm:px-4 sm:py-2 w-full sm:w-auto">
          View All
        </Button>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-2 text-left text-sm font-medium text-gray-600 whitespace-nowrap sm:whitespace-normal">
                  User ID
                </th>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-2 text-left text-sm font-medium text-gray-600 whitespace-nowrap sm:whitespace-normal">
                  User Name
                </th>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-2 text-left text-sm font-medium text-gray-600 whitespace-nowrap sm:whitespace-normal">
                  Total Orders
                </th>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-2 text-left text-sm font-medium text-gray-600 whitespace-nowrap sm:whitespace-normal">
                  Completed Orders
                </th>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-2 text-left text-sm font-medium text-gray-600 whitespace-nowrap sm:whitespace-normal">
                  Total Spending
                </th>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-2 text-left text-sm font-medium text-gray-600 whitespace-nowrap sm:whitespace-normal">
                  Rating
                </th>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-2 text-left text-sm font-medium text-gray-600 whitespace-nowrap sm:whitespace-normal">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-2 sm:px-3 md:px-4 py-2 text-sm text-gray-900 whitespace-nowrap sm:whitespace-normal">
                    {user.userId}
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <img
                        src={user.avatar}
                        alt={user.customerName}
                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover flex-shrink-0"
                      />
                      <span className="text-sm text-gray-900 whitespace-nowrap sm:whitespace-normal sm:break-words">
                        {user.customerName}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-2 text-sm text-gray-600 whitespace-nowrap sm:whitespace-normal">
                    {user.totalOrders}
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-2 text-sm text-gray-600 whitespace-nowrap sm:whitespace-normal">
                    {user.completedOrders}
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-2 text-sm text-gray-600 whitespace-nowrap sm:whitespace-normal">
                    {user.totalSpending}
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-2 text-sm text-gray-600 whitespace-nowrap sm:whitespace-normal">
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
                      <span>{user.rating}</span>
                    </div>
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-2">
                    <ActionDropdown
                      onView={() => handleView(user)}
                      onEdit={() => handleEdit(user)}
                      onDelete={() => handleDelete(user)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedUser(null)
          setEditFormData({})
        }}
        title="Edit User"
      >
        <div className="space-y-4">
          <TextField
            id="userId"
            label="User ID"
            value={editFormData.userId || ''}
            onChange={(value) => setEditFormData({ ...editFormData, userId: value })}
          />
          <TextField
            id="customerName"
            label="Customer Name"
            value={editFormData.customerName || ''}
            onChange={(value) => setEditFormData({ ...editFormData, customerName: value })}
          />
          <TextField
            id="totalOrders"
            label="Total Orders"
            type="number"
            value={editFormData.totalOrders?.toString() || ''}
            onChange={(value) => setEditFormData({ ...editFormData, totalOrders: parseInt(value) || 0 })}
          />
          <TextField
            id="completedOrders"
            label="Completed Orders"
            type="number"
            value={editFormData.completedOrders?.toString() || ''}
            onChange={(value) => setEditFormData({ ...editFormData, completedOrders: parseInt(value) || 0 })}
          />
          <TextField
            id="totalSpending"
            label="Total Spending"
            value={editFormData.totalSpending || ''}
            onChange={(value) => setEditFormData({ ...editFormData, totalSpending: value })}
          />
          <TextField
            id="rating"
            label="Rating"
            type="number"
            step="0.1"
            value={editFormData.rating?.toString() || ''}
            onChange={(value) => setEditFormData({ ...editFormData, rating: parseFloat(value) || 0 })}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setEditModalOpen(false)
                setSelectedUser(null)
                setEditFormData({})
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete User"
        message={`Are you sure you want to delete user ${selectedUser?.customerName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false)
          setSelectedUser(null)
        }}
      />
    </div>
  )
}

