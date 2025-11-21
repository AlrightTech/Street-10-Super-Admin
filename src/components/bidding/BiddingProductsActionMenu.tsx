import { useEffect, useRef, useState } from 'react'
import { MoreVerticalIcon } from '../icons/Icons'

interface BiddingProductsActionMenuProps {
  onView?: () => void
  className?: string
  align?: 'left' | 'right'
}

export default function BiddingProductsActionMenu({ onView, className = '', align = 'right' }: BiddingProductsActionMenuProps) {
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
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const handleView = () => {
    onView?.()
    setOpen(false)
  }

  return (
    <div className={`relative inline-flex ${className}`} ref={menuRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1"
        aria-label="Action menu"
      >
        <MoreVerticalIcon className="h-5 w-5" />
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute z-10 mt-2 w-32 rounded-xl border border-gray-100 bg-white py-1 shadow-lg ring-1 ring-black/5 ${
            align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
          }`}
        >
          {onView && (
            <button
              type="button"
              onClick={handleView}
              role="menuitem"
              className="flex w-full items-center px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
            >
              View
            </button>
          )}
        </div>
      )}
    </div>
  )
}

