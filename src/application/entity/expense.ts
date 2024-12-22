import Category from './category'

export default interface Expense {
  id?: string | undefined
  expenseDate: string
  description: string
  category: Category | undefined
  expenseValue: number
  creditCard?: boolean | undefined
  quota?: number | undefined
  totalQuota?: number | undefined
  creationDate: string
}