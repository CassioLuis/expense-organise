import { ReactNode, useEffect } from 'react'
import { useAppDependencies } from './hooks/use-app-dependencies'
import { categoryStore } from './infra/store/category-store'
import { expenseStore } from './infra/store/expense-store'

export default function FetchData (): ReactNode {
  const { searchExpensesUsecase, searchCategoriesUsecase } = useAppDependencies()
  const { storeSetExpenses, expenses } = expenseStore()
  const { storeSetCategory, categories } = categoryStore()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = []
        if (!expenses.length) {
          promises.push(searchExpensesUsecase.execute(storeSetExpenses))
        }
        if (!categories.length) {
          promises.push(searchCategoriesUsecase.execute(storeSetCategory))
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