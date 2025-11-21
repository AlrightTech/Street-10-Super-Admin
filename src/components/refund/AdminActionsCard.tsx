import { useState, useRef } from 'react'
import type { RefundRequest } from '../../types/refundRequest'

interface AdminActionsCardProps {
  refundRequest: RefundRequest
  onMarkAsPaid: () => void
  onReject: () => void
  onSaveNotes: (notes: string) => void
  onFileUpload: (file: File) => void
}

export default function AdminActionsCard({
  refundRequest,
  onMarkAsPaid,
  onReject,
  onSaveNotes,
  onFileUpload,
}: AdminActionsCardProps) {
  const [notes, setNotes] = useState(refundRequest.adminNotes || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileUpload(file)
    }
  }

  const handleSaveNotes = () => {
    onSaveNotes(notes)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      onFileUpload(file)
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm overflow-hidden">
      {/* Header with Icon */}
      <div className="mb-6 flex items-center gap-2">
        <h2 className="text-lg font-bold text-gray-900">Admin Actions</h2>
        <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </div>

      <div className="space-y-6">
        {/* Upload Transaction Slip */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Upload Transaction Slip / Proof of Payment</h3>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center cursor-pointer hover:border-[#F39C12] transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <svg className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
          </div>
        </div>

        {/* Notes / Remarks */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Notes / Remarks (Optional)</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes or remarks about this transaction..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-[#F39C12] focus:outline-none focus:ring-1 focus:ring-[#F39C12] resize-none"
            rows={4}
          />
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              type="button"
              onClick={() => {
                if (notes) {
                  handleSaveNotes()
                }
                onMarkAsPaid()
              }}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#F39C12] px-6 py-3 text-sm font-medium text-white hover:bg-[#E67E22] transition-colors cursor-pointer"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Mark as Paid
            </button>
            <button
              type="button"
              onClick={() => {
                if (notes) {
                  handleSaveNotes()
                }
                onReject()
              }}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-lg bg-pink-50 border border-pink-200 px-6 py-3 text-sm font-medium text-red-600 hover:bg-pink-100 transition-colors cursor-pointer"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject Request
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

