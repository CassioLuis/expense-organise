import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Category } from '@/application/entity/category'
import { useState } from 'react'

interface PropsTypes {
  selected: string,
  options: Category[],
  setValue: (option: string) => void
}

export function CategorySelector ({ selected, options, setValue }: PropsTypes) {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger
        asChild
        className={`${selected === 'Indefinido' ? 'text-muted-foreground border-destructive' : ''}`}
      >
        <Button
          variant="outline"
          role="combobox"
          className={`w-[223px] justify-between ${(selected === 'Indefinido' || selected === '') ? 'text-muted-foreground justify-end' : ''}`}
        >
          {selected ? options.find((option: Category) => option.name === selected)?.name : ''}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[223px] p-0">
        <Command>
          <CommandInput
            placeholder="Procurar..."
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {options.map((option: Category) => (
                <CommandItem
                  key={option.id}
                  value={option.name}
                  onSelect={() => {
                    setValue(option.id)
                    setOpen(false)
                  }}
                >
                  {option.name}
                  <Check className={cn('ml-auto', option.name === selected ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover >
  )
}
