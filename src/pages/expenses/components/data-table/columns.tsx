import { ColumnDef } from '@tanstack/react-table'
import { Expense } from '@/application/entity/expense'
import { DeleteExpense } from './actions/delete-expense'
import { ChangeCreditCard } from './actions/change-credit-card'
import { ChangeCategory } from './actions/change-category'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'

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
    cell: ({ row }) => <ChangeCategory expense={row.original} />
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
    header: ({ column }) => {
      return (
        <div className='flex items-center justify-end gap-2'>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className='flex items-center justify-end gap-2 p-0 hover:bg-transparent'
          >
            <div className="text-right">Valor</div>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => <div className='text-right'>{row.original.getExpenseValue()}</div>
  },
  {
    id: 'actions',
    cell: ({ row }) => <DeleteExpense expense={row.original} />
  }
]
