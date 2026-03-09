import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Expense } from '@/application/entity/expense'
import Utilities from '@/utils/Utilities'

interface ChartExpenseCategoriesProps {
  expenses: Expense[]
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--muted-foreground))'
]

const size = 180
const cx = size / 2
const cy = size / 2
const strokeWidth = 28
const radius = (size - strokeWidth) / 2
const circumference = 2 * Math.PI * radius

const DonutChart = ({ data, total, title }: { data: any[], total: number, title: string }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <div className="flex flex-col flex-1 min-w-[300px]">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 text-center">{title}</h3>
      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm min-h-[180px]">
          Nenhum dado disponível.
        </div>
      ) : (
        <div className="flex flex-col xl:flex-row items-start gap-6">
          <div
            className="relative flex-shrink-0"
            style={{ width: size, height: size }}
          >
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="transform -rotate-90 overflow-visible"
            >
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth={strokeWidth}
                strokeOpacity={0.2}
                style={{ pointerEvents: 'none' }}
              />
              {data.map((slice, index) => {
                const strokeLength = (slice.percentage / 100) * circumference
                const dasharray = `${strokeLength} ${circumference}`

                // Calculate offset by summing previous lengths
                const offset = -data.slice(0, index).reduce((acc, s) => acc + (s.percentage / 100) * circumference, 0)

                return (
                  <circle
                    key={slice.label}
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill="none"
                    stroke={slice.color}
                    strokeWidth={activeIndex === index ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={dasharray}
                    strokeDashoffset={offset}
                    strokeLinecap="butt"
                    className="transition-all duration-300 ease-out cursor-pointer origin-center"
                    style={{ pointerEvents: 'stroke' }}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  />
                )
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Total</span>
              <span className="text-[13px] font-black text-foreground">
                {Utilities.currencyFormat(total, 'pt-BR', 'BRL')}
              </span>
            </div>
          </div>

          <div className="flex-1 w-full space-y-2.5 mt-2 xl:mt-0 xl:max-w-[180px]">
            {data.map((slice, index) => (
              <div
                key={slice.label}
                className={`flex items-center justify-between p-1.5 rounded-lg transition-all duration-200 ${activeIndex === index ? 'bg-primary/10 ring-1 ring-primary/20' : ''}`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 transition-transform duration-200 ${activeIndex === index ? 'scale-125' : ''}`}
                    style={{ backgroundColor: slice.color }}
                  />
                  <span
                    className={`text-xs truncate transition-colors duration-200 max-w-[80px] ${activeIndex === index ? 'font-bold text-primary' : 'font-medium text-foreground'}`}
                    title={slice.label}
                  >
                    {slice.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  <span className={`text-xs w-7 text-right transition-colors duration-200 ${activeIndex === index ? 'font-black text-primary' : 'font-bold text-muted-foreground'}`}>
                    {slice.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ChartExpenseCategories ({ expenses }: ChartExpenseCategoriesProps) {
  // Group by category and subcategory
  const categoryTotals: Record<string, number> = {}
  const subCategoryTotals: Record<string, number> = {}

  expenses.forEach(exp => {
    const cat = exp.getCategoryName() || 'Outros'
    const subCat = exp.category?.subCategory || 'Indefinido'

    const value = parseFloat(exp.expenseValue.replace(/[^\d,]/g, '').replace(',', '.'))
    if (!isNaN(value)) {
      categoryTotals[cat] = (categoryTotals[cat] || 0) + value
      subCategoryTotals[subCat] = (subCategoryTotals[subCat] || 0) + value
    }
  })

  // Helper function to process data for the donut chart
  const processData = (totals: Record<string, number>) => {
    const total = Object.values(totals).reduce((a, b) => a + b, 0)

    const sortedData = Object.entries(totals)
      .filter(([_, val]) => val > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5) // Top 5

    const top5Total = sortedData.reduce((acc, [_, val]) => acc + val, 0)
    if (total > top5Total) {
      sortedData.push(['Outros', total - top5Total])
    }

    const chartData = sortedData.map(([label, value], i) => ({
      label,
      value,
      percentage: total > 0 ? (value / total) * 100 : 0,
      color: COLORS[i % COLORS.length]
    }))

    return { total, chartData }
  }

  const categories = processData(categoryTotals)
  const subcategories = processData(subCategoryTotals)

  return (
    <Card className="bg-card border-border/50 shadow-sm flex flex-col lg:col-span-2 xl:col-span-1">
      <CardHeader className="pb-0 pt-5 px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold">Distribuição de Gastos</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-4 flex-1 flex flex-col justify-center min-h-[250px]">
        <div className="flex flex-col sm:flex-row flex-wrap gap-8 justify-between">
          <DonutChart
            data={categories.chartData}
            total={categories.total}
            title=""
          />

          {/* Divider on desktop */}
          <div className="hidden sm:block w-px bg-border/50 self-stretch" />
          {/* Divider on mobile */}
          <div className="sm:hidden h-px w-full bg-border/50" />

          <DonutChart
            data={subcategories.chartData}
            total={subcategories.total}
            title=""
          />
        </div>
      </CardContent>
    </Card>
  )
}
