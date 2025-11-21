import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { mockVendors } from '../data/mockVendors'
import type { Vendor } from '../types/vendors'

/**
 * Edit Vendor page component
 */
export default function EditVendor() {
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Form state
  const [formData, setFormData] = useState({
    ownerName: '',
    businessName: '',
  })
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending')

  useEffect(() => {
    const loadVendor = async () => {
      setLoading(true)
      // Try to get vendor from location state first
      if (location.state?.vendor) {
        const vendorData = location.state.vendor as Vendor
        setVendor(vendorData)
        setFormData({
          ownerName: vendorData.ownerName,
          businessName: vendorData.businessName,
        })
        setStatus(vendorData.status)
      } else if (id) {
        // Fetch vendor by ID from mock data
        const vendorId = parseInt(id, 10)
        const vendorData = mockVendors.find((v) => v.id === vendorId)
        if (vendorData) {
          setVendor(vendorData)
          setFormData({
            ownerName: vendorData.ownerName,
            businessName: vendorData.businessName,
          })
          setStatus(vendorData.status)
        }
      }
      setLoading(false)
    }

    loadVendor()
  }, [id, location.state])

  const handleSave = () => {
    if (!vendor) return
    
    // Update vendor in mock data (in a real app, this would be an API call)
    const vendorIndex = mockVendors.findIndex((v) => v.id === vendor.id)
    if (vendorIndex !== -1) {
      mockVendors[vendorIndex] = {
        ...mockVendors[vendorIndex],
        ownerName: formData.ownerName,
        businessName: formData.businessName,
        status: status,
      }
    }
    
    navigate('/vendors', { 
      state: { 
        vendor: {
          ...vendor,
          ownerName: formData.ownerName,
          businessName: formData.businessName,
          status: status,
        }
      } 
    })
  }

  const handleCancel = () => {
    navigate('/vendors')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#F7941D] border-r-transparent"></div>
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-sm text-gray-600">Vendor not found</p>
          <button
            onClick={() => navigate('/vendors')}
            className="mt-4 rounded-lg bg-[#F39C12] px-4 py-2 text-sm font-medium text-white hover:bg-[#E67E22] transition-colors cursor-pointer"
          >
            Back to Vendors
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Edit Vendor</h1>
            <p className="text-sm text-gray-600">Dashboard • Vendors</p>
          </div>
          <button
            onClick={() => navigate('/vendors')}
            className="flex items-center gap-2 rounded-lg bg-[#F39C12] px-4 py-2 text-sm font-medium text-white hover:bg-[#E67E22] transition-colors cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Vendors
          </button>
        </div>
      </div>

      {/* Edit Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="space-y-6">
          {/* Owner Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owner Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 text-sm text-gray-900 focus:border-[#F39C12] focus:outline-none focus:ring-1 focus:ring-[#F39C12]"
                placeholder="Enter owner name"
              />
              <svg
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>

          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 text-sm text-gray-900 focus:border-[#F39C12] focus:outline-none focus:ring-1 focus:ring-[#F39C12]"
                placeholder="Enter business name"
              />
              <svg
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'pending' | 'approved' | 'rejected')}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-[#F39C12] focus:outline-none focus:ring-1 focus:ring-[#F39C12]"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={handleCancel}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 rounded-lg bg-[#F39C12] px-4 py-2 text-sm font-medium text-white hover:bg-[#E67E22] transition-colors cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

