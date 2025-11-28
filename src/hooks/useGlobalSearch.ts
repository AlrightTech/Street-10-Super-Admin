import { useState, useCallback } from 'react'
import { globalSearchService } from '../services/globalSearch'
import type { SearchResult, GroupedSearchResults } from '../types/search'

/**
 * Custom hook for global search functionality
 */
export function useGlobalSearch() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (query: string, limit?: number): Promise<SearchResult[]> => {
    if (!query.trim()) return []
    
    setIsLoading(true)
    setError(null)
    
    try {
      const results = await globalSearchService.search(query, limit)
      return results
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed'
      setError(errorMessage)
      console.error('Search error:', err)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  const searchGrouped = useCallback(async (query: string, limitPerGroup?: number): Promise<GroupedSearchResults[]> => {
    if (!query.trim()) return []
    
    setIsLoading(true)
    setError(null)
    
    try {
      const results = await globalSearchService.searchGrouped(query, limitPerGroup)
      return results
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed'
      setError(errorMessage)
      console.error('Search error:', err)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    search,
    searchGrouped,
    isLoading,
    error,
  }
}

