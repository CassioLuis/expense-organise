import { useEffect } from 'react'
import { GoalsGrid } from './components/goals-grid'
import { useGoalStore } from '@/infra/store/goal-store'
import { useToast } from '@/hooks/use-toast'
import { categoryStore } from '@/infra/store/category-store'
import { Card, CardContent } from '@/components/ui/card'
import Utilities from '@/utils/Utilities'
import { PiggyBank, Target, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function GoalsPage () {
  const { fetchGoals, goals, error } = useGoalStore()
  const categories = categoryStore((state) => state.categories)
  const { toast } = useToast()

  const salary = 4000
  const totalGoals = categories.reduce((acc, cat) => {
    const goal = goals.find(g => g.categoryName === cat.name)
    return acc + (goal?.amount || 0)
  }, 0)
  const potentialSavings = salary - totalGoals
  const savingsPercent = Math.max(0, Math.round((potentialSavings / salary) * 100))

  // Fetch goals on mount
  useEffect(() => {
    fetchGoals().catch(console.error)
  }, [fetchGoals])

  // Show errors if loading failed
  useEffect(() => {
    if (error) {
      toast({
        title: 'Atenção',
        description: error,
        variant: 'destructive'
      })
    }
  }, [error, toast])

  return (
    <div className="relative min-h-[calc(100vh-[100px])] flex flex-col">
      <div className="flex-1 w-full pb-20">
        <div className="mb-8 text-left">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Metas por Categoria</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Defina o orçamento mensal para cada categoria de gastos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border/50 shadow-sm hover:bg-accent/50 transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Wallet size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Salário Base</span>
                <span className="text-base font-black text-foreground">{Utilities.currencyFormat(salary, 'pt-BR', 'BRL')}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 shadow-sm hover:bg-accent/50 transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                <Target size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total em Metas</span>
                <span className="text-base font-black text-rose-500">{Utilities.currencyFormat(totalGoals, 'pt-BR', 'BRL')}</span>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            'transition-colors shadow-sm border',
            potentialSavings >= 0
              ? 'bg-emerald-500/5 border-emerald-500/30 hover:bg-emerald-500/10'
              : 'bg-rose-500/5 border-rose-500/30 hover:bg-rose-500/10'
          )}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <div className={cn(
                'h-10 w-10 rounded-xl flex items-center justify-center',
                potentialSavings >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
              )}
              >
                <PiggyBank size={20} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-[10px] uppercase font-bold tracking-wider',
                    potentialSavings >= 0 ? 'text-emerald-500' : 'text-rose-500'
                  )}
                  >
                    {potentialSavings >= 0 ? 'Economia Prevista' : 'Déficit Previsto'}
                  </span>
                  <span className={cn(
                    'text-[9px] font-bold px-1.5 py-0.5 rounded-md',
                    potentialSavings >= 0 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'
                  )}
                  >
                    {savingsPercent}%
                  </span>
                </div>
                <span className={cn(
                  'text-base font-black',
                  potentialSavings >= 0 ? 'text-emerald-500' : 'text-rose-500'
                )}
                >
                  {Utilities.currencyFormat(potentialSavings, 'pt-BR', 'BRL')}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* The Grid mapping the defined categories */}
        <div>
          <GoalsGrid />
        </div>
      </div>
    </div>
  )
}
