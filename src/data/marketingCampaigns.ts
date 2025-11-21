import type { MarketingCampaign } from '../types/dashboard'
import { mockCampaigns } from './mockData'

export function getMarketingCampaigns(): MarketingCampaign[] {
  return mockCampaigns.map((campaign) => ({ ...campaign }))
}

export function findMarketingCampaign(id: string): MarketingCampaign | undefined {
  return mockCampaigns.find((campaign) => campaign.id === id)
}

export function deleteMarketingCampaign(id: string): void {
  const index = mockCampaigns.findIndex((campaign) => campaign.id === id)
  if (index !== -1) {
    mockCampaigns.splice(index, 1)
  }
}

export function updateMarketingCampaign(id: string, updates: Partial<MarketingCampaign>): void {
  const index = mockCampaigns.findIndex((campaign) => campaign.id === id)
  if (index !== -1) {
    mockCampaigns[index] = {
      ...mockCampaigns[index],
      ...updates,
    }
  }
}

