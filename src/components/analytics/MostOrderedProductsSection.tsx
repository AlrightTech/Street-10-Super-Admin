import Button from '../ui/Button'
import type { MostOrderedProduct } from '../../types/analytics'

/**
 * MostOrderedProductsSection component props
 */
export interface MostOrderedProductsSectionProps {
  products: MostOrderedProduct[]
}

/**
 * Most ordered products section component
 */
export default function MostOrderedProductsSection({ products }: MostOrderedProductsSectionProps) {
  return (
    <div>
      <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-900">Top Selling Products</h3>
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
                  Product Name
                </th>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-2 text-left text-sm font-medium text-gray-600 whitespace-nowrap sm:whitespace-normal">
                  Vendor
                </th>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-2 text-left text-sm font-medium text-gray-600 whitespace-nowrap sm:whitespace-normal">
                  Category
                </th>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-2 text-left text-sm font-medium text-gray-600 whitespace-nowrap sm:whitespace-normal">
                  Price
                </th>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-2 text-left text-sm font-medium text-gray-600 whitespace-nowrap sm:whitespace-normal">
                  Sales
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-2 sm:px-3 md:px-4 py-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <img
                        src={product.productImage}
                        alt={product.productName}
                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-cover flex-shrink-0"
                      />
                      <span className="text-sm text-gray-900 whitespace-nowrap sm:whitespace-normal sm:break-words">
                        {product.productName}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-2 text-sm text-gray-600 whitespace-nowrap sm:whitespace-normal sm:break-words">
                    {product.vendor}
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-2 text-sm text-gray-600 whitespace-nowrap sm:whitespace-normal sm:break-words">
                    {product.category}
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-2 text-sm text-gray-600 whitespace-nowrap sm:whitespace-normal">
                    {product.price}
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-2 text-sm text-gray-600 whitespace-nowrap sm:whitespace-normal">
                    {product.sales}
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

