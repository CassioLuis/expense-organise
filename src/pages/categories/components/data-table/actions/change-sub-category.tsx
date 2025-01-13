import { Category, RawCategoryPartial } from '@/application/entity/category'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useAppDependencies } from '@/hooks/use-app-dependencies'
import { categoryStore } from '@/infra/store/category-store'
import { useState } from 'react'

export function SubCategorySelector ({ category }: { category: Category }) {
  const subCategory = ['Essencial', 'Eventual', 'Dispensável', 'Outro']

  const [localState, setLocalState] = useState<RawCategoryPartial>({
    subCategory: category.subCategory
  })

  const { storeUpdateCategory } = categoryStore()
  const { updateCategoryUsecase } = useAppDependencies()

  async function changeSubCategory (value: any): Promise<void> {
    const categoryPayload: RawCategoryPartial = {
      _id: category.id,
      subCategory: value
    }
    try {
      await updateCategoryUsecase.execute(categoryPayload, storeUpdateCategory)
      setLocalState(categoryPayload)
    } catch (e: any) {
      console.log(e)
    }
  }

  return (
    <Select
      defaultValue={category.subCategory}
      onValueChange={(value) => changeSubCategory(value)}
    >
      <SelectTrigger className={`w-[180px] ${localState.subCategory === 'Indefinido' ? 'destructive group border-destructive text-destructive-foreground' : ''}`}>
        <SelectValue placeholder="Selecione..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel className='text-muted-foreground'>Sub Categorias</SelectLabel>
          {subCategory.map((item, idx) =>
            <SelectItem
              value={item}
              key={idx}
            >
              {item}
            </SelectItem>)}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
