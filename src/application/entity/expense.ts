import Utilities from '@/utils/Utilities'
import { Category } from './category'

export class RawExpense {
  _id: string
  expenseDate: string
  description: string
  category: Category | string
  expenseValue: number
  creditCard: boolean
  quota: number
  totalQuota: number

  constructor (
    id: string,
    expenseDate: string,
    description: string,
    category: Category | string,
    expenseValue: number,
    quota: number,
    totalQuota: number,
    creditCard: boolean
  ) {
    this._id = id
    this.expenseDate = expenseDate
    this.description = description
    this.category = category
    this.expenseValue = expenseValue
    this.creditCard = creditCard
    this.quota = quota
    this.totalQuota = totalQuota
  }
}

export class Expense {
  private id: string
  private expenseDate: string
  private description: string
  private category: Category | string
  private expenseValue: string
  private quota: string
  private totalQuota: number
  private creditCard: boolean

  constructor (
    id: string,
    expenseDate: string,
    description: string,
    category: Category | string,
    expenseValue: number,
    quota: number,
    totalQuota: number,
    creditCard: boolean
  ) {
    this.id = id
    this.expenseDate = Utilities.dateFormat(expenseDate, 'DD MMM.').toUpperCase()
    this.description = description
    this.category = category
    this.expenseValue = Utilities.currencyFormat(expenseValue, 'pt-BR', 'BRL')
    this.creditCard = creditCard
    this.quota = totalQuota ? `${quota}/${totalQuota}` : '-'
    this.totalQuota = totalQuota
  }

  getId (): string {
    return this.id
  }

  getCreditCard () {
    return this.creditCard
  }

  getExpenseValue () {
    return this.expenseValue
  }

  getQuota () {
    return this.quota
  }

  getCategory () {
    return this.category
  }

  getCategoryId (): string {
    if (typeof this.category === 'string') {
      return this.category
    }
    return this.category.id
  }

  getExpense () {
    return {
      id: this.id,
      expenseDate: this.expenseDate,
      description: this.description,
      category: this.category,
      expenseValue: this.expenseValue,
      creditCard: this.creditCard,
      quota: this.quota,
      totalQuota: this.totalQuota
    }
  }
}

interface ExpenseAdditionalContract {
  getId?: Expense['getId']
  id: Expense['id']
  creditCard?: Expense['creditCard']
}

export type ExpensePartial = Partial<Expense> & ExpenseAdditionalContract

export type RawExpensePartial = Partial<RawExpense>
