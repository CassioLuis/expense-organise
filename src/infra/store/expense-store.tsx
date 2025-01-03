import { Expense } from '@/application/entity/expense'
import { create } from 'zustand'

interface State {
  expenses: Expense[]
}

export interface ExpenseStoreAction {
  setExpenses: (expense: Expense[]) => void
  saveExpense: (expense: Expense) => void
  removeExpense: (expense: Expense) => void
}

export const expenseStore = create<State & ExpenseStoreAction>((set) => ({
  expenses: [],
  setExpenses: (expenses) => set({ expenses }),
  saveExpense: (expense) => set((state) => (
    {
      expenses: [expense, ...state.expenses]
    }
  )),
  removeExpense: (expense) => set((state) => (
    {
      expenses: state.expenses.filter(item => item.getId() !== expense.getId())
    }
  ))
}))
