import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion'
import AccordionTrigger from './accordion-trigger'
import Utilities from '@/utils/Utilities'
import { analiticStore } from '@/infra/store/analitic-store'
import { expenseStore } from '@/infra/store/expense-store'
import { SubCategory } from '@/application/entity/category'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
    <Card className='h-full flex flex-col bg-card border-border/50 shadow-sm'>
      <CardHeader className="pb-3 pt-5 px-6">
        <CardTitle className="text-base font-bold">Resumo Analítico</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-4 overflow-hidden flex-1 px-4'>
        <div className='flex-1 overflow-y-auto'>
          <Accordion
            type="single"
            collapsible
            className='space-y-2'
          >
            {analitic.map((item, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className={`border border-border/50 rounded-xl transition-all overflow-hidden ${item.bg}`}
              >
                <AccordionTrigger className='py-2.5 px-3 flex items-center justify-between hover:no-underline hover:bg-accent/40 transition-colors'>
                  <span className="font-semibold text-sm">{item.category.name}</span>
                  <span className="text-sm font-bold text-primary">{Utilities.currencyFormat(item.value, 'pt-BR', 'BRL')}</span>
                </AccordionTrigger>
                <AccordionContent className='py-2 px-4 text-muted-foreground text-xs space-y-2 max-h-60 overflow-y-auto bg-accent/20'>
                  {expenses
                    .filter((expense) => expense.getCategoryName() === item.category.name)
                    .map((expense) => (
                      <div
                        key={expense.id}
                        className='flex justify-between items-center py-1 border-b border-border/20 last:border-0'
                      >
                        <span className="truncate max-w-[140px]">{expense.description}</span>
                        <span className="font-semibold ml-2 flex-shrink-0">{expense.expenseValue}</span>
                      </div>
                    ))
                  }
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className='bg-primary/8 rounded-xl p-4 border border-primary/15'>
          <div className='flex justify-between items-center mb-3'>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total de Gastos</span>
            <span className="text-base font-black text-primary">{Utilities.currencyFormat(totalDebts, 'pt-BR', 'BRL')}</span>
          </div>
          <div className='flex flex-col gap-0.5'>
            {Object.keys(relevanceBalance).map((item, idx) => (
              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                key={idx}
                className='hover:bg-primary/10 cursor-pointer flex justify-between items-center px-2 py-1.5 rounded-lg text-muted-foreground transition-all group'
              >
                <span className="text-xs font-medium group-hover:text-primary transition-colors">{item}</span>
                <span className="text-xs font-bold group-hover:text-primary transition-colors">{Utilities.currencyFormat(relevanceBalance[item as SubCategory], 'pt-BR', 'BRL')}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
