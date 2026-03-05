import { Card, CardContent } from '@/components/ui/card'
import Utilities from '@/utils/Utilities'
import { TrendingUp, TrendingDown, DollarSign, ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { analiticStore } from '@/infra/store/analitic-store'

interface OverviewProps {
  totalSpent: number
  previousMonthSpent: number
  userName?: string
}

export default function Overview ({ totalSpent, previousMonthSpent, userName = 'Cassio Luis' }: OverviewProps) {
  const diff = totalSpent - previousMonthSpent
  const percentChange = previousMonthSpent !== 0 ? (diff / previousMonthSpent) * 100 : 0
  const isOptimal = diff <= 0
  const { relevanceBalance } = analiticStore()

  const totalIncome = Object.values(relevanceBalance).reduce((acc, curr) => acc + (curr < 0 ? Math.abs(curr) : 0), 0)
  const estimatedBalance = totalIncome - totalSpent

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
        {/* Balance */}
        <Card className="bg-card border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-xl bg-primary/20 border border-primary/20">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-primary/70 mt-1">Saldo</span>
            </div>
            <p className="text-2xl font-black text-foreground tracking-tight">
              {Utilities.currencyFormat(estimatedBalance > 0 ? estimatedBalance : totalSpent, 'pt-BR', 'BRL')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total do período atual</p>
          </CardContent>
        </Card>

        {/* Total Expenses */}
        <Card className="bg-card border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <ArrowDownCircle className="w-4 h-4 text-rose-500" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-1">Despesas</span>
            </div>
            <p className="text-2xl font-black text-foreground tracking-tight">
              {Utilities.currencyFormat(totalSpent, 'pt-BR', 'BRL')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total de gastos no período</p>
          </CardContent>
        </Card>

        {/* Monthly comparison */}
        <Card className="bg-card border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <ArrowUpCircle className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-1">Variação</span>
            </div>
            <p className={`text-2xl font-black tracking-tight ${isOptimal ? 'text-primary' : 'text-rose-500'}`}>
              {percentChange > 0 ? '+' : ''}{percentChange.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">Comparado ao período anterior</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
