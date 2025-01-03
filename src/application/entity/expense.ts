import Utilities from '@/utils/Utilities'

export class RawExpense {
  _id?: string
  expenseDate: string
  description: string
  category: string
  expenseValue: number
  creditCard?: boolean
  quota: number
  totalQuota: number

  constructor (
    expenseDate: string,
    description: string,
    category: string,
    expenseValue: number,
    quota: number,
    totalQuota: number,
    creditCard?: boolean
  ) {
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
  private expenseDate: string
  private description: string
  private category: string
  private expenseValue: string
  private quota: string
  private totalQuota: number
  private creditCard?: boolean
  private id?: string

  constructor (
    expenseDate: string,
    description: string,
    category: string,
    expenseValue: number,
    quota: number,
    totalQuota: number,
    creditCard?: boolean,
    id?: string
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

  getId () {
    return this.id
  }

  getCreditCard () {
    return this.creditCard
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
