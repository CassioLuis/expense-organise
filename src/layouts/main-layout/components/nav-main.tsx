import { ChevronRight, SquareTerminal } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar'
import { Link } from 'react-router'
import routes from '../routes'

// interface Items {
//   title: string
//   url: string
//   icon?: LucideIcon
//   isActive?: boolean
//   items?: {
//     title: string
//     url: string
//   }[]
// }

export function NavMain () {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Controle de Gastos</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible
          asChild
          defaultOpen={false}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={'Playground'}>
                <SquareTerminal />
                <span>{routes.title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {
                  routes.children.map((route, idx) => {
                    return (
                      <SidebarMenuSubItem key={idx}>
                        <SidebarMenuSubButton asChild>
                          <Link to={route.path}>
                            <span>{route.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )
                  })
                }
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup >
  )
}
