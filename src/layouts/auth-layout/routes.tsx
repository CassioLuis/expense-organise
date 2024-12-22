import { Signin, Starred } from '@/pages'
import AuthLayout from '.'

export default {
  element: <AuthLayout />,
  children: [
    {
      path: '/starred',
      element: <Starred />
    },
    {
      path: '/signin',
      element: <Signin />
    }
  ]
}