import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CategoriesFilterTabs from '../components/categories/CategoriesFilterTabs'
import CategoriesTable from '../components/categories/CategoriesTable'
import SearchBar from '../components/ui/SearchBar'
import FilterDropdown from '../components/users/FilterDropdown'
import { PlusIcon } from '../components/icons/Icons'

export type CategoryStatus = 'active' | 'inactive'

export interface CategoryRecord {
  id: string
  name: string
  icon: string
  parentCategory: string | null
  status: CategoryStatus
}

const CATEGORIES_DATA: CategoryRecord[] = [
  { id: '001', name: 'Electronics', icon: 'laptop', parentCategory: null, status: 'active' },
  { id: '002', name: 'Smartphones', icon: 'smartphone', parentCategory: 'Electronics', status: 'active' },
  { id: '003', name: 'Fashion', icon: 'shirt', parentCategory: null, status: 'inactive' },
  { id: '004', name: "Men's Clothing", icon: 'person', parentCategory: 'Fashion', status: 'active' },
  { id: '005', name: 'Home & Garden', icon: 'home', parentCategory: null, status: 'active' },
  { id: '006', name: 'Computers', icon: 'laptop', parentCategory: 'Electronics', status: 'active' },
  { id: '007', name: 'Accessories', icon: 'shirt', parentCategory: 'Fashion', status: 'active' },
  { id: '008', name: 'Women Clothing', icon: 'person', parentCategory: 'Fashion', status: 'active' },
  { id: '009', name: 'Kitchen', icon: 'home', parentCategory: 'Home & Garden', status: 'active' },
  { id: '010', name: 'Furniture', icon: 'home', parentCategory: 'Home & Garden', status: 'active' },
  { id: '011', name: 'Tablets', icon: 'smartphone', parentCategory: 'Electronics', status: 'active' },
  { id: '012', name: 'Watches', icon: 'shirt', parentCategory: 'Fashion', status: 'inactive' },
  { id: '013', name: 'Shoes', icon: 'shirt', parentCategory: 'Fashion', status: 'active' },
  { id: '014', name: 'Bags', icon: 'shirt', parentCategory: 'Fashion', status: 'active' },
  { id: '015', name: 'Jewelry', icon: 'shirt', parentCategory: 'Fashion', status: 'active' },
  { id: '016', name: 'Appliances', icon: 'home', parentCategory: 'Home & Garden', status: 'active' },
  { id: '017', name: 'Garden Tools', icon: 'home', parentCategory: 'Home & Garden', status: 'active' },
  { id: '018', name: 'Cameras', icon: 'laptop', parentCategory: 'Electronics', status: 'active' },
  { id: '019', name: 'Audio', icon: 'laptop', parentCategory: 'Electronics', status: 'active' },
  { id: '020', name: 'Gaming', icon: 'laptop', parentCategory: 'Electronics', status: 'active' },
  { id: '021', name: 'TV & Video', icon: 'laptop', parentCategory: 'Electronics', status: 'active' },
  { id: '022', name: 'Kids Clothing', icon: 'person', parentCategory: 'Fashion', status: 'active' },
  { id: '023', name: 'Bedding', icon: 'home', parentCategory: 'Home & Garden', status: 'active' },
  { id: '024', name: 'Lighting', icon: 'home', parentCategory: 'Home & Garden', status: 'active' },
]

const TAB_OPTIONS: { key: string; label: string }[] = [
  { key: 'categories', label: 'Categories' },
  { key: 'sub-category', label: 'Sub Category' },
  { key: 'filter', label: 'Filter' },
]

const PAGE_SIZE = 5

export default function Categories() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<string>('categories')
  const [searchValue, setSearchValue] = useState('')
  const [searchCategoriesValue, setSearchCategoriesValue] = useState('')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All Categories')
  const [currentPage, setCurrentPage] = useState(1)
  const [categories, setCategories] = useState<CategoryRecord[]>(CATEGORIES_DATA)

  const filteredCategories = useMemo(() => {
    let result = [...categories]

    // Filter by search (title)
    if (searchValue.trim()) {
      const query = searchValue.toLowerCase()
      result = result.filter((category) => category.name.toLowerCase().includes(query))
    }

    // Filter by category search
    if (searchCategoriesValue.trim()) {
      const query = searchCategoriesValue.toLowerCase()
      result = result.filter((category) => category.name.toLowerCase().includes(query))
    }

    // Filter by category dropdown
    if (selectedCategoryFilter !== 'All Categories') {
      if (selectedCategoryFilter === 'Top Level') {
        result = result.filter((category) => category.parentCategory === null)
      } else {
        result = result.filter((category) => category.parentCategory === selectedCategoryFilter)
      }
    }

    return result
  }, [categories, searchValue, searchCategoriesValue, selectedCategoryFilter])

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / PAGE_SIZE))

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredCategories.slice(start, start + PAGE_SIZE)
  }, [filteredCategories, currentPage])

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    setCurrentPage(1)
  }

  const handleSearchCategoriesChange = (value: string) => {
    setSearchCategoriesValue(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const handleEdit = (category: CategoryRecord) => {
    // eslint-disable-next-line no-console
    console.log('Edit category:', category)
  }

  const handleDelete = (category: CategoryRecord) => {
    // eslint-disable-next-line no-console
    console.log('Delete category:', category)
  }

  const handleToggleStatus = (category: CategoryRecord) => {
    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat.id === category.id
          ? { ...cat, status: cat.status === 'active' ? 'inactive' : 'active' }
          : cat
      )
    )
  }

  // Get unique parent categories for dropdown
  const parentCategories = useMemo(() => {
    const parents = new Set<string>()
    categories.forEach((cat) => {
      if (cat.parentCategory) {
        parents.add(cat.parentCategory)
      }
    })
    return ['All Categories', 'Top Level', ...Array.from(parents).sort()]
  }, [categories])

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Categories</h1>
        <p className="mt-1 text-sm text-gray-600">
          <span>Dashboard</span>
          <span className="mx-1">•</span>
          <span>Categories</span>
        </p>
      </div>

      {/* Tabs Section - Separate White Card */}
      <section className="rounded-xl bg-white shadow-sm">
        <div className="px-4 sm:px-6 py-4">
          <CategoriesFilterTabs tabs={TAB_OPTIONS} activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      </section>

      {/* Main Card Section */}
      <section className="rounded-xl bg-white shadow-sm">
        {/* Content Section */}
        <div className="px-4 sm:px-6 py-6">
          {/* Top Row: Categories heading, Search, and Add Buttons */}
          <div className="mb-4 sm:mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Categories</h2>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3 w-full sm:w-auto">
              <SearchBar
                placeholder="Search by Title"
                value={searchValue}
                onChange={handleSearchChange}
                className="w-full sm:w-auto sm:min-w-[180px] md:min-w-[200px]"
              />
              <button
                type="button"
                onClick={() => navigate('/categories/add-sub-category')}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F7931E] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white transition hover:bg-[#E8851C] focus:outline-none focus:ring-2 focus:ring-[#F7931E] focus:ring-offset-2 whitespace-nowrap w-full sm:w-auto cursor-pointer"
              >
                <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Add New Sub Categories</span>
                <span className="xs:hidden">Add Sub Category</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/categories/add')}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F7931E] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white transition hover:bg-[#E8851C] focus:outline-none focus:ring-2 focus:ring-[#F7931E] focus:ring-offset-2 whitespace-nowrap w-full sm:w-auto cursor-pointer"
              >
                <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                Add Categories
              </button>
            </div>
          </div>

          {/* Middle Row: Search categories, Dropdown, and Total */}
          <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3 w-full sm:w-auto">
              <SearchBar
                placeholder="Search categories"
                value={searchCategoriesValue}
                onChange={handleSearchCategoriesChange}
                className="w-full sm:w-auto sm:min-w-[180px] md:min-w-[200px]"
              />
              <FilterDropdown
                label={selectedCategoryFilter}
                options={parentCategories}
                onSelect={(value) => {
                  setSelectedCategoryFilter(value)
                  setCurrentPage(1)
                }}
                className="w-full sm:w-auto sm:min-w-[140px] md:min-w-[160px]"
              />
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap text-left sm:text-right">
              Total Categories: {filteredCategories.length}
            </p>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            <CategoriesTable
              categories={paginatedCategories}
              startIndex={(currentPage - 1) * PAGE_SIZE}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          </div>
        </div>

        {/* Pagination Section */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 border-t border-gray-100 px-4 sm:px-6 py-4">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-lg border border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              &lt; Back
            </button>
            <div className="flex items-center gap-0.5 sm:gap-1">
              {(() => {
                const pages: (number | string)[] = []

                if (totalPages <= 8) {
                  // Show all pages if 8 or fewer
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(i)
                  }
                } else {
                  // Always show first page
                  pages.push(1)

                  if (currentPage <= 4) {
                    // Show pages 1-5, then ellipsis, then last 2
                    for (let i = 2; i <= 5; i++) {
                      pages.push(i)
                    }
                    pages.push('...')
                    pages.push(totalPages - 1)
                    pages.push(totalPages)
                  } else if (currentPage >= totalPages - 3) {
                    // Show first 2, then ellipsis, then last 5
                    pages.push(2)
                    pages.push('...')
                    for (let i = totalPages - 4; i <= totalPages; i++) {
                      pages.push(i)
                    }
                  } else {
                    // Show first, ellipsis, current-1, current, current+1, ellipsis, last
                    pages.push('...')
                    pages.push(currentPage - 1)
                    pages.push(currentPage)
                    pages.push(currentPage + 1)
                    pages.push('...')
                    pages.push(totalPages)
                  }
                }

                return pages.map((page, idx) => {
                  if (page === '...') {
                    return (
                      <span key={`ellipsis-${idx}`} className="px-1 text-gray-600">
                        ...
                      </span>
                    )
                  }
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handlePageChange(page as number)}
                      className={`h-7 w-7 sm:h-9 sm:w-9 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })
              })()}
            </div>
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              Next &gt;
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
