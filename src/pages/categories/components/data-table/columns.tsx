import { ColumnDef } from '@tanstack/react-table'
import { Category } from '@/application/entity/category'
import { DeleteCategory } from './actions/delete-category'

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'name',
    header: 'Descrição'
  },
  {
    accessorKey: 'subCategory',
    header: 'Sub Categoria'
  },
  {
    id: 'actions',
    cell: ({ row }) => <DeleteCategory category={row.original} />
  }
]
