import { useMemo, useState } from 'react'
import OrdersFilterTabs from '../components/orders/OrdersFilterTabs'
import OrdersTable from '../components/orders/OrdersTable'
import type { OrderActionType } from '../components/orders/OrdersActionMenu'
import SearchBar from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'
import OrderDetailsView from '../components/orders/OrderDetailsView'
import OrderDetailView from '../components/orders/OrderDetailView'

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

const ORDERS_DATA: OrderRecord[] = [
  { id: '#001', customerName: 'Tauseef Ahmed', product: 'Abstract Painting', amount: 343, paymentMethod: 'Credit Card', status: 'completed', orderDate: '12 Aug 2025' },
  { id: '#002', customerName: 'Qasim Munawar', product: 'Abstract Painting', amount: 343, paymentMethod: 'PayPal', status: 'cancelled', orderDate: '12 Aug 2025' },
  { id: '#003', customerName: 'Yasir Hafeez', product: 'Abstract Painting', amount: 343, paymentMethod: 'Bank Transfer', status: 'cancelled', orderDate: '12 Aug 2025' },
  { id: '#004', customerName: 'Junaid Akhtar Butt', product: 'Abstract Painting', amount: 768, paymentMethod: 'Bank Transfer', status: 'pending', orderDate: '19 Aug 2025' },
  { id: '#005', customerName: 'Tariq Iqbal', product: 'Abstract Painting', amount: 768, paymentMethod: 'PayPal', status: 'completed', orderDate: '12 Aug 2025' },
  { id: '#006', customerName: 'Muhammed Saeed', product: 'Abstract Painting', amount: 768, paymentMethod: 'PayPal', status: 'cancelled', orderDate: '12 Aug 2025' },
  { id: '#007', customerName: 'Qasim Munawar', product: 'Abstract Painting', amount: 768, paymentMethod: 'Credit Card', status: 'pending', orderDate: '13 Aug 2025' },
  { id: '#008', customerName: 'Abdul Rehman', product: 'Abstract Painting', amount: 768, paymentMethod: 'Bank Transfer', status: 'completed', orderDate: '12 Aug 2025' },
  { id: '#009', customerName: 'Yasir Hafeez', product: 'Abstract Painting', amount: 768, paymentMethod: 'Credit Card', status: 'cancelled', orderDate: '12 Aug 2025' },
  { id: '#010', customerName: 'Yasir Hafeez', product: 'Abstract Painting', amount: 768, paymentMethod: 'Credit Card', status: 'cancelled', orderDate: '12 Aug 2025' },
  { id: '#011', customerName: 'Yasir Hafeez', product: 'Abstract Painting', amount: 768, paymentMethod: 'Credit Card', status: 'completed', orderDate: '12 Aug 2025' },
  { id: '#012', customerName: 'Yasir Hafeez', product: 'Abstract Painting', amount: 768, paymentMethod: 'PayPal', status: 'completed', orderDate: '12 Aug 2025' },
  { id: '#013', customerName: 'Yasir Hafeez', product: 'Abstract Painting', amount: 768, paymentMethod: 'Bank Transfer', status: 'pending', orderDate: '12 Aug 2025' },
  { id: '#014', customerName: 'Yasir Hafeez', product: 'Abstract Painting', amount: 768, paymentMethod: 'Bank Transfer', status: 'completed', orderDate: '12 Aug 2025' },
  { id: '#015', customerName: 'Yasir Hafeez', product: 'Abstract Painting', amount: 768, paymentMethod: 'Credit Card', status: 'completed', orderDate: '12 Aug 2025' },
  { id: '#016', customerName: 'Yasir Hafeez', product: 'Abstract Painting', amount: 768, paymentMethod: 'PayPal', status: 'cancelled', orderDate: '12 Aug 2025' },
  { id: '#017', customerName: 'Yasir Hafeez', product: 'Abstract Painting', amount: 768, paymentMethod: 'PayPal', status: 'completed', orderDate: '12 Aug 2025' },
  { id: '#018', customerName: 'Yasir Hafeez', product: 'Abstract Painting', amount: 768, paymentMethod: 'Bank Transfer', status: 'pending', orderDate: '12 Aug 2025' },
]

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
  const [activeTab, setActiveTab] = useState<(typeof TAB_OPTIONS)[number]['key']>('all')
  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewingOrder, setViewingOrder] = useState<OrderRecord | null>(null)
  const [viewingOrderDetail, setViewingOrderDetail] = useState<OrderRecord | null>(null)

  const tabOptionsWithCounts = useMemo(
    () =>
      TAB_OPTIONS.map((tab) => ({
        ...tab,
        count:
          tab.key === 'all'
            ? ORDERS_DATA.length
            : ORDERS_DATA.filter((order) => order.status === tab.key).length,
        badgeClassName: STATUS_BADGE_CLASS[tab.key],
      })),
    [],
  )

  const filteredOrders = useMemo(() => {
    let result = [...ORDERS_DATA]

    if (activeTab !== 'all') {
      result = result.filter((order) => order.status === activeTab)
    }

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
  }, [activeTab, searchValue])

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE))

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredOrders.slice(start, start + PAGE_SIZE)
  }, [filteredOrders, currentPage])

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
      setViewingOrderDetail(order)
    } else {
      // Placeholder callback for other actions
      // eslint-disable-next-line no-console
      console.log(`Action "${action}" selected for order ${order.id}`)
    }
  }

  const handleNameClick = (order: OrderRecord) => {
    // eslint-disable-next-line no-console
    console.log(`Open detail view for ${order.customerName} (${order.id})`)
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
          <div className="overflow-x-auto">
            <OrdersTable
              orders={paginatedOrders}
              startIndex={(currentPage - 1) * PAGE_SIZE}
              onActionSelect={handleOrderAction}
              onNameClick={handleNameClick}
            />
          </div>
        </div>

        <footer className="flex justify-end items-center gap-3 border-t border-gray-200 px-4 py-4 sm:px-6">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </footer>
      </section>
    </div>
  )
}

