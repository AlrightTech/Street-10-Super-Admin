import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import OrdersFilterTabs from '../components/orders/OrdersFilterTabs'
import OrdersTable from '../components/orders/OrdersTable'
import type { OrderActionType } from '../components/orders/OrdersActionMenu'
import SearchBar from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'
import OrderDetailsView from '../components/orders/OrderDetailsView'
import OrderDetailView from '../components/orders/OrderDetailView'
import { ordersApi } from '../services/orders.api'

export type OrderStatus = 'completed' | 'pending' | 'cancelled'

export interface OrderRecord {
  id: string
  customerName: string
  product: string
  amount: number
  paymentMethod: string
  status: OrderStatus
  orderDate: string
}

// Removed mock data - using API now

const TAB_OPTIONS: { key: 'all' | OrderStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
]

const STATUS_BADGE_CLASS: Record<'all' | OrderStatus, { active: string; inactive: string }> = {
  all: {
    active: 'bg-[#4C50A2] text-white',
    inactive: 'bg-[#4C50A2] text-white',
  },
  pending: {
    active: 'bg-[#FFF2D6] text-[#B76E00]',
    inactive: 'bg-[#FFF2D6] text-[#B76E00]',
  },
  completed: {
    active: 'bg-[#DCF6E5] text-[#118D57]',
    inactive: 'bg-[#DCF6E5] text-[#118D57]',
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
  const [orderCounts, setOrderCounts] = useState({ all: 0, pending: 0, completed: 0, cancelled: 0 })

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const statusMap: Record<string, string> = {
          'all': '',
          'pending': 'created',
          'completed': 'closed',
          'cancelled': 'cancelled',
        }
        
        const filters: any = {
          page: currentPage,
          limit: PAGE_SIZE,
        }
        
        if (activeTab !== 'all') {
          filters.status = statusMap[activeTab]
        }
        
        const result = await ordersApi.getAll(filters)
        
        // Transform API orders to frontend format
        const transformedOrders: OrderRecord[] = result.data.map((order: any) => ({
          id: order.orderNumber,
          customerName: order.user?.email?.split('@')[0] || 'Customer',
          product: order.items?.[0]?.product?.title || 'Product',
          amount: parseFloat(order.totalMinor?.toString() || '0') / 100,
          paymentMethod: order.paymentMethod === 'card' ? 'Credit Card' : 
                        order.paymentMethod === 'wallet' ? 'Wallet' : 
                        order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Unknown',
          status: order.status === 'closed' || order.status === 'delivered' ? 'completed' :
                 order.status === 'cancelled' ? 'cancelled' : 'pending',
          orderDate: new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        }))
        
        setOrders(transformedOrders)
        setTotalPages(result.pagination.totalPages)
        
        // Update counts for tabs
        const allResult = await ordersApi.getAll({ limit: 1000 })
        const counts = {
          all: allResult.pagination.total,
          pending: allResult.data.filter((o: any) => !['closed', 'delivered', 'cancelled'].includes(o.status)).length,
          completed: allResult.data.filter((o: any) => ['closed', 'delivered'].includes(o.status)).length,
          cancelled: allResult.data.filter((o: any) => o.status === 'cancelled').length,
        }
        setOrderCounts(counts)
      } catch (error) {
        console.error('Error fetching orders:', error)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [activeTab, currentPage])

  const tabOptionsWithCounts = useMemo(
    () =>
      TAB_OPTIONS.map((tab) => ({
        ...tab,
        count: orderCounts[tab.key] || 0,
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

  const handleOrderAction = (order: OrderRecord, action: OrderActionType) => {
    if (action === 'view') {
      setViewingOrder(order)
    } else if (action === 'view-order') {
      // Navigate to order details page
      navigate(`/orders/${order.id.replace('#', '')}`)
    } else {
      // Placeholder callback for other actions
      // eslint-disable-next-line no-console
      console.log(`Action "${action}" selected for order ${order.id}`)
    }
  }

  const handleNameClick = (order: OrderRecord) => {
    // Navigate to order details page
    navigate(`/orders/${order.id.replace('#', '')}`)
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
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Orders</h1>
          <p className="mt-1 text-sm font-semibold">
            <span className="text-gray-600">Dashboard • </span>
            <span className="text-black">Orders</span>
          </p>
        </div>
      </div>

      <section className="rounded-xl bg-white shadow-sm">
        <header className="flex flex-col gap-4 border-b border-gray-100 px-4 pt-4 pb-0 sm:flex-row sm:items-center sm:justify-between sm:px-6">
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

        <footer className="flex justify-end items-center gap-3 border-t border-gray-200 px-4 py-4 sm:px-6">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </footer>
      </section>
    </div>
  )
}

