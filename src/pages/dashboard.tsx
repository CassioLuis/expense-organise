import Expense from '@/application/entity/expense'
import { Button } from '@/components/ui/button'
import { ToastAction } from '@/components/ui/toast'
import { useAppDependencies } from '@/hooks/use-app-dependencies'
import { toast } from '@/hooks/use-toast'
import Utilities from '@/utils/Utilities'
import { useState } from 'react'

export default function Dashboard () {
  const { expenseGateway } = useAppDependencies()
  const [expenses, setExpenses] = useState<Expense[] | undefined>(undefined)

  async function getExpenses () {
    try {
      const response = await expenseGateway.getAllByUser()
      setExpenses(response.data)
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: e.message,
        description: Utilities.dateFormat(new Date(), 'dddd, D MMMM [de] YYYY [às] h:mm A'),
        action: (
          <ToastAction altText="Goto schedule to undo">Ok</ToastAction>
        )
      })
    }
  }

  return (
    <div>
      <Button onClick={getExpenses}>GET</Button>
      <pre>{expenses ? JSON.stringify(expenses, null, 2) : 'No expenses available.'}</pre>
    </div>
  )
}
