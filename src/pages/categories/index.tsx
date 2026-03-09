import { DataTable } from '@/components/data-table'
import { useAppDependencies } from '@/hooks/use-app-dependencies'
import { categoryStore } from '@/infra/store/category-store'
import { useState, useEffect } from 'react'
import { columns } from './components/data-table/columns'
import { Input } from '@/components/ui/input'
import { CategoryPartial } from '@/application/entity/category'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

type HTMLInputElementPartial = Partial<React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>>

export default function Categories () {
  const { saveCategoryUsecase, searchCategoriesUsecase } = useAppDependencies()
  const { storeSetCategory, categories } = categoryStore()

  const [categoryPayload, setCategoryPayload] = useState<CategoryPartial>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    async function load () {
      if (categories.length === 0) {
        setIsLoading(true)
        try {
          await searchCategoriesUsecase.execute(storeSetCategory)
        } finally {
          setIsLoading(false)
        }
      }
    }
    load()
  }, [])

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
    <div className='flex flex-col gap-5 py-4 px-1'>
      <Card className="bg-card border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3 pb-3 pt-5 px-6">
          <div className="p-2.5 rounded-xl bg-primary/15 text-primary">
            <Plus className="w-4 h-4" />
          </div>
          <CardTitle className="text-base font-bold">Nova Categoria</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <Input
            type="text"
            placeholder="Acrescentar categoria..."
            className="bg-muted/30 border-border/50 focus-visible:ring-primary/30"
            onChange={(event) => setCategoryPayload({ name: event.target.value })}
            onKeyUp={(event) => addCategory(event as HTMLInputElementPartial)}
          />
        </CardContent>
      </Card>

      <Card className="bg-card border-border/50 shadow-sm">
        <CardHeader className="pb-3 pt-5 px-6">
          <CardTitle className="text-base font-bold">Lista de Categorias</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {isLoading ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 py-4 border-b border-border/10">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-12" />
              </div>
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 py-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              ))}
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={categories}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
