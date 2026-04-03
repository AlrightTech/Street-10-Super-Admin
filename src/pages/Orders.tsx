import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import OrdersFilterTabs from '../components/orders/OrdersFilterTabs'
import OrdersTable from '../components/orders/OrdersTable'
import type { OrderActionType } from '../components/orders/OrdersActionMenu'
import SearchBar from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'
import OrderDetailsView from '../components/orders/OrderDetailsView'
import OrderDetailView from '../components/orders/OrderDetailView'
import { ordersApi, type Order } from '../services/orders.api'

export type OrderStatus = 'active' | 'inactive' | 'created' | 'paid' | 'fulfillment_pending' | 'shipped' | 'delivered' | 'closed' | 'cancelled'

export interface OrderRecord {
  id: string
  customerName: string
  customerEmail?: string
  customerImageUrl?: string
  product: string
  productImage?: string
  amount: number
  amountFormatted: string
  paymentMethod: string
  status: OrderStatus
  displayStatus: string
  refundStatus?: string
  orderDate: string
  orderNumber: string
  orderId?: string // UUID for navigation
}

/** Label shown in tables/badges; mirrors API order.status + refundStatus. */
export function buildOrderDisplayStatus(
  status: string,
  refundStatus?: string | null
): string {
  const statusDisplayMap: Record<string, string> = {
    created: 'Created',
    paid: 'Paid',
    fulfillment_pending: 'Fulfillment Pending',
    shipped: 'Shipped',
    delivered: 'Delivered',
    closed: 'Closed',
    cancelled: 'Cancelled',
    active: 'Active',
    inactive: 'Inactive',
    completed: 'Completed',
    processing: 'Processing',
    pending: 'Pending',
  }
  const baseLabel =
    statusDisplayMap[status] ||
    status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  const rs = refundStatus
  if (rs === 'refund_requested') return `${baseLabel} + Refund Requested`
  if (rs === 'partially_refunded') return `${baseLabel} + Partially Refunded`
  if (rs === 'fully_refunded') return 'Cancelled + Refunded'
  return baseLabel
}

const TAB_OPTIONS: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'paid', label: 'Paid' },
  { key: 'fulfillment_pending', label: 'Fulfillment Pending' },
  { key: 'shipped', label: 'Shipped' },
]

const STATUS_BADGE_CLASS: Record<string, { active: string; inactive: string }> = {
  all: {
    active: 'bg-[#4C50A2] text-white',
    inactive: 'bg-[#4C50A2] text-white',
  },
  created: {
    active: 'bg-yellow-100 text-yellow-800',
    inactive: 'bg-yellow-100 text-yellow-800',
  },
  paid: {
    active: 'bg-[#DCF6E5] text-[#118D57]',
    inactive: 'bg-[#DCF6E5] text-[#118D57]',
  },
  fulfillment_pending: {
    active: 'bg-blue-100 text-blue-800',
    inactive: 'bg-blue-100 text-blue-800',
  },
  shipped: {
    active: 'bg-purple-100 text-purple-800',
    inactive: 'bg-purple-100 text-purple-800',
  },
  delivered: {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-green-100 text-green-800',
  },
  refund_requested: {
    active: 'bg-orange-100 text-orange-800',
    inactive: 'bg-orange-100 text-orange-800',
  },
  refunded: {
    active: 'bg-blue-100 text-blue-800',
    inactive: 'bg-blue-100 text-blue-800',
  },
  active: {
    active: 'bg-[#DCF6E5] text-[#118D57]',
    inactive: 'bg-[#DCF6E5] text-[#118D57]',
  },
  inactive: {
    active: 'bg-[#FFE4DE] text-[#B71D18]',
    inactive: 'bg-[#FFE4DE] text-[#B71D18]',
  },
  closed: {
    active: 'bg-gray-100 text-gray-800',
    inactive: 'bg-gray-100 text-gray-800',
  },
  cancelled: {
    active: 'bg-[#FFE4DE] text-[#B71D18]',
    inactive: 'bg-[#FFE4DE] text-[#B71D18]',
  },
}

const PAGE_SIZE = 6

export default function Orders() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<string>('all')
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)

  const filterOptions = [
    { key: 'all', label: 'All Orders' },
    { key: 'status:created', label: 'Created' },
    { key: 'status:delivered', label: 'Delivered' },
    { key: 'status:closed', label: 'Completed' },
    { key: 'status:cancelled', label: 'Cancelled' },
    { key: 'refund:refund_requested', label: 'Refund Requested' },
    { key: 'refund:refunded', label: 'Refunded' },
  ]
  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewingOrder, setViewingOrder] = useState<OrderRecord | null>(null)
  const [viewingOrderDetail, setViewingOrderDetail] = useState<OrderRecord | null>(null)
  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [refreshKey, setRefreshKey] = useState(0)
  const [orderCounts, setOrderCounts] = useState({ all: 0, paid: 0, fulfillment_pending: 0, shipped: 0 })

  // Load orders from API
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true)
      
      try {
        const params: Record<string, any> = { page: currentPage, limit: PAGE_SIZE }
        if (activeTab !== 'all') {
          params.status = activeTab
        }
        if (activeFilter !== 'all') {
          if (activeFilter.startsWith('status:')) {
            params.status = activeFilter.replace('status:', '')
          } else if (activeFilter.startsWith('refund:')) {
            params.refund_status = activeFilter.replace('refund:', '')
          }
        }

        const response = await ordersApi.getAll(params)

        const transformedOrders: OrderRecord[] = (response.data || []).map((order: Order) => {
          const total = parseFloat(order.totalMinor) / 100
          const firstItem = order.items?.[0]
          const productName = firstItem?.product?.title || 'N/A'
          const productImage = firstItem?.product?.media?.[0]?.url || null
          const customerName = (order.user as any)?.name || order.user?.email?.split('@')[0] || 'Unknown'
          const customerImageUrl = (order.user as any)?.profileImageUrl || null
          
          let coreStatus = order.status as OrderStatus
          if (order.auctionId && order.paymentStage) {
            ;(order as any).displayPaymentStage = order.paymentStage
          }

          const compoundLabel = buildOrderDisplayStatus(order.status, order.refundStatus)
          
          return {
            id: `#${order.orderNumber || order.id.slice(-8)}`,
            customerName: customerName,
            customerEmail: order.user?.email,
            customerImageUrl: customerImageUrl,
            product: productName,
            productImage: productImage,
            amount: total,
            amountFormatted: `${order.currency} ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            paymentMethod: order.paymentMethod || 'N/A',
            status: coreStatus,
            displayStatus: compoundLabel,
            refundStatus: order.refundStatus || 'none',
            orderDate: new Date(order.createdAt).toLocaleDateString('en-GB'),
            orderNumber: order.orderNumber,
            orderId: order.id,
            userId: order.userId,
            paymentStage: order.paymentStage,
            auctionId: order.auctionId,
            orderType: (order as any).orderType || 'admin-ecommerce',
          } as OrderRecord & { orderId: string; userId?: string; paymentStage?: string; auctionId?: string; orderType?: string }
        })
        
        setOrders(transformedOrders)
        setTotalPages(response.pagination?.totalPages || 1)

        // Use pagination total from current + "all" request for counts (only 2 requests max)
        const currentTotal = response.pagination?.total || 0
        if (activeTab === 'all' && activeFilter === 'all') {
          setOrderCounts(prev => ({ ...prev, all: currentTotal }))
        }
      } catch (error) {
        console.error('Error loading orders:', error)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [activeTab, activeFilter, currentPage, refreshKey])

  const tabOptionsWithCounts = useMemo(
    () =>
      TAB_OPTIONS.map((tab) => ({
        ...tab,
        count: orderCounts[tab.key as keyof typeof orderCounts] || 0,
        badgeClassName: STATUS_BADGE_CLASS[tab.key],
      })),
    [orderCounts],
  )

  const filteredOrders = useMemo(() => {
    let result = [...orders]

    if (searchValue.trim()) {
      const query = searchValue.toLowerCase()
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.product.toLowerCase().includes(query),
      )
    }

    return result
  }, [orders, searchValue])

  const paginatedOrders = useMemo(() => {
    return filteredOrders
  }, [filteredOrders])

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey)
    setActiveFilter('all')
    setCurrentPage(1)
  }

  const handleFilterSelect = (value: string) => {
    setActiveFilter(value)
    setActiveTab('all')
    setShowFilterDropdown(false)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const handleOrderAction = async (order: OrderRecord, action: OrderActionType) => {
    // Use orderId if available (actual UUID), otherwise extract from id
    const orderId = (order as any).orderId || (order.id?.toString().replace('#', '') || '')
    
    if (action === 'view' || action === 'view-order') {
      // Navigate to order details page (not customer detail page)
      console.log('Navigating to order detail page with orderId:', orderId)
      navigate(`/orders/${orderId}/detail`)
    } else if (action === 'edit') {
      // Navigate to order edit page (if exists) or detail page
      navigate(`/orders/${orderId}/detail`)
    } else if (action === 'delete') {
      // Check if order is already cancelled
      if (order.status === 'cancelled') {
        alert('This order is already cancelled.')
        return
      }

      // Show confirmation and cancel order (not delete - just change status)
      const confirmed = window.confirm(`Are you sure you want to cancel order ${order.orderNumber}? This action cannot be undone.`)
      if (confirmed) {
        try {
          // Update order status to 'cancelled' (not actually deleting the order)
          await ordersApi.updateStatus(orderId, 'cancelled')
          alert('Order cancelled successfully')
          setRefreshKey(k => k + 1)
        } catch (error: any) {
          // Handle error gracefully - check if it's a validation error about status transition
          const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error'
          if (errorMessage.includes('status') || errorMessage.includes('transition') || errorMessage.includes('cancelled')) {
            alert(`Cannot cancel order: ${errorMessage}`)
          } else {
            alert(`Failed to cancel order: ${errorMessage}`)
          }
        }
      }
    } else if (action === 'block') {
      // Block order (update status to cancelled or add block flag)
      const confirmed = window.confirm(`Are you sure you want to block order ${order.orderNumber}?`)
      if (confirmed) {
        try {
          await ordersApi.updateStatus(orderId, 'cancelled')
          alert('Order blocked successfully')
          // Refresh orders list
          window.location.reload()
        } catch (error: any) {
          alert(`Failed to block order: ${error?.message || 'Unknown error'}`)
        }
      }
    }
  }

  const handleNameClick = (order: OrderRecord) => {
    // Navigate to order customer detail page using order ID
    const orderId = (order as any).orderId || (order.id?.toString().replace('#', '') || '')
    if (orderId) {
      navigate(`/orders/${orderId}`)
    } else {
      // Fallback: navigate to order detail if user ID not available
      const orderId = (order as any).orderId || order.id.replace('#', '')
      navigate(`/orders/${orderId}`)
    }
  }

  // If viewing order detail, show order detail view instead of the table
  if (viewingOrderDetail) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-600">Orders</p>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Orders</h1>
            <p className="mt-1 text-sm font-semibold">
              <span className="text-gray-600">Dashboard • </span>
              <span className="text-black">Orders</span>
            </p>
          </div>
        </div>

        <OrderDetailView order={viewingOrderDetail} />
      </div>
    )
  }

  // If viewing an order (customer details), show order details instead of the table
  if (viewingOrder) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Orders</h1>
            <p className="mt-1 text-sm font-semibold">
              <span className="text-gray-600">Dashboard • </span>
              <span className="text-black">Orders</span>
            </p>
          </div>
        </div>

        <OrderDetailsView
          order={viewingOrder}
          onClose={() => setViewingOrder(null)}
          onViewOrder={(order) => {
            setViewingOrder(null)
            setViewingOrderDetail(order)
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 sm:text-2xl">Orders</h1>
          <p className="mt-1 text-sm font-semibold">
            <span className="text-gray-600 dark:text-gray-400">Dashboard • </span>
            <span className="text-black dark:text-gray-100">Orders</span>
          </p>
        </div>
      </div>

      <section className="rounded-xl bg-white dark:bg-gray-800 shadow-sm transition-colors">
        <header className="flex flex-col gap-4 border-b border-gray-100 dark:border-gray-700 px-4 pt-4 pb-0 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <OrdersFilterTabs tabs={tabOptionsWithCounts} activeTab={activeTab} onTabChange={handleTabChange} />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
            <SearchBar
              placeholder="Search Order #"
              value={searchValue}
              onChange={handleSearchChange}
              className="min-w-[220px] sm:min-w-[240px]"
            />
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeFilter !== 'all' ? 'bg-orange-50 text-orange-700 border border-orange-300' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 01.8 1.6l-4.2 5.6a2 2 0 00-.4 1.2v5.6a1 1 0 01-1.447.894L12 16.618l-2.753 1.676A1 1 0 017.8 16.4v-5.6a2 2 0 00-.4-1.2L3.2 5.6A1 1 0 013 4z"
                  />
                </svg>
                {activeFilter === 'all' ? 'Filter' : filterOptions.find(o => o.key === activeFilter)?.label || 'Filter'}
              </button>
              {showFilterDropdown && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  {filterOptions.map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => handleFilterSelect(opt.key)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                        activeFilter === opt.key ? 'bg-orange-50 text-orange-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-600">Loading orders...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <OrdersTable
                orders={paginatedOrders}
                startIndex={(currentPage - 1) * PAGE_SIZE}
                onActionSelect={handleOrderAction}
                onNameClick={handleNameClick}
              />
            </div>
          )}
        </div>

        <footer className="flex justify-end items-center gap-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-4 sm:px-6 transition-colors">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </footer>
      </section>
    </div>
  )
}

