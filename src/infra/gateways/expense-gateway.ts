import HttpAdapter from '@/infra/http/http-adapter'
import env from '../env'
import Expense from '@/application/entity/expense'
// import querystring from 'querystring'

const basePath = '/expenses'

export default class ExpenseGateway {
  constructor (private readonly httpAdapter: HttpAdapter) { }

  async getAllByUser (): Promise<Output> {
    // const { iniDate, finDate } = input

    // const formattedIniDate = iniDate.replace(/:/g, '%3A')
    // const formattedFinDate = finDate.replace(/:/g, '%3A')

    // const queryParams = {
    //   iniDate: formattedIniDate,
    //   finDate: formattedFinDate
    // }

    // const queryString = querystring.stringify(queryParams)

    return this.httpAdapter.get(`${env.BASE_URL}${basePath}`)

    // return this.httpAdapter.get(`${env.BASE_URL}${basePath}/analitic?iniDate=${formattedIniDate}&finDate=${formattedFinDate}`)
  }
}

// interface Input {
//   iniDate: string
//   finDate: string
// }

export interface Output {
  data: Expense[],
  status: number
}
