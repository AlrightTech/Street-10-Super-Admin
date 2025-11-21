import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getVendorDetailById, updateVendorDetail } from '../data/mockVendorDetails'
import type { VendorDetailData } from '../types/vendorDetails'

type EditableField = 'name' | 'businessName' | 'email' | 'password' | 'phone' | 'commissionRate' | 'address'

interface FormValues {
  name: string
  businessName: string
  email: string
  password: string
  phone: string
  commissionRate: string
  address: string
}

const EditIcon = ({ className = 'h-4 w-4 text-[#7E8495]' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor">
    <path
      d="M13.5 3.5L16.5 6.5M12.3333 4.66667L4.66667 12.3333L4 16L7.66667 15.3333L15.3333 7.66667L12.3333 4.66667Z"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const DeleteIcon = ({ className = 'h-4 w-4 text-[#E25858]' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor">
    <path
      d="M4.5 5.5H16M7 5.5V4.5C7 3.39543 7.89543 2.5 9 2.5H11C12.1046 2.5 13 3.39543 13 4.5V5.5M15.5 5.5V16C15.5 17.1046 14.6046 18 13.5 18H6.5C5.39543 18 4.5 17.1046 4.5 16V5.5H15.5Z"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path d="M8.5 9.5V14.5M11.5 9.5V14.5" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

const DocumentTag = ({
  label,
  onRemove,
}: {
  label: string
  onRemove?: () => void
}) => (
  <span className="inline-flex items-center gap-2 rounded-md bg-[#F5F7FB] px-3 py-2 text-xs font-medium text-[#4A4E60] sm:text-sm">
    <svg className="h-4 w-4 text-[#7A7E92]" viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path
        d="M12 3H7.5C6.11929 3 5 4.11929 5 5.5V14.5C5 15.8807 6.11929 17 7.5 17H12.5C13.8807 17 15 15.8807 15 14.5V8L12 5V3Z"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 3V6H15" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    {label}
    <button
      type="button"
      onClick={onRemove}
      className="flex h-4 w-4 items-center justify-center text-[#E25858] transition-colors hover:text-[#C24141]"
      aria-label={`Remove ${label}`}
    >
      <span className="text-xs leading-none">✕</span>
    </button>
  </span>
)

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-8 w-16 items-center rounded-full border border-transparent px-1 transition-colors cursor-pointer ${
      checked ? 'bg-[#F39C12]' : 'bg-[#E5E7EB]'
    }`}
    aria-pressed={checked}
    aria-label="Activate or deactivate vendor"
  >
    <span
      className={`inline-flex h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
        checked ? 'translate-x-7' : 'translate-x-0'
      }`}
    />
  </button>
)

export default function EditUserDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const locationVendor = (location.state as { vendor?: VendorDetailData })?.vendor
  const [vendor, setVendor] = useState<VendorDetailData | null>(locationVendor ?? null)
  const [formValues, setFormValues] = useState<FormValues | null>(null)
  const [editingField, setEditingField] = useState<EditableField | null>(null)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (!vendor && id) {
      const detail = getVendorDetailById(Number(id))
      if (!detail) {
        navigate('/vendors', { replace: true })
        return
      }
      setVendor(detail)
    }
  }, [id, vendor, navigate])

  useEffect(() => {
    if (vendor) {
      setFormValues({
        name: vendor.ownerName,
        businessName: vendor.businessName,
        email: vendor.email,
        password: '••••••',
        phone: vendor.phone,
        commissionRate: vendor.commissionRate,
        address: vendor.address,
      })
      setIsActive(vendor.status === 'approved')
    }
  }, [vendor])

  const documents = useMemo(() => vendor?.documents ?? [], [vendor])

  if (!formValues || !vendor) {
    return null
  }

  const handleFieldChange = (field: EditableField, value: string) => {
    setFormValues((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const handleStopEditing = () => {
    setEditingField(null)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const status = isActive ? 'approved' : 'rejected'
    const updatedVendor: VendorDetailData = {
      ...vendor,
      status,
      ownerName: formValues.name,
      businessName: formValues.businessName,
      email: formValues.email,
      phone: formValues.phone,
      commissionRate: formValues.commissionRate,
      address: formValues.address,
      financialInfo: {
        ...vendor.financialInfo,
        commissionRate: formValues.commissionRate,
      },
    }

    updateVendorDetail(updatedVendor)
    setVendor(updatedVendor)
    navigate(`/vendors/${vendor.id}/detail`, { replace: true })
  }

  const FieldValue = ({
    field,
    type = 'text',
  }: {
    field: EditableField
    type?: 'text' | 'email' | 'tel' | 'password'
  }) => {
    const value = formValues[field]
    const isEditing = editingField === field

    return (
      <div className="relative">
        {isEditing ? (
          <input
            autoFocus
            type={type}
            value={value}
            onChange={(event) => handleFieldChange(field, event.target.value)}
            onBlur={handleStopEditing}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === 'Escape') {
                event.preventDefault()
                handleStopEditing()
              }
            }}
            className="w-full rounded-lg border border-[#D7DAE5] bg-white px-4 py-3 text-sm text-[#1F2937] outline-none ring-0 focus:border-[#F39C12] focus:ring-1 focus:ring-[#F39C12] sm:text-base"
          />
        ) : (
          <div className="relative w-full rounded-lg bg-[#F5F7FB] px-4 py-3 text-sm text-[#1F2937] sm:text-base">
            <span className="block pr-10">{value}</span>
            <button
              type="button"
              onClick={() => setEditingField(field)}
              className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-sm transition-transform hover:scale-105 cursor-pointer"
              aria-label={`Edit ${field}`}
            >
              <EditIcon />
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-4xl rounded-lg border border-[#E4E7F1] bg-white px-4 py-6 shadow-[0_20px_40px_rgba(17,24,39,0.08)] sm:px-8 sm:py-8 lg:px-12 lg:py-10"
      >
      <div className="mb-8 space-y-3 text-center">
        <h1 className="text-xl font-semibold text-[#111827] sm:text-2xl">Edit User Details</h1>
        <p className="text-sm text-[#6B7280]">Update profile information and access credentials.</p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#6F7284] sm:text-sm">
            Name
          </label>
          <FieldValue field="name" />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#6F7284] sm:text-sm">
            Business Name
          </label>
          <FieldValue field="businessName" />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#6F7284] sm:text-sm">
            Email
          </label>
          <FieldValue field="email" type="email" />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#6F7284] sm:text-sm">
            Password
          </label>
          <FieldValue field="password" type="password" />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#6F7284] sm:text-sm">
            Phone Number
          </label>
          <FieldValue field="phone" type="tel" />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#6F7284] sm:text-sm">
            Commission Rate
          </label>
          <FieldValue field="commissionRate" />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#6F7284] sm:text-sm">
            Address
          </label>
          <FieldValue field="address" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#6F7284] sm:text-sm">
              Documents
            </label>
            <button
              type="button"
              className="inline-flex items-center gap-2 text-xs font-medium text-[#F39C12] transition-colors hover:text-[#E67E22] cursor-pointer sm:text-sm"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                <path
                  d="M10 4.16667V15.8333M4.16667 10H15.8333"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Add Document
            </button>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {documents.map((document) => (
              <DocumentTag
                key={document.id}
                label={document.title}
                onRemove={() => undefined}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-6">
        <div className="flex flex-col items-start gap-3">
          <Toggle checked={isActive} onChange={setIsActive} />
          <span className="text-sm font-semibold text-[#111827]">Activate / Deactivate</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-transparent bg-[#D14343] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#B72E2E] cursor-pointer"
          >
            <DeleteIcon className="h-4 w-4 text-white" />
            Block Vendor
          </button>
          <button
            type="button"
            onClick={() => navigate(`/vendors/${vendor.id}/detail`)}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-[#D1D5DB] bg-white px-5 py-2.5 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F3F4F6] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-[#F39C12] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#E67E22] cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </form>
    </div>
  )
}


