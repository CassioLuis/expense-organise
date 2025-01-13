import { Expense, RawExpenseSend } from '@/application/entity/expense'
import { create } from 'zustand'

interface State {
  expenses: Expense[]
}

export interface ExpenseStoreAction {
  storeSetExpenses: (expense: Expense[]) => void
  storeSaveExpense: (expense: Expense) => void
  storeRemoveExpense: (expense: Expense) => void
  storeUpdateExpense: (updatePayload: RawExpenseSend) => void
}

export const expenseStore = create<State & ExpenseStoreAction>((set) => ({
  expenses: [],
  storeSetExpenses: (expenses) => set({ expenses }),
  storeSaveExpense: (expense) => set((state) => ({ expenses: [expense, ...state.expenses] })),
  storeRemoveExpense: (expense) => set((state) => ({
    expenses: state.expenses.filter(item => item.getId() !== expense.getId())
  })),
  storeUpdateExpense: (updatePayload) =>
    set((state) => (
      {
        expenses: state.expenses.map((item) => {
          if (item.getId() !== updatePayload.id) return item
          return Object.assign(item, updatePayload)
        })
      }
    ))
}))
