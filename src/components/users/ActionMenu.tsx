import { useState, useRef, useEffect } from 'react'
import { MoreVerticalIcon } from '../icons/Icons'
import type { UserStatus } from '../../types/users'

/**
 * ActionMenu component props
 */
export interface ActionMenuProps {
  userId: number
  currentStatus: UserStatus
  onEdit: () => void
  onDelete: (userId: number) => void
  onToggleBlock: (userId: number) => void
}

/**
 * Action menu component with three-dots dropdown
 */
export default function ActionMenu({
  userId,
  currentStatus,
  onEdit,
  onDelete,
  onToggleBlock,
}: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleEdit = () => {
    onEdit()
    setIsOpen(false)
  }

  const handleDelete = () => {
    onDelete(userId)
    setIsOpen(false)
  }

  const handleToggleBlock = () => {
    onToggleBlock(userId)
    setIsOpen(false)
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        aria-label="Action menu"
        aria-expanded={isOpen}
      >
        <MoreVerticalIcon className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-40 origin-top-right rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="py-1" role="menu">
            <button
              type="button"
              onClick={handleEdit}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              role="menuitem"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 transition-colors"
              role="menuitem"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={handleToggleBlock}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              role="menuitem"
            >
              {currentStatus === 'active' ? 'Block' : currentStatus === 'blocked' ? 'Unblock' : 'Block'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

