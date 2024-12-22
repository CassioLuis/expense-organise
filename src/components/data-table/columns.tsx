import { ColumnDef } from '@tanstack/react-table'
import Expense from './data-mock'

export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: 'id',
    header: '_ID'
  },
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
    header: 'Categoria'
  },
  {
    accessorKey: 'expenseValue',
    header: 'Valor'
  },
  {
    accessorKey: 'creditCard',
    header: 'Cartão'
  },
  {
    accessorKey: 'quota',
    header: 'Parcela'
  },
  {
    accessorKey: 'totalQuota',
    header: 'Total de Parcelas'
  },
  {
    accessorKey: 'creationDate',
    header: 'Data de Criação'
  }
]

// export const columns: ColumnDef<Expense>[] = [
//   {
//     id: 'select',
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && 'indeterminate')
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false
//   },
//   {
//     accessorKey: 'status',
//     header: 'Status',
//     cell: ({ row }) => (
//       <div className="capitalize">{row.getValue('status')}</div>
//     )
//   },
//   {
//     accessorKey: 'email',
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//         >
//           Email
//           <ArrowUpDown />
//         </Button>
//       )
//     },
//     cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>
//   },
//   {
//     accessorKey: 'amount',
//     header: () => <div className="text-right">Amount</div>,
//     cell: ({ row }) => {
//       const amount = parseFloat(row.getValue('amount'))

//       // Format the amount as a dollar amount
//       const formatted = new Intl.NumberFormat('pt-BR', {
//         style: 'currency',
//         currency: 'BRL'
//       }).format(amount)

//       return <div className="text-right font-medium">{formatted}</div>
//     }
//   },
//   {
//     id: 'actions',
//     enableHiding: false,
//     cell: ({ row }) => {
//       const payment = row.original

//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button
//               variant="ghost"
//               className="h-8 w-8 p-0"
//             >
//               <span className="sr-only">Open menu</span>
//               <MoreHorizontal />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(payment.id)}
//             >
//               Copy payment ID
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>View customer</DropdownMenuItem>
//             <DropdownMenuItem>View payment details</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     }
//   }
// ]