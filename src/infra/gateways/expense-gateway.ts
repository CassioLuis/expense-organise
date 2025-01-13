import HttpAdapter from '@/infra/http/http-adapter'
import env from '../env'
import { Expense, RawExpenseSend } from '@/application/entity/expense'
// import querystring from 'querystring'

const basePath = '/expenses'

export default class ExpenseGateway {
  constructor (private readonly httpAdapter: HttpAdapter) { }

  async getAllByUser (): Promise<Output> {
    return this.httpAdapter.get(`${env.BASE_URL}${basePath}`)
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
  data: Expense[],
  status: number
}
