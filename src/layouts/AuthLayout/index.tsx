import { Outlet } from 'react-router'

export default function index() {
  return (
    <div className='flex h-screen w-full items-center justify-center px-4'>
      <Outlet />
    </div>
  )
}
