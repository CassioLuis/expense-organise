import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'
import Utilities from '@/utils/Utilities'
import CategoryGateway from '@/infra/gateways/category-gateway'
import { CategoryStoreAction } from '@/infra/store/category-store'
import { Category } from '../entity/category'

export default class SearchCategories {

  constructor (
    private readonly expenseGateway: CategoryGateway,
    private readonly toaster: typeof toast
  ) { }

  async execute (setState: CategoryStoreAction['storeSetCategory']): Promise<void> {
    try {
      const { data } = await this.expenseGateway.getAllByUser()
      const categoryList: Category[] = []
      data.forEach(item => {
        categoryList.push(new Category(
          item._id,
          item.name,
          item.subCategory
        ))
      })
      setState(categoryList)
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