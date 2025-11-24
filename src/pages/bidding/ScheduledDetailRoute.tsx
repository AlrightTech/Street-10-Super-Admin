import { useParams, useNavigate } from 'react-router-dom'
import { getProductById } from '../../utils/biddingProducts'
import ScheduledDetail from './ScheduledDetail'

export default function ScheduledDetailRoute() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const product = id ? getProductById(id) : undefined
  
  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">Product not found</p>
          <button
            onClick={() => navigate('/building-products')}
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-[#F7931E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E8840D]"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }
  
  return <ScheduledDetail product={product} onClose={() => navigate('/building-products')} />
}

