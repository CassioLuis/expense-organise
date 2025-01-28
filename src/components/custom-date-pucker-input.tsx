import { forwardRef } from 'react'
import { Button } from './ui/button'
import { LucideCalendar } from 'lucide-react'

interface CustomInputProps {
  value?: string
  onClick?: () => void
}

const CustomInput = forwardRef<HTMLButtonElement, CustomInputProps>(({ value, onClick }, ref) => (
  <Button
    className='border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-[250px] justify-start font-normal text-muted-foreground'
    onClick={onClick}
    ref={ref}
  >
    <LucideCalendar className='mr-2 h-4 w-4' />
    <span>{value}</span>
  </Button>
))

CustomInput.displayName = 'CustomInput'

export default CustomInput