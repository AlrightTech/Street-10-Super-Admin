import type { KYCData } from '../../types/kyc'

interface KYCInformationCardProps {
  kycData: KYCData
}

export default function KYCInformationCard({ kycData }: KYCInformationCardProps) {
  const getDocumentHeaderIcon = (iconColor?: string) => {
    if (iconColor === 'blue') {
      return (
        <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      )
    }
    if (iconColor === 'green') {
      return (
        <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
    if (iconColor === 'purple') {
      return (
        <svg className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
    return null
  }

  const getDocumentPlaceholderIcon = (type: string) => {
    if (type === 'selfie-verification') {
      return (
        <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
    if (type === 'document') {
      return (
        <svg className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    }
    return null
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm overflow-hidden">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3 sm:gap-0">
        <h2 className="text-lg font-bold text-gray-900">KYC Information</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          {kycData.kycId && (
            <span className="text-sm text-gray-600 break-words">{kycData.kycId}</span>
          )}
          <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 capitalize">
            {kycData.kycType}
          </span>
        </div>
      </div>
      
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">Submission Date</p>
          <p className="text-sm font-medium text-gray-900 break-words">{kycData.submissionDate} at {kycData.submissionTime}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Reference Number</p>
          <p className="text-sm font-medium text-gray-900 break-words">{kycData.referenceNumber}</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Submitted Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {kycData.documents.map((doc) => (
            <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
              {/* Card Header with Title and Icon */}
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900">{doc.title}</h4>
                {getDocumentHeaderIcon(doc.iconColor)}
              </div>
              
              {/* Document Image or Placeholder */}
              {doc.type === 'kyc-document' ? (
                <img
                  src={doc.fileUrl}
                  alt={doc.name}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              ) : (
                <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                  {getDocumentPlaceholderIcon(doc.type)}
                </div>
              )}
              
              {/* Document Info */}
              <p className="text-sm text-gray-900 mb-1 break-words">{doc.name}</p>
              <p className="text-xs text-gray-500 break-words">Uploaded: {doc.uploadedDate}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

