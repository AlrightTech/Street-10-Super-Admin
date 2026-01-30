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
  orderDate: string
  orderNumber: string
  orderId?: string // UUID for navigation
}

const TAB_OPTIONS: { key: 'all' | OrderStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'created', label: 'Created' },
  { key: 'paid', label: 'Paid' },
  { key: 'fulfillment_pending', label: 'Fulfillment Pending' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
]

const STATUS_BADGE_CLASS: Record<'all' | OrderStatus, { active: string; inactive: string }> = {
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
  const [activeTab, setActiveTab] = useState<(typeof TAB_OPTIONS)[number]['key']>('all')
  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewingOrder, setViewingOrder] = useState<OrderRecord | null>(null)
  const [viewingOrderDetail, setViewingOrderDetail] = useState<OrderRecord | null>(null)
  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [orderCounts, setOrderCounts] = useState({ all: 0, created: 0, paid: 0, fulfillment_pending: 0, shipped: 0, delivered: 0 })

  // Load orders from API
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true)
      
      try {
        // Map frontend tab to backend status filter
        let statusFilter: string | undefined
        if (activeTab !== 'all') {
          statusFilter = activeTab
        }

        const response = await ordersApi.getAll({
          status: statusFilter,
          page: currentPage,
          limit: PAGE_SIZE,
        })

        // Transform API orders to OrderRecord format
        const transformedOrders: OrderRecord[] = (response.data || []).map((order: Order) => {
          const total = parseFloat(order.totalMinor) / 100
          const firstItem = order.items?.[0]
          const productName = firstItem?.product?.title || 'N/A'
          const productImage = firstItem?.product?.media?.[0]?.url || null
          const customerName = (order.user as any)?.name || order.user?.email?.split('@')[0] || 'Unknown'
          const customerImageUrl = (order.user as any)?.profileImageUrl || null
          
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
            status: order.status as OrderStatus,
            orderDate: new Date(order.createdAt).toLocaleDateString('en-GB'),
            orderNumber: order.orderNumber,
            orderId: order.id, // Store actual UUID for navigation
          } as OrderRecord & { orderId: string }
        })
        
        setOrders(transformedOrders)
        setTotalPages(response.pagination?.totalPages || 1)
        
        // Fetch counts for all statuses
        const allResponse = await ordersApi.getAll({ limit: 1 })
        const countsResponse = await Promise.all([
          ordersApi.getAll({ status: 'created', limit: 1 }),
          ordersApi.getAll({ status: 'paid', limit: 1 }),
          ordersApi.getAll({ status: 'fulfillment_pending', limit: 1 }),
          ordersApi.getAll({ status: 'shipped', limit: 1 }),
          ordersApi.getAll({ status: 'delivered', limit: 1 }),
        ])
        
        setOrderCounts({
          all: allResponse.pagination?.total || 0,
          created: countsResponse[0].pagination?.total || 0,
          paid: countsResponse[1].pagination?.total || 0,
          fulfillment_pending: countsResponse[2].pagination?.total || 0,
          shipped: countsResponse[3].pagination?.total || 0,
          delivered: countsResponse[4].pagination?.total || 0,
        })
      } catch (error) {
        console.error('Error loading orders:', error)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [activeTab, currentPage])

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
    setActiveTab(tabKey as (typeof TAB_OPTIONS)[number]['key'])
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
    const orderId = (order as any).orderId || order.id.replace('#', '')
    
    if (action === 'view' || action === 'view-order') {
      // Navigate to order details page
      navigate(`/orders/${orderId}`)
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
          // Refresh orders list
          const response = await ordersApi.getAll({
            status: activeTab !== 'all' ? activeTab : undefined,
            page: currentPage,
            limit: PAGE_SIZE,
          })
          const transformedOrders: OrderRecord[] = (response.data || []).map((order: Order) => {
            const total = parseFloat(order.totalMinor) / 100
            const firstItem = order.items?.[0]
            const productName = firstItem?.product?.title || 'N/A'
            const productImage = firstItem?.product?.media?.[0]?.url || null
            const customerName = (order.user as any)?.name || order.user?.email?.split('@')[0] || 'Unknown'
            const customerImageUrl = (order.user as any)?.profileImageUrl || null
            
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
              status: order.status as OrderStatus,
              orderDate: new Date(order.createdAt).toLocaleDateString('en-GB'),
              orderNumber: order.orderNumber,
              orderId: order.id,
            } as OrderRecord & { orderId: string }
          })
          setOrders(transformedOrders)
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
    // Navigate to order details page using order ID (UUID)
    const orderId = (order as any).orderId || order.id.replace('#', '')
    navigate(`/orders/${orderId}`)
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
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 01.8 1.6l-4.2 5.6a2 2 0 00-.4 1.2v5.6a1 1 0 01-1.447.894L12 16.618l-2.753 1.676A1 1 0 017.8 16.4v-5.6a2 2 0 00-.4-1.2L3.2 5.6A1 1 0 013 4z"
                />
              </svg>
              Filter
            </button>
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

