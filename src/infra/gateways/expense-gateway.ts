import HttpAdapter from '@/infra/http/http-adapter'
import env from '../env'
import Expense from '@/application/entity/expense'

const basePath = '/expenses'

export default class ExpenseGateway {
  constructor(private readonly httpAdapter: HttpAdapter) { }

  async getByUser (input: Input): Promise<Output> {
    const { iniDate, finDate } = input

    const formattedIniDate = iniDate.replace(/:/g, '%3A')
    const formattedFinDate = finDate.replace(/:/g, '%3A')

    return this.httpAdapter.get(`${env.BASE_URL}${basePath}/analitic?iniDate=${formattedIniDate}&finDate=${formattedFinDate}`)
  }
}

interface Input {
  iniDate: string
  finDate: string
}

interface Output {
  relevante: object
  analitic: object
  expenses: Expense[]
}