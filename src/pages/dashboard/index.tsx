import { useEffect } from 'react'
import { useAppDependencies } from '@/hooks/use-app-dependencies'
import { expenseStore } from '@/infra/store/expense-store'
import { analiticStore } from '@/infra/store/analitic-store'
import Utilities from '@/utils/Utilities'
import { useDateRange } from '@/contexts/DateRangeContext'

import Overview from './components/overview'
import SpendingTrend from './components/spending-trend'
import ExpenseCategories from './components/expense-categories'
import TransactionList from './components/transaction-list'
import Analitic from './components/analitic'

export default function Dashboard () {
  const { searchExpensesUsecase } = useAppDependencies()
  const { expenses, storeSetExpenses } = expenseStore()
  const { storeSetAnalitic, storeSetRelevanceBalance } = analiticStore()
  const { iniDate, finDate } = useDateRange()

  useEffect(() => {
    async function searchExpenses () {
      if (!iniDate || !finDate) return

      const period = {
        iniDate: Utilities.utcDateToString(iniDate),
        finDate: Utilities.utcDateToString(finDate)
      }
      await searchExpensesUsecase.execute(period, storeSetExpenses, storeSetAnalitic, storeSetRelevanceBalance)
    }
    searchExpenses()
  }, [iniDate, finDate])

  const totalSpent = expenses.reduce((acc, curr) => {
    const value = parseFloat(curr.expenseValue.replace(/[^\d,]/g, '').replace(',', '.'))
    return acc + (isNaN(value) ? 0 : value)
  }, 0)

  return (
    <div className='flex flex-col gap-5 py-4 px-1'>

      {/* Overview KPI row */}
      <Overview
        totalSpent={totalSpent}
        previousMonthSpent={totalSpent * 0.9}
        userName="Cassio Luis"
      />

      {/* Main content area */}
      <div className="flex flex-col gap-5">
        {/* Top Row: Charts */}
        <div className="grid gap-5 lg:grid-cols-2">
          <SpendingTrend expenses={expenses} />
          <ExpenseCategories expenses={expenses} />
        </div>

        {/* Bottom Row: Transactions & Analytics */}
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2 h-full">
            <TransactionList expenses={expenses} />
          </div>
          <div className="h-full">
            <Analitic />
          </div>
        </div>
      </div>
    </div>
  )
}
