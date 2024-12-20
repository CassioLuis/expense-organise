import { ExpenseGateway } from '../../infra/gateways'
import Expense from '../entity/expense'

export default class GetExpensesUseCase {

  constructor (
    private readonly expenseGateway: ExpenseGateway
  ) { }

  async execute (iniDate: string, finDate: string): Promise<Expense[]> {
    return this.expenseGateway.getByUser({ iniDate, finDate })
  }
}
