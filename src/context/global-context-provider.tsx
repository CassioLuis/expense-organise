import { createContext, ReactNode } from 'react'
import AxiosAdapter from '@/infra/http/axios/axios-adapter'
import { AuthGateway, ExpenseGateway } from '@/infra/gateways'
import AxiosInterceptor from '@/infra/http/axios/axios-interceptor'
import SearchExpenses from '@/application/usecase/search-expenses-usecase'
import { toast } from '@/hooks/use-toast'
import Signin from '@/application/usecase/signin-usecase'
import SaveExpense from '@/application/usecase/save-expense-usecase'
import DeleteExpense from '@/application/usecase/delete-expense-usecase'
import UpdateExpense from '@/application/usecase/update-expense'

const axiosInterceptedInstance = new AxiosInterceptor().getInstance()
const httpAdapter = new AxiosAdapter(axiosInterceptedInstance)
const authGateway = new AuthGateway(httpAdapter)
const expenseGateway = new ExpenseGateway(httpAdapter)
const searchExpensesUsecase = new SearchExpenses(expenseGateway, toast)
const signinUsecase = new Signin(authGateway, toast)
const saveExpenseUsecase = new SaveExpense(expenseGateway, searchExpensesUsecase, toast)
const deleteExpenseUsecase = new DeleteExpense(expenseGateway, toast)
const updateExpenseUsecase = new UpdateExpense(expenseGateway, toast)

const dependencies = {
  signinUsecase,
  searchExpensesUsecase,
  saveExpenseUsecase,
  deleteExpenseUsecase,
  updateExpenseUsecase
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
