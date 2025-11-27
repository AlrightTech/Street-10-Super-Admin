import { EditIcon, XIcon } from '../icons/Icons'

export interface SubCategoryItem {
  id: string
  name: string
}

export interface SubCategoryCardData {
  id: string
  title: string
  description: string
  subCategoryCount: number
  items: SubCategoryItem[]
  icon: string
  status: 'active' | 'inactive'
}

interface SubCategoryCardProps {
  subCategory: SubCategoryCardData
  onEdit?: (subCategory: SubCategoryCardData) => void
  onRemoveItem?: (subCategoryId: string, itemId: string) => void
}

export default function SubCategoryCard({ subCategory, onEdit, onRemoveItem }: SubCategoryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5 flex flex-col h-full">
      {/* Header: Icon and Badge */}
      

      <div className="flex items-start justify-between mb-4">
        {/* Blue Icon Square */}
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white text-lg sm:text-xl font-semibold">
            {subCategory.icon || 'B'}
          </span>
        </div>
        {/* Active All Badge */}
       

      {/* Title */}
      <div>

      <h3 className="text-base -mt-1.5 sm:text-lg font-semibold text-gray-900">
        {subCategory.title}
      </h3>

      {/* Description */}
      <p className="text-xs sm:text-sm text-gray-600 mb-2.5">
        {subCategory.description}
      </p>

      {/* Sub Categories Count */}
      <p className="text-xs sm:text-sm text-gray-700 mb-4">
        {subCategory.subCategoryCount} Sub Categories
      </p>


      
      </div>
      <span className=" bg-[#F7931E] text-xs px-2 py-1 rounded-full inline-flex text-white ">
          Active All
        </span>
      </div>
      
      

      {/* Items List */}
      <div className="flex flex-wrap gap-2 mb-5">
        {subCategory.items.map((item) => (
          <span
            key={item.id}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
          >
            {item.name}
            {onRemoveItem && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveItem?.(subCategory.id, item.id)
                }}
                className="ml-0.5 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                aria-label={`Remove ${item.name}`}
              >
                <XIcon className="h-3 w-3" />
              </button>
            )}
          </span>
        ))}
      </div>

      {/* Edit Button */}
      <button
        type="button"
        onClick={() => onEdit?.(subCategory)}
        className="mt-auto w-full rounded-lg bg-[#F7931E] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#E8851C] focus:outline-none focus:ring-2 focus:ring-[#F7931E] focus:ring-offset-2 cursor-pointer"
      >
        <span className="inline-flex items-center justify-center gap-2">
          <EditIcon className="h-4 w-4" />
          Edit
        </span>
      </button>
    </div>
  )
}

