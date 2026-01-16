import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { MoreVerticalIcon } from '../icons/Icons'

export type ProductActionType = 'edit-product' | 'delete-product'

interface ProductsActionMenuProps {
  onSelect?: (action: ProductActionType) => void
  className?: string
  align?: 'left' | 'right'
}

const ACTIONS: { key: ProductActionType; label: string; destructive?: boolean }[] = [
  { key: 'edit-product', label: 'Edit Product' },
  { key: 'delete-product', label: 'Delete Product', destructive: true },
]

export default function ProductsActionMenu({ onSelect, className = '', align = 'right' }: ProductsActionMenuProps) {
  const [open, setOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, right: 0 })
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current || !buttonRef.current) return
      if (
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      // Calculate position when menu opens
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        setMenuPosition({
          top: rect.bottom + window.scrollY + 8, // 8px = mt-2 equivalent
          right: window.innerWidth - rect.right + window.scrollX,
          left: rect.left + window.scrollX,
        })
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const handleSelect = (action: ProductActionType) => {
    onSelect?.(action)
    setOpen(false)
  }

  const menuContent = open ? (
    <div
      ref={menuRef}
      role="menu"
      className={`fixed z-[100] w-48 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-black/5 dark:ring-gray-700 transition-colors ${
        align === 'right' ? 'origin-top-right' : 'origin-top-left'
      }`}
      style={{
        top: `${menuPosition.top}px`,
        ...(align === 'right' ? { right: `${menuPosition.right}px` } : { left: `${menuPosition.left}px` }),
      }}
    >
      {ACTIONS.map((action) => (
        <button
          key={action.key}
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleSelect(action.key)
          }}
          role="menuitem"
          className={`flex w-full items-center px-4 py-2 text-sm transition cursor-pointer ${
            action.destructive
              ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-300'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          {action.label}
        </button>
      ))}
    </div>
  ) : null

  return (
    <>
      <div className={`relative inline-flex ${className}`}>
        <button
          ref={buttonRef}
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
      </div>
      {open && typeof document !== 'undefined' && createPortal(menuContent, document.body)}
    </>
  )
}
