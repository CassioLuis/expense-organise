import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'
import { ExpenseGateway } from '@/infra/gateways'
import Utilities from '@/utils/Utilities'
import { RawExpenseSend } from '@/application/entity/expense'
import { ExpenseStoreAction } from '@/infra/store/expense-store'
import SearchExpenses from './search-expenses-usecase'
import { AnaliticStoreAction } from '@/infra/store/analitic-store'

export default class SaveExpense {

  constructor (
    private readonly expenseGateway: ExpenseGateway,
    private readonly searchExpensesUsecase: SearchExpenses,
    private readonly toaster: typeof toast
  ) { }

  async execute (
    payload: RawExpenseSend,
    setStore: ExpenseStoreAction['storeSetExpenses'],
    setAnaliticStore: AnaliticStoreAction['storeSetAnalitic'],
    setRelevance: AnaliticStoreAction['storeSetRelevanceBalance']
  ): Promise<void> {
    const period = {
      iniDate: Utilities.utcDateToString(Utilities.currentFirstDay()),
      finDate: Utilities.utcDateToString(Utilities.currentLastDay())
    }
    let hasError = false
    try {
      if (payload.totalQuota! > 1) {
        await this.hasQuotaExecute(payload)
        return this.searchExpensesUsecase.execute(period, setStore, setAnaliticStore, setRelevance)
      }
      await this.expenseGateway.save(payload)
      await this.searchExpensesUsecase.execute(period, setStore, setAnaliticStore, setRelevance)
    } catch (e: any) {
      hasError = true
      this.toaster({
        variant: 'destructive',
        title: e.message,
        description: Utilities.dateFormat(new Date(), 'dddd, D MMMM [de] YYYY [às] h:mm A'),
        action: (
          <ToastAction altText="Goto schedule to undo">Ok</ToastAction>
        )
      })
    } finally {
      if (!hasError) {
        this.toaster({
          variant: 'default',
          title: 'Criado!',
          description: Utilities.dateFormat(new Date(), 'dddd, D MMMM [de] YYYY [às] h:mm A'),
          action: (
            <ToastAction altText="Goto schedule to undo">Ok</ToastAction>
          )
        })
      }
    }
  }

  private async hasQuotaExecute (payload: RawExpenseSend): Promise<void> {
    const generateNextQuotas = Array.from({ length: payload.totalQuota! }, (_, idx) => {
      const quota = idx + 1
      if (idx !== 0) {
        const expenseDate = Utilities.creteNextQuotas(payload.expenseDate!, idx)
        return { ...payload, expenseDate, quota }
      }
      return { ...payload, quota }
    })
    await Promise.all(generateNextQuotas.map(async (item) => this.expenseGateway.save(item)))
  }
}
