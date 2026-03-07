import { Card, CardContent } from '@/components/ui/card'
import Utilities from '@/utils/Utilities'
import { TrendingUp, TrendingDown, CalendarMinus2, CalendarCheck2 } from 'lucide-react'
import moment from 'moment'
import 'moment/dist/locale/pt-BR'

interface OverviewProps {
  totalSpent: number
  previousMonthSpent: number
  currentDate: Date | null
  userName?: string
}

export default function Overview ({ totalSpent, previousMonthSpent, currentDate, userName = 'Cassio Luis' }: OverviewProps) {
  const diff = totalSpent - previousMonthSpent
  const percentChange = previousMonthSpent !== 0 ? (diff / previousMonthSpent) * 100 : 0
  const isOptimal = diff <= 0

  // Month names
  moment.locale('pt-BR')
  const currentMonthName = currentDate
    ? moment(currentDate).format('MMMM [de] YYYY')
    : ''
  const previousMonthName = currentDate
    ? moment(currentDate).subtract(1, 'month').format('MMMM [de] YYYY')
    : ''

  // Progress bar: ratio of current spending vs previous
  // If previous is 0, show 0% (nothing to compare)
  // Cap at 100% visually for the bar width
  const spendingRatio = previousMonthSpent > 0
    ? Math.min((totalSpent / previousMonthSpent) * 100, 100)
    : (totalSpent > 0 ? 100 : 0)

  return (
    <div className="space-y-4">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pt-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financial Overview</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Bem-vindo de volta, <span className="text-primary font-semibold">{userName}</span>!
            {isOptimal
              ? ' Sua saúde financeira está melhorando.'
              : ' Aqui está o que está acontecendo hoje.'}
          </p>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${isOptimal
          ? 'bg-primary/10 text-primary border-primary/20'
          : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
          }`}>
          {isOptimal
            ? <TrendingDown className="w-3.5 h-3.5" />
            : <TrendingUp className="w-3.5 h-3.5" />
          }
          {percentChange > 0 ? '+' : ''}{percentChange.toFixed(1)}% vs mês anterior
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Card 1 — Previous Month */}
        <Card className="bg-card border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <CalendarMinus2 className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-1">Mês Anterior</span>
            </div>
            <p className="text-2xl font-black text-foreground tracking-tight">
              {Utilities.currencyFormat(previousMonthSpent, 'pt-BR', 'BRL')}
            </p>
            <p className="text-xs text-muted-foreground mt-1 capitalize">{previousMonthName}</p>
          </CardContent>
        </Card>

        {/* Card 2 — Current Month */}
        <Card className="bg-card border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <CalendarCheck2 className="w-4 h-4 text-rose-500" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-1">Mês Atual</span>
            </div>
            <p className="text-2xl font-black text-foreground tracking-tight">
              {Utilities.currencyFormat(totalSpent, 'pt-BR', 'BRL')}
            </p>
            <p className="text-xs text-muted-foreground mt-1 capitalize">{currentMonthName}</p>
          </CardContent>
        </Card>

        {/* Card 3 — Variation + Progress Bar */}
        <Card className="bg-card border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-xl border ${isOptimal
                ? 'bg-primary/10 border-primary/20'
                : 'bg-rose-500/10 border-rose-500/20'
                }`}>
                {isOptimal
                  ? <TrendingDown className="w-4 h-4 text-primary" />
                  : <TrendingUp className="w-4 h-4 text-rose-500" />
                }
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-1">Variação</span>
            </div>
            <p className={`text-2xl font-black tracking-tight ${isOptimal ? 'text-primary' : 'text-rose-500'}`}>
              {percentChange > 0 ? '+' : ''}{percentChange.toFixed(1)}%
            </p>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
                <span>Gasto atual vs anterior</span>
                <span className="font-semibold">{spendingRatio.toFixed(0)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted/50 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${isOptimal ? 'bg-primary' : 'bg-rose-500'
                    }`}
                  style={{ width: `${spendingRatio}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
