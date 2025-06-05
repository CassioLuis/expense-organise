import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'
import { ExpenseGateway } from '@/infra/gateways'
import Utilities from '@/utils/Utilities'
import { ExpenseStoreAction } from '@/infra/store/expense-store'
import { RawExpenseSend } from '@/application/entity/expense'
import { Category } from '@/application/entity/category'

export default class UpdateExpense {

  constructor (
    private readonly expenseGateway: ExpenseGateway,
    private readonly toaster: typeof toast
  ) { }

  async execute (
    updatePayload: RawExpenseSend,
    setStore: ExpenseStoreAction['storeUpdateExpense'],
    categories?: Category[]
  ): Promise<void> {
    console.log(updatePayload)
    try {
      await this.expenseGateway.update(updatePayload)
      if (updatePayload.category && typeof updatePayload.category === 'string') {
        const category = categories?.find(item => item.id === updatePayload.category) as Category
        return setStore({ ...updatePayload, category })
      }
      setStore(updatePayload)
    } catch (e: any) {
      this.toaster({
        variant: 'destructive',
        title: `UpdateExpense: ${e.message}`,
        description: Utilities.dateFormat(new Date(), 'dddd, D MMMM [de] YYYY [às] h:mm A'),
        action: <ToastAction altText="Goto schedule to undo">Ok</ToastAction>
      })
    }
  }
}