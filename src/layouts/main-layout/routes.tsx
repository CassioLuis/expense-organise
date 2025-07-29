import { Dashboard, ErrorPage, Categories } from '@/pages'
import MainLayout from '.'
import { ProtectedRoute } from '@/protected-route'
import Expenses from '@/pages/expenses'
import FetchData from '@/fetch-data'

export default {
  element: (
    <ProtectedRoute>
      <FetchData />
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