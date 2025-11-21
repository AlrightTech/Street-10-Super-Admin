import { type ReactNode } from 'react'

export interface ModalProps {
  isOpen: boolean
  title?: string
  onClose: () => void
  children: ReactNode
}

export default function Modal({ isOpen, title, onClose, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
        <div
          className="w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-xl my-4 sm:my-8 max-h-[90vh] overflow-y-auto"
          onClick={(event) => event.stopPropagation()}
        >
          {title && <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-bold text-gray-900">{title}</h2>}
          {children}
        </div>
      </div>
    </>
  )
}

