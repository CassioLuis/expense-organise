import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'
import { ExpenseGateway } from '@/infra/gateways'
import Utilities from '@/utils/Utilities'
import { ExpenseStoreAction } from '@/infra/store/expense-store'
import { Expense } from '../entity/expense'
import { Category } from '../entity/category'
import { GetExpensesParams } from '@/infra/gateways/expense-gateway'
import { AnaliticStoreAction } from '@/infra/store/analitic-store'

export default class SearchExpenses {

  constructor (
    private readonly expenseGateway: ExpenseGateway,
    private readonly toaster: typeof toast
  ) { }

  async execute (
    params: GetExpensesParams,
    setStore: ExpenseStoreAction['storeSetExpenses'],
    setAnaliticStore: AnaliticStoreAction['storeSetAnalitic'],
    setRelevance: AnaliticStoreAction['storeSetRelevanceBalance']
  ): Promise<void> {
    try {
      const { data } = await this.expenseGateway.getByDateInterval(params)
      const expenseList: Expense[] = []
      data.expenses.forEach(item => expenseList.push(
        new Expense(
          item._id,
          item.expenseDate,
          item.description,
          new Category(
            item.category._id,
            item.category.name,
            item.category.subCategory
          ),
          item.expenseValue,
          item.quota,
          item.totalQuota,
          item.creditCard
        )
      ))
      setAnaliticStore(data.analitic)
      setRelevance(data.relevanceBalance)
      setStore(expenseList)
    } catch (e: any) {
      this.toaster({
        variant: 'destructive',
        title: e.message,
        description: Utilities.dateFormat(new Date(), 'dddd, D MMMM [de] YYYY [às] h:mm A'),
        action: (
          <ToastAction altText="Goto schedule to undo">Ok</ToastAction>
        )
      })
    }
  }
}