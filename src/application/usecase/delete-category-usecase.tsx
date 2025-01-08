import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'
import Utilities from '@/utils/Utilities'
import CategoryGateway from '@/infra/gateways/category-gateway'
import { Category } from '../entity/category'
import { CategoryStoreAction } from '@/infra/store/category-store'

export default class DeleteCategory {

  constructor (
    private readonly categoryGateway: CategoryGateway,
    private readonly toaster: typeof toast
  ) { }

  async execute (category: Category, setState: CategoryStoreAction['storeRemoveCategory']): Promise<void> {
    try {
      await this.categoryGateway.delete(category.id)
      setState(category)
    } catch (e: any) {
      this.toaster({
        variant: 'destructive',
        title: `DeleteExpense: ${e.message}`,
        description: Utilities.dateFormat(new Date(), 'dddd, D MMMM [de] YYYY [às] h:mm A'),
        action: (
          <ToastAction altText="Goto schedule to undo">Ok</ToastAction>
        )
      })
    }
  }
}