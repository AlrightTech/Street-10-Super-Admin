import Button from './Button'

/**
 * ConfirmModal component props
 */
export interface ConfirmModalProps {
  isOpen: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Confirmation modal component
 */
export default function ConfirmModal({
  isOpen,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div
          className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-xl my-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title */}
          <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-gray-900">{title}</h3>

          {/* Message */}
          <p className="mb-4 sm:mb-6 text-sm text-gray-600 break-words">{message}</p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <Button variant="secondary" onClick={onCancel} className="w-full sm:w-auto">
              {cancelText}
            </Button>
            <button
              type="button"
              onClick={onConfirm}
              className="w-full sm:w-auto rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 whitespace-nowrap"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

