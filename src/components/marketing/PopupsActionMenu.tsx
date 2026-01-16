import { useState, useRef, useEffect } from 'react'
import { MoreVerticalIcon } from '../icons/Icons'

export type PopupActionType = 'view-popup' | 'edit-popup' | 'delete-popup'

interface PopupsActionMenuProps {
  onSelect: (action: PopupActionType) => void
  align?: 'left' | 'right'
}

export default function PopupsActionMenu({ onSelect, align = 'right' }: PopupsActionMenuProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  const handleAction = (action: PopupActionType) => {
    setOpen(false)
    onSelect(action)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((prev) => !prev)
        }}
        className="rounded-full p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer focus:outline-none transition-colors"
      >
        <MoreVerticalIcon className="h-5 w-5" />
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute z-[100] mt-2 w-48 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-black/5 dark:ring-gray-700 transition-colors ${
            align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
          }`}
        >
          <button
            type="button"
            role="menuitem"
            onClick={(e) => {
              e.stopPropagation()
              handleAction('view-popup')
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            View Details
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={(e) => {
              e.stopPropagation()
              handleAction('edit-popup')
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Edit Popup
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={(e) => {
              e.stopPropagation()
              handleAction('delete-popup')
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Delete Popup
          </button>
        </div>
      )}
    </div>
  )
}
