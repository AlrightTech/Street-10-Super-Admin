import { useEffect } from 'react'
import { settingsApi } from '../services/settings.api'

/**
 * Favicon component that dynamically updates the favicon from API
 */
export default function Favicon() {
  useEffect(() => {
    const updateFavicon = async () => {
      try {
        const settings = await settingsApi.getPublicSettings()
        if (settings?.logos?.favicon) {
          // Remove existing favicon links
          const existingLinks = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]')
          existingLinks.forEach((link) => link.remove())

          // Create new favicon link
          const link = document.createElement('link')
          link.rel = 'icon'
          link.type = 'image/png'
          link.href = settings.logos.favicon
          document.head.appendChild(link)
        }
      } catch (error) {
        console.error('Failed to update favicon:', error)
      }
    }

    updateFavicon()
  }, [])

  return null
}

