import React, { createContext, ReactNode, useContext } from 'react'
import AxiosAdapter from '@/infra/http/axios/axios-adapter'
import { AuthGateway, ExpenseGateway } from '@/infra/gateways'
import SigninUseCase from '@/application/usecase/signin-usecase'
import GetExpensesUseCase from '@/application/usecase/get-expenses-usecase'
import AxiosInterceptor from '@/infra/http/axios/axios-interceptor'

// Inicialize as dependências
const axiosInterceptedInstance = new AxiosInterceptor().getInstance()
const httpAdapter = new AxiosAdapter(axiosInterceptedInstance)
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
