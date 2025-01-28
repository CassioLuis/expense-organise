import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { ptBR } from 'date-fns/locale/pt-BR'
import { RawExpenseSend } from '@/application/entity/expense'
import { columns } from '@/pages/expenses/components/data-table/columns'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import CustomInput from '@/components/custom-date-pucker-input'
import { useAppDependencies } from '@/hooks/use-app-dependencies'
import { expenseStore } from '@/infra/store/expense-store'
import Utilities from '@/utils/Utilities'

export default function Expenses () {
  const { saveExpenseUsecase, searchExpensesUsecase } = useAppDependencies()
  const { storeSetExpenses, expenses } = expenseStore()

  const expense: RawExpenseSend = {
    expenseDate: new Date(),
    description: 'Compras do Mês',
    category: '65b80f618adc2566b1a22ad8',
    expenseValue: Math.floor(Math.random() * 100) + 1,
    quota: 0,
    totalQuota: 0
  }

  async function addExpense () {
    await saveExpenseUsecase.execute(expense, storeSetExpenses)
  }

  const [startDate, setStartDate] = useState<Date | null>(new Date())
  const [endDate, setEndDate] = useState<Date | null>(new Date())

  let params = {
    iniDate: Utilities.newUtcDate(startDate!).firtDay,
    finDate: Utilities.newUtcDate(startDate!).lastDay
  }

  useEffect(() => {
    params = {
      iniDate: Utilities.newUtcDate(startDate!).firtDay,
      finDate: Utilities.newUtcDate(startDate!).lastDay
    }
  }, [startDate])

  const onChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  async function searchExpenses () {
    await searchExpensesUsecase.execute(params, storeSetExpenses)
  }

  return (
    <div className='container mx-auto space-y-2'>
      <div className='space-x-2'>
        <Button onClick={addExpense}>POST</Button>
        <Button onClick={searchExpenses}>GET</Button>
        <DatePicker
          customInput={<CustomInput />}
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={onChange}
          isClearable={true}
          locale={ptBR}
          dateFormat="dd/MM/yyyy"
          showPopperArrow={false}
          popperPlacement="bottom-start"
        />
      </div>
      <DataTable
        columns={columns}
        data={expenses}
      />
    </div>
  )
}
