import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'
import Utilities from '@/utils/Utilities'
import CategoryGateway from '@/infra/gateways/category-gateway'
import { Category, CategoryPartial } from '../entity/category'
import { CategoryStoreAction } from '@/infra/store/category-store'
import SearchCategories from './search-category-usecase'

export default class SaveCategory {

  constructor (
    private readonly categoryGateway: CategoryGateway,
    private readonly SearchCategoriesUsecase: SearchCategories,
    private readonly toaster: typeof toast
  ) { }

  async execute (payload: CategoryPartial, setStore: CategoryStoreAction['storeSetCategory']): Promise<void> {
    try {
      await this.categoryGateway.save(payload as Category)
      await this.SearchCategoriesUsecase.execute(setStore)
    } catch (e: any) {
      this.toaster({
        variant: 'destructive',
        title: e.message,
        description: Utilities.dateFormat(new Date(), 'dddd, D MMMM [de] YYYY [às] h:mm A'),
        action: (
          <ToastAction altText="Goto schedule to undo">Ok</ToastAction>
        )
      })
    }
  }
}
