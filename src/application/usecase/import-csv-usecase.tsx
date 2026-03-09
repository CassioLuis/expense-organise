import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'
import ExpenseGateway from '@/infra/gateways/expense-gateway'
import { ImportCsvResult } from '@/infra/gateways/expense-gateway'
import { ExpenseStoreAction } from '@/infra/store/expense-store'
import SearchExpenses from './search-expenses-usecase'
import { AnaliticStoreAction } from '@/infra/store/analitic-store'

export default class ImportCsv {

  constructor (
    private readonly expenseGateway: ExpenseGateway,
    private readonly searchExpensesUsecase: SearchExpenses,
    private readonly toaster: typeof toast
  ) { }

  async execute (
    file: File,
    setStore: ExpenseStoreAction['storeSetExpenses'],
    setAnaliticStore: AnaliticStoreAction['storeSetAnalitic'],
    setRelevance: AnaliticStoreAction['storeSetRelevanceBalance'],
    dateRange: { iniDate: string; finDate: string }
  ): Promise<ImportCsvResult | null> {
    try {
      const result = await this.expenseGateway.importCsv(file)

      const messages: string[] = []
      if (result.imported > 0) messages.push(`${result.imported} importadas`)
      if (result.duplicates.count > 0) messages.push(`${result.duplicates.count} duplicadas`)
      if (result.skipped.count > 0) messages.push(`${result.skipped.count} ignoradas`)

      this.toaster({
        variant: 'default',
        title: '✅ Importação concluída!',
        description: messages.join(' · '),
        action: (
          <ToastAction altText="Ok">Ok</ToastAction>
        )
      })

      // Refresh dashboard data
      await this.searchExpensesUsecase.execute(dateRange, setStore, setAnaliticStore, setRelevance)

      return result
    } catch (e: any) {
      this.toaster({
        variant: 'destructive',
        title: 'Erro na importação',
        description: e.message || 'Falha ao importar CSV',
        action: (
          <ToastAction altText="Ok">Ok</ToastAction>
        )
      })
      return null
    }
  }
}
