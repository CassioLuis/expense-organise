import { ColumnDef } from '@tanstack/react-table'
import { Expense } from '@/application/entity/expense'
import { DeleteExpense } from './actions/delete-expense'
import { ChangeCreditCard } from './actions/change-credit-card'

export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: 'expenseDate',
    header: 'Data'
  },
  {
    accessorKey: 'description',
    header: 'Descrição'
  },
  {
    accessorKey: 'category',
    header: () => <div className="text-center">Categoria</div>,
    cell: ({ row }) => <div className='text-center'>{row.original.getCategoryId()}</div>
  },
  {
    accessorKey: 'creditCard',
    header: () => <div className="text-center">Cartão</div>,
    cell: ({ row }) => <ChangeCreditCard expense={row.original} />
  },
  {
    accessorKey: 'quota',
    header: () => <div className="text-center">Parcela</div>,
    cell: ({ row }) => <div className='text-center'>{row.original.getQuota()}</div>
  },
  {
    accessorKey: 'expenseValue',
    header: () => <div className="text-right">Valor</div>,
    cell: ({ row }) => <div className='text-right'>{row.original.getExpenseValue()}</div>
  },
  {
    id: 'actions',
    cell: ({ row }) => <DeleteExpense expense={row.original} />
  }
]
