import HttpAdapter from '@/infra/http/http-adapter'
import env from '../env'
import { RawExpense } from '@/application/entity/expense'
// import querystring from 'querystring'

const basePath = '/expenses'

export default class ExpenseGateway {
  constructor (private readonly httpAdapter: HttpAdapter) { }

  async getAllByUser (): Promise<Output> {
    return this.httpAdapter.get(`${env.BASE_URL}${basePath}`)
  }

  async save (expense: RawExpense): Promise<void> {
    return this.httpAdapter.post(`${env.BASE_URL}${basePath}`, expense)
  }

  async delete (expense: RawExpense['_id']): Promise<void> {
    return this.httpAdapter.delete(`${env.BASE_URL}${basePath}/${expense}`)
  }
}

export interface Output {
  data: RawExpense[],
  status: number
}
