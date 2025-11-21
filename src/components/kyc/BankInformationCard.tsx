import type { BankInfo, KYCType } from '../../types/kyc'

interface BankInformationCardProps {
  bankInfo: BankInfo
  kycType: KYCType
  kycId?: string
}

export default function BankInformationCard({ bankInfo, kycType, kycId }: BankInformationCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm overflow-hidden">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3 sm:gap-0">
        <h2 className="text-lg font-bold text-gray-900">Bank Information</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          {kycId && (
            <span className="text-sm text-gray-600 break-words">KYC ID: {kycId}</span>
          )}
          <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 capitalize">
            {kycType}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">IBAN:</p>
            <p className="text-sm font-bold text-gray-900 break-words">{bankInfo.iban}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Swift Code</p>
            <p className="text-sm font-bold text-gray-900 break-words">{bankInfo.swiftCode}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Name on Card</p>
            <p className="text-sm font-bold text-gray-900 break-words">{bankInfo.nameOnCard}</p>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">BANK NAME</p>
            <p className="text-sm font-bold text-gray-900 break-words">{bankInfo.bankName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Account Number</p>
            <p className="text-sm font-bold text-gray-900 break-words">{bankInfo.accountNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Bank Country</p>
            <p className="text-sm font-bold text-gray-900 break-words">{bankInfo.bankCountry}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

