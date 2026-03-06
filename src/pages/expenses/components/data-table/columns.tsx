import { ColumnDef } from '@tanstack/react-table'
import { Expense } from '@/application/entity/expense'
import { DeleteExpense } from './actions/delete-expense'
import { ChangeCreditCard } from './actions/change-credit-card'
import { ChangeCategory } from './actions/change-category'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, CheckCircle2 } from 'lucide-react'
import { CircularProgress } from '@/components/circular-progress'

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
    cell: ({ row }) => {
      const quotaStr = row.original.getQuota()
      const isPending = quotaStr !== '-'

      if (!isPending) {
        return (
          <div className="flex justify-center text-primary">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        )
      }

      const [current, total] = quotaStr.split('/').map(Number)
      return (
        <div className="flex justify-center">
          <CircularProgress
            value={current}
            max={total}
            text={quotaStr}
            size={28}
          />
        </div>
      )
    }
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
