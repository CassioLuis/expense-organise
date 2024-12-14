import React, { createContext, ReactNode, useContext } from 'react'
import AxiosAdapter from '@/infra/http/axios/axios-adapter'
import { AuthGateway, ExpenseGateway } from '@/infra/gateways'
import SigninUseCase from '@/application/usecase/signin-usecase'
import GetExpensesUseCase from '@/application/usecase/get-expenses-usecase'

// Inicialize as dependências
const httpAdapter = new AxiosAdapter()
const authGateway = new AuthGateway(httpAdapter)
const expenseGateway = new ExpenseGateway(httpAdapter)
const signinUseCase = new SigninUseCase(authGateway)
const getExpensesUseCase = new GetExpensesUseCase(expenseGateway)

const dependencies = {
  signinUseCase,
  getExpensesUseCase
}

// Defina o tipo do contexto
type AppDependencies = typeof dependencies

interface AppDependenciesProviderProps {
  children: ReactNode
}

// Crie o contexto e o hook para acessá-lo
const AppDependenciesContext = createContext<AppDependencies | null>(null)

export const AppDependenciesProvider: React.FC<AppDependenciesProviderProps> = ({ children }) => (
  <AppDependenciesContext.Provider value={dependencies}>
    {children}
  </AppDependenciesContext.Provider>
)

export const useAppDependencies = (): AppDependencies => {
  const context = useContext(AppDependenciesContext)
  if (!context) {
    throw new Error('useAppDependencies must be used within an AppDependenciesProvider')
  }
  return context
}
