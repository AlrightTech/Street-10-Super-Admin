import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import VendorsTable from '../components/vendors/VendorsTable'
import FilterTabs from '../components/vendors/FilterTabs'
import AddVendorModal from '../components/vendors/AddVendorModal'
import Pagination from '../components/ui/Pagination'
import ConfirmModal from '../components/ui/ConfirmModal'
import { vendorsApi } from '../services/vendors.api'
import type { Vendor, VendorStatus } from '../types/vendors'

/**
 * Filter icon component
 */
const FilterIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
)

/**
 * Vendors page component
 */
export default function Vendors() {
  const navigate = useNavigate()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [activeFilter, setActiveFilter] = useState<'all' | VendorStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [vendorToDelete, setVendorToDelete] = useState<number | null>(null)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10

  // Fetch vendors from API
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true)
        const filters: any = {
          page: currentPage,
          limit: itemsPerPage,
        }
        
        if (activeFilter !== 'all') {
          filters.status = activeFilter
        }
        
        const result = await vendorsApi.getAll(filters)
        
        // Safety check: ensure result.data is an array
        if (!result?.data || !Array.isArray(result.data)) {
          console.error('Invalid API response structure:', result)
          setVendors([])
          setTotalPages(1)
          return
        }
        
        // Transform API vendors to frontend format
        const transformedVendors: Vendor[] = result.data.map((vendor: any) => {
          // Convert UUID to numeric ID for frontend
          const numericId = parseInt(vendor.id.replace(/-/g, '').substring(0, 10), 16) % 1000000
          return {
            id: numericId,
            ownerName: vendor.user?.email?.split('@')[0] || vendor.name || 'Vendor',
            businessName: vendor.name || 'Business',
            status: (vendor.status === 'approved' ? 'approved' : 
                    vendor.status === 'rejected' ? 'rejected' : 
                    'pending') as VendorStatus,
            avatar: '',
            // Store full vendor data for reference
            _vendorData: vendor,
          }
        })
        
        setVendors(transformedVendors)
        setTotalPages(result.pagination.totalPages)
      } catch (error) {
        console.error('Error fetching vendors:', error)
        setVendors([])
      } finally {
        setLoading(false)
      }
    }

    fetchVendors()
  }, [activeFilter, currentPage])

  // Calculate counts - fetch all vendors for accurate counts
  const [counts, setCounts] = useState({ all: 0, pending: 0, approved: 0, rejected: 0 })
  
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const allResult = await vendorsApi.getAll({ limit: 1000 })
        const countsData = {
          all: allResult.pagination.total,
          pending: allResult.data.filter((v: any) => v.status === 'pending').length,
          approved: allResult.data.filter((v: any) => v.status === 'approved').length,
          rejected: allResult.data.filter((v: any) => v.status === 'rejected').length,
        }
        setCounts(countsData)
      } catch (error) {
        console.error('Error fetching vendor counts:', error)
      }
    }
    fetchCounts()
  }, [])

  // Filter and search vendors (client-side filtering for search only, status is handled by API)
  const filteredVendors = useMemo(() => {
    let filtered = vendors

    // Apply search filter (status filter is handled by API)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (v) =>
          (v as any).name?.toLowerCase().includes(query) ||
          (v as any).email?.toLowerCase().includes(query) ||
          ((v as any).user?.email?.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [vendors, searchQuery])

  // Use filtered vendors (pagination is handled by API)
  const paginatedVendors = filteredVendors

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeFilter, searchQuery])

  /**
   * Handle edit vendor
   */
  const handleEdit = (vendorId: number) => {
    const vendor = vendors.find((v) => v.id === vendorId)
    if (vendor) {
      navigate(`/vendors/${vendorId}/edit`, { state: { vendor } })
    }
  }

  /**
   * Handle delete vendor
   */
  const handleDelete = (vendorId: number) => {
    setVendorToDelete(vendorId)
    setDeleteModalOpen(true)
  }

  /**
   * Confirm delete vendor
   */
  const confirmDelete = () => {
    if (vendorToDelete !== null) {
      setVendors((prevVendors) => prevVendors.filter((v) => v.id !== vendorToDelete))
      setDeleteModalOpen(false)
      setVendorToDelete(null)
    }
  }

  /**
   * Cancel delete vendor
   */
  const cancelDelete = () => {
    setDeleteModalOpen(false)
    setVendorToDelete(null)
  }

  /**
   * Handle block vendor
   */
  const handleBlock = (vendorId: number) => {
    setVendors((prevVendors) =>
      prevVendors.map((v) =>
        v.id === vendorId ? { ...v, status: 'rejected' as VendorStatus } : v
      )
    )
  }

  /**
   * Handle add vendor
   */
  const handleAddVendor = () => {
    setAddModalOpen(true)
  }

  /**
   * Handle add vendor submit
   */
  const handleAddVendorSubmit = (vendorData: {
    ownerName: string
    businessName: string
    status: VendorStatus
    avatar?: string
  }) => {
    // Generate new ID (max existing ID + 1)
    const newId = Math.max(...vendors.map((v) => v.id), 0) + 1
    
    const newVendor: Vendor = {
      id: newId,
      ownerName: vendorData.ownerName,
      businessName: vendorData.businessName,
      status: vendorData.status,
      avatar: vendorData.avatar,
    }

    setVendors((prevVendors) => [...prevVendors, newVendor])
    setAddModalOpen(false)
  }

  /**
   * Handle filter change
   */
  const handleFilterChange = (filter: 'all' | VendorStatus) => {
    setActiveFilter(filter)
    setCurrentPage(1)
  }

  /**
   * Handle page change
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Vendors</h1>
        <p className="mt-1 text-sm font-semibold">
          <span className="text-gray-600">Dashboard • </span>
          <span className="text-black">Orders</span>
        </p>
      </div>

      {/* Add Vendor Button */}
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={handleAddVendor}
          className="rounded-lg bg-[#F39C12] px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-[#E67E22] transition-colors cursor-pointer whitespace-nowrap"
        >
          Add Vendor
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Loading vendors...</p>
        </div>
      )}

      {/* Table Container with Filter Tabs, Search, and Table */}
      {!loading && (
      <div className="bg-white rounded-lg overflow-hidden">
        {/* Filter Tabs and Search Controls */}
        <div className="border-b border-gray-200">
          <div className="flex flex-col sm:flex-row 
          items-stretch sm:items-center justify-between 
          gap-3 sm:gap-4">
            {/* Filter Tabs */}
            <div className="flex-1 min-w-0">
              <FilterTabs
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                counts={counts}
              />
            </div>

            {/* Search and Filter Controls */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="relative flex-1 sm:flex-none sm:w-48 md:w-64 min-w-0">
                <input
                  type="text"
                  placeholder="Vendors"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 sm:px-4 py-2 pl-8 sm:pl-10 text-xs sm:text-sm text-gray-900 placeholder-gray-500 focus:border-[#F39C12] focus:outline-none focus:ring-1 focus:ring-[#F39C12]"
                />
                <svg
                  className="absolute left-2 sm:left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              
              {/* Filter Icon - Right Side */}
              <button
                type="button"
                className="inline-flex items-center justify-center
                 gap-2 rounded-full px-4 py-2 text-sm font-medium
                  text-gray-600 transition hover:text-gray-900"
                aria-label="Filter"
              >
                <FilterIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Vendors Table */}
        <div className="p-0">
          <div className="overflow-x-auto">
            <VendorsTable
              vendors={paginatedVendors}
              startIndex={(currentPage - 1) * itemsPerPage}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onBlock={handleBlock}
              onRowClick={(vendorId, status) => {
                const vendor = vendors.find((v) => v.id === vendorId)
                if (!vendor) return

                if (status === 'approved') {
                  navigate(`/vendors/${vendorId}/detail`)
                } else if (status === 'pending') {
                  navigate(`/vendor-request-detail/${vendorId}`)
                }
              }}
            />
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200 p-4 flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
      )}

      {/* Add Vendor Modal */}
      <AddVendorModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddVendorSubmit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Vendor"
        message="Are you sure you want to delete this vendor?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  )
}

