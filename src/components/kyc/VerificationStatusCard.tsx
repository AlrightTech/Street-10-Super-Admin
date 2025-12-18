import { useState } from 'react'
import type { KYCStatus } from '../../types/kyc'

interface VerificationStatusCardProps {
  status: KYCStatus
  adminNotes: string
  onApprove: () => void
  onReject: () => void
  onSaveNote: (notes: string) => void
}

export default function VerificationStatusCard({
  status,
  adminNotes,
  onApprove,
  onReject,
  onSaveNote,
}: VerificationStatusCardProps) {
  const [notes, setNotes] = useState(adminNotes)

  const handleSaveNote = () => {
    onSaveNote(notes)
  }

  const getStatusBadge = () => {
    if (status === 'approved') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-800">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Approved
        </span>
      )
    }
    if (status === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-red-100 text-red-800">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Rejected
        </span>
      )
    }
    if (status === 'under-review') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Under Review
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-orange-100 text-orange-800">
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Pending Review
      </span>
    )
  }

  const isApproved = status === 'approved'
  const isRejected = status === 'rejected'

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Verification Status & Actions */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-6">Verification Status & Actions</h2>
          
          <div className="mb-4">
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
              <span>Current Status:</span>
              {getStatusBadge()}
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={onApprove}
              disabled={isApproved}
              className={`w-full sm:w-[200px] flex items-center justify-center sm:justify-start gap-5 rounded-lg px-10 py-3 text-sm font-medium text-white transition-colors
                ${isApproved ? 'bg-green-300 cursor-not-allowed opacity-60' : 'bg-green-600 hover:bg-green-700 cursor-pointer'}`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Approve
            </button>
            <button
              type="button"
              onClick={onReject}
              disabled={isRejected}
              className={`w-full sm:w-[200px] flex items-center justify-center sm:justify-start gap-5 rounded-lg px-10 py-3 text-sm font-medium text-white transition-colors
                ${isRejected ? 'bg-red-300 cursor-not-allowed opacity-60' : 'bg-red-600 hover:bg-red-700 cursor-pointer'}`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject
            </button>
          </div>
        </div>
        
        {/* Right Column: Admin Comments & Notes */}
        <div className='mt-0 md:mt-12 pb-0 md:pb-8' >
          
          <h2 className="text-sm mb-2 text-gray-900 ">Admin Comments & Notes</h2>
          <div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your comments, feedback, or reason for approval/rejection..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-[#F39C12] focus:outline-none focus:ring-1 focus:ring-[#F39C12] resize-none"
              rows={4}
            />
            <button
              type="button"
              onClick={handleSaveNote}
              className="mt-3 w-full sm:w-auto rounded-lg bg-[#F39C12] px-4 py-2 text-sm font-medium text-white hover:bg-[#E67E22] transition-colors cursor-pointer"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

