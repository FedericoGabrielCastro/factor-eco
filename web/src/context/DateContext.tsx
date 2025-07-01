import React, { createContext, useContext, useEffect, useState } from 'react'

// Context type for simulated date
interface DateContextType {
  simulatedDate: string | null
  setSimulatedDate: (date: string | null) => void
  resetToToday: () => void
  isSimulated: boolean
}

const DateContext = createContext<DateContextType | undefined>(undefined)

const DATE_KEY = 'simulatedDate'

export const DateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Restore simulated date from localStorage if available, else use today
  const [simulatedDate, setSimulatedDateState] = useState<string | null>(() => {
    const stored = localStorage.getItem(DATE_KEY)
    if (stored) return stored
    // Default to today in YYYY-MM-DD
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  })

  // Update state and persist in localStorage
  const setSimulatedDate = (date: string | null) => {
    setSimulatedDateState(date)
    if (date) {
      localStorage.setItem(DATE_KEY, date)
    } else {
      localStorage.removeItem(DATE_KEY)
    }
  }

  // Reset to today's date
  const resetToToday = () => {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    const todayStr = `${yyyy}-${mm}-${dd}`
    setSimulatedDate(todayStr)
  }

  // Check if current date is simulated (different from today)
  const isSimulated = (() => {
    if (!simulatedDate) return false
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    return simulatedDate !== todayStr
  })()

  // Sync with localStorage on mount
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === DATE_KEY) {
        setSimulatedDateState(e.newValue)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <DateContext.Provider
      value={{
        simulatedDate,
        setSimulatedDate,
        resetToToday,
        isSimulated,
      }}
    >
      {children}
    </DateContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDate = () => {
  const ctx = useContext(DateContext)
  if (!ctx) throw new Error('useDate must be used within DateProvider')
  return ctx
}
