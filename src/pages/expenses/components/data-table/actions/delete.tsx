import { Expense } from '@/application/entity/expense'
import { Button } from '@/components/ui/button'
import { useAppDependencies } from '@/hooks/use-app-dependencies'
import { expenseStore } from '@/infra/store/expense-store'

export function DeleteExpense ({ expense }: { expense: Expense }) {
  const { deleteExpenseUsecase } = useAppDependencies()
  const { removeExpense } = expenseStore()

  async function deleteExpense () {
    await deleteExpenseUsecase.execute(expense, removeExpense)
  }

  return (
    <Button onClick={deleteExpense}>
      Delete
    </Button>
  )
}