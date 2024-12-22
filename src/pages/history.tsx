import { DataTable } from '@/components/data-table'
import { columns } from '@/components/data-table/columns'
import { expenses } from '@/components/data-table/data-mock'

export default function DemoPage () {

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={expenses}
      />
    </div>
  )
}
