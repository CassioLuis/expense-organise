import { GoalCard } from './goal-card'
import { useGoalStore } from '@/infra/store/goal-store'

import { categoryStore } from '@/infra/store/category-store'

// Helper function to hash a string to a determinisc HEX color
const stringToColor = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += ('00' + value.toString(16)).substr(-2)
  }
  return color
}

export function GoalsGrid () {
  const { goals, setGoalAmount, saveGoals } = useGoalStore()

  const categories = categoryStore((state) => state.categories)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6 pb-24">
      {categories.map((cat, idx) => {
        // Find existing goal or default to 0
        const existing = goals.find(g => g.categoryName === cat.name)
        const currentAmount = existing ? existing.amount : 0
        const maxAllocable = 5000 // A default max value that could be enhanced later

        return (
          <GoalCard
            key={idx}
            color={stringToColor(cat.name)}
            title={cat.name}
            maxAllocable={maxAllocable}
            currentAmount={currentAmount}
            onChange={(val) => setGoalAmount(cat.name, val)}
            onSave={saveGoals}
          />
        )
      })}
    </div>
  )
}
