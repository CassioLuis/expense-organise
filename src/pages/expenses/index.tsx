import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { ptBR } from 'date-fns/locale/pt-BR'
import { columns } from '@/pages/expenses/components/data-table/columns'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import CustomInput from '@/components/custom-date-picker-input'
import { useAppDependencies } from '@/hooks/use-app-dependencies'
import { expenseStore } from '@/infra/store/expense-store'
import Utilities from '@/utils/Utilities'
import { analiticStore } from '@/infra/store/analitic-store'
import AddExpense from './components/add-expense'
import { RawExpenseSend } from '@/application/entity/expense'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Filter, List } from 'lucide-react'

export default function Expenses () {
  const { saveExpenseUsecase, searchExpensesUsecase } = useAppDependencies()
  const { storeSetExpenses, expenses } = expenseStore()
  const { storeSetAnalitic, storeSetRelevanceBalance } = analiticStore()

  const expense: RawExpenseSend = {
    expenseDate: new Date(),
    description: 'Compras do Mês',
    category: '65b80f618adc2566b1a22ad8',
    expenseValue: Math.floor(Math.random() * 100) + 1,
    quota: 0,
    totalQuota: 2
  }

  async function addExpense () {
    await saveExpenseUsecase.execute(expense, storeSetExpenses, storeSetAnalitic, storeSetRelevanceBalance)
  }

  const [iniDate, setStartDate] = useState<Date>(new Date())
  const [finDate, setEndDate] = useState<Date>(new Date())
  const [shouldFetch, setShouldFetch] = useState<boolean>(false)

  const period = {
    iniDate: Utilities.utcDateToString(iniDate),
    finDate: Utilities.utcDateToString(finDate)
  }

  useEffect(() => {
    if (!shouldFetch) return
    async function searchExpenses () {
      await searchExpensesUsecase.execute(period, storeSetExpenses, storeSetAnalitic, storeSetRelevanceBalance)
    }
    searchExpenses()
  }, [iniDate, finDate])

  function onChange (dates: any) {
    const [start, end] = dates
    setStartDate(start)
    handleSetEndDate(end)
    setShouldFetch(true)
  }

  function handleSetEndDate (endDate: Date) {
    if (endDate) {
      endDate.setHours(23, 59, 59, 999)
    }
    setEndDate(endDate)
  }

  return (
    <div className='flex flex-col gap-5 py-4 px-1'>
      <Card className="bg-card border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3 pb-3 pt-5 px-6">
          <div className="p-2.5 rounded-xl bg-primary/15 text-primary">
            <Filter className="w-4 h-4" />
          </div>
          <CardTitle className="text-base font-bold">Filtros e Ações</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className='flex flex-wrap items-center gap-4'>
            <div className="flex items-center gap-2">
              <Button
                variant='outline'
                onClick={addExpense}
                className="hover:bg-primary/10 hover:text-primary transition-colors border-border/50"
              >
                POST
              </Button>
              <AddExpense />
            </div>

            <div className='flex items-center gap-2 bg-muted/30 border border-border/50 px-3 py-1 pb-1.5 rounded-lg shadow-sm'>
              <DatePicker
                customInput={<CustomInput />}
                selectsRange={true}
                startDate={iniDate}
                endDate={finDate}
                onChange={onChange}
                isClearable={true}
                locale={ptBR}
                dateFormat="dd/MM/yyyy"
                showPopperArrow={false}
                popperPlacement="bottom-start"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3 pb-3 pt-5 px-6">
          <div className="p-2.5 rounded-xl bg-primary/15 text-primary">
            <List className="w-4 h-4" />
          </div>
          <CardTitle className="text-base font-bold">Lista de Lançamentos</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <DataTable
            columns={columns}
            data={expenses}
          />
        </CardContent>
      </Card>
    </div>
  )
}
