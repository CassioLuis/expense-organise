import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Expense } from '@/application/entity/expense'
import Utilities from '@/utils/Utilities'

interface SpendingTrendProps {
  expenses: Expense[]
}

export default function SpendingTrend ({ expenses }: SpendingTrendProps) {
  // Group expenses by day
  const dailyTotals: Record<string, number> = {}

  expenses.forEach(exp => {
    const day = exp.expenseDate.split(' ')[0]
    const value = parseFloat(exp.expenseValue.replace(/[^\d,]/g, '').replace(',', '.'))
    dailyTotals[day] = (dailyTotals[day] || 0) + (isNaN(value) ? 0 : value)
  })

  const days = Object.keys(dailyTotals).sort()
  const displayData = days.slice(-12).map(day => ({
    label: day,
    value: dailyTotals[day]
  }))

  // Pad if empty
  const chartData = displayData.length > 0
    ? displayData
    : Array(8).fill(null).map((_, i) => ({ label: `${i + 1}`, value: 0 }))

  const maxVal = Math.max(...chartData.map(d => d.value), 1)
  const minVal = Math.min(...chartData.map(d => d.value), 0)
  const range = maxVal - minVal || 1

  const W = 600
  const H = 180
  const PAD_X = 10
  const PAD_Y = 20
  const innerW = W - PAD_X * 2
  const innerH = H - PAD_Y * 2

  const points = chartData.map((d, i) => ({
    x: PAD_X + (i / (chartData.length - 1 || 1)) * innerW,
    y: PAD_Y + innerH - ((d.value - minVal) / range) * innerH,
    ...d
  }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const areaPath = [
    `M ${points[0].x.toFixed(1)} ${(PAD_Y + innerH).toFixed(1)}`,
    ...points.map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`),
    `L ${points[points.length - 1].x.toFixed(1)} ${(PAD_Y + innerH).toFixed(1)}`,
    'Z'
  ].join(' ')

  return (
    <Card className="bg-card border-border/50 shadow-sm">
      <CardHeader className="pb-2 pt-5 px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold">Tendência de Gastos</CardTitle>
          {displayData.length > 0 && (
            <span className="text-xs text-muted-foreground font-medium">
              Últimos {displayData.length} dias
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-5">
        {displayData.length === 0 ? (
          <div className="h-[160px] flex items-center justify-center text-muted-foreground text-sm">
            Nenhum dado disponível para este período.
          </div>
        ) : (
          <div className="relative">
            <svg
              viewBox={`0 0 ${W} ${H + 30}`}
              className="w-full overflow-visible"
              preserveAspectRatio="none"
            >

              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
                <line
                  key={i}
                  x1={PAD_X}
                  y1={PAD_Y + innerH * t}
                  x2={W - PAD_X}
                  y2={PAD_Y + innerH * t}
                  stroke="currentColor"
                  strokeOpacity="0.08"
                  strokeWidth="1"
                />
              ))}

              {/* Area fill */}
              <path d={areaPath} fill="hsl(145 85% 45%)" fillOpacity="0.1" />

              {/* Line */}
              <path
                d={linePath}
                fill="none"
                stroke="hsl(145 85% 45%)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {points.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="hsl(145 85% 45%)"
                    stroke="white"
                    strokeWidth="2"
                    className="drop-shadow-sm"
                  />
                  {/* X-axis labels */}
                  {(i === 0 || i === Math.floor(points.length / 2) || i === points.length - 1) && (
                    <text
                      x={p.x}
                      y={H + 20}
                      textAnchor="middle"
                      fontSize="11"
                      fill="currentColor"
                      opacity="0.5"
                    >
                      {p.label}
                    </text>
                  )}
                </g>
              ))}
            </svg>

            {/* Min/Max labels */}
            <div className="flex justify-between mt-1 px-2">
              <span className="text-[10px] text-muted-foreground">
                Min: {Utilities.currencyFormat(minVal, 'pt-BR', 'BRL')}
              </span>
              <span className="text-[10px] text-muted-foreground">
                Max: {Utilities.currencyFormat(maxVal, 'pt-BR', 'BRL')}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
