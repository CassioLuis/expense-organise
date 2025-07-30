import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'
import Utilities from '@/utils/Utilities'
import CategoryGateway from '@/infra/gateways/category-gateway'
import { CategoryStoreAction } from '@/infra/store/category-store'
import { Category } from '../entity/category'

export default class SearchCategories {

  constructor (
    private readonly categoryGateway: CategoryGateway,
    private readonly toaster: typeof toast
  ) { }

  async execute (setStore: CategoryStoreAction['storeSetCategory']): Promise<void> {
    try {
      const { data } = await this.categoryGateway.getAllByUser()
      const categoryList: Category[] = []
      data.forEach(item => {
        if (item.name === 'Indefinido') return
        const { id, name, subCategory }: Category = {
          id: item._id,
          name: item.name,
          subCategory: item.subCategory
        }
        categoryList.push(new Category(id, name, subCategory))
      })
      setStore(categoryList)
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