import { ReactNode, useEffect } from 'react'
import { useAppDependencies } from './hooks/use-app-dependencies'
import { categoryStore } from './infra/store/category-store'
import { expenseStore } from './infra/store/expense-store'
import Utilities from './utils/Utilities'
import { analiticStore } from './infra/store/analitic-store'
import { useGoalStore } from './infra/store/goal-store'

export default function FetchData (): ReactNode {
  const { searchExpensesUsecase, searchCategoriesUsecase, searchGoalUsecase } = useAppDependencies()
  const { storeSetExpenses, expenses } = expenseStore()
  const { storeSetCategory, categories } = categoryStore()
  const { storeSetAnalitic, storeSetRelevanceBalance } = analiticStore()
  const { goals: storedGoals, storeSetGoals } = useGoalStore()


  useEffect(() => {
    const period = {
      iniDate: Utilities.utcDateToString(Utilities.currentFirstDay()),
      finDate: Utilities.utcDateToString(Utilities.currentLastDay())
    }
    async function fetchData () {
      try {
        const promises = []
        if (!expenses.length) {
          promises.push(searchExpensesUsecase.execute(period, storeSetExpenses, storeSetAnalitic, storeSetRelevanceBalance))
        }
        if (!categories.length) {
          promises.push(searchCategoriesUsecase.execute(storeSetCategory))
        }
        if (!storedGoals.length) {
          promises.push(searchGoalUsecase.execute(storeSetGoals))
        }
        await Promise.all(promises)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  return false
}