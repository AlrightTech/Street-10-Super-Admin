import type { VendorServiceItem } from '../types/vendorDetails'
import { mockVendorDetails } from './mockVendorDetails'

export interface ProductDetailData extends VendorServiceItem {
  productId: string
  categoryPath: string
  descriptionLong: string
  additionalDocuments: string[]
  condition: string
  brand: string
  regularPrice: string
  salePrice: string
  stockQuantity: number
  weight: string
  dimensions: string
  metaTitle: string
  metaDescription: string
  performance: {
    views: number
    orders: number
    revenue: string
    conversionRate: string
    saved: number
    shared: number
  }
}

export const mockProductDetails: ProductDetailData[] = [
  {
    productId: 'apple-airpods-pro-2',
    id: 'apple-airpods-pro-2',
    name: 'Apple',
    category: 'Electronics',
    categoryPath: 'Electronics → Audio → Earbuds',
    price: '$199.99',
    orders: '123',
    status: 'In Stock',
    timeLeft: '14 Left',
    description:
      'Experience next-level sound with the Apple AirPods Pro (2nd generation). Featuring personalized Spatial Audio, longer battery life, and the Apple H2 chip for a magical listening experience.',
    descriptionLong:
      'Experience next-level sound with the Apple AirPods Pro (2nd generation). Featuring personalized Spatial Audio, longer battery life, and the Apple H2 chip for a magical listening experience.',
    additionalDocuments: ['Watch Video'],
    image:
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&fit=crop',
    condition: 'Excellent',
    brand: 'Apple',
    regularPrice: '$249.99',
    salePrice: '$199.99',
    stockQuantity: 45,
    weight: '0.068 kg',
    dimensions: '3.06 x 2.18 x 2.40 cm',
    metaTitle: 'Apple AirPods Pro 2nd Gen - Premium Wireless Earbuds',
    metaDescription:
      'Shop Apple AirPods Pro 2nd Generation with personalized Spatial Audio, Active Noise Cancellation, and up to 6 hours of listening time.',
    performance: {
      views: 1234,
      orders: 89,
      revenue: '$57,991',
      conversionRate: '73%',
      saved: 44,
      shared: 900,
    },
  },
]

export function getProductDetailById(productId: string): ProductDetailData | null {
  // First, try to find in mockProductDetails
  const existingProduct = mockProductDetails.find(
    (product) => product.productId === productId || product.id === productId
  )
  if (existingProduct) {
    return existingProduct
  }

  // If not found, search through vendor services
  for (const vendor of mockVendorDetails) {
    const serviceIndex = vendor.services.findIndex((s) => s.id === productId)
    if (serviceIndex !== -1) {
      const service = vendor.services[serviceIndex]
      // Create a ProductDetailData from the service
      // Use index-based image selection similar to AllVendorProducts
      const defaultImage =
        serviceIndex % 2 === 0
          ? 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&fit=crop'
          : 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=900&fit=crop'
      
      const productDetail: ProductDetailData = {
        productId: service.id,
        id: service.id,
        name: service.name,
        category: service.category || 'Uncategorized',
        categoryPath: service.category || 'Uncategorized',
        price: service.price || '$0',
        orders: service.orders || '0',
        status: service.status || 'Active',
        timeLeft: service.badge || (service.orders ? `${service.orders} Left` : 'N/A'),
        description: service.description || 'Product description not available.',
        descriptionLong: service.description || 'Product description not available.',
        additionalDocuments: [],
        image: (service as any).image || defaultImage,
        condition: 'Good',
        brand: 'Unknown',
        regularPrice: service.price || '$0',
        salePrice: service.price || '$0',
        stockQuantity: parseInt(service.orders || '0', 10) || 0,
        weight: '0.0 kg',
        dimensions: '0 x 0 x 0 cm',
        metaTitle: service.name,
        metaDescription: service.description || service.name,
        performance: {
          views: parseInt(service.orders || '0', 10) * 10 || 0,
          orders: parseInt(service.orders || '0', 10) || 0,
          revenue: '$0',
          conversionRate: '0%',
          saved: 0,
          shared: 0,
        },
      }
      return productDetail
    }
  }

  return null
}

export function updateProductDetail(productId: string, updatedData: Partial<ProductDetailData>) {
  const productIndex = mockProductDetails.findIndex((product) => product.productId === productId || product.id === productId)
  if (productIndex !== -1) {
    mockProductDetails[productIndex] = {
      ...mockProductDetails[productIndex],
      ...updatedData,
    }
  }
}

export function deleteProductDetail(productId: string) {
  const productIndex = mockProductDetails.findIndex((product) => product.productId === productId || product.id === productId)
  if (productIndex !== -1) {
    mockProductDetails.splice(productIndex, 1)
    return true
  }
  return false
}


