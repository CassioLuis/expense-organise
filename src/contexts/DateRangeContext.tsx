import { createContext, useContext, useState, ReactNode } from 'react'
import Utilities from '@/utils/Utilities'

interface DateRangeContextType {
  iniDate: Date | null
  setStartDate: (date: Date | null) => void
  finDate: Date | null
  setEndDate: (date: Date | null) => void
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined)

export function DateRangeProvider ({ children }: { children: ReactNode }) {
  const [iniDate, setStartDate] = useState<Date | null>(Utilities.currentFirstDay())
  const [finDate, setEndDate] = useState<Date | null>(Utilities.currentLastDay())

  return (
    <DateRangeContext.Provider value={{ iniDate, setStartDate, finDate, setEndDate }}>
      {children}
    </DateRangeContext.Provider>
  )
}

export function useDateRange () {
  const context = useContext(DateRangeContext)
  if (context === undefined) {
    throw new Error('useDateRange must be used within a DateRangeProvider')
  }
  return context
}
