import { useState, useEffect } from 'react'
import { settingsApi, type PublicSettings } from '../services/settings.api'

/* Inline SVG icons matching website footer (no external icon lib) */
const PhoneIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)

const MailIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const MapPinIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

/**
 * Footer component matching the main website design.
 * Used on superadmin dashboard login page for consistent branding.
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
  const address = settings?.contact?.address?.value || ''
  const footerOneFeatures = settings?.contact?.footerOneFeatures || []
  const footerTwoFeatures = settings?.contact?.footerTwoFeatures || []
  const socialMediaLinks = settings?.contact?.socialMediaLinks || []

  const websiteBase = import.meta.env.VITE_WEBSITE_URL || ''

  const resolveLink = (link: string) => {
    if (!link || link === '#') return '#'
    if (link.startsWith('http://') || link.startsWith('https://')) {
      return link
    }
    return websiteBase ? `${websiteBase}${link.startsWith('/') ? '' : '/'}${link}` : link
  }

  const handleLinkClick = (link: string) => {
    const resolved = resolveLink(link)
    if (resolved && resolved !== '#') {
      window.open(resolved, link.startsWith('http') ? '_blank' : '_self')
    }
  }

  return (
    <footer className="w-full bg-[#4c50a2] text-white">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo + Links */}
        <div>
          <div className="flex items-center gap-2 mb-4 md:ms-12">
            <img
              src={logoUrl}
              alt="Logo"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/Images/Street10-logo.png'
              }}
            />
          </div>
          <ul className="space-y-2 text-sm md:ms-12">
            {footerOneFeatures.map((feature) => (
              <li key={feature.id}>
                <button
                  type="button"
                  onClick={() => handleLinkClick(feature.link)}
                  className="text-left hover:text-[#EE8E32] transition cursor-pointer"
                >
                  {feature.title}
                </button>
              </li>
            ))}
            {footerOneFeatures.length === 0 && (
              <>
                <li>
                  <a href={websiteBase ? `${websiteBase}/contact` : '#'} className="hover:text-[#EE8E32] transition">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href={websiteBase ? `${websiteBase}/help` : '#'} className="hover:text-[#EE8E32] transition">
                    Help & Center
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Features */}
        <div>
          <h3 className="font-semibold mb-4">Features</h3>
          <ul className="space-y-2 text-sm">
            {footerTwoFeatures.map((feature) => (
              <li key={feature.id}>
                <button
                  type="button"
                  onClick={() => handleLinkClick(feature.link)}
                  className="text-left hover:text-[#EE8E32] transition cursor-pointer"
                >
                  {feature.title}
                </button>
              </li>
            ))}
            {footerTwoFeatures.length === 0 && (
              <>
                <li>
                  <a href={websiteBase ? `${websiteBase}/bidding` : '#'} className="hover:text-[#EE8E32] transition">
                    Bidding
                  </a>
                </li>
                <li>
                  <a href={websiteBase ? `${websiteBase}/e-commerce` : '#'} className="hover:text-[#EE8E32] transition">
                    E-commerce
                  </a>
                </li>
                <li>
                  <a href={websiteBase ? `${websiteBase}/vendors` : '#'} className="hover:text-[#EE8E32] transition">
                    Vendors
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Contact Info + Social */}
        <div className="md:-ms-22">
          <h3 className="font-semibold mb-4">Join our social platform to stay updated</h3>
          <div className="space-y-2 text-sm">
            {phoneNumber && (
              <div className="flex items-center gap-2">
                <PhoneIcon />
                <a href={`tel:${phoneNumber}`} className="hover:underline">
                  {phoneNumber}
                </a>
              </div>
            )}
            {email && (
              <div className="flex items-center gap-2">
                <MailIcon />
                <a href={`mailto:${email}`} className="hover:underline">
                  {email}
                </a>
              </div>
            )}
            {address && (
              <div className="flex items-center gap-2">
                <MapPinIcon />
                {address}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 mt-4">
            {socialMediaLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                {link.icon ? (
                  <img
                    src={link.icon}
                    alt={link.name}
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                ) : (
                  <span className="text-white text-sm">{link.name}</span>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold mb-4">Receive updates from our weekly newsletter.</h3>
          <p className="text-sm mb-4">
            Be the first to get notified about new Street features & updates.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 bg-white rounded-l-md text-black w-full text-sm outline-none"
            />
            <button
              type="button"
              className="bg-[#ee8e31] text-nowrap px-2 py-2 cursor-pointer rounded-r-md text-sm font-semibold hover:bg-[#d97d2a] transition-colors"
            >
              Notify Me
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="text-center pb-3 text-sm">
        Copyright ©{new Date().getFullYear()}. All right reserved
      </div>
    </footer>
  )
}
