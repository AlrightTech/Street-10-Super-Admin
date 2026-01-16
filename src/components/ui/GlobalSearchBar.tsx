import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { globalSearchService } from '../../services/globalSearch'
import type { SearchResult, GroupedSearchResults } from '../../types/search'
import {
  UsersIcon,
  ShoppingBagIcon,
  PackageIcon,
  FolderTreeIcon,
  DollarSignIcon,
  GridIcon,
} from '../icons/Icons'

/**
 * Search icon component
 */
const SearchIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

/**
 * Loading spinner component
 */
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-2">
    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-[#F7931E]" />
  </div>
)

/**
 * Icon mapping for result types
 */
const typeIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  user: UsersIcon,
  vendor: ShoppingBagIcon,
  order: PackageIcon,
  product: PackageIcon,
  category: FolderTreeIcon,
  finance: DollarSignIcon,
  'bidding-product': GridIcon,
}

/**
 * Type label mapping
 */
const typeLabelMap: Record<string, string> = {
  user: 'User',
  vendor: 'Vendor',
  order: 'Order',
  product: 'Product',
  category: 'Category',
  finance: 'Finance',
  'bidding-product': 'Bidding Product',
}

/**
 * GlobalSearchBar component props
 */
export interface GlobalSearchBarProps {
  placeholder?: string
  className?: string
}

/**
 * Global Search Bar component with dropdown suggestions
 */
export default function GlobalSearchBar({
  placeholder = 'Search across Users, Vendors, Orders, Products...',
  className = '',
}: GlobalSearchBarProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GroupedSearchResults[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Debounced search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setIsOpen(false)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setIsOpen(true)

    try {
      const groupedResults = await globalSearchService.searchGrouped(searchQuery, 5)
      setResults(groupedResults)
      setSelectedIndex(-1)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Handle input change with debouncing
  const handleInputChange = (value: string) => {
    setQuery(value)

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Set new timer for debounced search
    debounceTimerRef.current = setTimeout(() => {
      performSearch(value)
    }, 300) // 300ms debounce
  }

  // Handle result selection
  const handleResultClick = (result: SearchResult) => {
    navigate(result.route)
    setQuery('')
    setResults([])
    setIsOpen(false)
    setSelectedIndex(-1)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return

    const allResults: SearchResult[] = []
    results.forEach((group) => {
      allResults.push(...group.results)
    })

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => (prev < allResults.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < allResults.length) {
          handleResultClick(allResults[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Get icon for result type
  const getTypeIcon = (type: string) => {
    const IconComponent = typeIconMap[type] || PackageIcon
    return <IconComponent className="h-4 w-4" />
  }

  // Calculate total results count
  const totalResults = results.reduce((sum, group) => sum + group.count, 0)

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            if (query.trim() && results.length > 0) {
              setIsOpen(true)
            }
          }}
          onKeyDown={handleKeyDown}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 pl-3 sm:pl-4 pr-9 sm:pr-10 text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-400 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E]"
        />
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400">
          <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <LoadingSpinner />
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4">
              <LoadingSpinner />
            </div>
          ) : results.length === 0 && query.trim() ? (
            <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              No results found for &quot;{query}&quot;
            </div>
          ) : results.length > 0 ? (
            <>
              {/* Results Summary */}
              <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-700">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  Found {totalResults} result{totalResults !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Grouped Results */}
              {results.map((group, groupIndex) => (
                <div key={group.type} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                  {/* Group Header */}
                  <div className="sticky top-0 bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(group.type)}
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{group.label}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">({group.count})</span>
                    </div>
                  </div>

                  {/* Group Results */}
                  <div className="py-1">
                    {group.results.map((result, resultIndex) => {
                      const flatIndex = results
                        .slice(0, groupIndex)
                        .reduce((sum, g) => sum + g.results.length, 0) + resultIndex
                      const isSelected = selectedIndex === flatIndex

                      return (
                        <button
                          key={result.id}
                          type="button"
                          onClick={() => handleResultClick(result)}
                          className={`w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                            isSelected ? 'bg-gray-100 dark:bg-gray-700' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex-shrink-0 text-gray-400 dark:text-gray-500">
                              {getTypeIcon(result.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {result.title}
                                </p>
                                <span className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-0.5 rounded">
                                  {typeLabelMap[result.type]}
                                </span>
                              </div>
                              {result.subtitle && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                                  {result.subtitle}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {/* Show more link if there are more results */}
                  {group.count > group.results.length && (
                    <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                      <button
                        type="button"
                        onClick={() => {
                          // Navigate to the module's page with search query
                          const moduleRoutes: Record<string, string> = {
                            user: '/users',
                            vendor: '/vendors',
                            order: '/orders',
                            product: '/products',
                            category: '/categories',
                            finance: '/finance',
                            'bidding-product': '/building-products',
                          }
                          const route = moduleRoutes[group.type] || '/'
                          navigate(`${route}?search=${encodeURIComponent(query)}`)
                          setIsOpen(false)
                        }}
                        className="text-xs text-[#F7931E] hover:text-[#E8840D] font-medium"
                      >
                        View all {group.count} {group.label.toLowerCase()}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}

