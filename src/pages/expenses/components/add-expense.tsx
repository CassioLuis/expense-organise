import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { ExpenseForm } from './expense-form'

export default function AddExpense () {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><Plus /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Despesa</DialogTitle>
          <DialogDescription>
            Clique em salvar quando estiver tudo preenchido.
          </DialogDescription>
        </DialogHeader>
        <ExpenseForm />
      </DialogContent>
    </Dialog>
  )
}
