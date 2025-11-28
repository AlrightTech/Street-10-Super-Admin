/**
 * Search result types
 */
export type SearchResultType = 'user' | 'vendor' | 'order' | 'product' | 'category' | 'finance' | 'bidding-product'

/**
 * Base search result interface
 */
export interface SearchResult {
  id: string
  type: SearchResultType
  title: string
  subtitle?: string
  route: string
  icon?: string
  metadata?: Record<string, any>
}

/**
 * Search result with grouping
 */
export interface GroupedSearchResults {
  type: SearchResultType
  label: string
  results: SearchResult[]
  count: number
}

/**
 * Search service interface
 */
export interface SearchService {
  search(query: string, limit?: number): Promise<SearchResult[]>
  searchGrouped(query: string, limitPerGroup?: number): Promise<GroupedSearchResults[]>
}

