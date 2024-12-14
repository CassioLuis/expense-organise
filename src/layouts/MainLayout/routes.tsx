import { Dashboard, History, Settings } from '@/pages'
import MainLayout from '.'

export default {
  element: <MainLayout />,
  title: 'Playground',
  children: [
    {
      path: '/',
      title: 'Dashboard',
      element: <Dashboard />
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