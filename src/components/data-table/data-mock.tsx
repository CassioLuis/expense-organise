type Payment = {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

export const data: Payment[] = [
  {
    id: 'm5gr84i9',
    amount: 316,
    status: 'success',
    email: 'ken99@yahoo.com'
  },
  {
    id: '3u1reuv4',
    amount: 242,
    status: 'success',
    email: 'Abe45@gmail.com'
  },
  {
    id: 'derv1ws0',
    amount: 837,
    status: 'processing',
    email: 'Monserrat44@gmail.com'
  },
  {
    id: '5kma53ae',
    amount: 874,
    status: 'success',
    email: 'Silas22@gmail.com'
  },
  {
    id: 'bhqecj4p',
    amount: 721,
    status: 'failed',
    email: 'carmella@hotmail.com'
  }
]

export default interface Expense {
  id?: string | undefined
  expenseDate: string
  description: string
  category: string
  expenseValue: number
  creditCard?: boolean | undefined
  quota?: number | undefined
  totalQuota?: number | undefined
  creationDate: string
}

export const expenses: Expense[] = [
  {
    id: '65b8220db2237a067faa91a4',
    expenseDate: '2024-01-24T12:00:00Z',
    description: 'machado',
    category: 'Indefinido',
    expenseValue: 40,
    creditCard: true,
    quota: 10,
    totalQuota: 10,
    creationDate: '2024-01-29T22:09:17.291Z'
  },
  {
    id: '65b8220eb2237a067faa91a9',
    expenseDate: '2024-01-24T12:00:00Z',
    description: 'machado',
    category: 'Indefinido',
    expenseValue: 40,
    creditCard: true,
    quota: 10,
    totalQuota: 10,
    creationDate: '2024-01-29T22:09:18.793Z'
  },
  {
    id: '65b82210b2237a067faa91ae',
    expenseDate: '2024-01-24T12:00:00Z',
    description: 'machado',
    category: 'Indefinido',
    expenseValue: 40,
    creditCard: true,
    quota: 10,
    totalQuota: 10,
    creationDate: '2024-01-29T22:09:20.101Z'
  }
]