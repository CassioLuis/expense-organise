import { Outlet } from 'react-router'

export default function index() {
  return (
    <div>
      <span>AuthLayout</span>
      <Outlet />
    </div>
  )
}
