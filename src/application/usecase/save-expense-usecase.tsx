import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'
import { ExpenseGateway } from '@/infra/gateways'
import Utilities from '@/utils/Utilities'
import { RawExpense } from '@/application/entity/expense'
import { ExpenseStoreAction } from '@/infra/store/expense-store'
import SearchExpenses from './search-expenses-usecase'

export default class SaveExpense {

  constructor (
    private readonly expenseGateway: ExpenseGateway,
    private readonly searchExpensesUsecase: SearchExpenses,
    private readonly toaster: typeof toast
  ) { }

  async execute (payload: RawExpense, setState: ExpenseStoreAction['setExpenses']): Promise<void> {
    try {
      const expense = new RawExpense(
        payload.expenseDate,
        payload.description,
        payload.category,
        payload.expenseValue,
        payload.quota,
        payload.totalQuota
      )
      await this.expenseGateway.save(expense)
      await this.searchExpensesUsecase.execute(setState)
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
