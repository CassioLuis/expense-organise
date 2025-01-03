import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'
import { ExpenseGateway } from '@/infra/gateways'
import Utilities from '@/utils/Utilities'
import { ExpenseStoreAction } from '@/infra/store/expense-store'
import ExpenseList from '../entity/expense-list'

export default class SearchExpenses {

  constructor (
    private readonly expenseGateway: ExpenseGateway,
    private readonly toaster: typeof toast
  ) { }

  async execute (setState: ExpenseStoreAction['setExpenses']): Promise<void> {
    try {
      const { data } = await this.expenseGateway.getAllByUser()
      const expenseList = new ExpenseList()
      data.forEach(item => expenseList.setExpenses(item))
      setState(expenseList.getExpenses())
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