import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Utilities from '@/utils/Utilities'
import { MonthlyDailyData } from '../../index'

interface ChartMonthlyBarsProps {
  monthlyDailyData: MonthlyDailyData[]
  spendingGoal: number
}

const MONTH_COLORS = [
  'hsl(220 15% 55%)',
  'hsl(220 15% 55%)',
  'hsl(220 18% 55%)',
  'hsl(220 18% 55%)',
  'hsl(220 20% 58%)',
  'hsl(220 20% 58%)',
  'hsl(200 25% 55%)',
  'hsl(200 30% 55%)',
  'hsl(180 35% 50%)',
  'hsl(160 40% 50%)',
  'hsl(145 60% 45%)',
  'hsl(145 85% 45%)'
]

export default function ChartMonthlyBars ({ monthlyDailyData, spendingGoal }: ChartMonthlyBarsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [hoveredGoalIndex, setHoveredGoalIndex] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  if (monthlyDailyData.length === 0) {
    return (
      <Card className="bg-card border-border/50 shadow-sm">
        <CardHeader className="pb-2 pt-5 px-6">
          <CardTitle className="text-base font-bold">Gastos Mensais</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-5">
          <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
            Carregando dados...
          </div>
        </CardContent>
      </Card>
    )
  }

  const data = monthlyDailyData.map((md, idx) => ({
    label: md.monthLabel,
    total: md.total,
    isCurrent: md.isCurrent,
    color: MONTH_COLORS[idx] || 'hsl(220 10% 50%)'
  }))

  const maxVal = Math.max(...data.map(d => d.total), spendingGoal, 1) * 1.1

  const W = 700
  const H = 220
  const PAD_X = 40
  const PAD_Y = 20
  const PAD_BOTTOM = 40
  const innerW = W - PAD_X * 2
  const innerH = H - PAD_Y - PAD_BOTTOM

  const barWidth = (innerW / data.length) * 0.8
  const barGap = (innerW / data.length) * 0.2

  return (
    <Card className="bg-card border-border/50 shadow-sm flex flex-col">
      <CardHeader className="pb-2 pt-5 px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold">Gastos Mensais</CardTitle>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-0.5 bg-foreground/40" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Meta</span>
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              Comparativo • 12 meses
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-3 flex-1 flex flex-col">
        <div className="relative flex-1 w-full min-h-[250px]">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H + 10}`}
            className="absolute inset-0 w-full h-full overflow-visible touch-none"
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
                      x={PAD_X - 6}
                      y={yPos + 3}
                      textAnchor="end"
                      fontSize="10"
                      fontWeight="500"
                      fill="currentColor"
                      opacity="0.45"
                    >
                      {gridValue === 0
                        ? 'R$ 0'
                        : `R$ ${(gridValue / 1000).toFixed(0)}k`}
                    </text>
                  )}
                </g>
              )
            })}

            {/* Bars */}
            {data.map((d, i) => {
              const x = PAD_X + i * (barWidth + barGap) + barGap / 2
              const totalHeight = (d.total / maxVal) * innerH
              const goalHeight = (spendingGoal / maxVal) * innerH

              const baseHeight = Math.min(totalHeight, goalHeight)
              const overflowHeight = Math.max(0, totalHeight - goalHeight)

              const baseY = PAD_Y + innerH - baseHeight
              const overflowY = baseY - overflowHeight
              const goalY = PAD_Y + innerH - goalHeight

              return (
                <g key={i}>
                  {/* Base Bar (within or equal to goal) */}
                  <rect
                    x={x}
                    y={baseY}
                    width={barWidth}
                    height={baseHeight}
                    fill={d.color}
                    rx={overflowHeight > 0 ? "0" : "4"}
                    fillOpacity={hoveredIndex === i ? 1 : 0.8}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="transition-all duration-200 cursor-pointer"
                  />

                  {/* Overflow Bar (exceeding goal) */}
                  {overflowHeight > 0 && (
                    <rect
                      x={x}
                      y={overflowY}
                      width={barWidth}
                      height={overflowHeight}
                      fill="hsl(var(--destructive))"
                      rx="4"
                      fillOpacity={hoveredIndex === i ? 1 : 0.8}
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="transition-all duration-200 cursor-pointer"
                    />
                  )}

                  {/* Goal Tick */}
                  <line
                    x1={x - 2}
                    y1={goalY}
                    x2={x + barWidth + 2}
                    y2={goalY}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeOpacity={hoveredGoalIndex === i ? 0.8 : 0.4}
                    className="pointer-events-none transition-all duration-200"
                  />

                  {/* Goal Interaction Area (Invisible) */}
                  <rect
                    x={x - 5}
                    y={goalY - 10}
                    width={barWidth + 10}
                    height={20}
                    fill="transparent"
                    onMouseEnter={() => setHoveredGoalIndex(i)}
                    onMouseLeave={() => setHoveredGoalIndex(null)}
                    className="cursor-help"
                  />

                  {/* X-axis labels */}
                  <text
                    x={x + barWidth / 2}
                    y={H - 8}
                    textAnchor="middle"
                    fontSize="10"
                    fill="currentColor"
                    opacity={hoveredIndex === i ? 1 : 0.4}
                    className="capitalize transition-opacity"
                  >
                    {d.label}
                  </text>
                </g>
              )
            })}
          </svg>

          {/* Tooltip */}
          {hoveredIndex !== null && hoveredGoalIndex === null && (
            <div
              className="absolute pointer-events-none top-0 z-10 w-44 bg-card border border-border shadow-lg rounded-md p-3 text-sm transition-all duration-75"
              style={{
                left: `${((PAD_X + hoveredIndex * (barWidth + barGap) + barWidth / 2) / W) * 100}%`,
                transform: hoveredIndex > data.length / 2 ? 'translateX(-110%)' : 'translateX(10%)'
              }}
            >
              <div className="font-bold border-b border-border pb-1 mb-2 capitalize">
                {monthlyDailyData[hoveredIndex].fullLabel}
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: data[hoveredIndex].color }}
                  />
                  <span className="text-xs text-muted-foreground">Total Gasto</span>
                </div>
                <div className="text-lg font-bold">
                  {Utilities.currencyFormat(data[hoveredIndex].total, 'pt-BR', 'BRL')}
                </div>
              </div>
            </div>
          )}

          {/* Goal Tooltip */}
          {hoveredGoalIndex !== null && (
            <div
              className="absolute pointer-events-none z-20 w-44 bg-card border border-primary/20 shadow-lg rounded-md p-3 text-sm transition-all duration-75"
              style={{
                left: `${((PAD_X + hoveredGoalIndex * (barWidth + barGap) + barWidth / 2) / W) * 100}%`,
                top: `${((PAD_Y + innerH - (spendingGoal / maxVal) * innerH) / (H + 10)) * 100}%`,
                transform: hoveredGoalIndex > data.length / 2 ? 'translate(-110%, -50%)' : 'translate(10%, -50%)'
              }}
            >
              <div className="font-bold text-primary mb-1 text-[11px] uppercase tracking-wider text-center">Meta de Gastos</div>
              <div className="text-lg font-bold text-center">
                {Utilities.currencyFormat(spendingGoal, 'pt-BR', 'BRL')}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
