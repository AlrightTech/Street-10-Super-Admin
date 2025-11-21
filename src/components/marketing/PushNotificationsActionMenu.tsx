import { useEffect, useRef, useState } from 'react'
import { MoreVerticalIcon } from '../icons/Icons'

export type PushNotificationActionType = 'notification-detail'

interface PushNotificationsActionMenuProps {
  onSelect?: (action: PushNotificationActionType) => void
  className?: string
  align?: 'left' | 'right'
  status?: 'sent' | 'pending' | 'scheduled' | 'expired'
}

const ACTIONS: { key: PushNotificationActionType; label: string }[] = [
  { key: 'notification-detail', label: 'Notification Detail' },
]

export default function PushNotificationsActionMenu({ onSelect, className = '', align = 'right', status }: PushNotificationsActionMenuProps) {
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

  const handleSelect = (action: PushNotificationActionType) => {
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
        className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4C50A2]"
      >
        <MoreVerticalIcon className="h-5 w-5" />
      </button>

      {open && status !== 'expired' && (
        <div
          role="menu"
          className={`absolute z-10 mt-2 w-48 rounded-xl border border-gray-100 bg-white py-2 shadow-lg ring-1 ring-black/5 ${
            align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
          }`}
        >
          {ACTIONS.map((action) => (
            <button
              key={action.key}
              type="button"
              onClick={() => handleSelect(action.key)}
              role="menuitem"
              className="flex w-full items-center px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

