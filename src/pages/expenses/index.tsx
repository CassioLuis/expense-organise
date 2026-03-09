import { useEffect, useState, useRef } from 'react'
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
import { Filter, List, Upload, Loader2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function Expenses () {
  const { saveExpenseUsecase, searchExpensesUsecase, importCsvUsecase } = useAppDependencies()
  const { storeSetExpenses, expenses } = expenseStore()
  const { storeSetAnalitic, storeSetRelevanceBalance } = analiticStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isImporting, setIsImporting] = useState(false)

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
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const period = {
    iniDate: Utilities.utcDateToString(iniDate),
    finDate: Utilities.utcDateToString(finDate)
  }

  async function handleFileChange (e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      await importCsvUsecase.execute(file, storeSetExpenses, storeSetAnalitic, storeSetRelevanceBalance, period)
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  useEffect(() => {
    if (!shouldFetch) return
    async function searchExpenses () {
      setIsLoading(true)
      try {
        await searchExpensesUsecase.execute(period, storeSetExpenses, storeSetAnalitic, storeSetRelevanceBalance)
      } finally {
        setIsLoading(false)
      }
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

            <div className="flex items-center gap-2 ml-auto">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg border border-border/50 shadow-sm text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                title="Importar extrato CSV"
              >
                {isImporting ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Upload className='w-4 h-4' />
                )}
                {isImporting ? 'Importando...' : 'Importar CSV'}
              </button>
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
          {isLoading ? (
            <div className="space-y-4 animate-in fade-in duration-500">
              {/* Fake header */}
              <div className="flex items-center justify-between gap-4 py-4 border-b border-border/10">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-12" />
              </div>
              {/* Fake rows */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-3">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              ))}
            </div>
          ) : (
            <div className="animate-in fade-in duration-700">
              <DataTable
                columns={columns}
                data={expenses}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
