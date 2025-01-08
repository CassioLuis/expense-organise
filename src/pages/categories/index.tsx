import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { useAppDependencies } from '@/hooks/use-app-dependencies'
import { categoryStore } from '@/infra/store/category-store'
import { useEffect, useState } from 'react'
import { columns } from './components/data-table/columns'
import { Input } from '@/components/ui/input'
import { RawCategoryPartial } from '@/application/entity/category'

type HTMLInputElementPartial = Partial<React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>>

export default function Categories () {
  const { searchCategoriesUsecase, saveCategoryUsecase } = useAppDependencies()
  const { storeSetCategory, categories } = categoryStore()

  async function getCategories () {
    await searchCategoriesUsecase.execute(storeSetCategory)
  }

  useEffect(() => {
    if (categories.length) return
    const getOnMount = async () => await getCategories()
    getOnMount()
  }, [])

  const [categoryPayload, setCategoryPayload] = useState<RawCategoryPartial>({})

  async function addCategory (event: HTMLInputElementPartial): Promise<void> {
    if (event.key !== 'Enter') return
    await saveCategoryUsecase.execute(categoryPayload, storeSetCategory)
    if (!event.target) return
    event.target.value = ''
    setCategoryPayload({})
  }

  return (
    <div className='container mx-auto space-y-2'>
      <div className='space-x-2'>
        <Button onClick={getCategories}>GET</Button>
      </div>
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
