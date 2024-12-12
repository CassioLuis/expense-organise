import { Starred } from '@/pages'
import AuthLayout from '.'

export default {
  element: <AuthLayout />,
  children: [
    {
      path: '/starred',
      element: <Starred />
    }
  ]
}