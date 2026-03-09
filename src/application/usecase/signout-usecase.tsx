import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'
import { AuthGateway } from '@/infra/gateways'
import Utilities from '@/utils/Utilities'
import { router } from '@/protected-route'

export default class Signout {

  constructor(
    private readonly authGateway: AuthGateway,
    private readonly toaster: typeof toast
  ) { }

  async execute (): Promise<void> {
    try {
      await this.authGateway.logout()
      localStorage.removeItem('isAuthenticated')
      router.navigate('/signin')
    } catch (e: any) {
      console.error(e)
      this.toaster({
        variant: 'destructive',
        title: 'Erro ao sair da conta',
        description: Utilities.dateFormat(new Date(), 'dddd, D MMMM [de] YYYY [às] h:mm A'),
        action: (
          <ToastAction altText="Goto schedule to undo">Ok</ToastAction>
        )
      })
    }
  }
}
