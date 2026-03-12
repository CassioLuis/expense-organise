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
  storeUpdateGoal: (goal: Goal) => void
  refreshTotalGoals: () => void
}

export const useGoalStore = create<GoalState & GoalStoreAction>((set, get) => ({
  goals: [],
  totalGoals: 0,
  isLoading: false,
  error: null,

  storeSetGoals: (goals) => {
    set({ goals })
    get().refreshTotalGoals()
  },
  storeSetLoading: (isLoading) => set({ isLoading }),
  storeSetError: (error) => set({ error }),
  storeUpdateGoal: (goal: Goal) => {
    const goals = get().goals.map(g => {
      if (g._id === goal._id && g.amount !== goal.amount) {
        return goal
      }
      return g
    })
    set({ goals })
    get().refreshTotalGoals()
  },
  refreshTotalGoals: () => {
    const goals = get().goals
    const totalGoals = goals.reduce((acc, g) => acc + (g.amount || 0), 0)
    set({ totalGoals })
  }
}))
