import { Expense, RawExpense } from '@/application/entity/expense'

export default class ExpenseList {
  private expenses: Expense[] = []

  setExpenses (expense: RawExpense) {
    this.expenses.push(
      new Expense(
        expense.expenseDate,
        expense.description,
        expense.category,
        expense.expenseValue,
        expense.quota,
        expense.totalQuota,
        expense.creditCard,
        expense._id
      )
    )
  }

  getExpenses (): any[] {
    return this.expenses
  }
}
