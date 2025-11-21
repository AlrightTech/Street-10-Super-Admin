import { useEffect, useMemo, useState } from 'react'
import Button from '../ui/Button'
import FilterButton from '../ui/FilterButton'
import ActionDropdown from '../users/ActionDropdown'
import ConfirmModal from '../ui/ConfirmModal'
import Modal from '../ui/Modal'
import type { MarketingCampaign } from '../../types/dashboard'
import {
  deleteMarketingCampaign,
  getMarketingCampaigns,
  updateMarketingCampaign,
} from '../../data/marketingCampaigns'

/**
 * MarketingPerformanceTable component props
 */
export interface MarketingPerformanceTableProps {
  campaigns: MarketingCampaign[]
}

/**
 * Marketing performance table component
 */
export default function MarketingPerformanceTable({ campaigns }: MarketingPerformanceTableProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [campaignData, setCampaignData] = useState<MarketingCampaign[]>(() => {
    const storedCampaigns = getMarketingCampaigns()
    if (storedCampaigns.length > 0) {
      return storedCampaigns
    }
    return campaigns.map((campaign) => ({ ...campaign }))
  })
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [campaignToEdit, setCampaignToEdit] = useState<MarketingCampaign | null>(null)
  const [editForm, setEditForm] = useState({
    campaign: '',
    engagement: '',
    conversion: '',
  })

  useEffect(() => {
    const storedCampaigns = getMarketingCampaigns()
    if (storedCampaigns.length > 0) {
      setCampaignData(storedCampaigns)
    } else {
      setCampaignData(campaigns.map((campaign) => ({ ...campaign })))
    }
  }, [campaigns])

  const refreshCampaigns = () => {
    setCampaignData(getMarketingCampaigns())
  }

  const filteredCampaigns = useMemo(() => {
    if (activeFilter === 'all') {
      return campaignData
    }

    if (activeFilter === 'active') {
      return campaignData.filter((campaign) => campaign.status === 'active')
    }

    return campaignData.filter((campaign) => campaign.status !== 'active')
  }, [campaignData, activeFilter])

  const allCount = campaignData.length
  const activeCount = campaignData.filter((c) => c.status === 'active').length
  const inactiveCount = campaignData.filter((c) => c.status !== 'active').length

  const handleDelete = (id: string) => {
    setCampaignToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleBlock = (id: string) => {
    updateMarketingCampaign(id, { status: 'blocked' })
    refreshCampaigns()
  }

  const handleEdit = (id: string) => {
    const current = campaignData.find((campaign) => campaign.id === id)
    if (!current) return

    setCampaignToEdit(current)
    setEditForm({
      campaign: current.campaign,
      engagement: current.engagement,
      conversion: current.conversion,
    })
    setEditModalOpen(true)
  }

  return (
    <div>
      <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row 
      items-start sm:items-center justify-between gap-3 sm:gap-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-900">Marketing Performance</h3>
        <Button  className="text-xs  sm:text-sm cursor-pointer w-full sm:w-auto">
          View
        </Button>
      </div>

      <div className=" bg-white rounded-lg
        shadow-sm">
        {/* Filter Buttons */}
        <div className="mb-3  flex px-4 border-b  border-gray-300
         flex-wrap gap-3 sm:gap-4 md:gap-6">
        <FilterButton
          label="All"
          count={allCount}
          active={activeFilter === 'all'}
          onClick={() => setActiveFilter('all')}
          variant="all"
        />
        <FilterButton
          label="Active"
          count={activeCount}
          active={activeFilter === 'active'}
          onClick={() => setActiveFilter('active')}
          variant="active"
        />
        <FilterButton
          label="Inactive"
          count={inactiveCount}
          active={activeFilter === 'inactive'}
          onClick={() => setActiveFilter('inactive')}
          variant="inactive"
        />
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <div className="max-h-[360px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}>
          <table className="w-full min-w-[800px]">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="border-b border-gray-200">
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-2 text-left text-sm font-medium text-gray-700 whitespace-nowrap sm:whitespace-normal bg-white">Campaign</th>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-2 text-left text-sm font-medium text-gray-700 whitespace-nowrap sm:whitespace-normal bg-white">Engagement</th>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-2 text-left text-sm font-medium text-gray-700 whitespace-nowrap sm:whitespace-normal bg-white">Conversion</th>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-2 text-left text-sm font-medium text-gray-700 whitespace-nowrap sm:whitespace-normal bg-white">Status</th>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-2 text-left text-sm font-medium text-gray-700 whitespace-nowrap sm:whitespace-normal bg-white">Action</th>
              </tr>
            </thead>
            <tbody className="border-b border-gray-300">
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50 border-b border-gray-200">
                  <td className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 sm:text-sm text-gray-900 whitespace-nowrap sm:whitespace-normal sm:break-words">{campaign.campaign}</td>
                  <td className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 sm:text-sm text-gray-600 whitespace-nowrap sm:whitespace-normal sm:break-words">{campaign.engagement}</td>
                  <td className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 sm:text-sm text-gray-600 whitespace-nowrap sm:whitespace-normal sm:break-words">{campaign.conversion}</td>
                  <td className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap sm:whitespace-normal">
                    <span
                      className={`inline-flex rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium ${
                        campaign.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {campaign.status === 'active' ? 'Active' : campaign.status === 'blocked' ? 'Blocked' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 whitespace-nowrap sm:whitespace-normal">
                    <ActionDropdown
                      onEdit={() => handleEdit(campaign.id)}
                      onDelete={() => handleDelete(campaign.id)}
                      onBlock={() => handleBlock(campaign.id)}
                    
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Campaign"
        message="Are you sure you want to delete this campaign?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          if (campaignToDelete) {
            deleteMarketingCampaign(campaignToDelete)
            refreshCampaigns()
          }
          setDeleteModalOpen(false)
          setCampaignToDelete(null)
        }}
        onCancel={() => {
          setDeleteModalOpen(false)
          setCampaignToDelete(null)
        }}
      />
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Campaign">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Campaign Name</label>
            <input
              type="text"
              value={editForm.campaign}
              onChange={(e) => setEditForm((prev) => ({ ...prev, campaign: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#F39C12] focus:outline-none focus:ring-1 focus:ring-[#F39C12]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Engagement</label>
            <input
              type="text"
              value={editForm.engagement}
              onChange={(e) => setEditForm((prev) => ({ ...prev, engagement: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#F39C12] focus:outline-none focus:ring-1 focus:ring-[#F39C12]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Conversion</label>
            <input
              type="text"
              value={editForm.conversion}
              onChange={(e) => setEditForm((prev) => ({ ...prev, conversion: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#F39C12] focus:outline-none focus:ring-1 focus:ring-[#F39C12]"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setEditModalOpen(false)
                setCampaignToEdit(null)
              }}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (!campaignToEdit) return

                updateMarketingCampaign(campaignToEdit.id, {
                  campaign: editForm.campaign.trim() || campaignToEdit.campaign,
                  engagement: editForm.engagement.trim() || campaignToEdit.engagement,
                  conversion: editForm.conversion.trim() || campaignToEdit.conversion,
                })
                refreshCampaigns()
                setEditModalOpen(false)
                setCampaignToEdit(null)
              }}
              className="rounded-lg bg-[#F39C12] px-4 py-2 text-sm font-medium text-white hover:bg-[#E67E22] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

