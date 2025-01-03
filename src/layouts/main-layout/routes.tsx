import { Dashboard, ErrorPage, History, Settings } from '@/pages'
import MainLayout from '.'
import { ProtectedRoute } from '@/router'
import Expenses from '@/pages/expenses'

export default {
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  title: 'Playground',
  errorElement: <ErrorPage.DefaultErrorPage />,
  children: [
    {
      path: '/',
      title: 'Dashboard',
      element: <Dashboard />
    },
    {
      path: '/despesas',
      title: 'Expenses',
      element: <Expenses />
    },
    {
      path: '/history',
      title: 'History',
      element: <History />
    },
    {
      path: '/settings',
      title: 'Settings',
      element: <Settings />
    }
  ]
}