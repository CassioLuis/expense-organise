import { createBrowserRouter } from 'react-router'
import { AuthLayoutRoutes, MainLayoutRoutes } from '@/layouts'

const router = createBrowserRouter([
  MainLayoutRoutes,
  AuthLayoutRoutes
])

export default router
