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
import { useEffect } from 'react'
import { ptBR } from 'date-fns/locale/pt-BR'
import { LucideCalendar } from 'lucide-react'
import { ComboboxDemo } from './category-selector'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'


export function ExpenseForm () {
  const defaultValues = {
    date: new Date(),
    category: '',
    description: '',
    quotas: 0,
    expenseValue: 0

  }
  const form = useForm({ defaultValues })
  function onSubmit (data: any) {
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

  useEffect(() => {
    console.log(form.getValues())
  }, [form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-4'>
          <div className='flex gap-4'>
            <FormField
              control={form.control}
              name="date"
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
                  <ComboboxDemo
                    field={field}
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
              name="quotas"
              render={({ field }) => (
                <FormItem className='grow flex flex-col'>
                  <FormLabel>Parcelas</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
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
