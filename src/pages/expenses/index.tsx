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

  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date())

  async function addExpense () {
    await saveExpenseUsecase.execute(expense, storeSetExpenses, storeSetAnalitic, storeSetRelevanceBalance)
  }

  let params = {
    iniDate: Utilities.newUtcDate(startDate!).firtDay,
    finDate: Utilities.newUtcDate(endDate!).lastDay
  }

  useEffect(() => {
    params = {
      iniDate: Utilities.newUtcDate(startDate || new Date()).firtDay,
      finDate: Utilities.newUtcDate(endDate || new Date()).lastDay
    }
    async function searchExpenses () {
      await searchExpensesUsecase.execute(params, storeSetExpenses, storeSetAnalitic, storeSetRelevanceBalance)
    }
    searchExpenses()
  }, [endDate])

  const onChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }


  return (
    <div className='container mx-auto space-y-2'>
      <div className='space-x-2 flex items-center'>
        <Button
          variant='outline'
          onClick={addExpense}
        >POST</Button>
        {/* <Button
          variant='outline'
          onClick={searchExpenses}
        >GET</Button> */}
        <AddExpense />
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
