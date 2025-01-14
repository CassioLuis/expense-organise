import { ptBR } from 'date-fns/locale/pt-BR'
import { forwardRef, useState } from 'react'
import DatePicker from 'react-datepicker'
// import { registerLocale } from 'react-datepicker'
import '@/assets/datepicker.css'
import { LucideCalendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
// registerLocale('ptBR', ptBR)

interface CustomInputProps {
  value?: string
  onClick?: () => void
}

export function DatePickerTeste () {
  const [startDate, setStartDate] = useState<Date | null>(new Date())

  const CustomInput = forwardRef<HTMLButtonElement, CustomInputProps>(({ value, onClick }, ref) => (
    <Button
      className='border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-[240px] justify-start text-left font-normal text-muted-foreground'
      onClick={onClick}
      ref={ref}
    >
      <LucideCalendar className='mr-2 h-4 w-4' />
      <span>{value}</span>
    </Button>
  ))
  CustomInput.displayName = 'CustomInput'

  return (
    <DatePicker
      locale={ptBR}
      dateFormat="dd/MM/yyyy"
      showPopperArrow={false}
      showMonthYearPicker
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      popperPlacement="bottom-start"
      customInput={<CustomInput />}
    />
  )
}
