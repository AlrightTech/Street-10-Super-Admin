import { useState } from 'react'
import { XIcon } from '../icons/Icons'
import type { VendorStatus } from '../../types/vendors'

interface AddVendorModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (vendorData: {
    ownerName: string
    businessName: string
    status: VendorStatus
    avatar?: string
  }) => void
}

export default function AddVendorModal({ isOpen, onClose, onAdd }: AddVendorModalProps) {
  const [formData, setFormData] = useState({
    ownerName: '',
    businessName: '',
    avatar: '',
  })
  const [status, setStatus] = useState<VendorStatus>('pending')
  const [errors, setErrors] = useState<{ ownerName?: string; businessName?: string }>({})

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const newErrors: { ownerName?: string; businessName?: string } = {}
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required'
    }
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Add vendor
    onAdd({
      ownerName: formData.ownerName.trim(),
      businessName: formData.businessName.trim(),
      status,
      avatar: formData.avatar.trim() || undefined,
    })

    // Reset form
    setFormData({
      ownerName: '',
      businessName: '',
      avatar: '',
    })
    setStatus('pending')
    setErrors({})
    onClose()
  }

  const handleClose = () => {
    setFormData({
      ownerName: '',
      businessName: '',
      avatar: '',
    })
    setStatus('pending')
    setErrors({})
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 rounded-t-lg">
          <h2 className="text-lg font-semibold text-gray-900">Add Vendor</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 bg-white rounded-b-lg">
          <div className="space-y-4">
            {/* Owner Name */}
            <div>
              <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">
                Owner Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="ownerName"
                value={formData.ownerName}
                onChange={(e) => {
                  setFormData({ ...formData, ownerName: e.target.value })
                  if (errors.ownerName) setErrors({ ...errors, ownerName: undefined })
                }}
                className={`w-full rounded-lg border ${
                  errors.ownerName ? 'border-red-300' : 'border-gray-300'
                } bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F39C12] focus:outline-none focus:ring-1 focus:ring-[#F39C12]`}
                placeholder="Enter owner name"
              />
              {errors.ownerName && (
                <p className="mt-1 text-xs text-red-600">{errors.ownerName}</p>
              )}
            </div>

            {/* Business Name */}
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="businessName"
                value={formData.businessName}
                onChange={(e) => {
                  setFormData({ ...formData, businessName: e.target.value })
                  if (errors.businessName) setErrors({ ...errors, businessName: undefined })
                }}
                className={`w-full rounded-lg border ${
                  errors.businessName ? 'border-red-300' : 'border-gray-300'
                } bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F39C12] focus:outline-none focus:ring-1 focus:ring-[#F39C12]`}
                placeholder="Enter business name"
              />
              {errors.businessName && (
                <p className="mt-1 text-xs text-red-600">{errors.businessName}</p>
              )}
            </div>

            {/* Avatar URL */}
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
                Avatar URL (Optional)
              </label>
              <input
                type="url"
                id="avatar"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F39C12] focus:outline-none focus:ring-1 focus:ring-[#F39C12]"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as VendorStatus)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-[#F39C12] focus:outline-none focus:ring-1 focus:ring-[#F39C12] cursor-pointer"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#F39C12] px-4 py-2 text-sm font-medium text-white hover:bg-[#E67E22] transition-colors cursor-pointer"
            >
              Add Vendor
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

