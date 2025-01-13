import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'
import { ExpenseGateway } from '@/infra/gateways'
import Utilities from '@/utils/Utilities'
import { ExpenseStoreAction } from '@/infra/store/expense-store'
import { Expense } from '@/application/entity/expense'

export default class DeleteExpense {

  constructor (
    private readonly expenseGateway: ExpenseGateway,
    private readonly toaster: typeof toast
  ) { }

  async execute (expense: Expense, setStore: ExpenseStoreAction['storeRemoveExpense']): Promise<void> {
    try {
      await this.expenseGateway.delete(expense.getId())
      setStore(expense)
    } catch (e: any) {
      this.toaster({
        variant: 'destructive',
        title: `DeleteExpense: ${e.message}`,
        description: Utilities.dateFormat(new Date(), 'dddd, D MMMM [de] YYYY [às] h:mm A'),
        action: (
          <ToastAction altText="Goto schedule to undo">Ok</ToastAction>
        )
      })
    }
  }
}