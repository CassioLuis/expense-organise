import { forwardRef } from 'react'

interface CustomInputProps {
  value?: string
  onClick?: () => void
}

const CustomInput = forwardRef<HTMLButtonElement, CustomInputProps>(({ value, onClick }, ref) => (
  <button
    className='text-xs font-medium text-foreground cursor-pointer hover:text-primary transition-colors bg-transparent border-none outline-none text-center min-w-[90px] capitalize'
    onClick={onClick}
    ref={ref}
    type='button'
  >
    {value}
  </button>
))

CustomInput.displayName = 'CustomInput'

export default CustomInput