import type { BankDetails } from '../../types/refundRequest'

interface BankDetailsCardProps {
  bankDetails: BankDetails
}

export default function BankDetailsCard({ bankDetails }: BankDetailsCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm overflow-hidden">
      {/* Header with Icon */}
      <div className="mb-6 flex items-center gap-2">
        <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h2 className="text-lg font-bold text-gray-900">Bank Details</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Bank Name</p>
          <p className="text-sm font-bold text-gray-900 break-words">{bankDetails.bankName}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Account Holder Name</p>
          <p className="text-sm font-bold text-gray-900 break-words">{bankDetails.accountHolderName}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Account Number</p>
          <p className="text-sm font-bold text-gray-900 break-words">{bankDetails.accountNumber}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Payment Method</p>
          <span className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            {bankDetails.paymentMethod}
          </span>
        </div>
      </div>
    </div>
  )
}

