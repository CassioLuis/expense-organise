import { Dashboard, ErrorPage, Categories } from '@/pages'
import MainLayout from '.'
import { ProtectedRoute } from '@/router'
import Expenses from '@/pages/expenses'

export default {
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  title: 'Despesas',
  errorElement: <ErrorPage.DefaultErrorPage />,
  children: [
    {
      path: '/',
      title: 'Dashboard',
      element: <Dashboard />
    },
    {
      path: '/despesas',
      title: 'Lançamento',
      element: <Expenses />
    },
    {
      path: '/categorias',
      title: 'Categorias',
      element: <Categories />
    }
  ]
}