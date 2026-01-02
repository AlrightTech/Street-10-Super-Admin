import { useState, useEffect } from 'react'
import { settingsApi, type PublicSettings } from '../services/settings.api'

/**
 * Footer component with logo, social icons, and contact info
 */
export default function Footer() {
  const [settings, setSettings] = useState<PublicSettings | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsApi.getPublicSettings()
        setSettings(data)
      } catch (error) {
        console.error('Failed to fetch settings:', error)
      }
    }

    fetchSettings()
  }, [])

  const logoUrl = settings?.logos?.websiteLogo || '/Images/Street10-logo.png'
  const phoneNumber = settings?.contact?.phoneNumbers?.[0]?.value || ''
  const email = settings?.contact?.email?.value || ''
  const socialMediaLinks = settings?.contact?.socialMediaLinks || []

  return (
    <footer className="bg-[#3A388D] text-white">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-10">
        <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 md:gap-6">
          {/* Left: Logo */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative flex h-20 w-20 md:h-20 md:w-20 items-center justify-center rounded-full bg-white flex-shrink-0 overflow-hidden p-2">
              <img 
                src={logoUrl} 
                alt="Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/Images/Street10-logo.png'
                }}
              />
            </div>
          </div>

          {/* Center: Social platform message + Icons */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <span className="text-white text-xs sm:text-sm md:text-base text-center sm:text-left">Join us social platform to stay updated</span>
            <div className="flex items-center gap-2">
              {socialMediaLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0077B5] text-white transition-colors hover:bg-[#005885] focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label={link.name}
                >
                  {link.icon ? (
                    <img 
                      src={link.icon} 
                      alt={link.name}
                      className="h-4 w-4 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <span className="text-xs">{link.name}</span>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Right: Contact info */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <span className="text-white font-medium text-xs sm:text-sm md:text-base whitespace-nowrap">Contact</span>
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-1.5 text-white hover:underline text-xs sm:text-sm md:text-base whitespace-nowrap">
                <svg className="h-3 w-3 sm:h-4 sm:mt-1 sm:w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="break-all sm:break-normal">{email}</span>
              </a>
            )}
            {phoneNumber && (
              <a href={`tel:${phoneNumber}`} className="flex items-center gap-1.5 text-white hover:underline text-xs sm:text-sm md:text-base whitespace-nowrap">
                <svg className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{phoneNumber}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

