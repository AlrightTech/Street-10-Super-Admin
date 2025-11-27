import SubCategoryCard, { type SubCategoryCardData } from './SubCategoryCard'

interface SubCategoriesGridProps {
  subCategories: SubCategoryCardData[]
  onEdit?: (subCategory: SubCategoryCardData) => void
  onRemoveItem?: (subCategoryId: string, itemId: string) => void
  emptyState?: React.ReactNode
}

export default function SubCategoriesGrid({
  subCategories,
  onEdit,
  onRemoveItem,
  emptyState,
}: SubCategoriesGridProps) {
  if (subCategories.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
        {emptyState ?? (
          <>
            <p className="text-base font-semibold text-gray-800">No subcategories to show</p>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Try adjusting your filters or search criteria to see different subcategories.
            </p>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {subCategories.map((subCategory) => (
        <SubCategoryCard
          key={subCategory.id}
          subCategory={subCategory}
          onEdit={onEdit}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </div>
  )
}

