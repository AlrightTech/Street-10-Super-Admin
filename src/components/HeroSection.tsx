import { useState, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { loginScreensApi } from '../services/login-screens.api'

/**
 * Hero section with background image, overlay, and text
 */
export default function HeroSection() {
  const { t } = useTranslation()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  
  // Default carousel images array
  const defaultImages = [
    "/Images/header-bg.png",
    "/Images/header-bg.png",
    "/Images/header-bg.png",
  ]

  // Helper function to normalize image URL
  const normalizeImageUrl = (url: string | null | undefined): string => {
    if (!url) return defaultImages[0];
    // If it's already a full URL (http/https), return as is
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    // If it's a relative path starting with /uploads or similar, prepend backend URL
    if (url.startsWith('/uploads/') || url.startsWith('/public/')) {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
      if (!API_BASE_URL) {
        console.warn('Missing VITE_API_BASE_URL. Cannot resolve backend URL for image:', url);
        return url; // Return as-is if we can't resolve
      }
      const backendUrl = API_BASE_URL.replace('/api/v1', '');
      return `${backendUrl}${url}`;
    }
    // If it's a relative path starting with /, use it as is
    if (url.startsWith('/')) {
      return url;
    }
    // Otherwise, prepend / to make it a root-relative path
    return `/${url}`;
  };

  // Fetch active login screen background image
  useEffect(() => {
    const fetchLoginScreen = async () => {
      try {
        console.log('Fetching active login screen for admin...');
        const loginScreen = await loginScreensApi.getActive('admin');
        console.log('Login screen response:', loginScreen);
        if (loginScreen?.backgroundUrl) {
          const normalizedUrl = normalizeImageUrl(loginScreen.backgroundUrl);
          console.log('Setting background image URL:', normalizedUrl);
          setBackgroundImageUrl(normalizedUrl);
        } else {
          console.log('No active login screen found or no backgroundUrl');
        }
      } catch (error) {
        console.error('Failed to fetch login screen:', error);
        // Keep default background image on error
      }
    };

    fetchLoginScreen();
  }, []);

  // Use fetched background image or default images
  const images = useMemo(() => {
    return backgroundImageUrl 
      ? [backgroundImageUrl, backgroundImageUrl, backgroundImageUrl]
      : defaultImages
  }, [backgroundImageUrl])
  
  const slides = useMemo(() => [
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
  ], [images, t])

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 3500) // Change slide every 3.5 seconds

    return () => clearInterval(interval)
  }, [slides.length, backgroundImageUrl])

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
