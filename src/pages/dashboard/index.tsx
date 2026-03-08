import { useEffect, useState } from 'react'
import { useAppDependencies } from '@/hooks/use-app-dependencies'
import { expenseStore } from '@/infra/store/expense-store'
import { analiticStore } from '@/infra/store/analitic-store'
import Utilities from '@/utils/Utilities'
import { useDateRange } from '@/contexts/DateRangeContext'
import moment from 'moment-timezone'
import { Analitic as AnaliticType } from '@/application/entity/analitic'

import TransactionList from './components/analitic/transaction-list'
import Analitic from './components/analitic/resume-analitic'
import Overview from './components/analitic/overview'
import ChartSpendingTrend from './components/charts/chart-spending-trend'
import ChartExpenseCategories from './components/charts/chart-expense-categories'

export interface MonthlyTotal {
  month: string
  year: number
  total: number
  isCurrent: boolean
}

export interface MonthlyDailyData {
  monthLabel: string   // e.g. "mar/26"
  fullLabel: string    // e.g. "Março 2026"
  isCurrent: boolean
  dailyTotals: number[] // index 0 = day 1, index 30 = day 31
  total: number
  daysInMonth: number
}

export default function Dashboard () {
  const { searchExpensesUsecase, expenseGateway } = useAppDependencies()
  const { expenses, storeSetExpenses } = expenseStore()
  const { storeSetAnalitic, storeSetRelevanceBalance } = analiticStore()
  const { iniDate, finDate } = useDateRange()
  const [previousMonthSpent, setPreviousMonthSpent] = useState(0)
  const [_, setMonthlyTotals] = useState<MonthlyTotal[]>([])
  const [monthlyDailyData, setMonthlyDailyData] = useState<MonthlyDailyData[]>([])
  const [previousMonthAnalitic, setPreviousMonthAnalitic] = useState<AnaliticType[]>([])

  useEffect(() => {
    async function fetchData () {
      if (!iniDate || !finDate) return

      // Fetch current month expenses
      const period = {
        iniDate: Utilities.utcDateToString(iniDate),
        finDate: Utilities.utcDateToString(finDate)
      }
      await searchExpensesUsecase.execute(period, storeSetExpenses, storeSetAnalitic, storeSetRelevanceBalance)

      // Fetch last 12 months in parallel
      moment.locale('pt-BR')
      const monthPromises: Promise<{ monthly: MonthlyTotal; daily: MonthlyDailyData; analitic: AnaliticType[] }>[] = []

      for (let i = 11; i >= 0; i--) {
        const mStart = moment.tz(iniDate, 'America/Sao_Paulo').subtract(i, 'months').startOf('month')
        const mEnd = moment.tz(iniDate, 'America/Sao_Paulo').subtract(i, 'months').endOf('month')
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
              const day = moment(exp.expenseDate).date()
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
    }
    fetchData()
  }, [iniDate, finDate])

  const totalSpent = expenses.reduce((acc, curr) => {
    const value = parseFloat(curr.expenseValue.replace(/[^\d,]/g, '').replace(',', '.'))
    return acc + (isNaN(value) ? 0 : value)
  }, 0)

  return (
    <div className='flex flex-col gap-4 py-4 px-1'>

      {/* Overview KPI row */}
      <Overview
        totalSpent={totalSpent}
        previousMonthSpent={previousMonthSpent}
        userName="Cassio Luis"
      />

      {/* Main content area */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left Column (Spans 2/3) — Charts & Transactions */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <ChartExpenseCategories expenses={expenses} />
          <ChartSpendingTrend monthlyDailyData={monthlyDailyData} />
          <TransactionList expenses={expenses} />
        </div>

        <div className="flex flex-col h-full relative">
          <div className="sticky top-5 flex-1">
            <Analitic previousMonthAnalitic={previousMonthAnalitic} />
          </div>
        </div>
      </div>
    </div>
  )
}
