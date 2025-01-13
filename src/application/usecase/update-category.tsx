import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'
import Utilities from '@/utils/Utilities'
import CategoryGateway from '@/infra/gateways/category-gateway'
import { CategoryStoreAction } from '@/infra/store/category-store'
import { CategoryPartial } from '../entity/category'

export default class UpdateCategory {

  constructor (
    private readonly categoryGateway: CategoryGateway,
    private readonly toaster: typeof toast
  ) { }

  async execute (categoryPayload: CategoryPartial, setStore: CategoryStoreAction['storeUpdateCategory']): Promise<void> {
    try {
      await this.categoryGateway.update(categoryPayload)
      setStore(categoryPayload)
    } catch (e: any) {
      this.toaster({
        variant: 'destructive',
        title: `UpdateCategory: ${e.message}`,
        description: Utilities.dateFormat(new Date(), 'dddd, D MMMM [de] YYYY [às] h:mm A'),
        action: (
          <ToastAction altText="Goto schedule to undo">Ok</ToastAction>
        )
      })
    }
  }
}