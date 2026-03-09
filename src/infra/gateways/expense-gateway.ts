import HttpAdapter from '@/infra/http/http-adapter'
import { Expense, RawExpenseReceived, RawExpenseSend } from '@/application/entity/expense'
import { Analitic } from '@/application/entity/analitic'
import { RelevanceBalance } from '@/application/entity/category'

const basePath = '/expenses'

export default class ExpenseGateway {
  constructor (private readonly httpAdapter: HttpAdapter) { }

  async getByDateInterval (params: GetExpensesParams): Promise<Output> {
    const url = new URLSearchParams(Object.entries(params))
    return this.httpAdapter.get(`${import.meta.env.VITE_API_URL}${basePath}/analitic?${url.toString()}`)
  }

  async save (expense: RawExpenseSend): Promise<void> {
    return this.httpAdapter.post(`${import.meta.env.VITE_API_URL}${basePath}`, expense)
  }

  async delete (expenseId: Expense['id']): Promise<void> {
    return this.httpAdapter.delete(`${import.meta.env.VITE_API_URL}${basePath}/${expenseId}`)
  }

  async update (expense: RawExpenseSend): Promise<void> {
    return this.httpAdapter.patch(`${import.meta.env.VITE_API_URL}${basePath}/${expense.id}`, expense)
  }

  async importCsv (file: File, bankType: string = 'nubank'): Promise<ImportCsvResult> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('bankType', bankType)
    const response = await this.httpAdapter.postForm(`${import.meta.env.VITE_API_URL}${basePath}/import`, formData)
    return response.data
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

export interface ImportCsvResult {
  imported: number
  skipped: {
    count: number
    items: { description: string; reason: string }[]
  }
  duplicates: {
    count: number
    items: { description: string; expenseDate: string; expenseValue: number; quota: number; totalQuota: number; reason: string }[]
  }
}
