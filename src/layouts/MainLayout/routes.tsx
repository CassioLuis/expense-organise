import { Dashboard, History, Settings } from '@/pages'
import MainLayout from '.'

export default {
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <Dashboard />
    },
    {
      path: '/history',
      element: <History />
    },
    {
      path: '/settings',
      element: <Settings />
    }
  ]
}