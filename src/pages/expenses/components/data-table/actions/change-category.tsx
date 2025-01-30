import { Category } from '@/application/entity/category'
import { Expense, RawExpenseSend } from '@/application/entity/expense'
import { useAppDependencies } from '@/hooks/use-app-dependencies'
import { categoryStore } from '@/infra/store/category-store'
import { expenseStore } from '@/infra/store/expense-store'
import { CategorySelector } from '../../category-selector'

export function ChangeCategory ({ expense }: { expense: Expense }) {
  const { categories } = categoryStore()
  const { updateExpenseUsecase } = useAppDependencies()
  const { storeUpdateExpense } = expenseStore()

  async function updateCategory (value: string): Promise<void> {
    const category = categories.find(item => item.name === value) as Category
    const updatePayload: RawExpenseSend = {
      id: expense.getId(),
      category: category.id
    }
    try {
      await updateExpenseUsecase.execute(updatePayload, storeUpdateExpense, categories)
    } catch (e: any) {
      console.log(e)
    }
  }

  return (
    <div className='text-center'>
      <CategorySelector
        selected={expense.getCategoryName()}
        options={categories}
        setValue={updateCategory}
      />
    </div>
  )
}
