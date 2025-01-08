import { Category } from '@/application/entity/category'
import { Button } from '@/components/ui/button'
import { useAppDependencies } from '@/hooks/use-app-dependencies'
import { categoryStore } from '@/infra/store/category-store'
import { Trash2 } from 'lucide-react'

export function DeleteCategory ({ category }: { category: Category }) {
  const { deleteCategoryUsecase } = useAppDependencies()
  const { storeRemoveCategory } = categoryStore()

  async function deleteCategory () {
    await deleteCategoryUsecase.execute(category, storeRemoveCategory)
  }

  return (
    <div className='text-right'>
      <Button
        onClick={deleteCategory}
        variant={'outline'}
        size={'icon'}
      >
        <Trash2 />
      </Button>
    </div>
  )
}