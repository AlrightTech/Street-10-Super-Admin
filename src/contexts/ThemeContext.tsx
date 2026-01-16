import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface ThemeContextType {
  darkMode: boolean
  setDarkMode: (darkMode: boolean) => void
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

const DARK_MODE_STORAGE_KEY = 'darkMode'

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Get initial dark mode from localStorage or default to false
  // Apply immediately on initial state to prevent flash
  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const saved = localStorage.getItem(DARK_MODE_STORAGE_KEY)
    const isDark = saved === 'true'
    // Apply immediately before React renders
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    return isDark
  })

  // Apply dark mode to document immediately when state changes
  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    // Save to localStorage
    localStorage.setItem(DARK_MODE_STORAGE_KEY, darkMode.toString())
  }, [darkMode])

  // Load dark mode preference from backend on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        // Try to load from backend
        const { profileApi } = await import('../services/profile.api')
        await profileApi.getMe()
        
        // If backend has darkMode preference, use it (when backend supports it)
        // For now, we'll rely on localStorage
        // In the future: if (user.darkMode !== undefined) setDarkModeState(user.darkMode)
      } catch (error) {
        // If backend call fails, use localStorage (already set in initial state)
        console.error('Failed to load theme preference:', error)
      }
    }

    loadThemePreference()
  }, [])

  const setDarkMode = (value: boolean) => {
    setDarkModeState(value)
  }

  const toggleDarkMode = () => {
    setDarkModeState((prev) => !prev)
  }

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
