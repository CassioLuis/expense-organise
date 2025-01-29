import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion'
import AccordionTrigger from './accordion-trigger'
import Utilities from '@/utils/Utilities'
import { analiticStore } from '@/infra/store/analitic-store'
import { expenseStore } from '@/infra/store/expense-store'
import { SubCategory } from '@/application/entity/category'

export default function Analitic () {

  const { analitic, relevanceBalance, storeSetAnalitic } = analiticStore()
  const { expenses } = expenseStore()
  const totalDebts = Object.values(relevanceBalance).reduce((acc, item) => acc += item, 0)

  function highlight (subCategory: SubCategory): void {
    const addHighlight = analitic.map(item => {
      if (item.category.subCategory !== subCategory) return { ...item, bg: '' }
      return { ...item, bg: 'bg-accent' }
    })
    storeSetAnalitic(addHighlight)
  }

  function handleMouseEnter (event: React.MouseEvent<HTMLDivElement>): void {
    const target = event.target as HTMLElement
    const firstChild = target.firstElementChild
    highlight(firstChild?.textContent as SubCategory)
  }

  function handleMouseLeave (): void {
    const removeHighlight = analitic.map(item => ({ ...item, bg: '' }))
    storeSetAnalitic(removeHighlight)
  }

  return (
    <div className='p-4 w-96 grow-0 h-full border rounded-md flex flex-col gap-4 justify-center'>
      <h1 className='text-center text-lg font-semibold'>Analítico</h1>
      <div className='grow overflow-y-auto'>
        <Accordion
          type="single"
          collapsible
          className='space-y-3'
        >
          {analitic.map((item, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className={`border rounded-md ${item.bg}`}
            >
              <AccordionTrigger className='py-2 px-4 rounded-md flex items-center justify-between'>
                <span>{item.category.name}</span>
                <span>{Utilities.currencyFormat(item.value, 'pt-BR', 'BRL')}</span>
              </AccordionTrigger>
              <AccordionContent className='py-2 px-5 text-muted-foreground text-sm space-y-3 max-h-96 overflow-y-auto'>
                {expenses
                  .filter((expense) => expense.category.name === item.category.name)
                  .map((expense) => (
                    <div
                      key={expense.id}
                      className='flex justify-between items-center'
                    >
                      <span>{expense.description}</span>
                      <span>{expense.expenseValue}</span>
                    </div>

                  ))
                }
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <div className='border rounded-md p-2'>
        <div className='flex justify-between items-center px-2'>
          <span>Total de Débitos</span>
          <span>{Utilities.currencyFormat(totalDebts, 'pt-BR', 'BRL')}</span>
        </div>
        <div className='pt-2 flex flex-col'>
          {Object.keys(relevanceBalance).map((item, idx) => (
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              key={idx}
              className='hover:bg-accent cursor-pointer flex justify-between items-center px-3 py-2 rounded-md text-muted-foreground text-sm transition-colors'
            >
              <span >{item}</span>
              <span>{Utilities.currencyFormat(relevanceBalance[item as SubCategory], 'pt-BR', 'BRL')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
