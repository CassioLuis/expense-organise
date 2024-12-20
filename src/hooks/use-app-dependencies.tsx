import { GlobalContext } from '@/context'
import { useContext } from 'react'

export const useAppDependencies = () => {
  const context = useContext(GlobalContext)
  if (!context) {
    throw new Error('useAppDependencies must be used within an AppDependenciesProvider')
  }
  return context
}
