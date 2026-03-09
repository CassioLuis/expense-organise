import * as React from 'react'
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  PieChart,
  BarChart3,
  Settings,
  TrendingUp,
  Zap,
  Target
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel
} from '@/components/ui/sidebar'
import { NavUser } from './nav-user'
import { useLocation, Link } from 'react-router'

const navItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Lançamento', url: '/despesas', icon: ArrowLeftRight },
  { title: 'Categorias', url: '/categorias', icon: PieChart },
  { title: 'Metas', url: '/metas', icon: Target },
  { title: 'Contas', url: '#', icon: Wallet, disabled: true },
  { title: 'Relatórios', url: '#', icon: BarChart3, disabled: true },
  { title: 'Configurações', url: '#', icon: Settings, disabled: true }
]

const user = {
  name: 'Cassio Luis',
  email: 'alex@finflow.com',
  avatar: ''
}

export function AppSidebar ({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()

  return (
    <Sidebar
      variant='inset'
      {...props}
      className='select-none'
    >
      <SidebarHeader className='pb-0'>
        {/* FinFlow Logo */}
        <div className='flex items-center gap-3 px-2 py-4'>
          <div className='flex items-center justify-center w-9 h-9 rounded-xl bg-sidebar-accent border border-sidebar-border'>
            <TrendingUp className='w-5 h-5 text-primary' />
          </div>
          <div className='flex flex-col'>
            <span className='text-base font-bold tracking-tight text-sidebar-foreground'>FinFlow</span>
            <span className='text-[10px] text-primary font-semibold uppercase tracking-widest'>Finance</span>
          </div>
        </div>

        {/* Premium plan badge */}
        <div className='mx-2 mb-3 px-3 py-2 rounded-xl bg-sidebar-accent border border-sidebar-border flex items-center gap-2'>
          <Zap className='w-3.5 h-3.5 text-primary flex-shrink-0' />
          <div className='flex flex-col min-w-0'>
            <span className='text-[11px] font-bold text-primary'>Premium Plan</span>
            <span className='text-[9px] text-sidebar-foreground/60 truncate'>Unlock AI insights</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='text-[10px] uppercase tracking-widest text-sidebar-foreground/40 px-2 mb-1'>
            Menu
          </SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const isActive = location.pathname === item.url
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                    className={`
                      group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                      ${isActive
                  ? 'bg-sidebar-accent text-primary border border-sidebar-border'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border border-transparent'
                }
                      ${item.disabled ? 'opacity-40 pointer-events-none' : ''}
                    `}
                  >
                    <Link to={item.disabled ? '#' : item.url}>
                      <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />
                      <span className='font-medium text-sm'>{item.title}</span>
                      {isActive && (
                        <div className='absolute right-2 w-1.5 h-1.5 rounded-full bg-primary' />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
