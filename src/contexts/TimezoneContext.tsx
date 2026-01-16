import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface TimezoneContextType {
  timezone: string
  setTimezone: (timezone: string) => void
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string
  formatTime: (date: Date | string) => string
  formatDateTime: (date: Date | string) => string
}

const TimezoneContext = createContext<TimezoneContextType | undefined>(undefined)

interface TimezoneProviderProps {
  children: ReactNode
}

const TIMEZONE_STORAGE_KEY = 'timeZone'

export function TimezoneProvider({ children }: TimezoneProviderProps) {
  // Get initial timezone from localStorage or default to system timezone
  const [timezone, setTimezoneState] = useState<string>(() => {
    if (typeof window === 'undefined') return 'UTC'
    const saved = localStorage.getItem(TIMEZONE_STORAGE_KEY)
    return saved || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  })

  // Save timezone to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(TIMEZONE_STORAGE_KEY, timezone)
  }, [timezone])

  // Load timezone preference from backend on mount
  useEffect(() => {
    const loadTimezonePreference = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        // Try to load from backend
        const { profileApi } = await import('../services/profile.api')
        await profileApi.getMe()
        
        // If backend has timezone preference, use it (when backend supports it)
        // For now, we'll rely on localStorage
        // In the future: if (user.timezone) setTimezoneState(user.timezone)
      } catch (error) {
        // If backend call fails, use localStorage (already set in initial state)
        console.error('Failed to load timezone preference:', error)
      }
    }

    loadTimezonePreference()
  }, [])

  const setTimezone = (tz: string) => {
    setTimezoneState(tz)
  }

  // Helper function to format date according to timezone
  const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: timezone,
      ...options,
    }
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj)
  }

  // Helper function to format time according to timezone
  const formatTime = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: timezone,
      hour12: true,
    }).format(dateObj)
  }

  // Helper function to format date and time according to timezone
  const formatDateTime = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: timezone,
      hour12: true,
    }).format(dateObj)
  }

  return (
    <TimezoneContext.Provider value={{ timezone, setTimezone, formatDate, formatTime, formatDateTime }}>
      {children}
    </TimezoneContext.Provider>
  )
}

export function useTimezone(): TimezoneContextType {
  const context = useContext(TimezoneContext)
  if (!context) {
    throw new Error('useTimezone must be used within TimezoneProvider')
  }
  return context
}
