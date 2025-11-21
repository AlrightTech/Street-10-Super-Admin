import { useEffect, useRef, useState } from 'react'
import { MoreVerticalIcon } from '../icons/Icons'

export type FinanceActionType = 'view' | 'edit' | 'block' | 'delete'

interface FinanceActionMenuProps {
  onSelect?: (action: FinanceActionType) => void
  className?: string
  align?: 'left' | 'right'
}

const ACTIONS: { key: FinanceActionType; label: string }[] = [
  { key: 'view', label: 'View' },
  { key: 'edit', label: 'Edit' },
  { key: 'block', label: 'Block' },
  { key: 'delete', label: 'Delete' },
]

export default function FinanceActionMenu({ onSelect, className = '', align = 'right' }: FinanceActionMenuProps) {
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

  const handleSelect = (action: FinanceActionType) => {
    onSelect?.(action)
    setOpen(false)
  }

  return (
    <div className={`relative inline-flex ${className}`} ref={menuRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4C50A2]"
      >
        <MoreVerticalIcon className="h-5 w-5" />
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute z-10 mt-2 w-40 rounded-xl border border-gray-100 bg-white py-2 shadow-lg ring-1 ring-black/5 ${
            align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
          }`}
        >
          {ACTIONS.map((action) => (
            <button
              key={action.key}
              type="button"
              onClick={() => handleSelect(action.key)}
              role="menuitem"
              className={`flex w-full items-center px-4 py-2 text-sm transition hover:bg-gray-50 ${
                action.key === 'delete' ? 'text-[#B71D18] hover:text-[#B71D18]' : 'text-gray-600 hover:text-gray-900'
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

