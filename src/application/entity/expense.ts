import Utilities from '@/utils/Utilities'
import { Category } from './category'

type OmitProps = 'category' | 'expenseValue' | 'quota' | 'expenseDate'

export type RawExpenseSend = Partial<Omit<Expense, OmitProps> & {
  category: string | Category,
  expenseValue: number,
  quota: number,
  expenseDate: Date,
}>

export class Expense {
  public readonly id: string
  public readonly expenseDate: string
  public readonly description: string
  public readonly category: Category
  public readonly expenseValue: string
  public readonly quota: string
  public readonly totalQuota: number
  public readonly creditCard: boolean

  constructor (
    id: string,
    expenseDate: Date,
    description: string,
    category: Category,
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

  getCategoryName (): string {
    if (typeof this.category === 'string') {
      return this.category
    }
    return this.category.name
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

export type ExpensePartial = Partial<Expense>
// & {
//   getId?: Expense['getId']
//   id: Expense['id']
//   creditCard?: Expense['creditCard'],
//   category?: Expense['category']
// }
