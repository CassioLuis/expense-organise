import { Expense } from '@/application/entity/expense'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, Wallet, CheckCircle2 } from 'lucide-react'

interface TransactionListProps {
  expenses: Expense[]
}

const categoryColors: Record<string, string> = {
  'Alimentação': 'bg-orange-500/15 text-orange-500',
  'Transporte': 'bg-blue-500/15 text-blue-500',
  'Lazer': 'bg-purple-500/15 text-purple-500',
  'Saúde': 'bg-rose-500/15 text-rose-500',
  'Educação': 'bg-yellow-500/15 text-yellow-500',
  'Moradia': 'bg-cyan-500/15 text-cyan-500',
}

const CircularProgress = ({ value, max }: { value: number, max: number }) => {
  const radius = 5
  const circumference = 2 * Math.PI * radius
  const percent = value / max
  const offset = circumference - percent * circumference

  return (
    <svg width="14" height="14" viewBox="0 0 14 14" className="transform -rotate-90 text-yellow-500">
      <circle
        cx="7"
        cy="7"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="opacity-20"
      />
      <circle
        cx="7"
        cy="7"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  )
}

function getCategoryColor (name: string): string {
  return categoryColors[name] ?? 'bg-primary/15 text-primary'
}

export default function TransactionList ({ expenses }: TransactionListProps) {
  return (
    <Card className="flex flex-col bg-card border-border/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-5 px-6">
        <CardTitle className="text-base font-bold">Transações Recentes</CardTitle>
        <span className="text-xs text-muted-foreground font-medium">
          {expenses.length} {expenses.length === 1 ? 'item' : 'itens'}
        </span>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="h-full max-h-[340px] overflow-y-auto overflow-x-hidden px-4 pb-4">
          <div className="space-y-1">
            {expenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Wallet className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-sm">Nenhuma transação neste período.</p>
              </div>
            ) : (
              expenses.map((expense) => {
                const isPending = expense.quota !== '-'
                const [currentQuota, totalQuota] = isPending ? expense.quota.split('/').map(Number) : [1, 1]
                const categoryColor = getCategoryColor(expense.getCategoryName())

                return (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/40 transition-colors duration-150 group"
                  >
                    {/* Icon + info */}
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${categoryColor} flex-shrink-0`}>
                        {expense.creditCard ? (
                          <CreditCard className="w-4 h-4" />
                        ) : (
                          <Wallet className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm leading-tight truncate max-w-[180px]">
                          {expense.description}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full ${categoryColor}`}>
                            {expense.getCategoryName()}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {expense.expenseDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Amount + status */}
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="font-bold text-sm text-foreground">
                        {expense.expenseValue}
                      </p>
                      <div className={`flex items-center justify-end gap-1.5 mt-0.5 text-[10px] font-semibold ${isPending ? 'text-yellow-500' : 'text-primary'
                        }`}>
                        {isPending
                          ? <CircularProgress value={currentQuota} max={totalQuota} />
                          : <CheckCircle2 className="w-3 h-3" />
                        }
                        {isPending ? `Parcela ${expense.quota}` : 'Concluído'}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
