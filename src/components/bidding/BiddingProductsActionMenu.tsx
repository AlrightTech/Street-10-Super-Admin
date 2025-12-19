import { useEffect, useRef, useState } from 'react'
import { MoreVerticalIcon, EyeIcon } from '../icons/Icons'

interface BiddingProductsActionMenuProps {
  onView?: () => void
  onDelete?: () => void
  className?: string
  align?: 'left' | 'right'
}

export default function BiddingProductsActionMenu({ onView, onDelete, className = '', align = 'right' }: BiddingProductsActionMenuProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      // Close menu on Escape key
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setOpen(false)
        }
      }
      document.addEventListener('keydown', handleEscape)
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation()
    onView?.()
    setOpen(false)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.()
    setOpen(false)
  }

  return (
    <div className={`relative inline-flex ${className}`} ref={menuRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`rounded-full p-1.5 text-gray-400
           transition-all duration-200
             hover:text-gray-600 cursor-pointer focus:outline-none
     ${
          open ? 'bg-gray-100 text-gray-600' : ''
        }`}
        aria-label="Action menu"
      >
        <MoreVerticalIcon className="h-5 w-5" />
      </button>

      {open && (
        <>
          {/* Backdrop overlay for better UX */}
          <div 
            className="fixed inset-0 z-0" 
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            role="menu"
            className={`absolute z-50 mt-2 w-40 min-w-[160px] rounded-lg border border-gray-200 bg-white py-2 shadow-xl ring-1 ring-black/5 transition-all duration-200 ${
              align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
            }`}
          >
            {onView && (
              <button
                type="button"
                onClick={handleView}
                role="menuitem"
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-150 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:bg-gray-50"
              >
                <EyeIcon className="h-4 w-4 text-gray-500" />
                <span>View</span>
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                role="menuitem"
                className="flex w-full cursor-pointer items-center px-4 py-2.5 text-sm font-medium text-red-600 transition-all duration-150 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:bg-red-50"
              >
                <span>Delete</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

