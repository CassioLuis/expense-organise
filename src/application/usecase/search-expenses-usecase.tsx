import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'
import { ExpenseGateway } from '@/infra/gateways'
import Utilities from '@/utils/Utilities'
import { ExpenseStoreAction } from '@/infra/store/expense-store'
import { Expense } from '../entity/expense'

export default class SearchExpenses {

  constructor (
    private readonly expenseGateway: ExpenseGateway,
    private readonly toaster: typeof toast
  ) { }

  async execute (setState: ExpenseStoreAction['storeSetExpenses']): Promise<void> {
    try {
      const { data } = await this.expenseGateway.getAllByUser()
      const expenseList: Expense[] = []
      data.forEach(item => expenseList.push(
        new Expense(
          item._id,
          item.expenseDate,
          item.description,
          item.category,
          item.expenseValue,
          item.quota,
          item.totalQuota,
          item.creditCard
        )
      ))
      setState(expenseList)
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