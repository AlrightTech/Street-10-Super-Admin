interface QuickActionsCardProps {
  onPrintInvoice?: () => void
  onSendEmail?: () => void
  onTrackShipment?: () => void
  onCancelOrder?: () => void
}

export default function QuickActionsCard({
  onPrintInvoice,
  onSendEmail,
  onTrackShipment,
  onCancelOrder,
}: QuickActionsCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
      <h3 className="mb-3 sm:mb-4 text-sm sm:text-base font-semibold text-gray-900">Quick Actions</h3>
      <div className="space-y-2 sm:space-y-3">
        <button
          type="button"
          onClick={onPrintInvoice}
          className="flex w-full items-center gap-2 sm:gap-3 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          <span>Print Invoice</span>
        </button>
        <button
          type="button"
          onClick={onSendEmail}
          className="flex w-full items-center gap-2 sm:gap-3 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span>Send Email to Customer</span>
        </button>
        <button
          type="button"
          onClick={onTrackShipment}
          className="flex w-full items-center gap-2 sm:gap-3 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Track Shipment</span>
        </button>
        <button
          type="button"
          onClick={onCancelOrder}
          className="flex w-full items-center gap-2 sm:gap-3 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-red-600 transition-colors hover:bg-red-50 cursor-pointer"
        >
          <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span>Cancel Order</span>
        </button>
      </div>
    </div>
  )
}

