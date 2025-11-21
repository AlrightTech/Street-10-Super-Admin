import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MoreVerticalIcon } from '../icons/Icons'
import type { AllUser } from '../../types/allUsers'
import type { KYCStatus } from '../../types/kyc'

/**
 * All Users Table component props
 */
export interface AllUsersTableProps {
  users: AllUser[]
}

/**
 * KYC Type Badge component
 */
function KYCTypeBadge({ type }: { type: 'individual' | 'business' }) {
  const isIndividual = type === 'individual'
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isIndividual
          ? 'bg-green-100 text-green-800'
          : 'bg-yellow-100 text-yellow-800'
      }`}
    >
      {isIndividual ? 'Individual' : 'Business'}
    </span>
  )
}

/**
 * Status Badge component
 */
function StatusBadge({ status }: { status: KYCStatus }) {
  const getStatusStyles = () => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'under-review':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = () => {
    switch (status) {
      case 'approved':
        return 'Approved'
      case 'pending':
        return 'Pending'
      case 'rejected':
        return 'Rejected'
      case 'under-review':
        return 'Under Review'
      default:
        return status
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {getStatusLabel()}
    </span>
  )
}

/**
 * Action Menu component
 */
function ActionMenu({ userId }: { userId: number }) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

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

  const handleView = () => {
    navigate(`/view-kyc/${userId}`)
    setIsOpen(false)
  }

  const handleEdit = () => {
    // Navigate to edit if needed
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
              onClick={handleView}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              role="menuitem"
            >
              View
            </button>
            <button
              type="button"
              onClick={handleEdit}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              role="menuitem"
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Generate avatar initials
 */
const getAvatarInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * All Users Table component
 */
export default function AllUsersTable({ users }: AllUsersTableProps) {
  return (
    <div className=" bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-white">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">User Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">KYC Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Submission Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600 flex-shrink-0">
                        {getAvatarInitials(user.userName)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.userName}</p>
                        <p className="text-xs text-gray-500">{user.userDescription}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <KYCTypeBadge type={user.kycType} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.submissionDate}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-4 py-3">
                    <ActionMenu userId={user.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

