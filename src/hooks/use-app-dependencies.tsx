import { useContext } from 'react'
import { AppDependenciesContext } from './app-dependencies-context'

export const useAppDependencies = () => {
  const context = useContext(AppDependenciesContext)
  if (!context) {
    throw new Error('useAppDependencies must be used within an AppDependenciesProvider')
  }
  return context
}
