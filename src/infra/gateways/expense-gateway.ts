import HttpAdapter from '@/infra/http/http-adapter'
import env from '../env'
import { ExpensePartial, RawExpense, RawExpensePartial } from '@/application/entity/expense'
// import querystring from 'querystring'

const basePath = '/expenses'

export default class ExpenseGateway {
  constructor (private readonly httpAdapter: HttpAdapter) { }

  async getAllByUser (): Promise<Output> {
    return this.httpAdapter.get(`${env.BASE_URL}${basePath}`)
  }

  async save (expense: RawExpensePartial): Promise<void> {
    return this.httpAdapter.post(`${env.BASE_URL}${basePath}`, expense)
  }

  async delete (expenseId: RawExpense['_id']): Promise<void> {
    return this.httpAdapter.delete(`${env.BASE_URL}${basePath}/${expenseId}`)
  }

  async update (expense: ExpensePartial): Promise<void> {
    return this.httpAdapter.patch(`${env.BASE_URL}${basePath}/${expense.id}`, expense)
  }
}

export interface Output {
  data: RawExpense[],
  status: number
}
