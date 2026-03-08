import { Card, CardContent } from '@/components/ui/card'
import Utilities from '@/utils/Utilities'
import { TrendingUp, TrendingDown, Info, Wallet, Percent } from 'lucide-react'

interface OverviewProps {
  totalSpent: number
  previousMonthSpent: number
  userName?: string
}

export default function Overview ({ totalSpent, previousMonthSpent, userName = 'Cassio Luis' }: OverviewProps) {
  const diff = totalSpent - previousMonthSpent
  const percentChange = previousMonthSpent !== 0 ? (diff / previousMonthSpent) * 100 : 0
  const isOptimal = diff <= 0

  // Progress bar: ratio of current spending vs previous
  // If previous is 0, show 0% (nothing to compare)
  // Cap at 100% visually for the bar width
  const spendingRatio = previousMonthSpent > 0
    ? Math.min((totalSpent / previousMonthSpent) * 100, 100)
    : (totalSpent > 0 ? 100 : 0)

  // Hardcoded income values
  const hardcodedIncome = 4000
  const incomeSpentRatio = (totalSpent / hardcodedIncome) * 100

  return (
    <div className="space-y-4">
      {/* Welcome header */}
      <div className="pt-2 mb-2">
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Bem-vindo de volta, <span className="text-primary font-semibold">{userName}</span>!
          {isOptimal
            ? ' Sua saúde financeira está melhorando.'
            : ' Aqui está o que está acontecendo hoje.'}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Card 1 — Resultado Parcial (Inspired by design print) */}
        <Card className="bg-card border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="pt-5 pb-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Resultado Parcial</span>
                  <Info className="w-3.5 h-3.5 text-muted-foreground/50" />
                </div>
              </div>

              <p className="text-3xl font-normal tracking-tight text-foreground mb-4">
                {-totalSpent < 0 ? '-' : ''}R$ {Math.abs(-totalSpent).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>

              <div className="flex items-center gap-2 mb-6">
                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-semibold ${isOptimal
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'bg-rose-500/10 text-rose-500'
                  }`}>
                  {isOptimal ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                  {percentChange > 0 ? '+' : ''}{percentChange.toFixed(1)}%
                </div>
                <span className="text-[11px] text-muted-foreground font-medium">
                  vs {Utilities.currencyFormat(previousMonthSpent, 'pt-BR', 'BRL')} mês anterior
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-400/90 transition-all duration-700 ease-out"
                  style={{ width: `${spendingRatio}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2 — Renda Mensal */}
        <Card className="bg-card border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="pt-5 pb-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Renda Mensal</span>
                  <Wallet className="w-3.5 h-3.5 text-muted-foreground/50" />
                </div>
              </div>
              <p className="text-3xl font-normal tracking-tight text-foreground mb-4">
                {Utilities.currencyFormat(hardcodedIncome, 'pt-BR', 'BRL')}
              </p>
            </div>

            <div className="pt-6">
              <p className="text-[11px] text-muted-foreground font-medium">
                Valor fixo (estimativa por enquanto)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 3 — Consumo da Renda */}
        <Card className="bg-card border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="pt-5 pb-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Consumo da Renda</span>
                  <Percent className="w-3.5 h-3.5 text-muted-foreground/50" />
                </div>
              </div>
              <p className={`text-3xl font-normal tracking-tight mb-4 ${totalSpent > hardcodedIncome ? 'text-rose-500' : 'text-foreground'
                }`}>
                {totalSpent > hardcodedIncome
                  ? `-${((totalSpent - hardcodedIncome) / hardcodedIncome * 100).toFixed(1)}%`
                  : `${incomeSpentRatio.toFixed(1)}%`
                }
              </p>
            </div>

            {/* Progress bar for income spent */}
            <div className="pt-2">
              <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${incomeSpentRatio > 100
                    ? 'bg-rose-500'
                    : incomeSpentRatio > 80
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                    }`}
                  style={{ width: `${Math.min(incomeSpentRatio, 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground font-medium flex justify-between">
                <span>Gasto no mês selecionado</span>
                <span>Max: 100%</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
