/**
 * Language type definitions
 */
export type Language = 'en' | 'ar'

export interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  dir: 'rtl' | 'ltr'
}

