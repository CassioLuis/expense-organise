import { create } from 'zustand'
import { Goal } from '@/application/entity/goal'

interface GoalState {
  goals: Goal[]
  totalGoals: number
  isLoading: boolean
  error: string | null
}

export interface GoalStoreAction {
  storeSetGoals: (goals: Goal[]) => void
  storeSetLoading: (loading: boolean) => void
  storeSetError: (error: string | null) => void
  storeUpdateGoal: (categoryName: string, amount: number) => void
}

export const useGoalStore = create<GoalState & GoalStoreAction>((set, get) => ({
  goals: [],
  totalGoals: 0,
  isLoading: false,
  error: null,

  storeSetGoals: (goals) => {
    const totalGoals = goals.reduce((acc, g) => acc + (g.amount || 0), 0)
    set({ goals, totalGoals })
  },
  storeSetLoading: (isLoading) => set({ isLoading }),
  storeSetError: (error) => set({ error }),
  storeUpdateGoal: (categoryName, amount) => {
    const goals = get().goals
    const index = goals.findIndex(g => g.categoryName === categoryName)

    let newGoals: Goal[] = []
    if (index >= 0) {
      newGoals = [...goals]
      newGoals[index] = { ...newGoals[index], amount }
    } else {
      newGoals = [...goals, { categoryName, amount, user: '' }]
    }

    const totalGoals = newGoals.reduce((acc, g) => acc + (g.amount || 0), 0)
    set({ goals: newGoals, totalGoals })
  }
}))
