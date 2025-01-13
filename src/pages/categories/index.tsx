import { DataTable } from '@/components/data-table'
import { useAppDependencies } from '@/hooks/use-app-dependencies'
import { categoryStore } from '@/infra/store/category-store'
import { useState } from 'react'
import { columns } from './components/data-table/columns'
import { Input } from '@/components/ui/input'
import { RawCategoryPartial } from '@/application/entity/category'

type HTMLInputElementPartial = Partial<React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>>

export default function Categories () {
  const { saveCategoryUsecase } = useAppDependencies()
  const { storeSetCategory, categories } = categoryStore()

  const [categoryPayload, setCategoryPayload] = useState<RawCategoryPartial>({})

  async function addCategory (event: HTMLInputElementPartial): Promise<void> {
    if (event.key !== 'Enter') return
    await saveCategoryUsecase.execute(categoryPayload, storeSetCategory)
    cleanStateAndInput(event)
  }

  function cleanStateAndInput (event: HTMLInputElementPartial): void {
    if (!event.target) return
    event.target.value = ''
    setCategoryPayload({})
  }

  return (
    <div className='pt-1 container mx-auto space-y-2'>
      <Input
        type="text"
        placeholder="Acrescentar categoria..."
        onChange={(event) => setCategoryPayload({ name: event.target.value })}
        onKeyUp={(event) => addCategory(event as HTMLInputElementPartial)}
      />
      <DataTable
        columns={columns}
        data={categories}
      />
    </div>
  )
}
