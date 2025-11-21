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
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 overflow-hidden">
      <h3 className="mb-4 text-base font-semibold text-gray-900">Product Details</h3>
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col sm:flex-row bg-[#F3F5F6] px-4 py-5 rounded-lg
           items-start gap-4 border-b border-gray-200  last:border-b-0 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="mb-2 text-base font-semibold text-gray-900 break-words">{product.name}</h4>
              <p className="mb-2 text-sm font-normal text-gray-600">{product.category}</p>
              <p className="text-sm font-normal text-gray-600">
                Quantity: {product.quantity} x ${product.price.toFixed(2)}
              </p>
            </div>
            <div className="text-left sm:text-right self-start sm:self-end flex-shrink-0">
              <p className="text-base font-semibold text-gray-900">${product.total.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

