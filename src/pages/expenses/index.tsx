import { RawExpenseSend } from '@/application/entity/expense'
import { DataTable } from '@/components/data-table'
import { columns } from '@/pages/expenses/components/data-table/columns'
import { Button } from '@/components/ui/button'
import { useAppDependencies } from '@/hooks/use-app-dependencies'
import { expenseStore } from '@/infra/store/expense-store'
import { ExpenseForm } from './components/expense-form'
import { DatePickerTeste } from './components/expense-form copy'

export default function Expenses () {
  const { saveExpenseUsecase } = useAppDependencies()
  const { storeSetExpenses, expenses } = expenseStore()

  const expense: RawExpenseSend = {
    expenseDate: new Date(),
    description: 'Supermercado',
    category: '65b80f618adc2566b1a22ad8',
    expenseValue: Math.floor(Math.random() * 100) + 1,
    quota: 0,
    totalQuota: 0
  }

  async function addExpense () {
    await saveExpenseUsecase.execute(expense, storeSetExpenses)
  }

  return (
    <div className='container mx-auto space-y-2'>
      <div className='space-x-2'>
        <Button onClick={addExpense}>POST</Button>
        <ExpenseForm />
        <DatePickerTeste />
      </div>
      <DataTable
        columns={columns}
        data={expenses}
      />
    </div>
  )
}
