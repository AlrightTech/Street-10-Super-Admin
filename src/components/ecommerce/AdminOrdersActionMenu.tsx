import { useEffect, useRef, useState } from 'react'
import { EyeIcon, EditIcon, XIcon } from '../icons/Icons'

interface AdminOrdersActionMenuProps {
  onView?: () => void
  onEdit?: () => void
  onBlock?: () => void
  className?: string
  align?: 'left' | 'right'
}

export default function AdminOrdersActionMenu({ 
  onView, 
  onEdit, 
  onBlock, 
  className = '', 
  align = 'right' 
}: AdminOrdersActionMenuProps) {
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

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.()
    setOpen(false)
  }

  const handleBlock = (e: React.MouseEvent) => {
    e.stopPropagation()
    onBlock?.()
    setOpen(false)
  }

  return (
    <div className={`relative inline-flex ${className}`} ref={menuRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((prev) => !prev)
        }}
        className={`rounded-full p-1.5 text-gray-400
           transition-all duration-200
             hover:text-gray-600 cursor-pointer focus:outline-none
     ${
          open ? 'bg-gray-100 text-gray-600' : ''
        }`}
        aria-label="Action menu"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
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
            {onEdit && (
              <button
                type="button"
                onClick={handleEdit}
                role="menuitem"
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-150 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:bg-gray-50"
              >
                <EditIcon className="h-4 w-4 text-gray-500" />
                <span>Edit</span>
              </button>
            )}
            {onBlock && (
              <button
                type="button"
                onClick={handleBlock}
                role="menuitem"
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 transition-all duration-150 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:bg-red-50"
              >
                <XIcon className="h-4 w-4 text-red-600" />
                <span>Block</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

