import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import UserSummaryCard from '../components/users/UserSummaryCard'
import UserStatsCard from '../components/users/UserStatsCard'
import SpendingSummary from '../components/users/SpendingSummary'
import OrderHistoryTable from '../components/users/OrderHistoryTable'
import ConfirmModal from '../components/ui/ConfirmModal'
import { getUserDetails } from '../data/mockUserDetails'
import type { UserDetails as UserDetailsType, BiddingItem, OrderItem } from '../types/userDetails'

/**
 * User Details page component
 */
export default function UserDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState<UserDetailsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<BiddingItem | OrderItem | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true)
      if (id) {
        // Check if user data is passed from navigation state (e.g., after edit)
        if (location.state?.user) {
          setUser(location.state.user as UserDetailsType)
        } else {
          // Otherwise, fetch from mock data
          const userData = getUserDetails(Number(id))
          if (userData) {
            setUser(userData)
          } else {
            // Fallback: redirect to users list if not found
            navigate('/users')
          }
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [id, navigate, location.state])

  const handleEdit = () => {
    if (user) {
      navigate(`/users/${user.id}/edit`)
    }
  }

  const handleBlock = () => {
    // Handle block logic
    console.log('Block user:', user?.id)
  }

  const handleDelete = (item: BiddingItem | OrderItem) => {
    setItemToDelete(item)
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (user && itemToDelete) {
      // Update user data by removing the item
      if ('status' in itemToDelete && 'bidId' in itemToDelete) {
        // It's a bidding item
        const biddingItem = itemToDelete as BiddingItem
        setUser({
          ...user,
          biddings: user.biddings.filter((b) => b.id !== biddingItem.id),
        })
      } else {
        // It's an order item
        const orderItem = itemToDelete as OrderItem
        setUser({
          ...user,
          orders: user.orders.filter((o) => o.id !== orderItem.id),
        })
      }
      setDeleteModalOpen(false)
      setItemToDelete(null)
    }
  }

  const cancelDelete = () => {
    setDeleteModalOpen(false)
    setItemToDelete(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Loading user details...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">User not found</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-hidden">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="mb-2 text-xl sm:text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-xs sm:text-sm text-gray-600">Dashboard • Users</p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* User Summary Card */}
        <UserSummaryCard user={user} />

        {/* User Stats Card */}
        <UserStatsCard
          user={user}
          onEdit={handleEdit}
          onBlock={handleBlock}
          onDelete={() => {
            // Handle user delete
            console.log('Delete user:', user.id)
          }}
        />

        {/* Spending Summary */}
        <SpendingSummary user={user} />

        {/* Order History Table */}
        <OrderHistoryTable
          user={user}
          onEdit={(item) => {
            console.log('Edit item:', item)
          }}
          onBlock={(item) => {
            console.log('Block item:', item)
          }}
          onDelete={handleDelete}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  )
}

