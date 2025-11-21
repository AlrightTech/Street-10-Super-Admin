import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Language, LanguageContextType } from '../types/language'

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

const LANGUAGE_STORAGE_KEY = 'app_language'
export function LanguageProvider({ children }: LanguageProviderProps) {
  // Get initial language from localStorage or default to 'en'
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language
    return savedLanguage === 'ar' ? 'ar' : 'en'
  })
  
  // Always keep direction as LTR - no RTL changes
  const dir: 'rtl' | 'ltr' = 'ltr'

  useEffect(() => {
    // Only set lang attribute, keep dir as ltr always
    document.documentElement.setAttribute('dir', dir)
    document.documentElement.setAttribute('lang', language)
  }, [dir, language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
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

