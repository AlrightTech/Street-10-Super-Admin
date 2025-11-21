import { useState, useEffect, useCallback, type ReactNode } from 'react'

/**
 * Carousel item type
 */
export interface CarouselItem {
  id: string
  content: ReactNode
}

/**
 * Carousel component props
 */
export interface CarouselProps {
  items: CarouselItem[]
  autoSlideInterval?: number // in milliseconds
  showDots?: boolean
  showArrows?: boolean
  className?: string
}

/**
 * Carousel component with auto-slide and manual navigation
 */
export default function Carousel({
  items,
  autoSlideInterval = 5000,
  showDots = true,
  showArrows = false,
  className = '',
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }, [items.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }, [items.length])

  // Auto-slide functionality
  useEffect(() => {
    if (autoSlideInterval > 0 && items.length > 1) {
      const interval = setInterval(nextSlide, autoSlideInterval)
      return () => clearInterval(interval)
    }
  }, [autoSlideInterval, nextSlide, items.length])

  if (items.length === 0) {
    return null
  }

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Carousel content */}
      <div className="relative h-full w-full min-h-[400px] md:min-h-[600px]">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {item.content}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {showArrows && items.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-lg hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="Previous slide"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-lg hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="Next slide"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Navigation dots */}
      {showDots && items.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2" role="tablist" aria-label="Carousel navigation">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-8 bg-[#F7941D]' : 'w-2 bg-white'
              }`}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

