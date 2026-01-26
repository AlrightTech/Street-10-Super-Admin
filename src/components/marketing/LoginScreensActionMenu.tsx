import { useEffect, useRef, useState } from 'react'
import { MoreVerticalIcon } from '../icons/Icons'

export type LoginScreenActionType = 'edit-login-screen' | 'delete-login-screen'

interface LoginScreensActionMenuProps {
  onSelect?: (action: LoginScreenActionType) => void
  className?: string
  align?: 'left' | 'right'
}

const ACTIONS: { key: LoginScreenActionType; label: string; destructive?: boolean }[] = [
  { key: 'edit-login-screen', label: 'Edit Login Screen' },
  { key: 'delete-login-screen', label: 'Delete Login Screen', destructive: true },
]

export default function LoginScreensActionMenu({ onSelect, className = '', align = 'right' }: LoginScreensActionMenuProps) {
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

  const handleSelect = (action: LoginScreenActionType) => {
    onSelect?.(action)
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
      )}
    </div>
  )
}
