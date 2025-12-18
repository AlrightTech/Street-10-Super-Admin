import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import type { Vendor } from '../types/vendors'
import { vendorsApi } from '../services/vendors.api'

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
    email: '',
    phone: '',
  })
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending')
  
  // Store original values for comparison
  const [originalData, setOriginalData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'pending' as 'pending' | 'approved' | 'rejected',
  })
  
  // UI messages
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [statusError, setStatusError] = useState<string>('')

  useEffect(() => {
    const loadVendor = async () => {
      setLoading(true)
      try {
        let vendorData: Vendor | null = null

        // Prefer vendor passed via navigation state (includes _vendorData with full API vendor)
        if (location.state?.vendor) {
          vendorData = location.state.vendor as Vendor
        } else if (id) {
          // Fallback: try to resolve numeric ID to UUID using global mapping from Vendors page
          const numericId = parseInt(id, 10)
          const mapping = (window as any).vendorMapping || {}
          const apiVendor = mapping[numericId]

          if (apiVendor) {
            vendorData = {
              id: numericId,
              ownerName: apiVendor.user?.email?.split('@')[0] || apiVendor.name || 'Vendor',
              businessName: apiVendor.name || 'Business',
              status: (apiVendor.status === 'approved' ? 'approved' :
                       apiVendor.status === 'rejected' ? 'rejected' : 'pending'),
              avatar: '',
              _vendorData: apiVendor,
            }
          }
        }

        if (vendorData) {
          setVendor(vendorData)
          const apiData = (vendorData as any)._vendorData
          const initialName = apiData?.name || vendorData.businessName
          const initialEmail = apiData?.email || apiData?.user?.email || ''
          const initialPhone = apiData?.phone || apiData?.user?.phone || ''
          const initialStatus = vendorData.status
          
          setFormData({
            ownerName: vendorData.ownerName,
            businessName: initialName,
            email: initialEmail,
            phone: initialPhone,
          })
          setStatus(initialStatus)
          
          // Store original values for change detection
          setOriginalData({
            name: initialName,
            email: initialEmail,
            phone: initialPhone,
            status: initialStatus,
          })
        }
      } catch (error) {
        console.error('Error loading vendor:', error)
      }
      setLoading(false)
    }

    loadVendor()
  }, [id, location.state])

  const handleSave = async () => {
    if (!vendor) return

    const apiData = (vendor as any)._vendorData
    const vendorId = apiData?.id as string | undefined

    if (!vendorId) {
      console.error('Vendor UUID not found in _vendorData')
      setStatusError('Unable to determine vendor ID. Please reopen this vendor from the Vendors list.')
      setTimeout(() => setStatusError(''), 5000)
      return
    }

    // Clear previous messages
    setStatusMessage('')
    setStatusError('')

    const updateData: any = {}

    // Compare business name (trim whitespace)
    const trimmedBusinessName = formData.businessName.trim()
    if (trimmedBusinessName && trimmedBusinessName !== originalData.name) {
      updateData.name = trimmedBusinessName
    }

    // Compare email (trim whitespace)
    const trimmedEmail = formData.email.trim()
    if (trimmedEmail && trimmedEmail !== originalData.email) {
      updateData.email = trimmedEmail
    }

    // Compare phone (handle null/empty)
    const trimmedPhone = formData.phone.trim()
    const normalizedPhone = trimmedPhone || null
    const normalizedOriginalPhone = originalData.phone || null
    if (normalizedPhone !== normalizedOriginalPhone) {
      updateData.phone = normalizedPhone
    }

    // Compare status
    if (status !== originalData.status) {
      updateData.status = status
    }

    if (Object.keys(updateData).length === 0) {
      setStatusError('No changes to save')
      setTimeout(() => setStatusError(''), 5000)
      return
    }

    try {
      const updated = await vendorsApi.update(vendorId, updateData)

      // Update local state with latest data
      setVendor({
        ...vendor,
        businessName: updated.name || vendor.businessName,
        status: (updated.status as any) || status,
        _vendorData: updated,
      })

      // Update original data to reflect saved changes
      setOriginalData({
        name: updated.name || originalData.name,
        email: updated.email || originalData.email,
        phone: updated.phone || originalData.phone,
        status: (updated.status as any) || status,
      })

      setStatusMessage('Vendor updated successfully')
      setTimeout(() => {
        setStatusMessage('')
        navigate('/vendors')
      }, 2000)
    } catch (error: any) {
      console.error('Error updating vendor:', error)
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update vendor. Please try again.'
      setStatusError(message)
      setTimeout(() => setStatusError(''), 5000)
    }
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
      {/* Status messages */}
      {statusMessage && (
        <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
          {statusMessage}
        </div>
      )}
      {statusError && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
          {statusError}
        </div>
      )}

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
          {/* Owner Name - Read-only (derived from email) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owner Name <span className="text-gray-400 text-xs">(read-only)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.ownerName}
                readOnly
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 pl-10 text-sm text-gray-500 cursor-not-allowed"
                placeholder="Owner name (derived from email)"
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

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 text-sm text-gray-900 focus:border-[#F39C12] focus:outline-none focus:ring-1 focus:ring-[#F39C12]"
                placeholder="Enter email address"
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 text-sm text-gray-900 focus:border-[#F39C12] focus:outline-none focus:ring-1 focus:ring-[#F39C12]"
                placeholder="Enter phone number"
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
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

