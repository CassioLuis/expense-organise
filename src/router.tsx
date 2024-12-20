import { createBrowserRouter, Navigate, Outlet, useNavigate } from 'react-router'
import { AuthLayoutRoutes, MainLayoutRoutes } from '@/layouts'
import { PropsWithChildren, useEffect } from 'react'

export function ProtectedRoutes () {
  const isAuthenticated = true
  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" />
}

type ProtectedRouteProps = PropsWithChildren;

export default function ProtectedRoute ({ children }: ProtectedRouteProps) {
  const isAuthenticated = true
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin', { replace: true })
    }
  }, [navigate, isAuthenticated])

  return children
}


export const router = createBrowserRouter([
  AuthLayoutRoutes,
  MainLayoutRoutes
])

// import { RouteLocationNormalized, Router, RouteRecordName } from 'vue-router'
// import { jwtDecode } from 'jwt-decode'
// import LocalStorageHandler from '@/infra/localStorage/local-storage-handler'
// import User from '@/entity/user'
// import UserSessionStore from '@/store/user-session-store'
// import { Session } from '@/infra/gateway/authentication-gateway'
// import Costumer from '@/entity/customer'
// import CostumerStore from '@/store/costumer-store'
// import SessionStorageHandler from '@/infra/localStorage/session-storage-handler'

// export class RouterGuard {
//   static execute (to: RouteLocationNormalized, router: Router) {
//     const routeName: RouteRecordName = to?.name || ''
//     const hasRoute: boolean = router.hasRoute(routeName)
//     const isAuthenticated = this.isTokenValid(router)

//     if (routeName === 'Login') {
//       this.setCostumerStore()
//       return isAuthenticated ? { path: '/home' } : undefined
//     }
//     if (!hasRoute) {
//       this.setCostumerStore()
//       return isAuthenticated ? { path: '/home' } : { path: '/login' }
//     }
//     if (!isAuthenticated) {
//       return { path: '/login' }
//     }
//     this.setCostumerStore()
//     return true
//   }

//   private static isTokenValid (router: Router): boolean {
//     const session = LocalStorageHandler.get<Session>('session')
//     if (!Object.entries(session).length) return false
//     const userSessionStore = UserSessionStore.getInstance()

//     if (router.currentRoute.value.fullPath === '/login' || !userSessionStore.getUser().cpfCnpj) {
//       const [part1, part2] = session?.token?.split('.') || []
//       if (!part1 || !part2) return false
//       const decodedToken: { usuario: User } = jwtDecode(session.token)
//       userSessionStore.setUser(decodedToken.usuario)
//       return Boolean(decodedToken.usuario.cpfCnpj)
//     }

//     return Boolean(userSessionStore.getUser().cpfCnpj)
//   }

//   private static setCostumerStore () {
//     const costumerStore = CostumerStore.getInstance()
//     if (costumerStore.getCpfCnpj()) return
//     const costumer = SessionStorageHandler.get<Costumer>('costumer')
//     if (!Object.entries(costumer).length) return
//     costumerStore.setCostumer(costumer)
//   }
// }
