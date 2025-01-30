import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import DatePicker from 'react-datepicker'
import { ptBR } from 'date-fns/locale/pt-BR'
import { LucideCalendar } from 'lucide-react'
import { CategorySelector } from './category-selector'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { categoryStore } from '@/infra/store/category-store'
import { useAppDependencies } from '@/hooks/use-app-dependencies'
import { expenseStore } from '@/infra/store/expense-store'
import { analiticStore } from '@/infra/store/analitic-store'
import { RawExpenseSend } from '@/application/entity/expense'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const expenseFormSchema = z.object({
  expenseDate: z.date(),
  category: z.string({
    required_error: 'Por favor selecione uma categoria.'
  }),
  description: z.string().min(1, {
    message: 'O Campo descrição é obrigatório.'
  }),
  totalQuota: z.number().positive().int().optional(),
  expenseValue: z.number().positive().min(0.01, {
    message: 'O valor deve ser maior que zero'
  })
})

type ExpenseFomSchema = z.infer<typeof expenseFormSchema>

const defaultValues: Partial<ExpenseFomSchema> = {
  expenseDate: new Date(),
  category: '',
  description: '',
  totalQuota: 0,
  expenseValue: 0
}

export function ExpenseForm () {
  const { categories } = categoryStore()
  const { saveExpenseUsecase } = useAppDependencies()
  const { storeSetExpenses } = expenseStore()
  const { storeSetAnalitic, storeSetRelevanceBalance } = analiticStore()

  const form = useForm<ExpenseFomSchema>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues,
    mode: 'onChange'
  })

  // const { fields, append } = useFieldArray({
  //   name: 'urls',
  //   control: form.control
  // })

  // const form = useForm<RawExpenseSend>({
  //   defaultValues: {
  //     expenseDate: new Date(),
  //     category: '',
  //     description: '',
  //     totalQuota: 0,
  //     expenseValue: 0
  //   }
  // })

  async function onSubmit (data: RawExpenseSend): Promise<void> {
    await saveExpenseUsecase.execute(data, storeSetExpenses, storeSetAnalitic, storeSetRelevanceBalance)
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      )
    })
    // form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-4'>
          <div className='flex gap-4'>
            <FormField
              control={form.control}
              name="expenseDate"
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <DatePicker
                      className='!w-[223px]'
                      showIcon
                      closeOnScroll={true}
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      isClearable={true}
                      locale={ptBR}
                      dateFormat="dd/MM/yyyy"
                      showPopperArrow={false}
                      popperPlacement="bottom-start"
                      icon={<LucideCalendar className='mr-2 h-4 w-4' />}
                    />
                  </FormControl>
                  <FormDescription>This is your public display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Categoria</FormLabel>
                  <CategorySelector
                    selected={field.value}
                    options={categories}
                    setValue={field.onChange}
                  />
                  <FormDescription>This is your public display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>This is your public display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex gap-4'>
            <FormField
              control={form.control}
              name="totalQuota"
              render={({ field }) => (
                <FormItem className='grow flex flex-col'>
                  <FormLabel>Parcelas</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                    />
                  </FormControl>
                  <FormDescription>This is your public display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expenseValue"
              render={({ field }) => (
                <FormItem className='grow flex flex-col'>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                    />
                  </FormControl>
                  <FormDescription>This is your public display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex justify-end'>
            <Button type="submit">Salvar</Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
