import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'
import { ExpenseGateway } from '@/infra/gateways'
import Utilities from '@/utils/Utilities'
import { ExpenseStoreAction } from '@/infra/store/expense-store'
import { Expense, RawExpenseSend } from '@/application/entity/expense'
import { Category } from '@/application/entity/category'

const DEFAULT_CATEGORY_NAME = 'Indefinido'

export default class UpdateExpense {

  constructor (
    private readonly expenseGateway: ExpenseGateway,
    private readonly toaster: typeof toast
  ) { }

  async execute (
    updatePayload: RawExpenseSend,
    setStore: ExpenseStoreAction['storeUpdateExpense'],
    categories?: Category[],
    allExpenses?: Expense[],
    setAllExpenses?: ExpenseStoreAction['storeSetExpenses']
  ): Promise<void> {
    try {
      await this.expenseGateway.update(updatePayload)

      let resolvedCategory: Category | undefined

      if (updatePayload.category && typeof updatePayload.category === 'string') {
        resolvedCategory = categories?.find(item => item.id === updatePayload.category) as Category
        setStore({ ...updatePayload, category: resolvedCategory })
      } else {
        setStore(updatePayload)
      }

      // Propagate category to all expenses with same description and default category
      if (resolvedCategory && allExpenses && setAllExpenses && updatePayload.id) {
        const updatedExpense = allExpenses.find(e => e.getId() === updatePayload.id)
        if (updatedExpense) {
          const description = updatedExpense.description
          const updatedExpenses = allExpenses.map(exp => {
            if (exp.getId() === updatePayload.id) {
              // Already updated via setStore
              return Object.assign(exp, { ...updatePayload, category: resolvedCategory })
            }
            // Propagate to same-description expenses with default category
            if (
              exp.description === description &&
              exp.getCategoryName() === DEFAULT_CATEGORY_NAME
            ) {
              return Object.assign(exp, { category: resolvedCategory })
            }
            return exp
          })
          setAllExpenses(updatedExpenses)
        }
      }
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