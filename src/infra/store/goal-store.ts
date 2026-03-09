import { create } from 'zustand'
import { Goal } from '@/application/entity/goal'
import { goalGateway } from '../gateways/goal-gateway'

interface GoalState {
  goals: Goal[]
  isLoading: boolean
  error: string | null
  fetchGoals: () => Promise<void>
  setGoalAmount: (categoryName: string, amount: number) => void
  saveGoals: () => Promise<void>
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  isLoading: false,
  error: null,

  fetchGoals: async () => {
    set({ isLoading: true, error: null })
    try {
      const fetched = await goalGateway.getAllGoals()
      set({ goals: fetched })
    } catch (err: any) {
      set({ error: err.message || 'Erro ao carregar metas' })
    } finally {
      set({ isLoading: false })
    }
  },

  setGoalAmount: (categoryName, amount) => {
    const goals = get().goals
    const index = goals.findIndex(g => g.categoryName === categoryName)

    if (index >= 0) {
      const newGoals = [...goals]
      newGoals[index] = { ...newGoals[index], amount }
      set({ goals: newGoals })
    } else {
      set({ goals: [...goals, { categoryName, amount, user: '' }] })
    }
  },

  saveGoals: async () => {
    const { goals } = get()
    set({ error: null })
    try {
      const mapped = goals.map(g => ({ categoryName: g.categoryName, amount: g.amount }))
      const updated = await goalGateway.upsertGoals(mapped)
      set({ goals: updated })
    } catch (err: any) {
      set({ error: err.message || 'Erro ao salvar metas' })
      throw err // For UI handling
    }
  }
}))
