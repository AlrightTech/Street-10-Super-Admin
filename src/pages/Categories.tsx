import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CategoriesFilterTabs from '../components/categories/CategoriesFilterTabs'
import CategoriesTable from '../components/categories/CategoriesTable'
import SubCategoriesGrid from '../components/categories/SubCategoriesGrid'
import { type SubCategoryCardData } from '../components/categories/SubCategoryCard'
import SearchBar from '../components/ui/SearchBar'
import FilterDropdown from '../components/users/FilterDropdown'
import { PlusIcon } from '../components/icons/Icons'
import { categoriesApi, type Category } from '../services/categories.api'

export type CategoryStatus = 'active' | 'inactive'

export interface CategoryRecord {
  id: string
  name: string
  icon: string
  parentCategory: string | null
  status: CategoryStatus
}

const TAB_OPTIONS: { key: string; label: string }[] = [
  { key: 'categories', label: 'Categories' },
  { key: 'sub-category', label: 'Sub Category' },
  { key: 'filter', label: 'Filter' },
]

const PAGE_SIZE = 5
const SUB_CATEGORY_PAGE_SIZE = 6

export default function Categories() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<string>('categories')
  const [searchValue, setSearchValue] = useState('')
  const [searchCategoriesValue, setSearchCategoriesValue] = useState('')
  const [subCategorySearchValue, setSubCategorySearchValue] = useState('')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All Categories')
  const [currentPage, setCurrentPage] = useState(1)
  const [subCategoryCurrentPage, setSubCategoryCurrentPage] = useState(1)
  const [categories, setCategories] = useState<CategoryRecord[]>([])
  const [totalCategories, setTotalCategories] = useState(0)
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [categoriesError, setCategoriesError] = useState<string | null>(null)
  const [subCategories, setSubCategories] = useState<SubCategoryCardData[]>([])
  const [isLoadingSubCategories, setIsLoadingSubCategories] = useState(false)
  const [subCategoriesError, setSubCategoriesError] = useState<string | null>(null)

  // Load categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true)
        setCategoriesError(null)

        const { data, pagination } = await categoriesApi.getAll({
          page: currentPage,
          limit: PAGE_SIZE,
          search: searchCategoriesValue || searchValue || undefined,
          // Only list top-level categories in the main Categories tab
          parentId: 'null',
        })

        // Map backend categories to CategoryRecord for table
        const records: CategoryRecord[] = data.map((cat: Category) => {
          const langData = (cat.langData || {}) as any
          const iconUrl = langData.en?.iconUrl || null
          // Use iconUrl if available, otherwise fall back to placeholder
          return {
            id: cat.id,
            name: cat.name,
            icon: iconUrl || 'home', // Use actual icon URL if available
            parentCategory: (cat as any).parent?.name || null,
            status: cat.isActive ? 'active' : 'inactive',
          }
        })

        setCategories(records)
        setTotalCategories(pagination.total)
      } catch (error: any) {
        console.error('Failed to load categories:', error)
        setCategoriesError(error.response?.data?.message || 'Failed to load categories')
      } finally {
        setIsLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [currentPage, searchCategoriesValue, searchValue])

  // Load subcategories from backend category tree
  useEffect(() => {
    const loadSubCategories = async () => {
      try {
        setIsLoadingSubCategories(true)
        setSubCategoriesError(null)
        const tree = await categoriesApi.getTree()

        const result: SubCategoryCardData[] = []

        const walk = (cat: Category) => {
          if (cat.children && cat.children.length > 0) {
            const lang = (cat.langData || {}) as any
            const desc = lang.en?.description || ''
            // Use iconUrl (image) if available, otherwise fall back to first letter
            const icon = lang.en?.iconUrl || (cat.name && cat.name.charAt(0).toUpperCase()) || 'C'

            result.push({
              id: cat.id,
              title: cat.name,
              description: desc,
              subCategoryCount: cat.children.length,
              icon,
              status: cat.isActive ? 'active' : 'inactive',
              items: cat.children.map((child) => ({
                id: child.id,
                name: child.name,
              })),
            })

            cat.children.forEach(walk)
          }
        }

        tree.forEach(walk)
        setSubCategories(result)
      } catch (error: any) {
        console.error('Failed to load subcategories:', error)
        setSubCategoriesError(error.response?.data?.message || 'Failed to load subcategories')
      } finally {
        setIsLoadingSubCategories(false)
      }
    }

    void loadSubCategories()
  }, [])

  const totalPages = Math.max(1, Math.ceil(totalCategories / PAGE_SIZE))

  const handleTabChange = (tabKey: string) => {
    if (tabKey === 'filter') {
      navigate('/categories/filters')
      return
    }
    setActiveTab(tabKey)
    setCurrentPage(1)
    setSubCategoryCurrentPage(1)
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
    navigate(`/categories/edit/${category.id}`)
  }

  const handleDelete = async (category: CategoryRecord) => {
    if (!window.confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      return
    }

    try {
      await categoriesApi.delete(category.id)
      // Refetch by keeping same page; effect will run because categories state changes after fetch
      setCategories((prev) => prev.filter((c) => c.id !== category.id))
      setTotalCategories((prev) => Math.max(0, prev - 1))
      if ((totalCategories - 1) <= (currentPage - 1) * PAGE_SIZE && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    } catch (error: any) {
      console.error('Failed to delete category:', error)
      alert(error.response?.data?.message || 'Failed to delete category')
    }
  }

  const handleToggleStatus = async (category: CategoryRecord) => {
    try {
      const updated = await categoriesApi.update(category.id, {
        isActive: category.status !== 'active',
      })
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === category.id
            ? {
                ...cat,
                status: updated.isActive ? 'active' : 'inactive',
              }
            : cat,
        ),
      )
    } catch (error: any) {
      console.error('Failed to update category status:', error)
      alert(error.response?.data?.message || 'Failed to update category status')
    }
  }

  // Filter subcategories
  const filteredSubCategories = useMemo(() => {
    let result = [...subCategories]

    if (subCategorySearchValue.trim()) {
      const query = subCategorySearchValue.toLowerCase()
      result = result.filter(
        (subCat) =>
          subCat.title.toLowerCase().includes(query) ||
          subCat.description.toLowerCase().includes(query)
      )
    }

    return result
  }, [subCategories, subCategorySearchValue])

  const subCategoryTotalPages = Math.max(1, Math.ceil(filteredSubCategories.length / SUB_CATEGORY_PAGE_SIZE))

  const paginatedSubCategories = useMemo(() => {
    const start = (subCategoryCurrentPage - 1) * SUB_CATEGORY_PAGE_SIZE
    return filteredSubCategories.slice(start, start + SUB_CATEGORY_PAGE_SIZE)
  }, [filteredSubCategories, subCategoryCurrentPage])

  const handleSubCategoryPageChange = (page: number) => {
    if (page < 1 || page > subCategoryTotalPages) return
    setSubCategoryCurrentPage(page)
  }

  const handleSubCategoryEdit = (subCategory: SubCategoryCardData) => {
    navigate(`/categories/edit-subcategory/${subCategory.id}`)
  }

  const handleRemoveSubCategoryItem = () => {
    // Item removal is handled inside AddSubCategory via backend updates.
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
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 sm:text-2xl">Categories</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          <span>Dashboard</span>
          <span className="mx-1">•</span>
          <span>Categories</span>
        </p>
      </div>

      {/* Tabs Section - Separate White Card */}
      <section className="rounded-xl bg-white dark:bg-gray-800 shadow-sm transition-colors">
        <div className="px-4 sm:px-6">
          <CategoriesFilterTabs tabs={TAB_OPTIONS} activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      </section>

      {/* Filter Section - Outside Card for Sub Category */}
      {activeTab === 'sub-category' && (
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="w-full sm:w-auto sm:max-w-md">
              <SearchBar
                placeholder="Search by Title"
                value={subCategorySearchValue}
                onChange={setSubCategorySearchValue}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Card Section */}
      <section className="rounded-xl bg-white dark:bg-gray-800 shadow-sm transition-colors">
        {/* Content Section */}
        {activeTab === 'sub-category' ? (
          <>
            {/* Sub Category View */}
            <div className="px-4 sm:px-6 py-4 sm:py-6">
              {/* Sub Categories Grid */}
              <div>
                {subCategoriesError && (
                  <div className="mb-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-3 py-2 text-sm text-red-700 dark:text-red-300">
                    {subCategoriesError}
                  </div>
                )}
                {isLoadingSubCategories ? (
                  <div className="flex min-h-[200px] items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                    Loading subcategories...
                  </div>
                ) : (
                  <SubCategoriesGrid
                    subCategories={paginatedSubCategories}
                    onEdit={handleSubCategoryEdit}
                    onRemoveItem={handleRemoveSubCategoryItem}
                  />
                )}
              </div>
            </div>

            {/* Pagination Section */}
            <div className="flex flex-col sm:flex-row justify-end items-center gap-3 px-4 sm:px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleSubCategoryPageChange(subCategoryCurrentPage - 1)}
                  disabled={subCategoryCurrentPage === 1}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 transition hover:border-gray-900 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  &lt; Back
                </button>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {(() => {
                    const pages: (number | string)[] = []

                    if (subCategoryTotalPages <= 8) {
                      for (let i = 1; i <= subCategoryTotalPages; i++) {
                        pages.push(i)
                      }
                    } else {
                      pages.push(1)

                      if (subCategoryCurrentPage <= 4) {
                        for (let i = 2; i <= 5; i++) {
                          pages.push(i)
                        }
                        pages.push('...')
                        pages.push(subCategoryTotalPages - 1)
                        pages.push(subCategoryTotalPages)
                      } else if (subCategoryCurrentPage >= subCategoryTotalPages - 3) {
                        pages.push(2)
                        pages.push('...')
                        for (let i = subCategoryTotalPages - 4; i <= subCategoryTotalPages; i++) {
                          pages.push(i)
                        }
                      } else {
                        pages.push('...')
                        pages.push(subCategoryCurrentPage - 1)
                        pages.push(subCategoryCurrentPage)
                        pages.push(subCategoryCurrentPage + 1)
                        pages.push('...')
                        pages.push(subCategoryTotalPages)
                      }
                    }

                    return pages.map((page, idx) => {
                      if (page === '...') {
                        return (
                          <span key={`ellipsis-${idx}`} className="px-1 text-gray-600 dark:text-gray-400">
                            ...
                          </span>
                        )
                      }
                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => handleSubCategoryPageChange(page as number)}
                          className={`h-7 w-7 sm:h-9 sm:w-9 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
                            subCategoryCurrentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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
                  onClick={() => handleSubCategoryPageChange(subCategoryCurrentPage + 1)}
                  disabled={subCategoryCurrentPage === subCategoryTotalPages}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 transition hover:border-gray-900 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  Next &gt;
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Categories Table View */}
            <div className=" ">
              {/* Top Row: Categories heading, Search, and Add Buttons */}
              <div className="mb-4 sm:mb-6 px-2  flex flex-col bg-gray-200 dark:bg-gray-700 rounded-t-xl p-2 gap-4 sm:flex-row 
              sm:items-center sm:justify-between transition-colors">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">Categories</h2>
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
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white transition hover:bg-[#E8851C] focus:outline-none focus:ring-2 focus:ring-[#F7931E] focus:ring-offset-2 whitespace-nowrap w-full sm:w-auto cursor-pointer"
                  >
                    <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">Add New Subcategory</span>
                    <span className="xs:hidden">Add Subcategory</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/categories/add')}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7931E] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white transition hover:bg-[#E8851C] focus:outline-none focus:ring-2 focus:ring-[#F7931E] focus:ring-offset-2 whitespace-nowrap w-full sm:w-auto cursor-pointer"
                  >
                    <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    Add Categories
                  </button>
                </div>
              </div>

              {/* Middle Row: Search categories, Dropdown, and Total */}
              <div className=" flex flex-col p-4 gap-3 sm:flex-row sm:items-center sm:justify-between">
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
                <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap text-left sm:text-right">
                  Total Categories: {totalCategories}
                </p>
              </div>

              {/* Table Section */}
              <div className="overflow-x-auto p-3">
                {categoriesError && (
                  <div className="mb-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-3 py-2 text-sm text-red-700 dark:text-red-300">
                    {categoriesError}
                  </div>
                )}
                {isLoadingCategories ? (
                  <div className="flex min-h-[200px] items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                    Loading categories...
                  </div>
                ) : (
                  <CategoriesTable
                    categories={categories}
                    startIndex={(currentPage - 1) * PAGE_SIZE}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                  />
                )}
              </div>
            </div>

            {/* Pagination Section */}
            <div className="flex flex-col sm:flex-row justify-end items-center gap-3
             px-4 sm:px-4 py-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 transition hover:border-gray-900 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
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
                          <span key={`ellipsis-${idx}`} className="px-1 text-gray-600 dark:text-gray-400">
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
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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
                  className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 transition hover:border-gray-900 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  Next &gt;
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
