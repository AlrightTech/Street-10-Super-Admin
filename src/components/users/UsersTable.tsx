import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import ActionMenu from './ActionMenu'
import type { User } from '../../types/users'

/**
 * UsersTable component props
 */
export interface UsersTableProps {
  users: User[]
  onEdit: (userId: number, user: User) => void
  onDelete: (userId: number) => void
  onToggleBlock: (userId: number) => void
}

/**
 * Users table component with all columns and responsive design
 */
export default function UsersTable({
  users,
  onEdit,
  onDelete,
  onToggleBlock,
}: UsersTableProps) {

  // Generate avatar initials or use placeholder
  const getAvatarInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <div className="max-h-[360px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}>
          <table className="w-full min-w-[800px]">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 bg-white">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 bg-white">
                  <div className="flex items-center gap-2">
                    Name
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 bg-white">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 bg-white">Role</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 bg-white">Total Purchase</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 bg-white">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 bg-white">Join Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 bg-white">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-[#f7f7f7] transition-colors"
                >
                  <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-600">{user.id}</td>
                  <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-600">
                    <Link
                      to={`/users/${user.id}`}
                      className="flex items-center gap-2 sm:gap-3 hover:text-[#FF8C00] transition-colors"
                    >
                      <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center  
                      justify-center rounded-full bg-gray-200 text-xs
                       font-medium text-gray-600 flex-shrink-0">
                        {getAvatarInitials(user.name)}
                      </div>
                      <span className="truncate max-w-[100px] sm:max-w-none">{user.name}</span>
                    </Link>
                  </td>
                  <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-600 truncate max-w-[150px] sm:max-w-none">{user.email}</td>
                  <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-600">{user.role}</td>
                  <td className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm text-gray-600 whitespace-nowrap">{user.totalPurchase}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.joinDate}</td>
                  <td className="px-4 py-3">
                    <ActionMenu
                      userId={user.id}
                      currentStatus={user.status}
                      onEdit={() => onEdit(user.id, user)}
                      onDelete={onDelete}
                      onToggleBlock={onToggleBlock}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

