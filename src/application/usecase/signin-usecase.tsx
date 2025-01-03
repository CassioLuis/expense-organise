import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'
import { AuthGateway } from '@/infra/gateways'
import Utilities from '@/utils/Utilities'

export default class Signin {

  constructor (
    private readonly authGateway: AuthGateway,
    private readonly toaster: typeof toast
  ) { }

  async execute (credentials: { email: string, password: string }): Promise<void> {
    try {
      const { data } = await this.authGateway.signin(credentials)
      localStorage.setItem('access-token', data.token)
      window.location.assign('/')
    } catch (e: any) {
      this.toaster({
        variant: 'destructive',
        title: e.message,
        description: Utilities.dateFormat(new Date(), 'dddd, D MMMM [de] YYYY [às] h:mm A'),
        action: (
          <ToastAction altText="Goto schedule to undo">Ok</ToastAction>
        )
      })
    }
  }
}