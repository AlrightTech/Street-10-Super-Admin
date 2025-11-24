import type { OrderProduct } from '../../types/orderDetails'

/**
 * ProductDetailsCard component props
 */
export interface ProductDetailsCardProps {
  products: OrderProduct[]
}

/**
 * Product details card component
 */
export default function ProductDetailsCard({ products }: ProductDetailsCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-base font-semibold text-gray-900">Ordered Items</h3>
      <div className="space-y-0 divide-y divide-gray-200">
        {products.map((product) => (
          <div key={product.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
            <img
              src={product.image || 'https://via.placeholder.com/80'}
              alt={product.name}
              className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
              <p className="mt-1 text-xs text-gray-600">Color: Black, Size: One Size</p>
              <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
                <span>Quantity: {product.quantity}</span>
                <span>Price: ${product.price.toFixed(2)}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Subtotal: ${product.total.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

