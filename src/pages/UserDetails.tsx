import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import UserSummaryCard from '../components/users/UserSummaryCard'
import UserStatsCard from '../components/users/UserStatsCard'
import SpendingSummary from '../components/users/SpendingSummary'
import OrderHistoryTable from '../components/users/OrderHistoryTable'
import ConfirmModal from '../components/ui/ConfirmModal'
import { usersApi } from '../services/users.api'
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
        try {
          // Check if user data is passed from navigation state (e.g., after edit)
          if (location.state?.user) {
            setUser(location.state.user as UserDetailsType)
            setLoading(false)
            return
          }

          // Fetch from API
          const apiUser = await usersApi.getById(id)
          
          // Transform API response to frontend format
          const transformedUser: UserDetailsType = {
            id: parseInt(apiUser.user.id.replace(/-/g, '').substring(0, 10), 16) % 1000000,
            name: apiUser.user.email.split('@')[0],
            email: apiUser.user.email,
            phone: apiUser.user.phone || '',
            avatar: '',
            role: apiUser.user.role,
            accountStatus: apiUser.user.status === 'active' ? 'verified' : apiUser.user.status === 'blocked' ? 'unverified' : 'pending',
            status: apiUser.user.status === 'active' ? 'active' : apiUser.user.status === 'blocked' ? 'blocked' : 'pending',
            ordersMade: apiUser.stats?.ordersCount || 0,
            biddingWins: apiUser.stats?.bidsWon || 0,
            totalSpent: parseFloat(apiUser.stats?.totalSpent?.toString() || '0') / 100,
            totalRefunds: 0,
            pendingRefunds: 0,
            netSpending: parseFloat(apiUser.stats?.totalSpent?.toString() || '0') / 100,
            walletBalance: parseFloat(apiUser.user.wallet?.availableMinor?.toString() || '0') / 100,
            walletLimit: 10000,
            interests: [],
            interestsImage: '',
            biddings: (apiUser.recentBids || []).map((bid: any) => ({
              id: bid.id,
              productName: bid.auction?.product?.title || 'Product',
              productImage: bid.auction?.product?.media?.[0]?.url || '',
              category: '',
              bidId: bid.id,
              bidAmount: parseFloat(bid.amountMinor?.toString() || '0') / 100,
              currentPrice: parseFloat(bid.amountMinor?.toString() || '0') / 100,
              result: bid.isWinning ? 'won' : 'lost',
              endDate: new Date(bid.auction?.endAt || new Date()).toLocaleDateString(),
              status: bid.isWinning ? 'won-fully-paid' : 'lost',
            })),
            orders: (apiUser.recentOrders || []).map((order: any) => ({
              id: order.id,
              productName: order.items?.[0]?.product?.title || 'Product',
              productImage: order.items?.[0]?.product?.media?.[0]?.url || '',
              orderId: order.orderNumber,
              amount: parseFloat(order.totalMinor?.toString() || '0') / 100,
              date: new Date(order.createdAt).toLocaleDateString(),
              status: order.status,
            })),
          }
          
          setUser(transformedUser)
        } catch (error) {
          console.error('Error fetching user details:', error)
          navigate('/users')
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

  const handleBlock = async () => {
    if (!user || !id) return
    
    try {
      const isCurrentlyBlocked = user.status === 'blocked'
      await usersApi.toggleBlock(id, !isCurrentlyBlocked)
      // Reload user data
      window.location.reload()
    } catch (error) {
      console.error('Error blocking user:', error)
      alert('Failed to update user status')
    }
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

