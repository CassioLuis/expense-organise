import { Expense, ExpensePartial } from '@/application/entity/expense'
import { Checkbox } from '@/components/ui/checkbox'
import { useAppDependencies } from '@/hooks/use-app-dependencies'
import { expenseStore } from '@/infra/store/expense-store'

export function ChangeCreditCard ({ expense }: { expense: Expense }) {
  const { updateExpenseUsecase } = useAppDependencies()
  const { storeUpdateExpense } = expenseStore()

  const updatePayload: ExpensePartial = {
    id: expense.getId(),
    creditCard: !expense.getCreditCard()
  }

  async function updateCreditCard () {
    await updateExpenseUsecase.execute(updatePayload, storeUpdateExpense)
  }

  return (
    <div className='pr-2 text-center'>
      <Checkbox
        checked={expense.getCreditCard()}
        onClick={() => updateCreditCard()}
        aria-label="Select row"
      />
    </div>
  )
}