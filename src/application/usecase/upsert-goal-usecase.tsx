import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'
import Utilities from '@/utils/Utilities'
import GoalGateway from '@/infra/gateways/goal-gateway'
import { GoalStoreAction } from '@/infra/store/goal-store'
import { Goal } from '@/application/entity/goal'

export default class UpsertGoal {
  constructor (
    private readonly goalGateway: GoalGateway,
    private readonly toaster: typeof toast
  ) { }

  async execute (goals: Goal[], setStore: GoalStoreAction['storeSetGoals']): Promise<void> {
    try {
      const mapped = goals.map(g => ({ categoryName: g.categoryName, amount: g.amount }))
      const { data } = await this.goalGateway.upsertGoals(mapped)
      setStore(data)
    } catch (e: any) {
      this.toaster({
        variant: 'destructive',
        title: e.message,
        description: Utilities.dateFormat(new Date(), 'dddd, D MMMM [de] YYYY [às] h:mm A'),
        action: (
          <ToastAction altText="Ok">Ok</ToastAction>
        )
      })
    }
  }
}
