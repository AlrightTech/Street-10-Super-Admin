import { useEffect, useRef, useState } from 'react'
import { MoreVerticalIcon } from '../icons/Icons'

export type StoryHighlightActionType = 'add-story' | 'edit-story'

interface StoryHighlightActionMenuProps {
  onSelect?: (action: StoryHighlightActionType) => void
  className?: string
  align?: 'left' | 'right'
}

const ACTIONS: { key: StoryHighlightActionType; label: string }[] = [
  { key: 'add-story', label: 'Add story' },
  { key: 'edit-story', label: 'Edit story' },
]

export default function StoryHighlightActionMenu({ onSelect, className = '', align = 'right' }: StoryHighlightActionMenuProps) {
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

  const handleSelect = (action: StoryHighlightActionType) => {
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
        className="rounded-full p-1 text-gray-400 cursor-pointer focus:outline-none"
      >
        <MoreVerticalIcon className="h-5 w-5" />
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute z-50 mt-2 w-40 rounded-xl border border-gray-100 bg-white py-2 shadow-lg ring-1 ring-black/5 ${
            align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
          }`}
        >
          {ACTIONS.map((action) => (
            <button
              key={action.key}
              type="button"
              onClick={() => handleSelect(action.key)}
              role="menuitem"
              className="flex w-full items-center px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

