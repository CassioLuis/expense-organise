import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'
import { AuthGateway } from '@/infra/gateways'
import Utilities from '@/utils/Utilities'
import { router } from '@/protected-route'

export default class Signin {

  constructor(
    private readonly authGateway: AuthGateway,
    private readonly toaster: typeof toast
  ) { }

  async execute (credentials: { email: string, password: string }): Promise<void> {
    try {
      const { data } = await this.authGateway.signin(credentials)
      localStorage.setItem('access-token', data.token)
      router.navigate('/')
    } catch (e: any) {
      console.log(e)
      this.toaster({
        variant: 'destructive',
        title: 'Erro ao efetuar login',
        description: Utilities.dateFormat(new Date(), 'dddd, D MMMM [de] YYYY [às] h:mm A'),
        action: (
          <ToastAction altText="Goto schedule to undo">Ok</ToastAction>
        )
      })
    }
  }
}