import { useState, useEffect } from 'react'
import { settingsApi } from '../services/settings.api'

/**
 * BrandLogo component props
 */
export interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Brand logo component for Street10
 */
export default function BrandLogo({ size = 'md', className = '' }: BrandLogoProps) {
  const [logoUrl, setLogoUrl] = useState<string>('/Images/Street10-logo.png')

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const settings = await settingsApi.getPublicSettings()
        if (settings?.logos?.websiteLogo) {
          setLogoUrl(settings.logos.websiteLogo)
        }
      } catch (error) {
        console.error('Failed to fetch logo:', error)
      }
    }

    fetchLogo()
  }, [])

  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-20 w-20',
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src={logoUrl} 
        alt="Street10 logo"
        className={`${sizeClasses[size]} object-contain`}
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src = '/Images/Street10-logo.png'
        }}
      />
    </div>
  )
}

