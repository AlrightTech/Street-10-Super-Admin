import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Language, LanguageContextType } from '../types/language'

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

const LANGUAGE_STORAGE_KEY = 'app_language'
const LANGUAGE_STORAGE_KEY_ALT = 'language' // Alternative key used in Settings

export function LanguageProvider({ children }: LanguageProviderProps) {
  // Get initial language from localStorage or default to 'en'
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en'
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language
    if (savedLanguage === 'ar' || savedLanguage === 'en') {
      return savedLanguage
    }
    // Check alternative key
    const altLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY_ALT)
    if (altLanguage === 'Arabic') return 'ar'
    if (altLanguage === 'English') return 'en'
    return 'en'
  })
  
  // Always keep direction as LTR - no RTL changes
  const dir: 'rtl' | 'ltr' = 'ltr'

  useEffect(() => {
    // Only set lang attribute, keep dir as ltr always
    document.documentElement.setAttribute('dir', dir)
    document.documentElement.setAttribute('lang', language)
  }, [dir, language])

  // Load language preference from backend on mount
  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        // Try to load from backend
        const { profileApi } = await import('../services/profile.api')
        const user = await profileApi.getMe()
        
        // If backend has language preference, use it
        if (user.lang && (user.lang === 'ar' || user.lang === 'en')) {
          setLanguageState(user.lang as Language)
          localStorage.setItem(LANGUAGE_STORAGE_KEY, user.lang)
          // Also sync alternative key
          localStorage.setItem(LANGUAGE_STORAGE_KEY_ALT, user.lang === 'ar' ? 'Arabic' : 'English')
        }
      } catch (error) {
        // If backend call fails, use localStorage (already set in initial state)
        console.error('Failed to load language preference:', error)
      }
    }

    loadLanguagePreference()
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
    // Also sync alternative key for Settings page compatibility
    localStorage.setItem(LANGUAGE_STORAGE_KEY_ALT, lang === 'ar' ? 'Arabic' : 'English')
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

