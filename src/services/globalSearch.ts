import type { SearchResult, SearchResultType, GroupedSearchResults } from '../types/search'
import { usersApi } from './users.api'
import { vendorsApi } from './vendors.api'

// Mock Orders Data
const mockOrders = [
  { id: 'ORD-001', customerName: 'John Doe', orderNumber: 'ORD-001', total: '$1,250.00', status: 'Pending' },
  { id: 'ORD-002', customerName: 'Jane Smith', orderNumber: 'ORD-002', total: '$2,500.00', status: 'Completed' },
  { id: 'ORD-003', customerName: 'Michael Johnson', orderNumber: 'ORD-003', total: '$850.00', status: 'Processing' },
  { id: 'ORD-004', customerName: 'Sarah Williams', orderNumber: 'ORD-004', total: '$3,200.00', status: 'Shipped' },
  { id: 'ORD-005', customerName: 'David Brown', orderNumber: 'ORD-005', total: '$1,800.00', status: 'Delivered' },
]

// Mock Products Data
const mockProducts = [
  { id: '1', name: 'Vintage Rolex Watch', sku: 'PROD-001', category: 'Luxury Goods', price: '$5,000' },
  { id: '2', name: 'Designer Handbag', sku: 'PROD-002', category: 'Fashion', price: '$1,200' },
  { id: '3', name: 'Antique Persian Rug', sku: 'PROD-003', category: 'Home Decor', price: '$3,500' },
  { id: '4', name: 'Rare Coin Collection', sku: 'PROD-004', category: 'Collectibles', price: '$2,800' },
  { id: '5', name: 'Modern Art Painting', sku: 'PROD-005', category: 'Art', price: '$4,500' },
]

// Mock Categories Data
const mockCategories = [
  { id: '1', name: 'Electronics', description: 'Electronic devices and accessories' },
  { id: '2', name: 'Fashion', description: 'Clothing and fashion accessories' },
  { id: '3', name: 'Home & Living', description: 'Home decor and furniture' },
  { id: '4', name: 'Collectibles', description: 'Rare and collectible items' },
  { id: '5', name: 'Luxury Goods', description: 'Premium luxury products' },
]

// Mock Finance Records Data
const mockFinanceRecords = [
  { id: 'FIN-001', description: 'Payment from Order ORD-001', amount: '$1,250.00', type: 'Revenue', date: '2024-01-15' },
  { id: 'FIN-002', description: 'Refund for Order ORD-002', amount: '$500.00', type: 'Refund', date: '2024-01-16' },
  { id: 'FIN-003', description: 'Vendor Payment', amount: '$2,000.00', type: 'Expense', date: '2024-01-17' },
  { id: 'FIN-004', description: 'Commission Payment', amount: '$150.00', type: 'Revenue', date: '2024-01-18' },
  { id: 'FIN-005', description: 'Transaction Fee', amount: '$25.00', type: 'Expense', date: '2024-01-19' },
]

// Mock Bidding Products Data
const mockBiddingProducts = [
  { id: '1', name: 'Vintage Rolex Submariner', category: 'Luxury Goods', startingPrice: '$5,000' },
  { id: '2', name: 'Rare Baseball Card Collection', category: 'Collectibles', startingPrice: '$200' },
  { id: '3', name: 'Original Oil Painting', category: 'Art', startingPrice: '$800' },
  { id: '4', name: 'Antique Persian Rug', category: 'Home Decor', startingPrice: '$1,200' },
  { id: '5', name: 'Vintage Camera Collection', category: 'Collectibles', startingPrice: '$500' },
]

/**
 * Search function for a specific data array
 */
function searchInArray<T>(
  data: T[],
  query: string,
  searchFields: (keyof T)[],
  mapper: (item: T) => SearchResult
): SearchResult[] {
  if (!query.trim()) return []
  
  const lowerQuery = query.toLowerCase()
  
  return data
    .filter((item) => {
      return searchFields.some((field) => {
        const value = item[field]
        return value && String(value).toLowerCase().includes(lowerQuery)
      })
    })
    .map(mapper)
}

/**
 * Global search service
 */
class GlobalSearchService {
  /**
   * Search across all modules
   */
  async search(query: string, limit: number = 10): Promise<SearchResult[]> {
    if (!query.trim()) return []
    
    const results: SearchResult[] = []
    
    try {
      // Search Users
      const userResponse = await usersApi.getAll({
        search: query,
        limit: 10,
        page: 1,
      })
      
      const userResults: SearchResult[] = userResponse.data.map((user) => ({
        id: user.id,
        type: 'user' as SearchResultType,
        title: user.name || user.email.split('@')[0],
        subtitle: user.email,
        route: `/users/${user.id}`,
        metadata: { phone: user.phone },
      }))
      results.push(...userResults)
    } catch (error) {
      console.error('Error searching users:', error)
    }
    
    try {
      // Search Vendors
      const vendorResponse = await vendorsApi.getAll({
        search: query,
        limit: 10,
        page: 1,
      })
      
      const vendorResults: SearchResult[] = vendorResponse.data.map((vendor) => {
        const ownerName = vendor.ownerName || vendor.user?.name || vendor.name
        return {
          id: vendor.id,
          type: 'vendor' as SearchResultType,
          title: ownerName || vendor.name,
          subtitle: vendor.email,
          route: `/vendors/${vendor.id}/detail`,
          metadata: { phone: vendor.phone, businessName: vendor.name },
        }
      })
      results.push(...vendorResults)
    } catch (error) {
      console.error('Error searching vendors:', error)
    }
    
    // Search Orders
    const orderResults = searchInArray(
      mockOrders,
      query,
      ['orderNumber', 'customerName', 'id'],
      (order) => ({
        id: order.id,
        type: 'order' as SearchResultType,
        title: `Order ${order.orderNumber}`,
        subtitle: `${order.customerName} - ${order.total}`,
        route: `/orders/${order.orderNumber}`,
        metadata: { status: order.status, total: order.total },
      })
    )
    results.push(...orderResults)
    
    // Search Products
    const productResults = searchInArray(
      mockProducts,
      query,
      ['name', 'sku', 'category', 'id'],
      (product) => ({
        id: product.id,
        type: 'product' as SearchResultType,
        title: product.name,
        subtitle: `${product.category} - ${product.price}`,
        route: `/ecommerce-products/${product.id}`,
        metadata: { sku: product.sku, price: product.price },
      })
    )
    results.push(...productResults)
    
    // Search Categories
    const categoryResults = searchInArray(
      mockCategories,
      query,
      ['name', 'description', 'id'],
      (category) => ({
        id: category.id,
        type: 'category' as SearchResultType,
        title: category.name,
        subtitle: category.description,
        route: `/categories?search=${encodeURIComponent(query)}`,
      })
    )
    results.push(...categoryResults)
    
    // Search Finance Records
    const financeResults = searchInArray(
      mockFinanceRecords,
      query,
      ['id', 'description', 'type'],
      (finance) => ({
        id: finance.id,
        type: 'finance' as SearchResultType,
        title: finance.description,
        subtitle: `${finance.type} - ${finance.amount}`,
        route: `/finance/all-transactions?search=${encodeURIComponent(query)}`,
        metadata: { amount: finance.amount, type: finance.type, date: finance.date },
      })
    )
    results.push(...financeResults)
    
    // Search Bidding Products
    const biddingProductResults = searchInArray(
      mockBiddingProducts,
      query,
      ['name', 'category', 'id'],
      (product) => ({
        id: product.id,
        type: 'bidding-product' as SearchResultType,
        title: product.name,
        subtitle: `${product.category} - Starting: ${product.startingPrice}`,
        route: `/building-products/${product.id}/scheduled`,
        metadata: { category: product.category, startingPrice: product.startingPrice },
      })
    )
    results.push(...biddingProductResults)
    
    // Limit results
    return results.slice(0, limit)
  }
  
  /**
   * Search with grouped results by type
   */
  async searchGrouped(query: string, limitPerGroup: number = 5): Promise<GroupedSearchResults[]> {
    if (!query.trim()) return []
    
    const allResults = await this.search(query, 100) // Get more results for grouping
    
    // Group by type
    const grouped = new Map<SearchResultType, SearchResult[]>()
    
    allResults.forEach((result) => {
      if (!grouped.has(result.type)) {
        grouped.set(result.type, [])
      }
      grouped.get(result.type)!.push(result)
    })
    
    // Type labels
    const typeLabels: Record<SearchResultType, string> = {
      user: 'Users',
      vendor: 'Vendors',
      order: 'Orders',
      product: 'Products',
      category: 'Categories',
      finance: 'Finance',
      'bidding-product': 'Bidding Products',
    }
    
    // Convert to array format
    const groupedResults: GroupedSearchResults[] = []
    
    grouped.forEach((results, type) => {
      groupedResults.push({
        type,
        label: typeLabels[type],
        results: results.slice(0, limitPerGroup),
        count: results.length,
      })
    })
    
    // Sort by result count (most results first)
    return groupedResults.sort((a, b) => b.count - a.count)
  }
}

// Export singleton instance
export const globalSearchService = new GlobalSearchService()

// Export for testing
export { GlobalSearchService }

