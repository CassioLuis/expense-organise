import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'
import { ExpenseGateway } from '@/infra/gateways'
import Utilities from '@/utils/Utilities'
import { RawExpenseSend } from '@/application/entity/expense'
import { ExpenseStoreAction } from '@/infra/store/expense-store'
import SearchExpenses from './search-expenses-usecase'

export default class SaveExpense {

  constructor (
    private readonly expenseGateway: ExpenseGateway,
    private readonly searchExpensesUsecase: SearchExpenses,
    private readonly toaster: typeof toast
  ) { }

  async execute (payload: RawExpenseSend, setStore: ExpenseStoreAction['storeSetExpenses']): Promise<void> {
    const params = {
      iniDate: Utilities.newUtcDate(payload.expenseDate!).firtDay,
      finDate: Utilities.newUtcDate(payload.expenseDate!).lastDay
    }
    try {
      await this.expenseGateway.save(payload)
      await this.searchExpensesUsecase.execute(params, setStore)
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
