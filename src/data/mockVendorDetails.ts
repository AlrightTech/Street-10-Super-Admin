import type { VendorDetailData } from '../types/vendorDetails'
import { mockVendors } from './mockVendors'

export const mockVendorDetails: VendorDetailData[] = [
  {
    id: 1,
    status: 'approved',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop',
    ownerName: 'Touseef Ahmed',
    role: 'Vendor',
    email: 'alice.johnson@example.com',
    phone: '+1 234 567 8900',
    businessName: 'Hotel Paradise',
    vendorType: 'Hotel',
    address: 'Street #12, Kohat, Qatar',
    commissionRate: '15%',
    financialInfo: {
      commissionRate: '15%',
      accountStatus: 'Verified',
      totalSales: '22',
      paymentRequest: 'Pending',
    },
    performance: [
      { id: 'total-orders', label: 'Total Orders', value: '320', icon: 'clipboard' },
      { id: 'completed-orders', label: 'Completed Orders', value: '300', icon: 'check' },
      { id: 'canceled-orders', label: 'Canceled Orders', value: '20', icon: 'x' },
      { id: 'average-rating', label: 'Average Rating', value: '4.5 / 5', icon: 'star' },
    ],
    documents: [
      { id: 'business-license', title: 'Business License', status: 'Verified', date: 'Jan 15, 2025' },
      { id: 'cnic-front', title: 'CNIC / Passport', status: 'Verified', date: 'Jan 15, 2025' },
      { id: 'cnic-back', title: 'CNIC / Passport', status: 'Verified', date: 'Jan 15, 2025' },
    ],
    services: [
      {
        id: 'apple-airpods-pro-2',
        name: 'Air',
        category: 'Car',
        price: '$70',
        orders: '23',
        status: 'Active',
        description: 'Premium air service for your vehicle.',
      },
      { id: 'service-2', name: 'Water', category: 'Car', price: '$50', orders: '10', status: 'Active' },
      { id: 'service-3', name: 'Air', category: 'Car', price: '$70', orders: '23', status: 'Pending' },
      { id: 'service-4', name: 'Water', category: 'Car', price: '$50', orders: '10', status: 'Pending' },
      { id: 'service-5', name: 'Air', category: 'Car', price: '$70', orders: '23', status: 'Blocked' },
    ],
  },
]

export function getVendorDetailById(id: number) {
  const existing = mockVendorDetails.find((vendor) => vendor.id === id)
  if (existing) {
    return existing
  }

  const vendor = mockVendors.find((item) => item.id === id)
  if (!vendor || vendor.status !== 'approved') {
    return null
  }

  const generated: VendorDetailData = {
    id: vendor.id,
    status: vendor.status,
    avatar:
      vendor.avatar ??
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop',
    ownerName: vendor.ownerName,
    role: 'Vendor',
    email: 'vendor@example.com',
    phone: '+1 234 567 8900',
    businessName: vendor.businessName,
    vendorType: 'Hotel',
    address: 'Street #12, Kohat, Qatar',
    commissionRate: '15%',
    financialInfo: {
      commissionRate: '15%',
      accountStatus: 'Verified',
      totalSales: '22',
      paymentRequest: 'Pending',
    },
    performance: [
      { id: 'total-orders', label: 'Total Orders', value: '320', icon: 'clipboard' },
      { id: 'completed-orders', label: 'Completed Orders', value: '300', icon: 'check' },
      { id: 'canceled-orders', label: 'Canceled Orders', value: '20', icon: 'x' },
      { id: 'average-rating', label: 'Average Rating', value: '4.5 / 5', icon: 'star' },
    ],
    documents: [
      { id: 'business-license', title: 'Business License', status: 'Verified', date: 'Jan 15, 2025' },
      { id: 'cnic-front', title: 'CNIC / Passport', status: 'Verified', date: 'Jan 15, 2025' },
      { id: 'cnic-back', title: 'CNIC / Passport', status: 'Verified', date: 'Jan 15, 2025' },
    ],
    services: [
      {
        id: 'apple-airpods-pro-2',
        name: 'Air',
        category: 'Car',
        price: '$70',
        orders: '23',
        status: 'Active',
      },
      { id: 'service-2', name: 'Water', category: 'Car', price: '$50', orders: '10', status: 'Active' },
      { id: 'service-3', name: 'Air', category: 'Car', price: '$70', orders: '23', status: 'Pending' },
      { id: 'service-4', name: 'Water', category: 'Car', price: '$50', orders: '10', status: 'Pending' },
      { id: 'service-5', name: 'Air', category: 'Car', price: '$70', orders: '23', status: 'Blocked' },
    ],
  }

  mockVendorDetails.push(generated)
  return generated
}

export function updateVendorDetail(updatedVendor: VendorDetailData) {
  const existingIndex = mockVendorDetails.findIndex((vendor) => vendor.id === updatedVendor.id)
  if (existingIndex !== -1) {
    mockVendorDetails[existingIndex] = {
      ...mockVendorDetails[existingIndex],
      ...updatedVendor,
      financialInfo: {
        ...mockVendorDetails[existingIndex].financialInfo,
        ...updatedVendor.financialInfo,
      },
    }
  } else {
    mockVendorDetails.push(updatedVendor)
  }

  const vendorIndex = mockVendors.findIndex((vendor) => vendor.id === updatedVendor.id)
  if (vendorIndex !== -1) {
    mockVendors[vendorIndex] = {
      ...mockVendors[vendorIndex],
      ownerName: updatedVendor.ownerName,
      businessName: updatedVendor.businessName,
      status: updatedVendor.status,
      avatar: updatedVendor.avatar ?? mockVendors[vendorIndex].avatar,
    }
  } else {
    mockVendors.push({
      id: updatedVendor.id,
      ownerName: updatedVendor.ownerName,
      businessName: updatedVendor.businessName,
      status: updatedVendor.status,
      avatar: updatedVendor.avatar,
    })
  }
}

