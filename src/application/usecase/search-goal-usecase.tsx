import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'
import Utilities from '@/utils/Utilities'
import GoalGateway from '@/infra/gateways/goal-gateway'
import { GoalStoreAction } from '@/infra/store/goal-store'

export default class SearchGoal {
  constructor(
    private readonly goalGateway: GoalGateway,
    private readonly toaster: typeof toast
  ) { }

  async execute (setStore: GoalStoreAction['storeSetGoals']): Promise<void> {
    try {
      const { data } = await this.goalGateway.getAllGoals()
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
