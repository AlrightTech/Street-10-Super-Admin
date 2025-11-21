import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation, type TranslationKey } from '../utils/translations'
import {
  translateStatus,
  translateLabel,
  translateTitle,
  translateRole,
  translateCategory,
  translateServiceName,
  translateServiceDescription,
  translateSidebarLabel,
} from '../utils/translateData'

/**
 * Hook to get translations based on current language
 * Only translates text - no UI changes
 */
export function useTranslation() {
  const { language } = useLanguage()
  
  const t = (key: TranslationKey): string => {
    return getTranslation(key, language)
  }
  
  return {
    t,
    translateStatus: (status: string) => translateStatus(status, language),
    translateLabel: (label: string) => translateLabel(label, language),
    translateTitle: (title: string) => translateTitle(title, language),
    translateRole: (role: string) => translateRole(role, language),
    translateCategory: (category: string) => translateCategory(category, language),
    translateServiceName: (name: string) => translateServiceName(name, language),
    translateServiceDescription: (description: string) => translateServiceDescription(description, language),
    translateSidebarLabel: (label: string) => translateSidebarLabel(label, language),
  }
}

