import { ColumnDef } from '@tanstack/react-table'
import { Category } from '@/application/entity/category'
import { DeleteCategory } from './actions/delete-category'
import { SubCategorySelector } from './actions/change-sub-category'

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'name',
    header: 'Descrição'
  },
  {
    accessorKey: 'subCategory',
    header: 'Sub Categoria',
    cell: ({ row }) => <SubCategorySelector category={row.original} />
  },
  {
    id: 'actions',
    cell: ({ row }) => <DeleteCategory category={row.original} />
  }
]
