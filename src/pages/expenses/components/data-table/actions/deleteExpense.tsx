import { Expense } from '@/application/entity/expense'
import { Button } from '@/components/ui/button'
import { useAppDependencies } from '@/hooks/use-app-dependencies'
import { expenseStore } from '@/infra/store/expense-store'
import { Trash2 } from 'lucide-react'

export function DeleteExpense ({ expense }: { expense: Expense }) {
  const { deleteExpenseUsecase } = useAppDependencies()
  const { storeRemoveExpense } = expenseStore()

  async function deleteExpense () {
    await deleteExpenseUsecase.execute(expense, storeRemoveExpense)
  }

  return (
    <div className='text-right'>
      <Button
        onClick={deleteExpense}
        variant={'outline'}
        size={'icon'}
      >
        <Trash2 />
      </Button>
    </div>
  )
}