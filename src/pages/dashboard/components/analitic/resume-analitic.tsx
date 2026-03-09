import { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion'
import AccordionTrigger from './accordion-trigger'
import Utilities from '@/utils/Utilities'
import { analiticStore } from '@/infra/store/analitic-store'
import { expenseStore } from '@/infra/store/expense-store'
import { SubCategory } from '@/application/entity/category'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Analitic as AnaliticType } from '@/application/entity/analitic'
import { useGoalStore } from '@/infra/store/goal-store'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface AnaliticProps {
  previousMonthAnalitic: AnaliticType[]
}

export default function Analitic ({ previousMonthAnalitic }: AnaliticProps) {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined)

  const { analitic, relevanceBalance, storeSetAnalitic } = analiticStore()
  const { expenses } = expenseStore()
  const { goals } = useGoalStore()
  const totalDebts = Object.values(relevanceBalance).reduce((acc, item) => acc += item, 0)

  // Build a map of previous month values by category name
  const prevCategoryMap: Record<string, number> = {}
  previousMonthAnalitic.forEach(item => {
    prevCategoryMap[item.category.name] = item.value
  })

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
          <TooltipProvider delayDuration={150}>
            <Accordion
              type="single"
              collapsible
              className='space-y-2'
              value={openItem}
              onValueChange={(val) => setOpenItem(val)}
            >
              {[...analitic]
                .sort((a, b) => {
                  const goalA = goals.find(g => g.categoryName === a.category.name)?.amount || 5000
                  const goalB = goals.find(g => g.categoryName === b.category.name)?.amount || 5000
                  const ratioA = a.value / goalA
                  const ratioB = b.value / goalB
                  return ratioB - ratioA
                })
                .map((item, idx) => {
                  const categoryName = item.category.name
                  const currentValue = item.value

                  const previousValue = prevCategoryMap[categoryName] || 0

                  // Get user goal for this category, default to 5000 if not set visually for bar scaling
                  const existingGoal = goals.find(g => g.categoryName === categoryName)
                  const goalAmount = existingGoal?.amount || 5000

                  // Calculate the maximum scale point (either the current spend, the goal, or the previous month if it was huge)
                  const maxScale = Math.max(currentValue, goalAmount, previousValue)

                  const isOverGoal = existingGoal && currentValue > goalAmount
                  const barColor = isOverGoal ? 'bg-rose-500' : 'bg-emerald-500'

                  // Calculate percentages clamped at 100% of maxScale
                  const currentPercent = maxScale === 0 ? 0 : Math.min((currentValue / maxScale) * 100, 100)
                  const prevPercent = maxScale === 0 ? 0 : Math.min((previousValue / maxScale) * 100, 100)

                  const goalUsagePercent = Math.round((currentValue / goalAmount) * 100)
                  const relativeDiff = goalUsagePercent - 100
                  const percentLabel = relativeDiff >= 0 ? `+${relativeDiff}%` : `${relativeDiff}%`

                  // Previous Month comparison
                  const prevDiff = previousValue > 0 ? Math.round(((currentValue / previousValue) - 1) * 100) : null
                  const prevLabel = prevDiff !== null ? (prevDiff >= 0 ? `+${prevDiff}%` : `${prevDiff}%`) : null

                  return (
                    <AccordionItem
                      key={idx}
                      value={`item-${idx}`}
                      className={`bg-muted-foreground/5 border border-border/50 rounded-xl transition-all overflow-hidden hover:bg-accent/50 cursor-pointer ${openItem === `item-${idx}` ? 'bg-accent/40' : ''} ${item.bg}`}
                      onClick={() => setOpenItem(openItem === `item-${idx}` ? undefined : `item-${idx}`)}
                    >
                      <div className="px-3 pt-3 pb-2 flex flex-col gap-1.5 relative">

                        <AccordionTrigger className='p-0 flex items-center justify-between hover:no-underline transition-colors mt-0 border-none'>
                          <span className="font-bold text-sm text-muted-foreground dark:text-gray-200">{categoryName}</span>
                          <span className={`text-sm font-bold ${barColor.replace('bg-', 'text-')}`}>
                            {Utilities.currencyFormat(currentValue, 'pt-BR', 'BRL')}
                          </span>
                        </AccordionTrigger>

                        {/* Progress Bar Container */}
                        <div className="relative h-2 w-full bg-muted/30 rounded-full mt-1">
                          {/* Previous Month Marker */}
                          {previousValue > 0 && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className="absolute top-1/2 -translate-y-1/2 w-3 h-5 bg-transparent z-30 cursor-help flex justify-center items-center hover:scale-125 transition-transform"
                                  style={{ left: `calc(${prevPercent}% - 6px)` }}
                                >
                                  <div className="w-[2px] h-3 bg-muted-foreground/100 rounded" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                className="bg-[#1f2937] text-white border border-gray-700 shadow-xl px-3 py-2"
                              >
                                <p className="text-xs font-semibold mb-0.5 text-gray-400">Mês anterior</p>
                                <p className="text-sm font-bold text-gray-100">{Utilities.currencyFormat(previousValue, 'pt-BR', 'BRL')}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}

                          {/* Goal Target Marker */}
                          {existingGoal && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className="absolute top-1/2 -translate-y-1/2 w-4 h-6 bg-transparent z-30 cursor-help flex justify-center items-center group"
                                  style={{ left: `calc(${Math.min((goalAmount / maxScale) * 100, 100)}% - 8px)` }}
                                >
                                  <div className="w-[3px] h-3.5 bg-white shadow-[0_0_4px_rgba(0,0,0,0.5)] rounded group-hover:scale-125 group-hover:bg-primary transition-all duration-200" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                className="bg-[#1f2937] text-white border border-gray-700 shadow-xl px-3 py-2"
                              >
                                <p className="text-xs font-semibold mb-0.5 text-gray-400">Meta</p>
                                <p className="text-sm font-bold text-emerald-400">{Utilities.currencyFormat(goalAmount, 'pt-BR', 'BRL')}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}

                          {/* Current Spending Bar */}
                          <div
                            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out ${barColor} shadow-[0_0_8px_rgba(16,185,129,0.3)]`}
                            style={{ width: `${currentPercent}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between z-10">
                          <div className="flex flex-col items-start gap-0.5">
                            <span className="text-xs tracking-wider text-muted-foreground/70 font-semibold leading-none">
                              vs Meta
                            </span>
                            <span className={`text-xs font-bold ${isOverGoal ? 'text-rose-500' : 'text-emerald-500'}`}>
                              {percentLabel}
                            </span>
                          </div>

                          {prevLabel && (
                            <div className="flex flex-col items-end gap-0.5">
                              <span className="text-xs tracking-wider text-muted-foreground/70 font-semibold leading-none">
                                vs Mês Ant.
                              </span>
                              <span className={`text-xs font-bold ${prevDiff && prevDiff > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                {prevLabel}
                              </span>
                            </div>
                          )}
                        </div>

                      </div>

                      <AccordionContent className='border-t-[.1rem] border-muted-foreground/15 py-2 px-4 text-muted-foreground text-xs space-y-2 max-h-60 overflow-y-auto bg-accent/20'>
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
                  )
                })}
            </Accordion>
          </TooltipProvider>
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
