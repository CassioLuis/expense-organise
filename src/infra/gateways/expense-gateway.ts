import HttpAdapter from '@/infra/http/http-adapter'
import env from '../env'
import { Expense, RawExpenseReceived, RawExpenseSend } from '@/application/entity/expense'
import { Analitic } from '@/application/entity/analitic'
import { RelevanceBalance } from '@/application/entity/category'

const basePath = '/expenses'

export default class ExpenseGateway {
  constructor (private readonly httpAdapter: HttpAdapter) { }

  async getByDateInterval (params: GetExpensesParams): Promise<Output> {
    const url = new URLSearchParams(Object.entries(params))
    return this.httpAdapter.get(`${env.BASE_URL}${basePath}/analitic?${url.toString()}`)
  }

  async save (expense: RawExpenseSend): Promise<void> {
    return this.httpAdapter.post(`${env.BASE_URL}${basePath}`, expense)
  }

  async delete (expenseId: Expense['id']): Promise<void> {
    return this.httpAdapter.delete(`${env.BASE_URL}${basePath}/${expenseId}`)
  }

  async update (expense: RawExpenseSend): Promise<void> {
    return this.httpAdapter.patch(`${env.BASE_URL}${basePath}/${expense.id}`, expense)
  }
}

export interface Output {
  data: {
    relevanceBalance: RelevanceBalance
    analitic: Analitic[]
    expenses: RawExpenseReceived[]
  },
  status: number
}

export interface GetExpensesParams {
  iniDate: string
  finDate: string
}
