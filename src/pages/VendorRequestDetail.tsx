import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { VendorRequestDetail } from '../types/vendorRequest'
import type { VendorStatus } from '../types/vendors'
import { getVendorRequestDetail, updateVendorRequestStatus } from '../data/mockVendorRequests'

const DocumentIcon = ({ className = 'h-6 w-6 text-[#F39C12]' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 3h8l4 4v14H7V3z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 3v18H5a2 2 0 01-2-2V5a2 2 0 012-2h2zm8 0v4h4" />
  </svg>
)

const DownloadIcon = ({ className = 'h-4 w-4 text-[#6B7280]' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
  </svg>
)

export default function VendorRequestDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [detail, setDetail] = useState<VendorRequestDetail | null>(null)
  const [isApproveModalOpen, setApproveModalOpen] = useState(false)
  const [isCredentialModalOpen, setCredentialModalOpen] = useState(false)
  const [isCredentialSuccessOpen, setCredentialSuccessOpen] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [formValues, setFormValues] = useState({
    email: '',
    commissionRate: '',
    password: '',
    confirmPassword: '',
  })
  const [formErrors, setFormErrors] = useState({
    passwordMismatch: false,
  })

  useEffect(() => {
    if (!id) return
    const numericId = Number(id)
    const data = getVendorRequestDetail(numericId)
    if (!data) {
      navigate('/vendors', { replace: true })
      return
    }
    setDetail({ ...data })
  }, [id, navigate])

  if (!detail) {
    return null
  }

  const handleStatusChange = (status: VendorStatus) => {
    const updated = updateVendorRequestStatus(detail.id, status)
    if (updated) {
      setDetail({ ...updated })
    }

    if (status === 'approved') {
      setApproveModalOpen(true)
    } else {
      setApproveModalOpen(false)
    }
  }

  const handleInputChange = (field: 'email' | 'commissionRate' | 'password' | 'confirmPassword', value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (field === 'password' || field === 'confirmPassword') {
      setFormErrors({
        passwordMismatch:
          field === 'password'
            ? value !== formValues.confirmPassword && formValues.confirmPassword.length > 0
            : formValues.password !== value && value.length > 0,
      })
    }
  }

  const handleSubmitCredentials = () => {
    if (formValues.password !== formValues.confirmPassword) {
      setFormErrors({ passwordMismatch: true })
      return
    }
    setCredentialModalOpen(false)
    setCredentialSuccessOpen(true)
  }

  const openCredentialModal = () => {
    if (detail) {
      setFormValues({
        email: detail.contact.email ?? '',
        commissionRate: '',
        password: '',
        confirmPassword: '',
      })
      setFormErrors({ passwordMismatch: false })
      setPasswordVisible(false)
      setConfirmPasswordVisible(false)
    }
    setCredentialSuccessOpen(false)
    setCredentialModalOpen(true)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4 text-xl font-semibold text-[#1F2937]">Vendor Requested Detail Page</h1>

        <div className="rounded-lg border border-[#E5E7EB] bg-gradient-to-r 
        from-white via-white to-[#F4F6FB] p-3">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <div className="flex flex-col gap-4 px-5 sm:flex-row sm:items-center sm:gap-5">
              {detail.avatar ? (
                <img
                  src={detail.avatar}
                  alt={detail.ownerName}
                  className="h-24 w-24 rounded-full object-cover sm:mx-0"
                />
              ) : (
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#F3F4F6] text-xl font-semibold text-[#9CA3AF] sm:mx-0">
                  {detail.ownerName
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
              )}
              <div className="space-y-3 text-center sm:text-left">
                <div>
                  <h2 className="text-2xl font-semibold text-[#111827]">{detail.ownerName}</h2>
                  <p className="text-sm text-gray-500">{detail.ownerName.split(' ')[0]}</p>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>{detail.contact.email}</p>
                  <p>{detail.contact.phone}</p>
                </div>
              </div>
            </div>

            <div className="mx-auto w-full rounded-lg bg-white p-6 shadow-[0_15px_35px_rgba(15,23,42,0.06)] sm:p-7 lg:w-[92%]">
              <div className="grid gap-5 text-sm text-[#4B5563] sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-[16px] font-semibold text-[#111827]">Business Name</p>
                  <p>{detail.business.businessName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[16px] font-semibold text-[#111827]">Address</p>
                  <p>{detail.business.address}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[16px] font-semibold text-[#111827]">Vendor Type</p>
                  <p>{detail.business.vendorType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[16px] font-semibold text-[#111827]">Contact Person Name</p>
                  <p>{detail.business.contactPerson}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-[#1F2937]">Documents / Attachments</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {detail.documents.map((document) => (
            <div
              key={document.id}
              className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full
                  bg-[#FBFAFA]">
                  <DocumentIcon className="h-5 w-5 text-[#F59E0B]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#515151]">{document.name}</p>
                  <p className="mt-1 text-sm text-[#4B5563]">{document.statusLabel}</p>
                  <div className="mt-4 flex items-center justify-end gap-2 text-xs font-medium text-[#6B7280]">
                    <DownloadIcon className="h-4 w-4 text-[#9CA3AF]" />
                    <span>{document.verifiedDate}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="">
        <div>
          <h2 className="text-base font-semibold text-[#1F2937]">Business Details</h2>
          <div className="mt-4 rounded-lg bg-white px-3 mb-4 p-2 pb-30
           shadow-[0_12px_32px_rgba(15,23,42,0.05)]">
            <p className="text-sm font-medium text-[#333333]">
              {detail.businessDescription}
            </p>
          </div>
        </div>

        <div className="flex justify-end pb-5 gap-4">
          <button
            type="button"
            onClick={() => handleStatusChange('rejected')}
            className="rounded-lg border border-[#D1D5DB] px-12 py-3 text-sm 
           text-[#999999] transition-colors bg-white/80"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => handleStatusChange('approved')}
            className="rounded-lg cursor-pointer bg-[#F39C12] px-8 py-3 text-sm
              text-white transition-colors hover:bg-[#E67E22]"
          >
            Approved
          </button>
        </div>
      </div>

      {isApproveModalOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/70 "
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6">
            <div className="relative w-full max-w-md rounded-lg
             bg-white px-8 py-10 text-center shadow-[0_25px_60px_rgba(15,23,42,0.12)] sm:px-12">
              <button
                type="button"
                onClick={() => setApproveModalOpen(false)}
                className="absolute right-6 top-6 text-[#9CA3AF] transition-colors hover:text-[#111827]"
                aria-label="Close"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#22C55E1A]">
                <svg className="h-10 w-10 text-[#22C55E]" viewBox="0 0 48 48" fill="none" stroke="currentColor">
                  <rect x="8" y="8" width="32" height="32" rx="10" fill="#22C55E" stroke="none" />
                  <path d="M19 24.5l4.5 4.5L29 21" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <p className="mt-6 text-base font-medium text-[#1F2937] leading-relaxed">
                Vendor “{detail.business.businessName}” has been approved successfully.
              </p>

              <button
                type="button"
                onClick={() => {
                  setApproveModalOpen(false)
                  openCredentialModal()
                }}
                className="mt-8 inline-flex cursor-pointer items-center justify-center rounded-xl bg-[#F39C12] px-8 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:shadow-[0_15px_30px_rgba(243,156,18,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F39C12]/70"
              >
                Create Credentials
              </button>
            </div>
          </div>
        </>
      )}

      {isCredentialModalOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/70" aria-hidden="true" />
          <div className="fixed inset-0 z-50 flex items-center  justify-center px-4 py-6 sm:px-6">
            <div className="relative w-full max-w-lg rounded-lg bg-white px-6 py-7 shadow-[0_30px_60px_rgba(17,24,39,0.14)] sm:px-8 lg:px-9">
              <button
                type="button"
                onClick={() => setCredentialModalOpen(false)}
                className="absolute right-8 top-8 text-[#9CA3AF] transition-colors hover:text-[#111827]"
                aria-label="Close"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>

              <h3 className="text-center text-lg font-semibold  text-[#1F2937] sm:text-xl">Create Credentials</h3>

              <div className="mt-2 space-y-2">
                <div className="">
                  <label className="text-sm   text-[#6B7280]">Email</label>
                  <input
                    type="email"
                    value={formValues.email}
                    onChange={(event) => handleInputChange('email', event.target.value)}
                    className="w-full rounded-lg border border-[#E5E7EB] bg-[#F7F7F7] px-4
                     py-2 text-sm text-[#1F2937] mt-1 focus:border-[#F39C12] focus:bg-white 
                     focus:outline-none focus:ring-2 focus:ring-[#F39C12]/30"
                    placeholder="e.g john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[#6B7280]">Commission Rate</label>
                  <input
                    type="text"
                    value={formValues.commissionRate}
                    onChange={(event) => handleInputChange('commissionRate', event.target.value)}
                    className="w-full rounded-lg border mt-1 border-[#E5E7EB] bg-[#F7F7F7] px-4 py-2
                     text-sm text-[#1F2937] focus:border-[#F39C12] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F39C12]/30"
                    placeholder="15%"
                  />
                </div>

                <div className="space-y-2">
                  <div className="">
                    <label className="text-sm  text-[#6B7280]">Password</label>
                    <div className="relative">
                      <input
                        type={passwordVisible ? 'text' : 'password'}
                        value={formValues.password}
                        onChange={(event) => handleInputChange('password', event.target.value)}
                        className="w-full rounded-lg border border-[#E5E7EB] bg-[#F7F7F7] px-4 
                        py-2 pr-28 text-sm text-[#1F2937] mt-1 focus:border-[#F39C12] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F39C12]/30"
                        placeholder="e.g 12ppklka"
                      />
                      <span className="absolute right-12 top-1/2 -translate-y-1/2 text-xs font-medium text-[#9CA3AF]">
                        Auto Generate
                      </span>
                      <button
                        type="button"
                        onClick={() => setPasswordVisible((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] transition-colors hover:text-[#111827]"
                        aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path
                            d={
                              passwordVisible
                                ? 'M3 3l18 18M9.9 9.9a3 3 0 104.2 4.2M9.88 9.88L4.12 15.64M14.12 9.88l5.76 5.76M10.73 5.08A10.444 10.444 0 0112 5c7 0 10 7 10 7a15.925 15.925 0 01-1.675 2.595'
                                : 'M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z M12 15a3 3 0 100-6 3 3 0 000 6z'
                            }
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.7}
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#6B7280]">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={confirmPasswordVisible ? 'text' : 'password'}
                        value={formValues.confirmPassword}
                        onChange={(event) => handleInputChange('confirmPassword', event.target.value)}
                        className={`w-full mt-1 rounded-lg border ${
                          formErrors.passwordMismatch ? 'border-[#F87171]' : 'border-[#E5E7EB]'
                        } bg-[#F7F7F7] px-4 
                        py-2 pr-12 text-sm text-[#1F2937] 
                        focus:border-[#F39C12] focus:bg-white focus:outline-none
                         focus:ring-2 focus:ring-[#F39C12]/30`}
                        placeholder="e.g 12ppklka"
                      />
                      <button
                        type="button"
                        onClick={() => setConfirmPasswordVisible((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] transition-colors hover:text-[#111827]"
                        aria-label={confirmPasswordVisible ? 'Hide password' : 'Show password'}
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path
                            d={
                              confirmPasswordVisible
                                ? 'M3 3l18 18M9.9 9.9a3 3 0 104.2 4.2M9.88 9.88L4.12 15.64M14.12 9.88l5.76 5.76M10.73 5.08A10.444 10.444 0 0112 5c7 0 10 7 10 7a15.925 15.925 0 01-1.675 2.595'
                                : 'M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z M12 15a3 3 0 100-6 3 3 0 000 6z'
                            }
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.7}
                          />
                        </svg>
                      </button>
                    </div>
                    {formErrors.passwordMismatch && (
                      <p className="text-xs font-medium text-[#EF4444]">Passwords do not match.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmitCredentials}
                  className="inline-flex cursor-pointer items-center justify-center
                   rounded-lg bg-[#F39C12] px-3 py-2 text-xs
                     text-white 
                      transition-transform hover:-translate-y-0.5 
                      hover:shadow-[0_15px_30px_rgba(243,156,18,0.35)] 
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F39C12]/60"
                >
                  Create And Send
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {isCredentialSuccessOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/70" aria-hidden="true" />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6">
            <div className="relative w-full max-w-sm rounded-lg bg-white px-8 py-9 text-center shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
              <button
                type="button"
                onClick={() => setCredentialSuccessOpen(false)}
                className="absolute right-5 top-5 text-[#9CA3AF] transition-colors hover:text-[#111827]"
                aria-label="Close"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#22C55E] bg-[#ECFDF3]">
                <svg className="h-8 w-8 text-[#22C55E]" viewBox="0 0 32 32" fill="none">
                  <path d="M26 16C26 10.4772 21.5228 6 16 6C10.4772 6 6 10.4772 6 16C6 21.5228 10.4772 26 16 26C21.5228 26 26 21.5228 26 16Z" fill="currentColor" />
                  <path d="M12.75 16.25L15 18.5L19.5 14" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="mt-4 text-sm font-medium text-[#111827]">
                Credentials created & sent to vendor email
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

