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
import { CalendarDays } from 'lucide-react'
import { useDateRange } from '@/contexts/DateRangeContext'

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/despesas': 'Lançamento',
  '/categorias': 'Categorias'
}

export default function MainLayout () {
  const location = useLocation()
  const pageTitle = pageTitles[location.pathname] ?? location.pathname.replace(/\//g, '')
  const { iniDate, finDate, setStartDate, setEndDate } = useDateRange()

  function onChange (dates: [Date | null, Date | null]) {
    const [start, end] = dates
    if (start) {
      // Ensure start date is at the beginning of the month
      const startOfMonth = new Date(start.getFullYear(), start.getMonth(), 1, 0, 0, 0, 0)
      setStartDate(startOfMonth)
    }
    if (end) {
      // Set end date to the last millisecond of the selected month
      const endOfMonth = new Date(end.getFullYear(), end.getMonth() + 1, 0, 23, 59, 59, 999)
      setEndDate(endOfMonth)
    } else {
      setEndDate(null)
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
              <div className='flex items-center gap-2 bg-muted/50 border border-border/50 px-3 py-1.5 rounded-lg shadow-sm'>
                <CalendarDays className='w-3.5 h-3.5 text-primary flex-shrink-0' />
                <DatePicker
                  customInput={<CustomInput />}
                  selectsRange={true}
                  startDate={iniDate}
                  endDate={finDate}
                  onChange={onChange}
                  locale={ptBR}
                  dateFormat="MMMM yyyy"
                  showMonthYearPicker
                  showPopperArrow={false}
                  popperPlacement="bottom-end"
                />
              </div>
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
