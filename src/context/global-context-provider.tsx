import { createContext, ReactNode } from 'react'
import AxiosAdapter from '@/infra/http/axios/axios-adapter'
import { AuthGateway, ExpenseGateway } from '@/infra/gateways'
import AxiosInterceptor from '@/infra/http/axios/axios-interceptor'

const axiosInterceptedInstance = new AxiosInterceptor().getInstance()
const httpAdapter = new AxiosAdapter(axiosInterceptedInstance)
const authGateway = new AuthGateway(httpAdapter)
const expenseGateway = new ExpenseGateway(httpAdapter)

const dependencies = {
  authGateway,
  expenseGateway
}

export const GlobalContext = createContext<AppDependencies>(dependencies)

export function GlobalContextProvider ({ children }: { children: ReactNode }): ReactNode {
  return (
    <GlobalContext.Provider value={dependencies}>
      {children}
    </GlobalContext.Provider>
  )
}

type AppDependencies = typeof dependencies

