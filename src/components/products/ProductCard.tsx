import React from 'react'

export interface ProductCardProps {
  imageUrl: string
  timeLeft: string
  categoryPath: string
  title: string
  description: string
  price: string
}

export const ProductCard: React.FC<ProductCardProps> = ({
  imageUrl,
  timeLeft,
  categoryPath,
  title,
  description,
  price,
}) => {
  return (
    <div
      className="group flex h-full w-full flex-col overflow-hidden rounded-lg bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative flex-shrink-0">
        <img
          src={imageUrl}
          alt={title}
          className="h-40 w-full object-cover"
          loading="lazy"
        />
        <span className="absolute right-3 top-3 rounded-sm bg-orange-500 px-3 py-1 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(249,115,22,0.35)]">
          {timeLeft}
        </span>
      </div>

      <div className="flex flex-col flex-grow px-3 py-2 text-left">
        <p className="text-sm font-medium text-orange-500">{categoryPath}</p>
        <h3 className="text-lg font-semibold text-gray-900
         transition-colors mt-1 mb-1 group-hover:text-gray-800 sm:text-xl">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-2 sm:text-xs line-clamp-2 flex-grow">{description}</p>
        <div className="text-xl font-bold text-indigo-600 sm:text-2xl mt-auto">{price}</div>
      </div>
    </div>
  )
}


