import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Expense } from '@/application/entity/expense'
import Utilities from '@/utils/Utilities'

interface ExpenseCategoriesProps {
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

export default function ExpenseCategories ({ expenses }: ExpenseCategoriesProps) {
  // Group by category and subcategory
  const categoryTotals: Record<string, number> = {}
  const subCategoryTotals: Record<string, number> = {}

  expenses.forEach(exp => {
    const cat = exp.getCategoryName() || 'Outros'
    // SubCategory is usually stored in the raw object or can be extracted.
    // If expense.category doesn't have subCategory directly available in the class getter, we use the raw object if possible,
    // or fallback to 'Indefinido'. Looking at the Category class, it has subCategory.
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

  // Reusable Donut Chart Component
  const size = 180
  const cx = size / 2
  const cy = size / 2
  const strokeWidth = 28
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  const DonutChart = ({ data, total, title }: { data: any[], total: number, title: string }) => {
    let currentOffset = 0

    return (
      <div className="flex flex-col flex-1 min-w-[300px]">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4 text-center">{title}</h3>
        {data.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm min-h-[180px]">
            Nenhum dado disponível.
          </div>
        ) : (
          <div className="flex flex-col xl:flex-row items-center gap-6">
            <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="transparent"
                  stroke="hsl(var(--muted))"
                  strokeWidth={strokeWidth}
                  strokeOpacity={0.2}
                />
                {data.map((slice) => {
                  const strokeLength = (slice.percentage / 100) * circumference
                  const dasharray = `${strokeLength} ${circumference}`
                  const offset = currentOffset
                  currentOffset -= strokeLength

                  return (
                    <circle
                      key={slice.label}
                      cx={cx}
                      cy={cy}
                      r={radius}
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth={strokeWidth}
                      strokeDasharray={dasharray}
                      strokeDashoffset={offset}
                      strokeLinecap={slice.percentage > 0 && slice.percentage < 100 ? 'round' : 'butt'}
                      className="transition-all duration-500 ease-out hover:stroke-[32px] cursor-pointer origin-center"
                    />
                  )
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Total</span>
                <span className="text-[13px] font-black text-foreground">
                  {Utilities.formatThousands(total)}
                </span>
              </div>
            </div>

            <div className="flex-1 w-full space-y-2.5 mt-2 xl:mt-0 xl:max-w-[180px]">
              {data.map((slice) => (
                <div key={slice.label} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors max-w-[80px]" title={slice.label}>
                      {slice.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                    <span className="text-xs text-muted-foreground w-7 text-right font-bold">
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

  return (
    <Card className="bg-card border-border/50 shadow-sm flex flex-col h-full lg:col-span-2 xl:col-span-1">
      <CardHeader className="pb-0 pt-5 px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold">Distribuição de Gastos</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-4 flex-1 flex flex-col justify-center">
        <div className="flex flex-col sm:flex-row flex-wrap gap-8 justify-between">
          <DonutChart data={categories.chartData} total={categories.total} title="Categorias Principais" />

          {/* Divider on desktop */}
          <div className="hidden sm:block w-px bg-border/50 self-stretch" />
          {/* Divider on mobile */}
          <div className="sm:hidden h-px w-full bg-border/50" />

          <DonutChart data={subcategories.chartData} total={subcategories.total} title="Subcategorias" />
        </div>
      </CardContent>
    </Card>
  )
}
