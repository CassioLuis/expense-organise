import { AppSidebar } from '@/layouts/MainLayout/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar'
import { Outlet, useLocation } from 'react-router'
import { ChangeTheme } from './components/change-theme'

export default function MainLayout () {

  const location = useLocation()

  return (
    <SidebarProvider>
      <AppSidebar className="rounded-r-xl" />
      <SidebarInset className='overflow-auto'>
        <header
          className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 select-none"
        >
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className='capitalize'>{location.pathname.replace(/\//g, '')}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className='flex gap-4 pr-4'>
            <ChangeTheme />
          </div>
        </header>
        <div className="grow flex flex-col gap-4 p-4 pt-0 !overflow-auto break-words">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
