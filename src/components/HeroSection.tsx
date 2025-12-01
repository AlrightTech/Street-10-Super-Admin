import { useState, useEffect, useRef } from 'react'
import { useTranslation } from '../hooks/useTranslation'

/**
 * Hero section with background image, overlay, and text
 */
export default function HeroSection() {
  const { t } = useTranslation()
  const [currentSlide, setCurrentSlide] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  
  // Carousel images array
  const images = [
    "/Images/header-bg.png",
    "/Images/header-bg.png",
    "/Images/header-bg.png",
  ]
  
  const slides = [
    {
      title: t('heroTitle'),
      image: images[0],
    },
    {
      title: t('heroTitle2'),
      image: images[1],
    },
    {
      title: t('heroTitle3'),
      image: images[2],
    },
  ]

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 3500) // Change slide every 3.5 seconds

    return () => clearInterval(interval)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    
    const distance = touchStartX.current - touchEndX.current
    const minSwipeDistance = 50

    if (distance > minSwipeDistance) {
      // Swipe left - next slide
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    } else if (distance < -minSwipeDistance) {
      // Swipe right - previous slide
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }

    touchStartX.current = null
    touchEndX.current = null
  }
  
  return (
    <div className="relative w-full min-h-[400px] ">
      <div 
        className="relative h-full w-full min-h-[400px] md:min-h-[600px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Carousel Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 h-full  w-full bg-cover  bg-no-repeat"
              style={{
                backgroundImage: `url('${slide.image}')`,
              }}
            />
        
            {/* Text Content */}
            <div className="absolute inset-0 z-10 flex
             h-full w-full items-center p-8 md:pl-16 md:pr-12 md:py-12">
              <h1 className="max-w-md text-4xl 
              font-bold leading-tight text-white drop-shadow-lg md:text-5xl">
                {slide.title}
              </h1>
            </div>
          </div>
        ))}

        {/* Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide
                  ? 'bg-[#F7931E] h-2.5 w-8'
                  : 'bg-white h-2.5 w-2.5'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
