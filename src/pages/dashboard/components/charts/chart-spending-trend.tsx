import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Utilities from '@/utils/Utilities'
import { MonthlyDailyData } from '../../index'

interface ChartSpendingTrendProps {
  monthlyDailyData: MonthlyDailyData[]
}

// Color palette for months (oldest → newest)
const MONTH_COLORS = [
  'hsl(220 15% 55%)',  // very muted
  'hsl(220 15% 55%)',
  'hsl(220 18% 55%)',
  'hsl(220 18% 55%)',
  'hsl(220 20% 58%)',
  'hsl(220 20% 58%)',
  'hsl(200 25% 55%)',
  'hsl(200 30% 55%)',
  'hsl(180 35% 50%)',
  'hsl(160 40% 50%)',
  'hsl(145 60% 45%)',  // previous month - more visible
  'hsl(145 85% 45%)',  // current month - most prominent
]

export default function ChartSpendingTrend ({ monthlyDailyData }: ChartSpendingTrendProps) {
  if (monthlyDailyData.length === 0) {
    return (
      <Card className="bg-card border-border/50 shadow-sm">
        <CardHeader className="pb-2 pt-5 px-6">
          <CardTitle className="text-base font-bold">Tendência de Gastos</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-5">
          <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
            Carregando dados...
          </div>
        </CardContent>
      </Card>
    )
  }

  // Build cumulative daily data for each month
  const monthLines = monthlyDailyData.map((md, monthIdx) => {
    const cumulative: number[] = []
    let acc = 0
    for (let d = 0; d < md.daysInMonth; d++) {
      acc += md.dailyTotals[d]
      cumulative.push(acc)
    }
    return {
      ...md,
      cumulative,
      color: MONTH_COLORS[monthIdx] || 'hsl(220 10% 50%)',
      opacity: md.isCurrent ? 1 : monthIdx >= 9 ? 0.6 : monthIdx >= 6 ? 0.3 : 0.15,
      strokeWidth: md.isCurrent ? 2.5 : monthIdx === monthlyDailyData.length - 2 ? 1.8 : 1
    }
  })

  // Filter out months with zero total (no data)
  const activeLines = monthLines.filter(m => m.total > 0 || m.isCurrent)

  // Max value across all cumulative data
  const maxVal = Math.max(...activeLines.flatMap(m => m.cumulative), 1)
  const maxDays = 31

  const W = 700
  const H = 220
  const PAD_X = 16
  const PAD_Y = 20
  const PAD_BOTTOM = 40
  const innerW = W - PAD_X * 2
  const innerH = H - PAD_Y - PAD_BOTTOM

  function getPoints (cumulative: number[], daysInMonth: number) {
    return cumulative.map((val, i) => ({
      x: PAD_X + (i / (maxDays - 1)) * innerW,
      y: PAD_Y + innerH - (val / maxVal) * innerH,
      day: i + 1,
      value: val
    }))
  }

  function buildSmoothPath (pts: { x: number; y: number }[]) {
    if (pts.length < 2) return ''
    return pts.map((p, i) => {
      if (i === 0) return `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
      const prev = pts[i - 1]
      const cpx = (prev.x + p.x) / 2
      return `C ${cpx.toFixed(1)} ${prev.y.toFixed(1)}, ${cpx.toFixed(1)} ${p.y.toFixed(1)}, ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
    }).join(' ')
  }

  // Current month for gradient area
  const currentMonth = activeLines.find(m => m.isCurrent)
  const currentPoints = currentMonth ? getPoints(currentMonth.cumulative, currentMonth.daysInMonth) : []
  const currentAreaPath = currentPoints.length > 1
    ? [
      `M ${currentPoints[0].x.toFixed(1)} ${(PAD_Y + innerH).toFixed(1)}`,
      `L ${currentPoints[0].x.toFixed(1)} ${currentPoints[0].y.toFixed(1)}`,
      ...currentPoints.slice(1).map((p, i) => {
        const prev = currentPoints[i]
        const cpx = (prev.x + p.x) / 2
        return `C ${cpx.toFixed(1)} ${prev.y.toFixed(1)}, ${cpx.toFixed(1)} ${p.y.toFixed(1)}, ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
      }),
      `L ${currentPoints[currentPoints.length - 1].x.toFixed(1)} ${(PAD_Y + innerH).toFixed(1)}`,
      'Z'
    ].join(' ')
    : ''

  // Day labels on x-axis
  const dayLabels = [1, 5, 10, 15, 20, 25, 31]

  return (
    <Card className="bg-card border-border/50 shadow-sm">
      <CardHeader className="pb-2 pt-5 px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold">Tendência de Gastos</CardTitle>
          <span className="text-xs text-muted-foreground font-medium">
            Acumulado por dia • 12 meses
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-3">
        <div className="relative">
          <svg
            viewBox={`0 0 ${W} ${H + 10}`}
            className="w-full overflow-visible"
            preserveAspectRatio="none"
          >

            {/* Horizontal grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
              const yPos = PAD_Y + innerH * t
              const gridValue = maxVal - t * maxVal
              return (
                <g key={`h-${i}`}>
                  <line
                    x1={PAD_X}
                    y1={yPos}
                    x2={W - PAD_X}
                    y2={yPos}
                    stroke="currentColor"
                    strokeOpacity="0.06"
                    strokeWidth="1"
                  />
                  {i % 2 === 0 && (
                    <text
                      x={PAD_X - 2}
                      y={yPos - 4}
                      textAnchor="start"
                      fontSize="9"
                      fill="currentColor"
                      opacity="0.35"
                    >
                      {Utilities.formatThousands(gridValue)}
                    </text>
                  )}
                </g>
              )
            })}

            {/* Vertical grid lines at key days */}
            {dayLabels.map(day => {
              const x = PAD_X + ((day - 1) / (maxDays - 1)) * innerW
              return (
                <line
                  key={`v-${day}`}
                  x1={x}
                  y1={PAD_Y}
                  x2={x}
                  y2={PAD_Y + innerH}
                  stroke="currentColor"
                  strokeOpacity="0.04"
                  strokeWidth="1"
                />
              )
            })}

            {/* Gradient definition for current month */}
            <defs>
              <linearGradient id="currentMonthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(145 85% 45%)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="hsl(145 85% 45%)" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Current month area fill (behind all lines) */}
            {currentAreaPath && (
              <path d={currentAreaPath} fill="url(#currentMonthGrad)" />
            )}

            {/* All month lines (oldest first = drawn behind) */}
            {activeLines.map((month, idx) => {
              const pts = getPoints(month.cumulative, month.daysInMonth)
              const path = buildSmoothPath(pts)
              const lastPoint = pts[pts.length - 1]

              return (
                <g key={idx}>
                  <path
                    d={path}
                    fill="none"
                    stroke={month.color}
                    strokeWidth={month.strokeWidth}
                    strokeOpacity={month.opacity}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* End-of-line label */}
                  {lastPoint && month.total > 0 && (
                    <text
                      x={lastPoint.x + 4}
                      y={lastPoint.y + 3}
                      fontSize={month.isCurrent ? '10' : '8'}
                      fontWeight={month.isCurrent ? 'bold' : 'normal'}
                      fill={month.color}
                      opacity={month.isCurrent ? 1 : Math.max(month.opacity, 0.5)}
                    >
                      {month.monthLabel}
                    </text>
                  )}
                  {/* Current month endpoint dot */}
                  {month.isCurrent && lastPoint && (
                    <circle
                      cx={lastPoint.x}
                      cy={lastPoint.y}
                      r="4"
                      fill={month.color}
                      stroke="hsl(var(--card))"
                      strokeWidth="2"
                    />
                  )}
                </g>
              )
            })}

            {/* X-axis day labels */}
            {dayLabels.map(day => {
              const x = PAD_X + ((day - 1) / (maxDays - 1)) * innerW
              return (
                <text
                  key={`d-${day}`}
                  x={x}
                  y={H - 8}
                  textAnchor="middle"
                  fontSize="10"
                  fill="currentColor"
                  opacity="0.4"
                >
                  {day}
                </text>
              )
            })}
          </svg>

          {/* Legend showing months with data */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 px-2 justify-end">
            {activeLines.filter(m => m.total > 0).slice(-4).map((month, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-0.5 rounded-full"
                  style={{ backgroundColor: month.color, opacity: month.opacity }}
                />
                <span className="text-[10px] text-muted-foreground capitalize">
                  {month.monthLabel} — {Utilities.currencyFormat(month.total, 'pt-BR', 'BRL')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
