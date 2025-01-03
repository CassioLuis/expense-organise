import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'
import { ExpenseGateway } from '@/infra/gateways'
import Utilities from '@/utils/Utilities'
import { ExpenseStoreAction } from '@/infra/store/expense-store'
import { ExpensePartial } from '@/application/entity/expense'

export default class UpdateExpense {

  constructor (
    private readonly expenseGateway: ExpenseGateway,
    private readonly toaster: typeof toast
  ) { }

  async execute (expense: ExpensePartial, setState: ExpenseStoreAction['storeUpdateExpense']): Promise<void> {
    try {
      await this.expenseGateway.update(expense)
      setState(expense)
    } catch (e: any) {
      this.toaster({
        variant: 'destructive',
        title: `UpdateExpense: ${e.message}`,
        description: Utilities.dateFormat(new Date(), 'dddd, D MMMM [de] YYYY [às] h:mm A'),
        action: (
          <ToastAction altText="Goto schedule to undo">Ok</ToastAction>
        )
      })
    }
  }
}