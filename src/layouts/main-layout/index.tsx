import { useRef, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar'
import { Outlet, useLocation } from 'react-router'
import { ChangeTheme } from './components/change-theme'
import { AppSidebar } from './components/app-sidebar'
import DatePicker from 'react-datepicker'
import { ptBR } from 'date-fns/locale/pt-BR'
import CustomInput from '@/components/custom-date-picker-input'
import { CalendarDays, Upload, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useDateRange } from '@/contexts/DateRangeContext'
import { useAppDependencies } from '@/hooks/use-app-dependencies'
import { expenseStore } from '@/infra/store/expense-store'
import { analiticStore } from '@/infra/store/analitic-store'
import Utilities from '@/utils/Utilities'

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/despesas': 'Lançamento',
  '/categorias': 'Categorias'
}

export default function MainLayout () {
  const location = useLocation()
  const pageTitle = pageTitles[location.pathname] ?? location.pathname.replace(/\//g, '')
  const { iniDate, setStartDate, setEndDate } = useDateRange()
  const { importCsvUsecase } = useAppDependencies()
  const { storeSetExpenses } = expenseStore()
  const { storeSetAnalitic, storeSetRelevanceBalance } = analiticStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isImporting, setIsImporting] = useState(false)

  function setMonth (date: Date) {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0)
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
    setStartDate(startOfMonth)
    setEndDate(endOfMonth)
  }

  function goToPreviousMonth () {
    const current = iniDate ?? new Date()
    const prev = new Date(current.getFullYear(), current.getMonth() - 1, 1)
    setMonth(prev)
  }

  function goToNextMonth () {
    const current = iniDate ?? new Date()
    const next = new Date(current.getFullYear(), current.getMonth() + 1, 1)
    setMonth(next)
  }

  function onPickerChange (date: Date | null) {
    if (date) setMonth(date)
  }

  async function handleFileChange (e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      const dateRange = {
        iniDate: Utilities.utcDateToString(iniDate ?? Utilities.currentFirstDay()),
        finDate: Utilities.utcDateToString(Utilities.currentLastDay())
      }
      await importCsvUsecase.execute(file, storeSetExpenses, storeSetAnalitic, storeSetRelevanceBalance, dateRange)
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar className="rounded-r-xl" />
      <SidebarInset className="md:rounded-tl-xl overflow-hidden bg-background">
        <header
          className="flex justify-between h-14 shrink-0 items-center gap-2 px-4 border-b border-border/40 bg-background transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 select-none"
        >
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
            <Separator
              orientation="vertical"
              className="mr-1 h-4 opacity-40"
            />
            <div>
              <h2 className="text-sm font-semibold text-foreground capitalize">{pageTitle}</h2>
            </div>
          </div>
          <div className='flex gap-4 items-center'>
            {location.pathname === '/' && (
              <>
                <div className='flex items-center gap-1 bg-muted/50 border border-border/50 px-1.5 py-1 rounded-lg shadow-sm'>
                  <button
                    onClick={goToPreviousMonth}
                    className='p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground'
                    title='Mês anterior'
                  >
                    <ChevronLeft className='w-4 h-4' />
                  </button>
                  <div className='flex items-center gap-1.5 px-1'>
                    <CalendarDays className='w-3.5 h-3.5 text-primary flex-shrink-0' />
                    <DatePicker
                      customInput={<CustomInput />}
                      selected={iniDate}
                      onChange={onPickerChange}
                      locale={ptBR}
                      dateFormat="MMM. yyyy"
                      showMonthYearPicker
                      showPopperArrow={false}
                      popperPlacement="bottom"
                      portalId="datepicker-portal"
                    />
                  </div>
                  <button
                    onClick={goToNextMonth}
                    className='p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground'
                    title='Próximo mês'
                  >
                    <ChevronRight className='w-4 h-4' />
                  </button>
                </div>
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
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded-lg border border-border/50 shadow-sm text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed h-[34px]"
                  title="Importar extrato CSV"
                >
                  {isImporting ? (
                    <Loader2 className='w-3.5 h-3.5 animate-spin' />
                  ) : (
                    <Upload className='w-3.5 h-3.5' />
                  )}
                  {isImporting ? 'Importando...' : 'Importar CSV'}
                </button>
              </>
            )}
            <ChangeTheme />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 break-words overflow-auto max-h-[calc(98svh-3.5rem)]">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
