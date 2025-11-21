import type { VendorRequestDetail } from '../types/vendorRequest'
import type { VendorStatus } from '../types/vendors'
import { mockVendors } from './mockVendors'

const vendorRequests: VendorRequestDetail[] = [
  {
    id: 1,
    ownerName: 'Touseef Ahmed',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop',
    contact: {
      email: 'alice.johnson@example.com',
      phone: '+1 234 567 8900',
    },
    business: {
      businessName: 'Hotel Paradise',
      vendorType: 'Hotel',
      address: 'Street #12, Kohat, Qatar',
      contactPerson: 'Umaar',
    },
    documents: [
      {
        id: 'business-license',
        name: 'Business License',
        statusLabel: 'Verified',
        verifiedDate: 'Jan 15, 2025',
        icon: 'document',
      },
      {
        id: 'commercial-certificate',
        name: 'Commercial Certificate',
        statusLabel: 'Verified',
        verifiedDate: 'Jan 15, 2025',
        icon: 'document',
      },
      {
        id: 'tax-certificate',
        name: 'Tax Certificate',
        statusLabel: 'Verified',
        verifiedDate: 'Jan 15, 2025',
        icon: 'document',
      },
    ],
    businessDescription: 'We provide hotel rooms & catering services',
    status: 'pending',
  },
]

export function getVendorRequestDetail(id: number) {
  const existing = vendorRequests.find((request) => request.id === id)
  if (existing) {
    return existing
  }

  const vendor = mockVendors.find((item) => item.id === id)
  if (!vendor) {
    return null
  }

  const generated: VendorRequestDetail = {
    id: vendor.id,
    ownerName: vendor.ownerName,
    avatar: vendor.avatar,
    contact: {
      email: 'vendor@example.com',
      phone: '+1 234 567 8900',
    },
    business: {
      businessName: vendor.businessName,
      vendorType: 'Hotel',
      address: 'Street #12, Kohat, Qatar',
      contactPerson: 'Umaar',
    },
    documents: [
      {
        id: 'business-license',
        name: 'Business License',
        statusLabel: 'Verified',
        verifiedDate: 'Jan 15, 2025',
        icon: 'document',
      },
      {
        id: 'commercial-certificate',
        name: 'Commercial Certificate',
        statusLabel: 'Verified',
        verifiedDate: 'Jan 15, 2025',
        icon: 'document',
      },
      {
        id: 'tax-certificate',
        name: 'Tax Certificate',
        statusLabel: 'Verified',
        verifiedDate: 'Jan 15, 2025',
        icon: 'document',
      },
    ],
    businessDescription: 'We provide hotel rooms & catering services',
    status: vendor.status,
  }

  vendorRequests.push(generated)
  return generated
}

export function updateVendorRequestStatus(id: number, status: VendorStatus) {
  const request = vendorRequests.find((item) => item.id === id)
  if (request) {
    request.status = status
  }

  const vendor = mockVendors.find((item) => item.id === id)
  if (vendor) {
    vendor.status = status
  }

  return request ?? null
}

