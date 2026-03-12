import { GoalCard } from './goal-card'
import { useGoalStore } from '@/infra/store/goal-store'
import { useAppDependencies } from '@/hooks/use-app-dependencies'
// import Utilities from '@/utils/Utilities'
import { Goal } from '@/application/entity/goal'

export function GoalsGrid () {
  const { goals, storeUpdateGoal } = useGoalStore()
  const { upsertGoalUsecase } = useAppDependencies()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6 pb-24">
      {goals.map((goal) => {
        return (
          <GoalCard
            key={goal._id}
            goal={goal}
            onSave={(editedGoal: Goal) => upsertGoalUsecase.execute(editedGoal, storeUpdateGoal)}
          />
        )
      })}
    </div>
  )
}
