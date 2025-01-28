import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion'
import AccordionTrigger from './components/accordion-trigger'
import { analiticStore } from '@/infra/store/analitic-store'
import Utilities from '@/utils/Utilities'
import { expenseStore } from '@/infra/store/expense-store'
import { SubCategory } from '@/application/entity/category'

export default function Dashboard () {

  const { analitic, relevanceBalance } = analiticStore()
  const { expenses } = expenseStore()

  return (
    <div className='container mx-auto flex h-full'>
      <div className='border grow'>
        left
      </div>
      <div className='p-4 w-96 grow-0 h-full border rounded-md flex flex-col gap-4'>
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
                className='border py-2 px-4 rounded-md'
              >
                <AccordionTrigger className='p-0 flex items-center justify-between'>
                  <span>{item.category.name}</span>
                  <span>{Utilities.currencyFormat(item.value, 'pt-BR', 'BRL')}</span>
                </AccordionTrigger>
                <AccordionContent className='py-3 px-1 text-muted-foreground text-sm space-y-3'>
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
        <div className='border rounded-md py-2 px-4'>
          <div className='flex justify-between items-center'>
            <span>Total de Débitos</span>
            <span>{Utilities.currencyFormat(
              Object.values(relevanceBalance).reduce((acc, item) => acc += item, 0),
              'pt-BR',
              'BRL'
            )}</span>
          </div>
          <div className='pt-3 flex flex-col gap-2'>
            {Object.keys(relevanceBalance).map((item, idx) => (
              <div
                key={idx}
                className='hover:bg-accent cursor-pointer flex justify-between items-center px-1 text-muted-foreground text-sm'
              >
                <span>{item}</span>
                <span>{Utilities.currencyFormat(relevanceBalance[item as SubCategory], 'pt-BR', 'BRL')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
