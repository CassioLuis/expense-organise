import { useEffect, useState } from 'react'
import { useAppDependencies } from '@/hooks/use-app-dependencies'
import { expenseStore } from '@/infra/store/expense-store'
import { analiticStore } from '@/infra/store/analitic-store'
import { userStore } from '@/infra/store/user-store'
import { useGoalStore } from '@/infra/store/goal-store'
import Utilities from '@/utils/Utilities'
import { useDateRange } from '@/contexts/DateRangeContext'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)
import { Analitic as AnaliticType } from '@/application/entity/analitic'

import TransactionList from './components/analitic/transaction-list'
import Analitic from './components/analitic/resume-analitic'
import AnaliticCards from './components/analitic/analitic-cards'
import ChartSpendingTrend from './components/charts/chart-spending-trend'
import ChartMonthlyBars from './components/charts/chart-monthly-bars'
import ChartExpenseCategories from './components/charts/chart-expense-categories'
import { Skeleton } from '@/components/ui/skeleton'

export interface MonthlyTotal {
  month: string
  year: number
  total: number
  isCurrent: boolean
}

export interface MonthlyDailyData {
  monthLabel: string // e.g. "mar/26"
  fullLabel: string // e.g. "Março 2026"
  isCurrent: boolean
  dailyTotals: number[] // index 0 = day 1, index 30 = day 31
  total: number
  daysInMonth: number
}

export default function Dashboard () {
  const { searchExpensesUsecase, expenseGateway, searchGoalUsecase } = useAppDependencies()
  const { expenses, storeSetExpenses } = expenseStore()
  const { storeSetAnalitic, storeSetRelevanceBalance } = analiticStore()
  const { name, lastName } = userStore()
  const { totalGoals, storeSetGoals } = useGoalStore()
  const { iniDate, finDate } = useDateRange()
  const [previousMonthSpent, setPreviousMonthSpent] = useState(0)
  const [_, setMonthlyTotals] = useState<MonthlyTotal[]>([])
  const [monthlyDailyData, setMonthlyDailyData] = useState<MonthlyDailyData[]>([])
  const [previousMonthAnalitic, setPreviousMonthAnalitic] = useState<AnaliticType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData () {
      if (!iniDate || !finDate) return
      setIsLoading(true)
      searchGoalUsecase.execute(storeSetGoals)

      // Fetch current month expenses
      const period = {
        iniDate: Utilities.utcDateToString(iniDate),
        finDate: Utilities.utcDateToString(finDate)
      }
      await searchExpensesUsecase.execute(period, storeSetExpenses, storeSetAnalitic, storeSetRelevanceBalance)

      // Fetch last 12 months in parallel
      dayjs.locale('pt-br')
      const monthPromises: Promise<{ monthly: MonthlyTotal; daily: MonthlyDailyData; analitic: AnaliticType[] }>[] = []

      for (let i = 11; i >= 0; i--) {
        const mStart = dayjs(iniDate).tz('America/Sao_Paulo').subtract(i, 'months').startOf('month')
        const mEnd = dayjs(iniDate).tz('America/Sao_Paulo').subtract(i, 'months').endOf('month')
        const monthLabel = mStart.format('MMM')
        const monthShort = mStart.format('MMM/YY')
        const fullLabel = mStart.format('MMMM YYYY')
        const yearLabel = mStart.year()
        const isCurrent = i === 0
        const daysInMonth = mEnd.date()

        const p = expenseGateway.getByDateInterval({
          iniDate: Utilities.utcDateToString(mStart.toDate()),
          finDate: Utilities.utcDateToString(mEnd.toDate())
        }).then(({ data }) => {
          const dailyTotals = new Array(daysInMonth).fill(0)
          let total = 0

          data.expenses.forEach((exp: any) => {
            const value = typeof exp.expenseValue === 'number' ? exp.expenseValue : parseFloat(String(exp.expenseValue))
            if (!isNaN(value)) {
              total += value
              const day = dayjs(exp.expenseDate).date()
              if (day >= 1 && day <= daysInMonth) {
                dailyTotals[day - 1] += value
              }
            }
          })

          const analiticData = data.analitic.map((item: any) => ({ ...item, bg: '' }))

          return {
            monthly: { month: monthLabel, year: yearLabel, total, isCurrent },
            daily: { monthLabel: monthShort, fullLabel, isCurrent, dailyTotals, total, daysInMonth },
            analitic: analiticData
          }
        }).catch(() => ({
          monthly: { month: monthLabel, year: yearLabel, total: 0, isCurrent },
          daily: { monthLabel: monthShort, fullLabel, isCurrent, dailyTotals: new Array(daysInMonth).fill(0), total: 0, daysInMonth },
          analitic: [] as AnaliticType[]
        }))

        monthPromises.push(p)
      }

      const results = await Promise.all(monthPromises)
      setMonthlyTotals(results.map(r => r.monthly))
      setMonthlyDailyData(results.map(r => r.daily))

      // Set previous month from results
      const prevMonth = results[results.length - 2]
      setPreviousMonthSpent(prevMonth?.monthly.total ?? 0)
      setPreviousMonthAnalitic(prevMonth?.analitic ?? [])
      setIsLoading(false)
    }
    fetchData()
  }, [iniDate, finDate])

  const totalSpent = expenses.reduce((acc, curr) => {
    const value = parseFloat(curr.expenseValue.replace(/[^\d,]/g, '').replace(',', '.'))
    return acc + (isNaN(value) ? 0 : value)
  }, 0)

  const userName = name ? `${name} ${lastName}` : 'Usuário'
  const isOptimal = (totalSpent - previousMonthSpent) <= 0

  return (
    <div className='flex flex-col gap-4 py-4 px-1'>

      {/* Welcome header - ALWAYS VISIBLE */}
      <div className="pt-2 mb-2">
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Bem-vindo de volta, <span className="text-primary font-semibold">{userName}</span>!
          {isOptimal
            ? ' Sua saúde financeira está melhorando.'
            : ' Aqui está o que está acontecendo hoje.'}
        </p>
      </div>

      {isLoading ? (
        <>
          {/* Skeleton for AnaliticCards */}
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-40 w-full rounded-xl bg-card border border-border/50 shadow-sm"
              />
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <Skeleton className="h-[300px] w-full rounded-xl bg-card border border-border/50 shadow-sm" />
              <Skeleton className="h-[300px] w-full rounded-xl bg-card border border-border/50 shadow-sm" />
              <Skeleton className="h-[400px] w-full rounded-xl bg-card border border-border/50 shadow-sm" />
            </div>
            <div className="flex flex-col h-full relative">
              <div className="sticky top-5 flex-1">
                <Skeleton className="h-[600px] w-full rounded-xl bg-card border border-border/50 shadow-sm" />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Main content area */}
          <AnaliticCards
            totalSpent={totalSpent}
            previousMonthSpent={previousMonthSpent}
          />

          <div className="grid gap-4 lg:grid-cols-3">
            {/* Left Column (Spans 2/3) — Charts & Transactions */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <ChartExpenseCategories expenses={expenses} />
              <ChartMonthlyBars
                monthlyDailyData={monthlyDailyData}
                spendingGoal={totalGoals}
              />
              <ChartSpendingTrend monthlyDailyData={monthlyDailyData} />
              <TransactionList expenses={expenses} />
            </div>

            <div className="flex flex-col h-full relative">
              <div className="sticky top-5 flex-1">
                <Analitic previousMonthAnalitic={previousMonthAnalitic} />
              </div>
            </div>
          </div>
        </>
      )}
    </div >
  )
}
