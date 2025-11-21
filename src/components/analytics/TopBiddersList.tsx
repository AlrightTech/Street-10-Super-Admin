import { useState, useEffect } from 'react'
import Button from '../ui/Button'
import ActionDropdown from '../users/ActionDropdown'
import Modal from '../ui/Modal'
import ConfirmModal from '../ui/ConfirmModal'
import TextField from '../ui/TextField'
import type { TopBidder } from '../../types/analytics'

/**
 * TopBiddersList component props
 */
export interface TopBiddersListProps {
  bidders: TopBidder[]
}

/**
 * Top bidders list component
 */
export default function TopBiddersList({ bidders: initialBidders }: TopBiddersListProps) {
  const [bidders, setBidders] = useState<TopBidder[]>(initialBidders)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedBidder, setSelectedBidder] = useState<TopBidder | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<TopBidder>>({})

  // Update local state when props change
  useEffect(() => {
    setBidders(initialBidders)
  }, [initialBidders])

  const handleEdit = (bidder: TopBidder) => {
    setSelectedBidder(bidder)
    setEditFormData({
      customerName: bidder.customerName,
      rating: bidder.rating,
      comment: bidder.comment,
      date: bidder.date,
    })
    setEditModalOpen(true)
  }

  const handleDelete = (bidder: TopBidder) => {
    setSelectedBidder(bidder)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedBidder) {
      setBidders(bidders.filter((b) => b.id !== selectedBidder.id))
      setDeleteModalOpen(false)
      setSelectedBidder(null)
    }
  }

  const handleEditSave = () => {
    if (selectedBidder && editFormData) {
      setBidders(
        bidders.map((b) =>
          b.id === selectedBidder.id
            ? {
                ...b,
                customerName: editFormData.customerName || b.customerName,
                rating: editFormData.rating || b.rating,
                comment: editFormData.comment || b.comment,
                date: editFormData.date || b.date,
              }
            : b
        )
      )
      setEditModalOpen(false)
      setSelectedBidder(null)
      setEditFormData({})
    }
  }

  return (
    <div>
      <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-900">Top Customer Feedback</h3>
        <Button variant="primary" className="rounded-lg text-[11px] px-3.5 py-2 cursor-pointer sm:text-xs sm:px-4 sm:py-2 w-full sm:w-auto">
          View All
        </Button>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-2 text-left text-sm font-medium text-gray-600 whitespace-nowrap sm:whitespace-normal">
                  Customer Name
                </th>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-2 text-left text-sm font-medium text-gray-600 whitespace-nowrap sm:whitespace-normal">
                  Rating
                </th>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-2 text-left text-sm font-medium text-gray-600 whitespace-nowrap sm:whitespace-normal">
                  Comment
                </th>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-2 text-left text-sm font-medium text-gray-600 whitespace-nowrap sm:whitespace-normal">
                  Date
                </th>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-2 text-left text-sm font-medium text-gray-600 whitespace-nowrap sm:whitespace-normal">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bidders.map((bidder) => (
                <tr key={bidder.id} className="hover:bg-gray-50">
                  <td className="px-2 sm:px-3 md:px-4 py-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <img
                        src={bidder.avatar}
                        alt={bidder.customerName}
                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover flex-shrink-0"
                      />
                      <span className="text-sm text-gray-900 whitespace-nowrap sm:whitespace-normal sm:break-words">
                        {bidder.customerName}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-2 text-sm text-gray-600 whitespace-nowrap sm:whitespace-normal">
                    {bidder.rating}
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-2 text-sm text-gray-600 whitespace-nowrap sm:whitespace-normal sm:break-words">
                    {bidder.comment}
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-2 text-sm text-gray-600 whitespace-nowrap sm:whitespace-normal">
                    {bidder.date}
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-2">
                    <ActionDropdown
                      onEdit={() => handleEdit(bidder)}
                      onDelete={() => handleDelete(bidder)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedBidder(null)
          setEditFormData({})
        }}
        title="Edit Customer Feedback"
      >
        <div className="space-y-4">
          <TextField
            id="customerName"
            label="Customer Name"
            value={editFormData.customerName || ''}
            onChange={(value) => setEditFormData({ ...editFormData, customerName: value })}
          />
          <TextField
            id="rating"
            label="Rating"
            value={editFormData.rating || ''}
            onChange={(value) => setEditFormData({ ...editFormData, rating: value })}
          />
          <div className="space-y-1">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
              Comment
            </label>
            <textarea
              id="comment"
              value={editFormData.comment || ''}
              onChange={(e) => setEditFormData({ ...editFormData, comment: e.target.value })}
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:border-[#F7941D] focus:outline-none focus:ring-2 focus:ring-[#F7941D]/20"
              rows={3}
            />
          </div>
          <TextField
            id="date"
            label="Date"
            type="date"
            value={editFormData.date || ''}
            onChange={(value) => setEditFormData({ ...editFormData, date: value })}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setEditModalOpen(false)
                setSelectedBidder(null)
                setEditFormData({})
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Customer Feedback"
        message={`Are you sure you want to delete feedback from ${selectedBidder?.customerName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false)
          setSelectedBidder(null)
        }}
      />
    </div>
  )
}

