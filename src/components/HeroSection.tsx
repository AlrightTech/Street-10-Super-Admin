import { useTranslation } from '../hooks/useTranslation'

/**
 * Hero section with background image, overlay, and text
 */
export default function HeroSection() {
  const { t } = useTranslation()
  
  return (
    <div className="relative w-full min-h-[400px] ">
      <div className="relative h-full w-full min-h-[400px] md:min-h-[600px]">
        {/* Background Image */}
        <div
          className="absolute inset-0 h-full  w-full bg-cover  bg-no-repeat"
          style={{
            backgroundImage: "url('/Images/header-bg.png')",
          }}
        />
    
        
    
        <div className="absolute inset-0 z-10 flex
         h-full w-full items-center p-8 md:pl-16 md:pr-12 md:py-12">
          <h1 className="max-w-md text-4xl 
          font-bold leading-tight text-white drop-shadow-lg md:text-5xl">
            {t('heroTitle')}
          </h1>
        </div>
      </div>
    </div>
  )
}
