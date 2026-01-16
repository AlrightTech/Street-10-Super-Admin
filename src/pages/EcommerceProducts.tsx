import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/ui/SearchBar'
import { FilterIcon } from '../components/icons/Icons'
import EcommerceProductsTable, { type EcommerceProduct } from '../components/ecommerce/EcommerceProductsTable'
import AdminOrdersTable, { type AdminOrder, type AdminOrderStatus } from '../components/ecommerce/AdminOrdersTable'
import OrdersFilterTabs from '../components/orders/OrdersFilterTabs'
import { productsApi, type Product } from '../services/products.api'

// Sample data for E-commerce Products (unused, kept for reference)
/*
const ECOMMERCE_PRODUCTS_DATA: EcommerceProduct[] = [
  {
    id: '1',
    name: 'Apple AirPods Pro (2nd Generation)',
    category: 'Electronics',
    price: '$8.750',
    stock: '25 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=100&h=100&fit=crop',
  },
  {
    id: '2',
    name: 'Rare Baseball Card Collection',
    category: 'Clothing',
    price: '$8.750',
    stock: '25 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
  },
  {
    id: '3',
    name: 'Original Oil Painting Landscape',
    category: 'Home & Garden',
    price: '$1.250',
    stock: '25 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100&h=100&fit=crop',
  },
  {
    id: '4',
    name: 'Antique Persian Rug',
    category: 'Electronics',
    price: 'No bids',
    stock: '25 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=100&h=100&fit=crop',
  },
  {
    id: '5',
    name: 'Samsung Galaxy Watch',
    category: 'Electronics',
    price: '$5.500',
    stock: '25 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
  },
  {
    id: '6',
    name: 'Designer Leather Jacket',
    category: 'Clothing',
    price: '$12.000',
    stock: '25 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop',
  },
  {
    id: '7',
    name: 'Vintage Camera Collection',
    category: 'Electronics',
    price: '$3.200',
    stock: '25 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&h=100&fit=crop',
  },
  {
    id: '8',
    name: 'Modern Art Sculpture',
    category: 'Home & Garden',
    price: '$15.000',
    stock: '25 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=100&h=100&fit=crop',
  },
  // Additional products to support 8 pages of pagination
  {
    id: '9',
    name: 'Wireless Bluetooth Headphones',
    category: 'Electronics',
    price: '$2.500',
    stock: '30 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
  },
  {
    id: '10',
    name: 'Designer Sunglasses',
    category: 'Clothing',
    price: '$1.800',
    stock: '20 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop',
  },
  {
    id: '11',
    name: 'Vintage Record Player',
    category: 'Electronics',
    price: '$4.200',
    stock: '15 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&h=100&fit=crop',
  },
  {
    id: '12',
    name: 'Luxury Watch Collection',
    category: 'Electronics',
    price: '$9.500',
    stock: '10 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
  },
  {
    id: '13',
    name: 'Premium Coffee Maker',
    category: 'Home & Garden',
    price: '$3.750',
    stock: '25 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100&h=100&fit=crop',
  },
  {
    id: '14',
    name: 'Classic Leather Boots',
    category: 'Clothing',
    price: '$6.250',
    stock: '18 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop',
  },
  {
    id: '15',
    name: 'Smart Home Hub',
    category: 'Electronics',
    price: '$2.800',
    stock: '22 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=100&h=100&fit=crop',
  },
  {
    id: '16',
    name: 'Artisan Ceramic Vase',
    category: 'Home & Garden',
    price: '$1.100',
    stock: '30 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100&h=100&fit=crop',
  },
  {
    id: '17',
    name: 'Gaming Console',
    category: 'Electronics',
    price: '$7.500',
    stock: '12 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=100&h=100&fit=crop',
  },
  {
    id: '18',
    name: 'Designer Handbag',
    category: 'Clothing',
    price: '$11.500',
    stock: '8 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop',
  },
  {
    id: '19',
    name: 'Vintage Typewriter',
    category: 'Electronics',
    price: '$2.300',
    stock: '5 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&h=100&fit=crop',
  },
  {
    id: '20',
    name: 'Luxury Bedding Set',
    category: 'Home & Garden',
    price: '$4.600',
    stock: '20 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100&h=100&fit=crop',
  },
  {
    id: '21',
    name: 'Professional Camera',
    category: 'Electronics',
    price: '$13.500',
    stock: '15 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&h=100&fit=crop',
  },
  {
    id: '22',
    name: 'Silk Scarf Collection',
    category: 'Clothing',
    price: '$850',
    stock: '35 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop',
  },
  {
    id: '23',
    name: 'Smart TV 65"',
    category: 'Electronics',
    price: '$16.750',
    stock: '10 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=100&h=100&fit=crop',
  },
  {
    id: '24',
    name: 'Garden Furniture Set',
    category: 'Home & Garden',
    price: '$5.800',
    stock: '12 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100&h=100&fit=crop',
  },
  {
    id: '25',
    name: 'Wireless Earbuds',
    category: 'Electronics',
    price: '$1.950',
    stock: '28 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
  },
  {
    id: '26',
    name: 'Designer T-Shirt',
    category: 'Clothing',
    price: '$450',
    stock: '40 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop',
  },
  {
    id: '27',
    name: 'Tablet Computer',
    category: 'Electronics',
    price: '$6.800',
    stock: '18 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
  },
  {
    id: '28',
    name: 'Decorative Mirror',
    category: 'Home & Garden',
    price: '$2.100',
    stock: '22 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100&h=100&fit=crop',
  },
  {
    id: '29',
    name: 'Fitness Tracker',
    category: 'Electronics',
    price: '$1.350',
    stock: '32 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
  },
  {
    id: '30',
    name: 'Cashmere Sweater',
    category: 'Clothing',
    price: '$3.400',
    stock: '16 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop',
  },
  {
    id: '31',
    name: 'Home Security System',
    category: 'Electronics',
    price: '$8.200',
    stock: '14 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=100&h=100&fit=crop',
  },
  {
    id: '32',
    name: 'Indoor Plant Collection',
    category: 'Home & Garden',
    price: '$950',
    stock: '25 units',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100&h=100&fit=crop',
  },
]
*/

// Sample data for Admin Orders
const ADMIN_ORDERS_DATA: AdminOrder[] = [
  {
    id: 'ORD-1342792777880',
    placedOn: '26/06/2020',
    type: 'Subscription',
    items: 1,
    amount: '$200',
    paymentMethod: 'Online',
    status: 'refunded',
  },
  {
    id: 'ORD-1342792777881',
    placedOn: '27/02/2020',
    type: 'Order',
    items: 1,
    amount: '$200',
    paymentMethod: 'COD',
    status: 'cancelled',
  },
  {
    id: 'ORD-1342792777882',
    placedOn: '27/02/2020',
    type: 'Order',
    items: 1,
    amount: '$200',
    paymentMethod: 'Wallet',
    status: 'completed',
  },
  {
    id: 'ORD-1342792777883',
    placedOn: '27/02/2020',
    type: 'Order',
    items: 1,
    amount: '$200',
    paymentMethod: 'Online',
    status: 'pending',
  },
  {
    id: 'ORD-1342792777884',
    placedOn: '28/02/2020',
    type: 'Order',
    items: 1,
    amount: '$200',
    paymentMethod: 'Online',
    status: 'completed',
  },
  {
    id: 'ORD-1342792777885',
    placedOn: '28/02/2020',
    type: 'Subscription',
    items: 1,
    amount: '$200',
    paymentMethod: 'Wallet',
    status: 'completed',
  },
  {
    id: 'ORD-1342792777886',
    placedOn: '01/03/2020',
    type: 'Order',
    items: 1,
    amount: '$200',
    paymentMethod: 'COD',
    status: 'completed',
  },
  {
    id: 'ORD-1342792777887',
    placedOn: '01/03/2020',
    type: 'Order',
    items: 1,
    amount: '$200',
    paymentMethod: 'Online',
    status: 'completed',
  },
  {
    id: 'ORD-1342792777888',
    placedOn: '02/03/2020',
    type: 'Order',
    items: 1,
    amount: '$200',
    paymentMethod: 'Wallet',
    status: 'completed',
  },
  {
    id: 'ORD-1342792777889',
    placedOn: '02/03/2020',
    type: 'Subscription',
    items: 1,
    amount: '$200',
    paymentMethod: 'Online',
    status: 'completed',
  },
  {
    id: 'ORD-1342792777890',
    placedOn: '03/03/2020',
    type: 'Order',
    items: 1,
    amount: '$200',
    paymentMethod: 'COD',
    status: 'completed',
  },
]

const ORDER_TAB_OPTIONS: { key: 'all' | AdminOrderStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'refunded', label: 'Refunded' },
]

const ORDER_STATUS_BADGE_CLASS: Record<'all' | AdminOrderStatus, { active: string; inactive: string }> = {
  all: {
    active: 'bg-[#6B46C1] text-white',
    inactive: 'bg-gray-100 text-gray-600',
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
  refunded: {
    active: 'bg-gray-100 text-gray-600',
    inactive: 'bg-gray-100 text-gray-600',
  },
}

const PRODUCTS_PAGE_SIZE = 4 // 4 products per page to match reference
const ORDERS_PAGE_SIZE = 4

/**
 * E-commerce Products page component
 */
// Map API Product to EcommerceProduct format
const mapProductToEcommerceProduct = (product: Product): EcommerceProduct => {
  const price = parseFloat(product.priceMinor) / 100
  const categoryName = product.categories?.[0]?.category?.name || 'Uncategorized'
  
  return {
    id: product.id,
    name: product.title,
    category: categoryName,
    price: `${price.toLocaleString()} ${product.currency || 'QAR'}`,
    stock: `${product.stock || 0} units`,
    status: product.status === 'active' ? 'active' : 'inactive',
    imageUrl: product.media?.[0]?.url,
  }
}

export default function EcommerceProducts() {
  const navigate = useNavigate()
  // E-commerce Products state
  const [productSearch, setProductSearch] = useState('')
  const [productsPage, setProductsPage] = useState(1)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)

  // Admin Orders state
  const [orderActiveTab, setOrderActiveTab] = useState<(typeof ORDER_TAB_OPTIONS)[number]['key']>('all')
  const [orderSearch, setOrderSearch] = useState('')
  const [ordersPage, setOrdersPage] = useState(1)

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await productsApi.getAll({
          page: productsPage,
          limit: PRODUCTS_PAGE_SIZE,
          superadmin_only: 'true', // Only fetch superadmin products (vendorId = null)
        })

        // Debug logging
        console.log('Products API Response:', response)
        console.log('Products Data:', response.data)
        console.log('Products Count:', response.data?.length || 0)
        console.log('Pagination:', response.pagination)

        // Handle response structure
        const productsData = response.data || []
        setProducts(productsData)
        setTotalPages(response.pagination?.totalPages || 1)

        if (productsData.length === 0) {
          console.warn('No products returned from API')
        }
      } catch (err: any) {
        console.error('Error fetching products:', err)
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        })
        setError(err.response?.data?.message || err.message || 'Failed to fetch products')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [productsPage])

  // Filter products
  const filteredProducts = useMemo(() => {
    // Only include pure e-commerce products (exclude bidding products)
    const ecommerceProducts = products.filter((product) => {
      const productType = product.attributes?.productType
      // Default to 'ecommerce' if not explicitly marked as 'bidding'
      return productType !== 'bidding'
    })

    let result = ecommerceProducts.map(mapProductToEcommerceProduct)

    if (productSearch.trim()) {
      const query = productSearch.toLowerCase()
      result = result.filter((product) => product.name.toLowerCase().includes(query))
    }

    return result
  }, [products, productSearch])

  const productsTotalPages = totalPages
  const paginatedProducts = filteredProducts

  // Filter orders
  const orderTabOptionsWithCounts = useMemo(
    () =>
      ORDER_TAB_OPTIONS.map((tab) => ({
        ...tab,
        count:
          tab.key === 'all'
            ? ADMIN_ORDERS_DATA.length
            : ADMIN_ORDERS_DATA.filter((order) => order.status === tab.key).length,
        badgeClassName: ORDER_STATUS_BADGE_CLASS[tab.key],
      })),
    [],
  )

  const filteredOrders = useMemo(() => {
    let result = [...ADMIN_ORDERS_DATA]

    if (orderActiveTab !== 'all') {
      result = result.filter((order) => order.status === orderActiveTab)
    }

    if (orderSearch.trim()) {
      const query = orderSearch.toLowerCase()
      result = result.filter((order) => order.id.toLowerCase().includes(query))
    }

    return result
  }, [orderActiveTab, orderSearch])

  const ordersTotalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PAGE_SIZE))
  const paginatedOrders = useMemo(() => {
    const start = (ordersPage - 1) * ORDERS_PAGE_SIZE
    return filteredOrders.slice(start, start + ORDERS_PAGE_SIZE)
  }, [filteredOrders, ordersPage])

  const handleOrderTabChange = (tabKey: string) => {
    setOrderActiveTab(tabKey as (typeof ORDER_TAB_OPTIONS)[number]['key'])
    setOrdersPage(1)
  }

  const handleOrderSearchChange = (value: string) => {
    setOrderSearch(value)
    setOrdersPage(1) // Reset to first page when search changes
  }

  const handleProductsPageChange = (page: number) => {
    if (page < 1 || page > productsTotalPages) return
    setProductsPage(page)
  }

  const handleOrdersPageChange = (page: number) => {
    if (page < 1 || page > ordersTotalPages) return
    setOrdersPage(page)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* E-commerce Products Section */}
      <section className="space-y-3 sm:space-y-4">
        {/* Header with Search and Add Button */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">E-commerce Products</h1>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
            <SearchBar
              placeholder="Search by Title"
              value={productSearch}
              onChange={setProductSearch}
              className="w-full sm:min-w-[220px] sm:w-auto"
            />
            <button
              type="button"
              onClick={() => navigate('/ecommerce-products/add')}
              className="inline-flex items-center justify-center 
               rounded-lg bg-[#F7931E] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D] whitespace-nowrap cursor-pointer w-full sm:w-auto"
            >
            
              +Add Product
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-xl bg-white dark:bg-gray-800 shadow-sm transition-colors">
          <div className="py-2 sm:py-4">
            {loading ? (
              <div className="flex min-h-[240px] flex-col items-center justify-center py-12 text-center">
                <p className="text-base font-semibold text-gray-800">Loading products...</p>
              </div>
            ) : error ? (
              <div className="flex min-h-[240px] flex-col items-center justify-center py-12 text-center">
                <p className="text-base font-semibold text-red-600">Error: {error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <EcommerceProductsTable 
                  products={paginatedProducts} 
                  onProductDeleted={() => {
                    // Refresh products list
                    const fetchProducts = async () => {
                      try {
                        setLoading(true)
                        setError(null)
                        const response = await productsApi.getAll({
                          page: productsPage,
                          limit: PRODUCTS_PAGE_SIZE,
                          superadmin_only: 'true', // Only fetch superadmin products (vendorId = null)
                        })
                        const productsData = response.data || []
                        setProducts(productsData)
                        setTotalPages(response.pagination?.totalPages || 1)
                      } catch (err: any) {
                        console.error('Error fetching products:', err)
                        setError(err.response?.data?.message || err.message || 'Failed to fetch products')
                        setProducts([])
                      } finally {
                        setLoading(false)
                      }
                    }
                    fetchProducts()
                  }}
                />
              </div>
            )}
          </div>

          {/* Pagination */}
          <footer className="flex flex-col sm:flex-row justify-end items-center gap-3 border-t border-gray-100 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
              <button
                type="button"
                onClick={() => handleProductsPageChange(productsPage - 1)}
                disabled={productsPage === 1}
                className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Back
              </button>
              <div className="flex items-center gap-1">
                {/* Show first 3 pages */}
                {Array.from({ length: Math.min(3, productsTotalPages) }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handleProductsPageChange(page)}
                    className={`h-8 w-8 sm:h-9 sm:w-9 rounded-lg text-xs sm:text-sm font-medium transition ${
                      productsPage === page
                        ? 'bg-[#6B46C1] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                {/* Show ellipsis if there are more than 3 pages */}
                {productsTotalPages > 3 && (
                  <>
                    <span className="px-1 text-gray-600 text-sm">...</span>
                    {/* Show last 2 pages */}
                    {productsTotalPages > 4 && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleProductsPageChange(productsTotalPages - 1)}
                          className={`h-8 w-8 sm:h-9 sm:w-9 rounded-lg text-xs sm:text-sm font-medium transition ${
                            productsPage === productsTotalPages - 1
                              ? 'bg-[#6B46C1] text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {productsTotalPages - 1}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleProductsPageChange(productsTotalPages)}
                          className={`h-8 w-8 sm:h-9 sm:w-9 rounded-lg text-xs sm:text-sm font-medium transition ${
                            productsPage === productsTotalPages
                              ? 'bg-[#6B46C1] text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {productsTotalPages}
                        </button>
                      </>
                    )}
                    {productsTotalPages === 4 && (
                      <button
                        type="button"
                        onClick={() => handleProductsPageChange(4)}
                        className={`h-8 w-8 sm:h-9 sm:w-9 rounded-lg text-xs sm:text-sm font-medium transition ${
                          productsPage === 4
                            ? 'bg-[#6B46C1] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        4
                      </button>
                    )}
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleProductsPageChange(productsPage + 1)}
                disabled={productsPage === productsTotalPages}
                className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </footer>
        </div>
      </section>

      {/* Admin Orders Section */}
      <section className="space-y-3 sm:space-y-4">
        {/* Header */}
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Admin Orders</h2>

        {/* Orders Table */}
        <div className="rounded-xl bg-white dark:bg-gray-800 shadow-sm transition-colors">
          <header className="flex flex-col gap-3 border-b border-gray-200 dark:border-gray-700 px-4 py-3
            sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:py-0">
            <div className="flex-1 flex items-center min-w-0">
              <OrdersFilterTabs
                tabs={orderTabOptionsWithCounts}
                activeTab={orderActiveTab}
                onTabChange={handleOrderTabChange}
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2 flex-shrink-0">
              <div className="relative w-full sm:w-auto sm:min-w-[160px]">
                <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search Order #"
                  value={orderSearch}
                  onChange={(e) => handleOrderSearchChange(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 py-1.5 pl-7 pr-2 text-xs sm:text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 focus:border-[#FF8C00] focus:ring-1 focus:ring-[#FF8C00] transition-colors"
                />
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 transition hover:bg-gray-50 dark:hover:bg-gray-600 whitespace-nowrap cursor-pointer w-full sm:w-auto"
              >
                <FilterIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Filter
              </button>
            </div>
          </header>

          <div className="py-2 sm:py-4">
            <div className="overflow-x-auto">
              <AdminOrdersTable orders={paginatedOrders} />
            </div>
          </div>

          {/* Pagination */}
          <footer className="flex flex-col 
          sm:flex-row justify-end items-center gap-3 
          border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6 sm:py-4 transition-colors">
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
              <button
                type="button"
                onClick={() => handleOrdersPageChange(ordersPage - 1)}
                disabled={ordersPage === 1}
                className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Back
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(ordersTotalPages, 2) }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handleOrdersPageChange(page)}
                    className={`h-8 w-8 sm:h-9 sm:w-9 rounded-lg text-xs sm:text-sm font-medium transition ${
                      ordersPage === page
                        ? 'bg-[#6B46C1] text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                {ordersTotalPages > 2 && (
                  <span className="px-1 text-gray-600 text-sm">...</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleOrdersPageChange(ordersPage + 1)}
                disabled={ordersPage === ordersTotalPages}
                className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </footer>
        </div>
      </section>
    </div>
  )
}
