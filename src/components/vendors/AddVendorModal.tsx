import { useState } from 'react'
import { XIcon } from '../icons/Icons'
import { vendorsApi } from '../../services/vendors.api'
import { usersApi } from '../../services/users.api'

interface AddVendorModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: () => void // Callback to refresh vendors list
}

export default function AddVendorModal({ isOpen, onClose, onAdd }: AddVendorModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    ownerIdUrl: '',
  })
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({})
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const newErrors: { name?: string; email?: string; phone?: string } = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Vendor name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (formData.phone && formData.phone.trim() && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setLoading(true)
      
      // First, find user by email to get userId
      const usersResult = await usersApi.getAll({ page: 1, limit: 1000 })
      const user = usersResult.data?.find((u: any) => u.email.toLowerCase() === formData.email.toLowerCase())
      
      if (!user) {
        setErrors({ email: 'User with this email does not exist. Please create the user first.' })
        setLoading(false)
        return
      }

      // Create vendor
      await vendorsApi.create({
        userId: user.id,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || undefined,
        ownerIdUrl: formData.ownerIdUrl.trim() || undefined,
      })

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        ownerIdUrl: '',
      })
      setErrors({})
      onClose()
      onAdd() // Refresh vendors list
      alert('Vendor created successfully!')
    } catch (error: any) {
      console.error('Error creating vendor:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create vendor'
      if (error?.response?.data?.error?.message) {
        setErrors({ email: error.response.data.error.message })
      } else {
        alert(`Error: ${errorMessage}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      ownerIdUrl: '',
    })
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
            {/* Vendor Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Vendor Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value })
                  if (errors.name) setErrors({ ...errors, name: undefined })
                }}
                className={`w-full rounded-lg border ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                } bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F39C12] focus:outline-none focus:ring-1 focus:ring-[#F39C12]`}
                placeholder="Enter vendor name"
                disabled={loading}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                  if (errors.email) setErrors({ ...errors, email: undefined })
                }}
                className={`w-full rounded-lg border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F39C12] focus:outline-none focus:ring-1 focus:ring-[#F39C12]`}
                placeholder="Enter email (user must exist)"
                disabled={loading}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value })
                  if (errors.phone) setErrors({ ...errors, phone: undefined })
                }}
                className={`w-full rounded-lg border ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                } bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F39C12] focus:outline-none focus:ring-1 focus:ring-[#F39C12]`}
                placeholder="Enter phone number"
                disabled={loading}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Owner ID URL */}
            <div>
              <label htmlFor="ownerIdUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Owner ID URL (Optional)
              </label>
              <input
                type="url"
                id="ownerIdUrl"
                value={formData.ownerIdUrl}
                onChange={(e) => setFormData({ ...formData, ownerIdUrl: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F39C12] focus:outline-none focus:ring-1 focus:ring-[#F39C12]"
                placeholder="https://example.com/owner-id.jpg"
                disabled={loading}
              />
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
              disabled={loading}
              className="rounded-lg bg-[#F39C12] px-4 py-2 text-sm font-medium text-white hover:bg-[#E67E22] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Add Vendor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

