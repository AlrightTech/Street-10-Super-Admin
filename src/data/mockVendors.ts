import type { Vendor, VendorStatus } from '../types/vendors'

/**
 * Mock vendor data
 */
export const mockVendors: Vendor[] = [
  { id: 1, ownerName: 'Touseef Ahmed', businessName: 'Abstract Painting', status: 'approved', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { id: 2, ownerName: 'Qasim Muneer', businessName: 'Abstract Painting', status: 'rejected', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
  { id: 3, ownerName: 'Yasir Hafeez', businessName: 'Abstract Painting', status: 'approved', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  { id: 4, ownerName: 'Junaid Akhtar Butt', businessName: 'Abstract Painting', status: 'pending', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop' },
  { id: 5, ownerName: 'Tariq Iqbal', businessName: 'Abstract Painting', status: 'approved', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop' },
  { id: 6, ownerName: 'Muhammed Saeed', businessName: 'Abstract Painting', status: 'rejected', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop' },
  { id: 7, ownerName: 'Abdurrehman', businessName: 'Abstract Painting', status: 'pending', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { id: 8, ownerName: 'Yasir Hafeez', businessName: 'Abstract Painting', status: 'approved', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  { id: 9, ownerName: 'Yasir Hafeez', businessName: 'Abstract Painting', status: 'rejected', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  { id: 10, ownerName: 'Yasir Hafeez', businessName: 'Abstract Painting', status: 'pending', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  { id: 11, ownerName: 'Yasir Hafeez', businessName: 'Abstract Painting', status: 'approved', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  { id: 12, ownerName: 'Yasir Hafeez', businessName: 'Abstract Painting', status: 'rejected', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  { id: 13, ownerName: 'Yasir Hafeez', businessName: 'Abstract Painting', status: 'pending', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  { id: 14, ownerName: 'Yasir Hafeez', businessName: 'Abstract Painting', status: 'approved', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  { id: 15, ownerName: 'Yasir Hafeez', businessName: 'Abstract Painting', status: 'rejected', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  { id: 16, ownerName: 'Yasir Hafeez', businessName: 'Abstract Painting', status: 'pending', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  { id: 17, ownerName: 'Yasir Hafeez', businessName: 'Abstract Painting', status: 'approved', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  { id: 18, ownerName: 'Yasir Hafeez', businessName: 'Abstract Painting', status: 'rejected', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  { id: 19, ownerName: 'Yasir Hafeez', businessName: 'Abstract Painting', status: 'pending', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  { id: 20, ownerName: 'Yasir Hafeez', businessName: 'Abstract Painting', status: 'approved', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  // Add more vendors to reach 47 total
  ...Array.from({ length: 27 }, (_, i) => {
    const statuses: VendorStatus[] = ['pending', 'approved', 'rejected']
    return {
      id: 21 + i,
      ownerName: `Vendor ${21 + i}`,
      businessName: 'Abstract Painting',
      status: statuses[i % 3] as VendorStatus,
      avatar: `https://images.unsplash.com/photo-${1507003211169 + i}?w=100&h=100&fit=crop`,
    }
  }),
]

