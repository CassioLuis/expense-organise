import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useState } from 'react'
import Expense, { data, expenses } from './data-mock'
import { columns } from './columns'

export type Payment = {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

interface DataTableProps<Expense, TValue> {
  columns: ColumnDef<Expense, TValue>[]
  data: Expense[]
}

export function DataTable<Expense, TValue> ({ columns, data }: DataTableProps<Expense, TValue>) {
  // const [sorting, setSorting] = useState<SortingState>([])
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  // const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  // const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow
// } from '@/components/ui/table'
// import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
// import { useState } from 'react'
// import { Input } from '../ui/input'
// import { columns } from './columns'
// import { data } from './data-mock'

// export function DataTable () {

//   const invoices = [
//     {
//       invoice: 'INV001',
//       paymentStatus: 'Paid',
//       totalAmount: '$250.00',
//       paymentMethod: 'Credit Card'
//     },
//     {
//       invoice: 'INV002',
//       paymentStatus: 'Pending',
//       totalAmount: '$150.00',
//       paymentMethod: 'PayPal'
//     },
//     {
//       invoice: 'INV003',
//       paymentStatus: 'Unpaid',
//       totalAmount: '$350.00',
//       paymentMethod: 'Bank Transfer'
//     },
//     {
//       invoice: 'INV004',
//       paymentStatus: 'Paid',
//       totalAmount: '$450.00',
//       paymentMethod: 'Credit Card'
//     },
//     {
//       invoice: 'INV005',
//       paymentStatus: 'Paid',
//       totalAmount: '$550.00',
//       paymentMethod: 'PayPal'
//     },
//     {
//       invoice: 'INV006',
//       paymentStatus: 'Pending',
//       totalAmount: '$200.00',
//       paymentMethod: 'Bank Transfer'
//     },
//     {
//       invoice: 'INV007',
//       paymentStatus: 'Unpaid',
//       totalAmount: '$300.00',
//       paymentMethod: 'Credit Card'
//     }
//   ]
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     onColumnFiltersChange: setColumnFilters,
//     getFilteredRowModel: getFilteredRowModel(),
//     state: {
//       columnFilters
//     }
//   })

//   return (
//     <div>
//       <div className="flex items-center py-4">
//         <Input
//           placeholder="Filter emails..."
//           value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
//           onChange={(event) =>
//             table.getColumn('email')?.setFilterValue(event.target.value)
//           }
//           className="max-w-sm"
//         />
//       </div>
//       <Table>
//         <TableCaption>A list of your recent invoices.</TableCaption>
//         <TableHeader>
//           <TableRow>
//             <TableHead className="w-[100px]">Invoice</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Method</TableHead>
//             <TableHead className="text-right">Amount</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {invoices.map((invoice) => (
//             <TableRow key={invoice.invoice}>
//               <TableCell className="font-medium">{invoice.invoice}</TableCell>
//               <TableCell>{invoice.paymentStatus}</TableCell>
//               <TableCell>{invoice.paymentMethod}</TableCell>
//               <TableCell className="text-right">{invoice.totalAmount}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//         <TableFooter>
//           <TableRow>
//             <TableCell colSpan={3}>Total</TableCell>
//             <TableCell className="text-right">$2,500.00</TableCell>
//           </TableRow>
//         </TableFooter>
//       </Table>
//     </div>
//   )
// }
