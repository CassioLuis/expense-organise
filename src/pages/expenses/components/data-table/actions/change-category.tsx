import { Category } from '@/application/entity/category'
import { Expense, RawExpenseSend } from '@/application/entity/expense'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAppDependencies } from '@/hooks/use-app-dependencies'
import { categoryStore } from '@/infra/store/category-store'
import { expenseStore } from '@/infra/store/expense-store'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'

export function ChangeCategory ({ expense }: { expense: Expense }) {
  const { categories } = categoryStore()
  const { updateExpenseUsecase } = useAppDependencies()
  const { storeUpdateExpense } = expenseStore()
  const [open, setOpen] = useState<boolean>(false)

  async function updateCategory (value: string): Promise<void> {
    const category = categories.find(item => item.name === value) as Category

    const updatePayload: RawExpenseSend = {
      id: expense.getId(),
      category: category.id
    }

    try {
      await updateExpenseUsecase.execute(updatePayload, storeUpdateExpense, categories)
      setOpen(false)
    } catch (e: any) {
      console.log(e)
    }
  }

  return (
    <div className='text-center'>
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger
          asChild
          className={`${expense.getCategoryName() === 'Indefinido' ? 'text-muted-foreground border-destructive' : ''}`}
        >
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {categories.find((item) => item.name === expense.getCategoryName())?.name || 'Selecione...'}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder="Procure Categoria..."
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>Categoria não encontrada.</CommandEmpty>
              <CommandGroup>
                {categories.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.name}
                    onSelect={(currentValue) => {
                      updateCategory(currentValue)
                    }}
                  >
                    {item.name}
                    <Check
                      className={cn(
                        'ml-auto',
                        expense.getCategoryName() === item.name ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
