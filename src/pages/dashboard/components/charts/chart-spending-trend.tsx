import { useState, useRef, MouseEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Utilities from '@/utils/Utilities'
import { MonthlyDailyData } from '../../index'

interface ChartSpendingTrendProps {
  monthlyDailyData: MonthlyDailyData[]
}

// Color palette for months (oldest → newest)
const MONTH_COLORS = [
  'hsl(220 15% 55%)', // very muted
  'hsl(220 15% 55%)',
  'hsl(220 18% 55%)',
  'hsl(220 18% 55%)',
  'hsl(220 20% 58%)',
  'hsl(220 20% 58%)',
  'hsl(200 25% 55%)',
  'hsl(200 30% 55%)',
  'hsl(180 35% 50%)',
  'hsl(160 40% 50%)',
  'hsl(145 60% 45%)', // previous month - more visible
  'hsl(145 85% 45%)' // current month - most prominent
]

export default function ChartSpendingTrend ({ monthlyDailyData }: ChartSpendingTrendProps) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

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
    let lastActiveDay = 0

    for (let d = 0; d < md.daysInMonth; d++) {
      acc += md.dailyTotals[d]
      cumulative.push(acc)
      if (md.dailyTotals[d] > 0) {
        lastActiveDay = d + 1
      }
    }

    // If there is no activity at all (but the month is current), set it to draw at least day 1
    if (lastActiveDay === 0) lastActiveDay = 1

    // For past months, draw the full month regardless if they stopped spending on day 20
    if (!md.isCurrent) {
      lastActiveDay = md.daysInMonth
    }

    return {
      ...md,
      cumulative,
      lastActiveDay,
      color: MONTH_COLORS[monthIdx] || 'hsl(220 10% 50%)',
      opacity: md.isCurrent ? 1 : monthIdx >= 9 ? 0.6 : monthIdx >= 6 ? 0.3 : 0.15,
      strokeWidth: md.isCurrent ? 2.5 : monthIdx === monthlyDailyData.length - 2 ? 1.8 : 1
    }
  })

  // Filter out months with zero total (no data)
  const activeLines = monthLines.filter(m => m.total > 0 || m.isCurrent)

  // Max value across all cumulative data, bumped by 15% for visual padding at the top
  const maxVal = Math.max(...activeLines.flatMap(m => m.cumulative), 1) * 1.15
  const maxDays = 31

  const W = 700
  const H = 220
  const PAD_X = 40
  const PAD_Y = 20
  const PAD_BOTTOM = 40
  const innerW = W - PAD_X * 2
  const innerH = H - PAD_Y - PAD_BOTTOM

  function getPoints (cumulative: number[], limitDay: number) {
    return cumulative.slice(0, limitDay).map((val, i) => ({
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

  // Day labels on x-axis: all days with movement in the current month
  // If no movement, fallback or default sparse labels
  let dayLabels: number[] = []
  if (currentMonth) {
    currentMonth.dailyTotals.forEach((val, idx) => {
      if (val > 0) dayLabels.push(idx + 1)
    })
  }
  // If no days with movement (or empty selection), default to the old ones
  if (dayLabels.length === 0) {
    dayLabels = [1, 5, 10, 15, 20, 25, 31]
  }

  const currentPoints = currentMonth ? getPoints(currentMonth.cumulative, currentMonth.lastActiveDay) : []
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

  const handleMouseMove = (e: MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const scaleX = W / rect.width
    const svgX = x * scaleX

    const dayFloat = ((svgX - PAD_X) / innerW) * (maxDays - 1) + 1
    let day = Math.round(dayFloat)
    if (day < 1) day = 1
    if (day > maxDays) day = maxDays
    setHoveredDay(day)
  }

  const handleMouseLeave = () => {
    setHoveredDay(null)
  }

  const tooltipXPercentage = hoveredDay
    ? ((PAD_X + ((hoveredDay - 1) / (maxDays - 1)) * innerW) / W) * 100
    : 0

  const tooltipData = hoveredDay ? activeLines
    .map(m => {
      const dayIdx = hoveredDay - 1
      if (dayIdx >= m.daysInMonth) return null
      return {
        label: m.monthLabel,
        color: m.color,
        dailyVal: m.dailyTotals[dayIdx],
        cumulativeVal: m.cumulative[dayIdx],
        isCurrent: m.isCurrent
      }
    })
    .filter(Boolean) as { label: string, color: string, dailyVal: number, cumulativeVal: number, isCurrent: boolean }[] : []

  // Reverse so newest month is displayed on top
  const displayTooltipData = [...tooltipData].reverse()

  return (
    <Card className="bg-card border-border/50 shadow-sm flex flex-col">
      <CardHeader className="pb-2 pt-5 px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold">Tendência de Gastos</CardTitle>
          <span className="text-xs text-muted-foreground font-medium">
            Acumulado por dia • 12 meses
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-3 flex-1 flex flex-col">
        <div className="relative flex-1 w-full min-h-[250px]">
          <svg
            ref={svgRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
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
              <linearGradient
                id="currentMonthGrad"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="hsl(145 85% 45%)"
                  stopOpacity="0.2"
                />
                <stop
                  offset="100%"
                  stopColor="hsl(145 85% 45%)"
                  stopOpacity="0.02"
                />
              </linearGradient>
            </defs>

            {/* Current month area fill (behind all lines) */}
            {currentAreaPath && (
              <path
                d={currentAreaPath}
                fill="url(#currentMonthGrad)"
              />
            )}

            {/* All month lines (oldest first = drawn behind) */}
            {activeLines.map((month, idx) => {
              const pts = getPoints(month.cumulative, month.lastActiveDay)
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

            {/* Hovered Day Vertical Line & Dots */}
            {hoveredDay && (
              <>
                <line
                  x1={PAD_X + ((hoveredDay - 1) / (maxDays - 1)) * innerW}
                  y1={PAD_Y}
                  x2={PAD_X + ((hoveredDay - 1) / (maxDays - 1)) * innerW}
                  y2={PAD_Y + innerH}
                  stroke="currentColor"
                  strokeOpacity="0.4"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="pointer-events-none transition-all duration-75"
                />
                {displayTooltipData.map((d, i) => {
                  const x = PAD_X + ((hoveredDay - 1) / (maxDays - 1)) * innerW
                  const y = PAD_Y + innerH - (d.cumulativeVal / maxVal) * innerH
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r={d.isCurrent ? '5' : '3.5'}
                      fill={d.color}
                      stroke="hsl(var(--card))"
                      strokeWidth="2"
                      className="pointer-events-none transition-all duration-75"
                    />
                  )
                })}
              </>
            )}

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

          {/* Hover Tooltip Overlay container is part of absolute parent */}
          {hoveredDay && displayTooltipData.length > 0 && (
            <div
              className="absolute pointer-events-none top-0 z-10 w-44 bg-card border border-border shadow-lg rounded-md p-3 text-sm transition-all duration-75"
              style={{
                left: `calc(${tooltipXPercentage}% + 10px)`,
                transform: tooltipXPercentage > 50 ? 'translateX(calc(-100% - 20px))' : 'none'
              }}
            >
              <div className="font-bold border-b border-border pb-2 mb-2 text-[13px]">Dia {hoveredDay}</div>
              <div className="flex flex-col gap-2 overflow-hidden pr-1">
                {displayTooltipData.map((d, i) => (
                  <div
                    key={i}
                    className="flex flex-col"
                  >
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: d.color }}
                      />
                      <span className={`text-xs ${d.isCurrent ? 'font-bold' : 'text-muted-foreground'} capitalize`}>{d.label}</span>
                    </div>
                    <div className="pl-4 flex flex-col mt-0.5">
                      <span className="text-xs font-semibold leading-none flex justify-between">
                        <span className="text-[10px] text-muted-foreground font-normal">Dia</span>
                        {Utilities.currencyFormat(d.dailyVal, 'pt-BR', 'BRL')}
                      </span>
                      <span className="text-[10px] text-muted-foreground leading-none mt-1 flex justify-between">
                        <span className="font-normal">Acúm</span>
                        {Utilities.currencyFormat(d.cumulativeVal, 'pt-BR', 'BRL')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Legend showing months with data */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 px-2 justify-end">
          {activeLines.filter(m => m.total > 0).slice(-4).map((month, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5"
            >
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
      </CardContent>
    </Card>
  )
}
